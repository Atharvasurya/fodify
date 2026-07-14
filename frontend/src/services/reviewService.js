import api from './api';

/**
 * Review Service
 * Handles all review-related API calls
 */
const reviewService = {
  /**
   * Get approved reviews for a restaurant
   */
  getRestaurantReviews: async (restaurantId) => {
    const response = await api.get(`/reviews/restaurant/${restaurantId}`);
    return response.data;
  },

  /**
   * Submit a review (requires authentication)
   */
  submitReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  /**
   * Get user's own reviews (requires authentication)
   */
  getMyReviews: async () => {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  }
};

export default reviewService;
