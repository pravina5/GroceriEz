import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  FlatList
} from 'react-native';
import { mealPlanService } from '../services/mealPlanService';
import { handleApiError } from '../utils/errorHandling';

export function MealPlanScreen() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState(new Set());
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const availableRecipes = await mealPlanService.getRecipes();
      setRecipes(availableRecipes);
    } catch (err) {
      setError(handleApiError(err, 'Failed to load recipes'));
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipeSelection = (recipeId) => {
    setSelectedRecipes(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(recipeId)) {
        newSelection.delete(recipeId);
      } else {
        newSelection.add(recipeId);
      }
      return newSelection;
    });
  };

  const generateMealPlan = async () => {
    if (selectedRecipes.size === 0) {
      setError('Please select at least one recipe');
      return;
    }

    try {
      setLoading(true);
      setError(null);
     
      const selectedRecipesList = recipes.filter(recipe =>
        selectedRecipes.has(recipe.id)
      );
     
      const newMealPlan = await mealPlanService.generateMealPlan(selectedRecipesList);
      setMealPlan(newMealPlan);
      await mealPlanService.saveMealPlan(newMealPlan);
    } catch (err) {
      setError(handleApiError(err, 'Failed to generate meal plan'));
    } finally {
      setLoading(false);
    }
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.recipeItem,
        selectedRecipes.has(item.id) && styles.selectedRecipe
      ]}
      onPress={() => toggleRecipeSelection(item.id)}
    >
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeType}>{item.type.join(', ')}</Text>
      </View>
      <Text style={styles.prepTime}>Prep time: {item.prepTime}</Text>
      <Text style={styles.ingredients}>
        Ingredients: {item.ingredients.join(', ')}
      </Text>
    </TouchableOpacity>
  );

  const renderMealPlanDay = ({ item }) => (
    <View style={styles.dayContainer}>
      <Text style={styles.dayHeader}>{item.day}</Text>
      {item.meals.map((meal, index) => (
        <View key={index} style={styles.meal}>
          <Text style={styles.mealType}>{meal.type}</Text>
          <Text style={styles.mealRecipe}>{meal.recipe?.name || 'TBD'}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Text style={styles.sectionTitle}>Available Recipes</Text>
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={item => item.id}
        style={styles.recipeList}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={generateMealPlan}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Generate Meal Plan ({selectedRecipes.size} recipes selected)
          </Text>
        )}
      </TouchableOpacity>

      {mealPlan && (
        <>
          <Text style={styles.sectionTitle}>Your Meal Plan</Text>
          <FlatList
            data={mealPlan.weekPlan}
            renderItem={renderMealPlanDay}
            keyExtractor={item => item.day}
            style={styles.mealPlanList}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#FF3B30',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFE5E5',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  recipeList: {
    maxHeight: '40%',
  },
  recipeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    borderRadius: 8,
  },
  selectedRecipe: {
    backgroundColor: '#aedea7',
    borderColor: '#7BC96F',
    borderWidth: 1,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeType: {
    fontSize: 14,
    color: '#666',
  },
  prepTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  ingredients: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#7BC96F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealPlanList: {
    flex: 1,
  },
  dayContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  meal: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  mealType: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  mealRecipe: {
    fontSize: 16,
    fontWeight: '500',
  },
});