import { useEffect, useMemo, useState } from 'react';
import { createRecipe, deleteRecipe, getRecipes, updateRecipe } from './api';
import './App.css';

const emptyForm = {
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  prepTimeMinutes: '',
};

function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const stats = useMemo(() => {
    const totalMinutes = recipes.reduce(
      (sum, recipe) => sum + (Number(recipe.prepTimeMinutes) || 0),
      0,
    );

    return {
      count: recipes.length,
      averageTime: recipes.length ? Math.round(totalMinutes / recipes.length) : 0,
    };
  }, [recipes]);

  const loadRecipes = async () => {
    try {
      setError(null);
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadRecipes);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleAddClick = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (recipe) => {
    setForm({
      title: recipe.title ?? '',
      description: recipe.description ?? '',
      ingredients: recipe.ingredients ?? '',
      instructions: recipe.instructions ?? '',
      prepTimeMinutes: recipe.prepTimeMinutes ?? '',
    });
    setEditingId(recipe.id);
    setIsFormOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const recipe = {
      title: form.title.trim(),
      description: form.description.trim(),
      ingredients: form.ingredients.trim(),
      instructions: form.instructions.trim(),
      prepTimeMinutes: form.prepTimeMinutes ? Number(form.prepTimeMinutes) : null,
    };

    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      setError('Please add a title, ingredients, and instructions.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      if (editingId) {
        await updateRecipe({ ...recipe, id: editingId });
      } else {
        await createRecipe(recipe);
      }

      await loadRecipes();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = async (recipe) => {
    const shouldDelete = window.confirm(`Delete "${recipe.title}"?`);

    if (!shouldDelete) {
      return;
    }

    try {
      setError(null);
      await deleteRecipe(recipe.id);
      setRecipes((currentRecipes) =>
        currentRecipes.filter((currentRecipe) => currentRecipe.id !== recipe.id),
      );

      if (editingId === recipe.id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Kitchen notebook</p>
          <h1>My Recipe Collection</h1>
          <p className="hero-copy">
            Save weeknight favorites, bright brunch ideas, and the recipes you
            keep promising yourself you will write down.
          </p>
        </div>

        <div className="hero-panel">
          <span className="stat-number">{stats.count}</span>
          <span className="stat-label">recipes saved</span>
          <span className="stat-divider" />
          <span className="stat-number">{stats.averageTime}</span>
          <span className="stat-label">average prep minutes</span>
        </div>
      </section>

      <section className="toolbar" aria-label="Recipe actions">
        <div>
          <h2>Recipe cards</h2>
          <p>Build, edit, and trim your collection from one place.</p>
        </div>
        <button className="button primary" type="button" onClick={handleAddClick}>
          + Add recipe
        </button>
      </section>

      {error && <p className="message error">Error: {error}</p>}

      {isFormOpen && (
        <section className="form-section" aria-label={editingId ? 'Modify recipe' : 'Add recipe'}>
          <form className="recipe-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <div>
                <p className="eyebrow">{editingId ? 'Modify recipe' : 'New recipe'}</p>
                <h2>{editingId ? 'Update your recipe' : 'Add something delicious'}</h2>
              </div>
              <button className="button ghost" type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>

            <div className="form-grid">
              <label>
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Lemon pasta"
                />
              </label>

              <label>
                Prep time
                <input
                  min="0"
                  name="prepTimeMinutes"
                  type="number"
                  value={form.prepTimeMinutes}
                  onChange={handleChange}
                  placeholder="25"
                />
              </label>

              <label className="wide">
                Description
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Bright, fast, and perfect for busy evenings."
                />
              </label>

              <label className="wide">
                Ingredients
                <textarea
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="Pasta, lemon, parmesan, garlic, butter"
                  rows="3"
                />
              </label>

              <label className="wide">
                Instructions
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  placeholder="Boil pasta, make sauce, toss together, serve warm."
                  rows="4"
                />
              </label>
            </div>

            <button className="button primary submit-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingId ? 'Save changes' : 'Add recipe'}
            </button>
          </form>
        </section>
      )}

      {recipes.length === 0 && !error ? (
        <section className="empty-state">
          <h2>No recipes found</h2>
          <p>Start with one favorite dish and let the collection grow from there.</p>
          <button className="button primary" type="button" onClick={handleAddClick}>
            + Add your first recipe
          </button>
        </section>
      ) : (
        <section className="recipe-grid">
          {recipes.map((recipe, index) => (
            <article className="recipe-card" key={recipe.id}>
              <div className={`card-accent accent-${index % 4}`} />
              <div className="card-header">
                <div>
                  <p className="recipe-time">
                    {recipe.prepTimeMinutes ? `${recipe.prepTimeMinutes} min` : 'No time set'}
                  </p>
                  <h2>{recipe.title}</h2>
                </div>
              </div>

              {recipe.description && <p className="description">{recipe.description}</p>}

              <div className="recipe-detail">
                <strong>Ingredients</strong>
                <p>{recipe.ingredients}</p>
              </div>

              {recipe.instructions && (
                <div className="recipe-detail">
                  <strong>Instructions</strong>
                  <p>{recipe.instructions}</p>
                </div>
              )}

              <div className="card-actions">
                <button className="button secondary" type="button" onClick={() => handleEditClick(recipe)}>
                  Modify
                </button>
                <button className="button danger" type="button" onClick={() => handleDeleteClick(recipe)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;
