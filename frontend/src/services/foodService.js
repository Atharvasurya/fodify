import api from './api';

/**
 * Food Service
 * Handles food item-related API calls
 */
const foodService = {
  // Search food items globally
  searchFoods: async (query) => {
    const response = await api.get('/foods/search', { params: { q: query } });
    return response.data;
  },

  // Get all food items for a restaurant
  getFoodsByRestaurant: async (restaurantId, params = {}) => {
    const response = await api.get(`/foods/restaurant/${restaurantId}`, { params });
    return response.data;
  },

  // Get single food item by ID
  getFoodById: async (id) => {
    const response = await api.get(`/foods/${id}`);
    return response.data;
  },
};

export default foodService;
