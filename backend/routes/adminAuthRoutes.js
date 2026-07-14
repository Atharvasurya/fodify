import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { adminLogin, verifyAdmin } from '../controllers/adminAuthController.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected admin routes
router.get('/verify', protect, admin, verifyAdmin);

export default router;
