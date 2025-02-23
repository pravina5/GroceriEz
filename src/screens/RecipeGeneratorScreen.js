import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { recipeService } from '../services/recipeService';
import { handleApiError } from '../utils/errorHandling';

export function RecipeGeneratorScreen() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addIngredient = () => {
    if (newIngredient) {
      setIngredients([...ingredients, {
        id: Date.now().toString(),
        name: newIngredient
      }]);
      setNewIngredient('');
    }
  };

  const generateRecipes = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    try {
      setLoading(true);
      const matchingRecipes = await recipeService.searchRecipes(
        ingredients.map(ing => ing.name)
      );
      setRecipes(matchingRecipes);
      setError(null);
    } catch (err) {
      setError(handleApiError(err, 'Failed to generate recipes'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add ingredient"
          value={newIngredient}
          onChangeText={setNewIngredient}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={addIngredient}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ingredient}>
            <Text style={styles.ingredientText}>{item.name}</Text>
          </View>
        )}
        style={styles.ingredientList}
      />

      <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={generateRecipes}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Generate Recipes</Text>
              )}
            </TouchableOpacity>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeDetails}>Prep Time: {item.prepTime}</Text>
            <Text style={styles.recipeDetails}>
              Ingredients: {item.ingredients.join(', ')}
            </Text>
            <Text style={styles.recipeInstructions}>
              Instructions:
              {item.instructions.map((step, index) => (
                `\n${index + 1}. ${step}`
              ))}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            {ingredients.length === 0
              ? 'Add ingredients to generate recipe suggestions!'
              : 'No recipes found for these ingredients. Try adding different ingredients.'}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      marginRight: 10,
      borderRadius: 5,
    },
    button: {
      backgroundColor: '#7BC96F',
      padding: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    tipContainer: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    foodName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    tipsHeader: {
      fontWeight: 'bold',
      marginTop: 5,
    },
    dayContainer: {
      marginBottom: 20,
    },
    dayHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    meal: {
      padding: 10,
      backgroundColor: '#f5f5f5',
      marginBottom: 5,
      borderRadius: 5,
    },
    recipeItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    recipeName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
  });