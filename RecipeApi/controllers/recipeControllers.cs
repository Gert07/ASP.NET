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

        // PUT: api/recipes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRecipe(int id, Recipe recipe)
        {
            if (id != recipe.Id)
            {
                return BadRequest();
            }

            var existingRecipe = await _context.Recipes.FindAsync(id);

            if (existingRecipe == null)
            {
                return NotFound();
            }

            existingRecipe.Title = recipe.Title;
            existingRecipe.Description = recipe.Description;
            existingRecipe.Ingredients = recipe.Ingredients;
            existingRecipe.Instructions = recipe.Instructions;
            existingRecipe.PrepTimeMinutes = recipe.PrepTimeMinutes;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/recipes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                return NotFound();
            }

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
