using Microsoft.EntityFrameworkCore;
using RecipeApi.Models;

namespace RecipeApi.Data
{
    public class RecipeContext : DbContext
    {
        public RecipeContext(DbContextOptions<RecipeContext> options) : base(options) { }

        public DbSet<Recipe> Recipes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Recipe>(entity =>
            {
                entity.Property(recipe => recipe.PrepTimeMinutes)
                    .HasColumnName("MakingTimeMinutes");

                entity.Property(recipe => recipe.CreatedAt)
                    .HasDefaultValueSql("GETDATE()")
                    .ValueGeneratedOnAdd();
            });
        }
    }
}
