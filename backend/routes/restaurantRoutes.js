import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurantController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Admin routes
router.post('/', protect, admin, createRestaurant);
router.put('/:id', protect, admin, updateRestaurant);
router.delete('/:id', protect, admin, deleteRestaurant);

export default router;
