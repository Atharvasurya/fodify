import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

/**
 * @desc    Global search across users, restaurants, orders, food
 * @route   GET /api/admin/search?q=query
 * @access  Private/Admin
 */
export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const searchRegex = new RegExp(q, 'i');

    // Search in parallel
    const [users, restaurants, foods, orders] = await Promise.all([
      User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).limit(5).select('name email role'),

      Restaurant.find({
        $or: [
          { name: searchRegex },
          { cuisine: searchRegex }
        ]
      }).limit(5).select('name cuisine image'),

      Food.find({
        name: searchRegex,
        isAvailable: true
      }).populate('restaurantId', 'name').limit(5).select('name price image restaurantId'),

      Order.find({
        $or: [
          { _id: searchRegex },
          { 'deliveryAddress.name': searchRegex }
        ]
      }).populate('userId', 'name email').limit(5).select('_id userId totalAmount status createdAt')
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        restaurants,
        foods,
        orders
      }
    });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
};
