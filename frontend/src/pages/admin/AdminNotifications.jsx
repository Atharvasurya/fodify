import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiCheck, FiTrash2, FiFilter } from 'react-icons/fi';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

/**
 * Admin Notifications Page
 * Full page for managing all notifications
 */
const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'unread') params.isRead = false;
      if (filter === 'read') params.isRead = true;

      const response = await adminService.getNotifications(params);
      setNotifications(response.data || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      toast.error('Failed to fetch notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await adminService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await adminService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      await adminService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_order':
        return '🛒';
      case 'order_cancelled':
        return '❌';
      case 'new_review':
        return '⭐';
      case 'new_restaurant_signup':
        return '🏪';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_order':
        return 'bg-green-50 border-green-200';
      case 'order_cancelled':
        return 'bg-red-50 border-red-200';
      case 'new_review':
        return 'bg-yellow-50 border-yellow-200';
      case 'new_restaurant_signup':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <FiCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['all', 'unread', 'read'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 font-medium capitalize transition ${filter === tab
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            {tab}
            {tab === 'unread' && unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 transition ${!notification.isRead ? getNotificationColor(notification.type) : 'bg-white border-gray-200'
                }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-3xl">{getNotificationIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                    {notification.userId && (
                      <span className="flex items-center gap-1">
                        👤 {notification.userId.name}
                      </span>
                    )}
                    {notification.orderId && (
                      <span className="flex items-center gap-1">
                        📦 Order #{notification.orderId.orderNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Mark as read"
                    >
                      <FiCheck className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <FiBell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {filter === 'unread'
                ? 'All notifications have been read'
                : filter === 'read'
                  ? 'No read notifications'
                  : 'You have no notifications yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
