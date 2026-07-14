import api from './api';

/**
 * Restaurant Service
 * Handles restaurant-related API calls
 */
const restaurantService = {
  // Get all restaurants with optional filters
  getRestaurants: async (params = {}) => {
    const response = await api.get('/restaurants', { params });
    return response.data;
  },

  // Get single restaurant by ID
  getRestaurantById: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },
};

export default restaurantService;
