import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { preservationService } from '../services/preservationService';

export function PreservationTipsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedItems, setSavedItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = async () => {
    try {
      setLoading(true);
      const items = await preservationService.getSavedItems();
      setSavedItems(items);
    } catch (err) {
      setError('Failed to load saved items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (!text) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const results = await preservationService.searchItems(text);
      setSearchResults(results);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (itemName) => {
    try {
      setLoading(true);
      const savedItem = await preservationService.saveItem(itemName);
      setSavedItems(prev => [...prev, savedItem]);
    } catch (err) {
      setError('Failed to save item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setLoading(true);
      await preservationService.removeItem(itemId);
      setSavedItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      setError('Failed to remove item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, type }) => (
    <View style={styles.tipContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.foodName}>{item.name}</Text>
        {type === 'search' ? (
          <TouchableOpacity
            onPress={() => handleSaveItem(item.name)}
            style={styles.actionButton}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handleRemoveItem(item.id)}
            style={[styles.actionButton, styles.removeButton]}
          >
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.infoText}>Storage: {item.storage}</Text>
      <Text style={styles.infoText}>Shelf Life: {item.shelf_life}</Text>
      <Text style={styles.tipsHeader}>Tips:</Text>
      {item.tips?.map((tip, index) => (
        <Text key={index} style={styles.tipText}>• {tip}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for food items..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {loading && (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      )}

      <FlatList
        data={searchQuery ? searchResults : savedItems}
        keyExtractor={(item) => item.id}
        renderItem={(props) => renderItem({ ...props, type: searchQuery ? 'search' : 'saved' })}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'No matching items found'
                : 'No saved items. Search for items to save preservation tips!'}
            </Text>
          </View>
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 10,
  },
  tipContainer: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  actionButton: {
    backgroundColor: '#7BC96F',
    padding: 8,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
  },
  infoText: {
    fontSize: 15,
    marginBottom: 5,
  },
  tipsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  tipText: {
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 3,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});