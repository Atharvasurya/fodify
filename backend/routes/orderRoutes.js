import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus, cancelOrder } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/', protect, createOrder);
router.get('/user', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/cancel', protect, cancelOrder);

// Admin routes
router.patch('/:id/status', protect, admin, updateOrderStatus);

export default router;
