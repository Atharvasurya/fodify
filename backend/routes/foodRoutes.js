import express from 'express';
import {
  getFoodsByRestaurant,
  getFoodById,
  createFood,
  searchFoods,
  getAllFoods,
  updateFood,
  deleteFood
} from '../controllers/foodController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllFoods);
router.get('/search', searchFoods);
router.get('/restaurant/:restaurantId', getFoodsByRestaurant);
router.get('/:id', getFoodById);

// Admin routes
router.post('/', protect, admin, createFood);
router.put('/:id', protect, admin, updateFood);
router.delete('/:id', protect, admin, deleteFood);

export default router;
