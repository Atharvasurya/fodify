import api from './api';

/**
 * Order Service
 * Handles order-related API calls
 */
const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getUserOrders: async () => {
    const response = await api.get('/orders/user');
    return response.data;
  },

  // Get single order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

export default orderService;
