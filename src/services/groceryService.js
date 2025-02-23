export const groceryService = {
    getItems: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    },
  
    addItem: async (item) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const estimatedPrice = Math.random() * 10; // Replace with actual price API
      return {
        id: Date.now().toString(),
        name: item.name,
        quantity: item.quantity,
        cost: estimatedPrice,
        dateAdded: new Date().toISOString()
      };
    },
  
    removeItem: async (itemId) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    },
  
    updateItem: async (itemId, updates) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: itemId, ...updates };
    },
  
    getPriceEstimate: async (itemName) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return Math.random() * 10; // Replace with actual price API
    }
  };