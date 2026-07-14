import express from 'express';
import { getRestaurantOffers, getFoodOffers } from '../controllers/offerController.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/restaurant/:id', getRestaurantOffers);
router.get('/food/:id', getFoodOffers);

export default router;
