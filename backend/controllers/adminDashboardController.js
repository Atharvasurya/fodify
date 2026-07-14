import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      newOrders,
      confirmedOrders,
      preparingOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      totalUsers,
      totalRestaurants,
      totalReviews,
      pendingReviews
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'preparing' }),
      Order.countDocuments({ status: 'out_for_delivery' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      User.countDocuments({ role: 'user' }),
      Restaurant.countDocuments(),
      Review.countDocuments(),
      Review.countDocuments({ status: 'pending' })
    ]);

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        orders: {
          total: totalOrders,
          new: newOrders,
          confirmed: confirmedOrders,
          preparing: preparingOrders,
          outForDelivery: outForDeliveryOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        },
        users: totalUsers,
        restaurants: totalRestaurants,
        reviews: {
          total: totalReviews,
          pending: pendingReviews
        },
        revenue: totalRevenue
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard statistics'
    });
  }
};

/**
 * @desc    Get order analytics
 * @route   GET /api/admin/analytics/orders
 * @access  Private/Admin
 */
export const getOrderAnalytics = async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    let startDate = new Date();
    if (period === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Use orderDate if available, fallback to createdAt
    const ordersByDay = await Order.aggregate([
      {
        $addFields: {
          dateField: { $ifNull: ['$createdAt', '$orderDate'] }
        }
      },
      {
        $match: {
          dateField: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateField' } },
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'delivered'] },
                '$totalAmount',
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('📊 Order Analytics:', JSON.stringify(ordersByDay, null, 2));

    res.status(200).json({
      success: true,
      data: ordersByDay
    });
  } catch (error) {
    console.error('Get order analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order analytics'
    });
  }
};

/**
 * @desc    Get revenue analytics
 * @route   GET /api/admin/analytics/revenue
 * @access  Private/Admin
 */
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    let groupFormat = '%Y-%m-%d';
    if (period === 'year') {
      groupFormat = '%Y-%m';
    }

    const revenueData = await Order.aggregate([
      {
        $match: {
          status: 'delivered'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching revenue analytics'
    });
  }
};
