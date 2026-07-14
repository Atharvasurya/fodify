import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getDashboardStats,
  getOrderAnalytics,
  getRevenueAnalytics
} from '../controllers/adminDashboardController.js';
import { globalSearch } from '../controllers/adminSearchController.js';
import {
  getUsers,
  getUserById,
  toggleUserBlock,
  getUserOrders
} from '../controllers/adminUserController.js';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/adminOrderController.js';
import {
  getAllReviews,
  approveReview,
  rejectReview,
  flagReview
} from '../controllers/adminReviewController.js';
import {
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer
} from '../controllers/adminOfferController.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/adminNotificationController.js';
import {
  getAllIssues,
  updateIssue
} from '../controllers/adminIssueController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect, admin);

// Dashboard & Analytics
router.get('/stats', getDashboardStats);
router.get('/analytics/orders', getOrderAnalytics);
router.get('/analytics/revenue', getRevenueAnalytics);

// Global Search
router.get('/search', globalSearch);

// User Management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/block', toggleUserBlock);
router.get('/users/:id/orders', getUserOrders);

// Order Management
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// Review Management
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/approve', approveReview);
router.put('/reviews/:id/reject', rejectReview);
router.put('/reviews/:id/flag', flagReview);

// Offer Management
router.get('/offers', getAllOffers);
router.post('/offers', createOffer);
router.put('/offers/:id', updateOffer);
router.delete('/offers/:id', deleteOffer);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markAsRead);
router.put('/notifications/read-all', markAllAsRead);

// Issues & Complaints
router.get('/issues', getAllIssues);
router.put('/issues/:id', updateIssue);

export default router;
