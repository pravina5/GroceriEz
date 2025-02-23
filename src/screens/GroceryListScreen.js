import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { groceryService } from '../services/groceryService';
import { handleApiError } from '../utils/errorHandling';

export function GroceryListScreen() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [budget, setBudget] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const loadedItems = await groceryService.getItems();
      setItems(loadedItems);
      calculateTotalCost(loadedItems);
    } catch (err) {
      setError(handleApiError(err, 'Failed to load grocery list'));
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCost = (itemList) => {
    const total = itemList.reduce((sum, item) => sum + item.cost, 0);
    setTotalCost(total);
  };

  const addItem = async () => {
    if (!newItem || !quantity) return;

    try {
      setLoading(true);
      const itemCost = await groceryService.getPriceEstimate(newItem);
     
      if (budget && (totalCost + itemCost > parseFloat(budget))) {
        setError('Adding this item would exceed your budget!');
        return;
      }

      const addedItem = await groceryService.addItem({
        name: newItem,
        quantity: quantity
      });

      const updatedItems = [...items, addedItem];
      setItems(updatedItems);
      calculateTotalCost(updatedItems);
      setNewItem('');
      setQuantity('');
      setError(null);
    } catch (err) {
      setError(handleApiError(err, 'Failed to add item'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Set Budget"
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
      />
      <Text style={styles.totalCost}>Total Cost: ${totalCost.toFixed(2)}</Text>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={newItem}
          onChangeText={setNewItem}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={addItem}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name} - {item.quantity}</Text>
            <Text style={styles.itemCost}>${item.cost.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No items in your list. Add some items above!</Text>
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
    alignItems: 'center',
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
    minWidth: 70,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    borderRadius: 5,
  },
});