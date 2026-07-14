import api from './api';
import axios from 'axios';

const adminApi = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const aiService = {
  getRecommendations: () => api.get('/ai/recommendations'),
  getGuestRecommendations: () => api.get('/ai/recommendations/guest'),
  getMoodSuggestions: (mood) => api.get(`/ai/mood/${mood}`),
  smartSearch: (query) => api.get(`/ai/search/smart?q=${encodeURIComponent(query)}`),
  getFoodPairings: (foodId) => api.get(`/ai/pairing/${foodId}`),
  getNutrition: (foodId) => api.get(`/ai/nutrition/${foodId}`),
  getTrending: () => api.get('/ai/trending'),
  getReorderSuggestions: () => api.get('/ai/reorder-suggestions'),
  getReviewInsights: (restaurantId) => api.get(`/ai/review-insights/${restaurantId}`),
  
  // Admin endpoints (Using adminApi to pass adminToken)
  getAdminInsights: () => adminApi.get('/ai/admin/insights'),
  getAdminForecast: (days = 7) => adminApi.get(`/ai/admin/forecast?days=${days}`),
  getAdminSentiment: () => adminApi.get('/ai/admin/sentiment'),
  getAdminSegments: () => adminApi.get('/ai/admin/segments'),
  getAdminMenuPerformance: () => adminApi.get('/ai/admin/menu-performance'),
  getAdminPricing: () => adminApi.get('/ai/admin/pricing'),
  getAdminAnomalies: () => adminApi.get('/ai/admin/anomalies'),
  getAdminDemandHeatmap: () => adminApi.get('/ai/admin/demand-heatmap'),
};

export default aiService;
