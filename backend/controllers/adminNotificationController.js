import Notification from '../models/Notification.js';

/**
 * @desc    Get all notifications
 * @route   GET /api/admin/notifications
 * @access  Private/Admin
 */
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, isRead = '' } = req.query;

    const query = {};

    if (isRead !== '') {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('orderId userId restaurantId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ isRead: false });

    res.status(200).json({
      success: true,
      data: notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching notifications'
    });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/admin/notifications/:id/read
 * @access  Private/Admin
 */
export const markAsRead = async (req, res) => {
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

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating notification'
    });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/admin/notifications/read-all
 * @access  Private/Admin
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating notifications'
    });
  }
};
