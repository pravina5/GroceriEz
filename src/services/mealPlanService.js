// MealPlanService.js
export const mealPlanService = {
  getRecipes: async () => {
    // Keeping existing dummy data
    const dummyRecipes = [
      {
        id: '1',
        name: 'Spaghetti Bolognese',
        type: ['dinner'],
        prepTime: '30 mins',
        ingredients: ['pasta', 'tomato sauce', 'ground beef']
      },
      {
        id: '2',
        name: 'Oatmeal with Fruits',
        type: ['breakfast'],
        prepTime: '10 mins',
        ingredients: ['oats', 'milk', 'fruits']
      },
      {
        id: '3',
        name: 'Chicken Salad',
        type: ['lunch', 'dinner'],
        prepTime: '20 mins',
        ingredients: ['chicken', 'lettuce', 'tomatoes']
      }
    ];
   
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyRecipes;
  },

  generateMealPlan: async (selectedRecipes) => {
    try {
      const response = await fetch('http://localhost:3000/api/generate-mealplan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipes: selectedRecipes }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate meal plan');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to generate meal plan: ' + error.message);
    }
  },

  saveMealPlan: async (mealPlan) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      ...mealPlan,
      dateCreated: new Date().toISOString()
    };
  },

  getMealPlanHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [];
  }
};
