import User from '../models/User.js';
import Order from '../models/Order.js';

/**
 * @desc    Get all users with pagination and search
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user'
    });
  }
};

/**
 * @desc    Block/Unblock user
 * @route   PUT /api/admin/users/:id/block
 * @access  Private/Admin
 */
export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent blocking admins
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot block admin users'
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: { isBlocked: user.isBlocked }
    });
  } catch (error) {
    console.error('Toggle user block error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating user status'
    });
  }
};

/**
 * @desc    Get user order history
 * @route   GET /api/admin/users/:id/orders
 * @access  Private/Admin
 */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id })
      .populate('restaurantId', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user orders'
    });
  }
};
