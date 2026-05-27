import { useEffect, useState } from 'react';
import { getRecipes } from './api';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadRecipes();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Recipe Collection</h1>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {recipes.length === 0 && !error ? (
        <p>No recipes found. Time to add some!</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {recipes.map((recipe) => (
            <li key={recipe.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <h2>{recipe.title}</h2>
              <p><strong>Prep Time:</strong> {recipe.prepTimeMinutes} mins</p>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;