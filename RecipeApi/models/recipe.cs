namespace RecipeApi.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Ingredients { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public int? PrepTimeMinutes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}