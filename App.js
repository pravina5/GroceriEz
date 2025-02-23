import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GroceryListScreen } from './src/screens/GroceryListScreen';
import { PreservationTipsScreen } from './src/screens/PreservationTipsScreen';
import { MealPlanScreen } from './src/screens/MealPlanScreen';
import { RecipeGeneratorScreen } from './src/screens/RecipeGeneratorScreen';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#7BC96F',

        }}
      >
        <Tab.Screen
          name="GroceryList"
          component={GroceryListScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="shopping-cart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Preservation"
          component={PreservationTipsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="kitchen" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="MealPlan"
          component={MealPlanScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="restaurant-menu" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Recipes"
          component={RecipeGeneratorScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="food-bank" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}