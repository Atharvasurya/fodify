import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import Notification from '../models/Notification.js';

const router = express.Router();

/**
 * @desc    Get all notifications for admin
 * @route   GET /api/admin/notifications
 * @access  Private/Admin
 */
router.get('/', protect, admin, async (req, res) => {
  try {
    const { isRead, limit = 50, page = 1 } = req.query;

    const query = {};
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('userId', 'name email')
      .populate('orderId', 'orderNumber totalAmount')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ isRead: false });

    res.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/admin/notifications/unread-count
 * @access  Private/Admin
 */
router.get('/unread-count', protect, admin, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ isRead: false });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count'
    });
  }
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/admin/notifications/:id/read
 * @access  Private/Admin
 */
router.put('/:id/read', protect, admin, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/admin/notifications/read-all
 * @access  Private/Admin
 */
router.put('/read-all', protect, admin, async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/admin/notifications/:id
 * @access  Private/Admin
 */
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

/**
 * Helper function to create notification
 * Can be imported and used in other routes
 */
export const createNotification = async (type, message, data = {}) => {
  try {
    await Notification.create({
      type,
      message,
      ...data
    });
  } catch (error) {
    console.error('Create notification error:', error);
  }
};

export default router;
