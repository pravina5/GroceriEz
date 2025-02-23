const dummyRecipeDatabase = [
    {
      id: '1',
      name: 'Pasta Primavera',
      ingredients: ['pasta', 'tomato', 'garlic', 'vegetables'],
      instructions: ['Boil pasta', 'Sauté vegetables', 'Combine and serve'],
      prepTime: '30 mins',
      difficulty: 'Easy'
    },
    {
      id: '2',
      name: 'Garden Salad',
      ingredients: ['lettuce', 'tomato', 'cucumber', 'dressing'],
      instructions: ['Chop vegetables', 'Mix ingredients', 'Add dressing'],
      prepTime: '10 mins',
      difficulty: 'Easy'
    }
  ];
  
  export const recipeService = {
    searchRecipes: async (ingredients) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return dummyRecipeDatabase.filter(recipe =>
        ingredients.some(ing =>
          recipe.ingredients.some(recipeIng =>
            recipeIng.toLowerCase().includes(ing.toLowerCase())
          )
        )
      );
    },
  
    getRecipeDetails: async (recipeId) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return dummyRecipeDatabase.find(recipe => recipe.id === recipeId);
    },
  
    saveRecipe: async (recipe) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id: Date.now().toString(),
        ...recipe,
        dateSaved: new Date().toISOString()
      };
    },
  
    getSavedRecipes: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }
  };