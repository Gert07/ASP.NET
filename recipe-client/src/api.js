// Adjust the port to match your .NET backend's launchSettings.json
const API_URL = 'http://localhost:5000/api/recipes'; 

/**
 * Fetches all recipes from the database.
 * @returns {Promise<Array>} List of recipes
 */
export const getRecipes = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
};

/**
 * Creates a new recipe.
 * @param {Object} recipe - The recipe data (title, description, ingredients, etc.)
 * @returns {Promise<Object>} The created recipe
 */
export const createRecipe = async (recipe) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) throw new Error('Failed to create recipe');
  return response.json();
};