// services/preservationService.js

const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  return response.json();
};

// Cache for preservation tips to minimize API calls
const preservationTipsCache = new Map();

export const preservationService = {
  searchItems: async (query) => {
    try {
      // If the item is in cache, return it
      if (preservationTipsCache.has(query.toLowerCase())) {
        const cachedData = preservationTipsCache.get(query.toLowerCase());
        return [
          {
            id: query.toLowerCase(),
            name: query.toLowerCase(),
            ...cachedData
          }
        ];
      }

      // If not in cache, fetch from API
      const response = await fetch(`${API_BASE_URL}` + '/preservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodItems: [query.toLowerCase()]
        })
      });

      const data = await handleApiResponse(response);
      
      // Store in cache
      Object.entries(data).forEach(([key, value]) => {
        preservationTipsCache.set(key.toLowerCase(), value);
      });

      // Transform the response to match the expected format
      return Object.entries(data).map(([key, value]) => ({
        id: key.toLowerCase(),
        name: key.toLowerCase(),
        ...value
      }));
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  getSavedItems: async () => {
    try {
      // Get saved items from local storage
      const savedItems = await localStorage.getItem('savedPreservationItems');
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error('Get saved items error:', error);
      throw error;
    }
  },

  saveItem: async (itemName) => {
    try {
      // First, ensure we have the preservation data
      if (!preservationTipsCache.has(itemName.toLowerCase())) {
        await preservationService.searchItems(itemName);
      }

      const newItem = {
        id: Date.now().toString(),
        name: itemName.toLowerCase(),
        dateAdded: new Date().toISOString(),
        ...preservationTipsCache.get(itemName.toLowerCase())
      };

      // Save to local storage
      const savedItems = await preservationService.getSavedItems();
      const updatedItems = [...savedItems, newItem];
      await localStorage.setItem('savedPreservationItems', JSON.stringify(updatedItems));

      return newItem;
    } catch (error) {
      console.error('Save item error:', error);
      throw error;
    }
  },

  removeItem: async (itemId) => {
    try {
      const savedItems = await preservationService.getSavedItems();
      const updatedItems = savedItems.filter(item => item.id !== itemId);
      await localStorage.setItem('savedPreservationItems', JSON.stringify(updatedItems));
      return true;
    } catch (error) {
      console.error('Remove item error:', error);
      throw error;
    }
  },

  getItemDetails: async (itemName) => {
    try {
      // If the item is in cache, return it
      if (preservationTipsCache.has(itemName.toLowerCase())) {
        return preservationTipsCache.get(itemName.toLowerCase());
      }

      // If not in cache, fetch it
      const results = await preservationService.searchItems(itemName);
      return results[0] || null;
    } catch (error) {
      console.error('Get item details error:', error);
      throw error;
    }
  }
};