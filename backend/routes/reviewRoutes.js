import express from 'express';
import { protect } from '../middleware/auth.js';
import Review from '../models/Review.js';

const router = express.Router();

/**
 * @desc    Submit a review for a restaurant/food
 * @route   POST /api/reviews
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { restaurantId, foodId, rating, comment, orderId, isPublic } = req.body;

    // Check if user already reviewed this order
    if (orderId) {
      const existingReview = await Review.findOne({
        userId: req.user._id,
        orderId
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this order'
        });
      }
    }

    const review = await Review.create({
      userId: req.user._id,
      restaurantId,
      foodId,
      orderId,
      rating,
      comment,
      isPublic: isPublic !== undefined ? isPublic : true, // Default to public
      status: 'pending' // Will be approved by admin
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! It will be visible after admin approval.',
      data: review
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit review'
    });
  }
});

/**
 * @desc    Get user's reviews
 * @route   GET /api/reviews/my-reviews
 * @access  Private
 */
router.get('/my-reviews', protect, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('restaurantId', 'name image')
      .populate('foodId', 'name image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

/**
 * @desc    Get approved reviews for a restaurant
 * @route   GET /api/reviews/restaurant/:restaurantId
 * @access  Public
 */
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const reviews = await Review.find({
      restaurantId,
      status: 'approved', // Only show approved reviews
      isPublic: true // Only show public reviews
    })
      .populate('userId', 'name') // Only get user name for privacy
      .sort({ createdAt: -1 }) // Newest first
      .limit(50); // Limit to 50 reviews

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Get restaurant reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

export default router;
