import axios from 'axios';

// Create axios instance for admin API calls
const adminApi = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
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

const adminService = {
  // Authentication
  login: async (credentials) => {
    const response = await adminApi.post('/admin/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  verify: async () => {
    const response = await adminApi.get('/admin/auth/verify');
    return response.data;
  },

  // Dashboard Stats
  getStats: async () => {
    const response = await adminApi.get('/admin/stats');
    return response.data;
  },

  getOrderAnalytics: async (period = 'week') => {
    const response = await adminApi.get(`/admin/analytics/orders?period=${period}`);
    return response.data;
  },

  getRevenueAnalytics: async (period = 'month') => {
    const response = await adminApi.get(`/admin/analytics/revenue?period=${period}`);
    return response.data;
  },

  // Global Search
  search: async (query) => {
    const response = await adminApi.get(`/admin/search?q=${query}`);
    return response.data;
  },

  // User Management
  getUsers: async (params = {}) => {
    const response = await adminApi.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await adminApi.get(`/admin/users/${id}`);
    return response.data;
  },

  toggleUserBlock: async (id) => {
    const response = await adminApi.put(`/admin/users/${id}/block`);
    return response.data;
  },

  getUserOrders: async (id) => {
    const response = await adminApi.get(`/admin/users/${id}/orders`);
    return response.data;
  },

  // Order Management
  getOrders: async (params = {}) => {
    const response = await adminApi.get('/admin/orders', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await adminApi.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await adminApi.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Review Management
  getReviews: async (params = {}) => {
    const response = await adminApi.get('/admin/reviews', { params });
    return response.data;
  },

  approveReview: async (id) => {
    const response = await adminApi.put(`/admin/reviews/${id}/approve`);
    return response.data;
  },

  rejectReview: async (id) => {
    const response = await adminApi.put(`/admin/reviews/${id}/reject`);
    return response.data;
  },

  flagReview: async (id, reason) => {
    const response = await adminApi.put(`/admin/reviews/${id}/flag`, { reason });
    return response.data;
  },

  // Offer Management
  getOffers: async (params = {}) => {
    const response = await adminApi.get('/admin/offers', { params });
    return response.data;
  },

  createOffer: async (offerData) => {
    const response = await adminApi.post('/admin/offers', offerData);
    return response.data;
  },

  updateOffer: async (id, offerData) => {
    const response = await adminApi.put(`/admin/offers/${id}`, offerData);
    return response.data;
  },

  deleteOffer: async (id) => {
    const response = await adminApi.delete(`/admin/offers/${id}`);
    return response.data;
  },

  // Food Management
  updateFood: async (id, foodData) => {
    const response = await adminApi.put(`/foods/${id}`, foodData);
    return response.data;
  },

  // Notifications
  getNotifications: async (params = {}) => {
    const response = await adminApi.get('/admin/notifications', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await adminApi.get('/admin/notifications/unread-count');
    return response.data;
  },

  markNotificationAsRead: async (id) => {
    const response = await adminApi.put(`/admin/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await adminApi.put('/admin/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await adminApi.delete(`/admin/notifications/${id}`);
    return response.data;
  },

  // Issues
  getIssues: async (params) => {
    const response = await adminApi.get('/admin/issues', { params });
    return response.data;
  },

  updateIssueStatus: async (id, status) => {
    const response = await adminApi.put(`/admin/issues/${id}`, { status });
    return response.data;
  },
};

export default adminService;
