const API_URL = import.meta.env.VITE_API_URL ?? '/api/recipes';

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

/**
 * Updates an existing recipe.
 * @param {Object} recipe - The recipe data with an id
 * @returns {Promise<void>}
 */
export const updateRecipe = async (recipe) => {
  const response = await fetch(`${API_URL}/${recipe.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) throw new Error('Failed to update recipe');
};

/**
 * Deletes an existing recipe.
 * @param {number} id - Recipe id
 * @returns {Promise<void>}
 */
export const deleteRecipe = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete recipe');
};
