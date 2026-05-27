using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeApi.Data;
using RecipeApi.Models;

namespace RecipeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly RecipeContext _context;

        public RecipesController(RecipeContext context)
        {
            _context = context;
        }

        // GET: api/recipes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Recipe>>> GetRecipes()
        {
            // This fetches all recipes from your MSSQL database
            return await _context.Recipes.ToListAsync();
        }

        // POST: api/recipes
        [HttpPost]
        public async Task<ActionResult<Recipe>> CreateRecipe(Recipe recipe)
        {
            // This saves a new recipe to your MSSQL database
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetRecipes), new { id = recipe.Id }, recipe);
        }
    }
}