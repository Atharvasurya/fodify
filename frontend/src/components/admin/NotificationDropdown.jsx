import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { formatDistanceToNow } from 'date-fns';

/**
 * Notification Dropdown Component
 * Shows recent notifications with mark as read functionality
 */
const NotificationDropdown = ({ isOpen, onClose, notificationCount, onUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await adminService.getNotifications({ limit: 5 });
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await adminService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      ));
      onUpdate(); // Update count in parent
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read and navigate based on type
    if (!notification.isRead) {
      handleMarkAsRead(notification._id, { stopPropagation: () => { } });
    }

    // Navigate based on notification type
    if (notification.orderId) {
      navigate('/admin/orders');
    } else if (notification.type === 'new_review') {
      navigate('/admin/reviews');
    } else if (notification.type === 'new_restaurant_signup') {
      navigate('/admin/restaurants');
    }

    onClose();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {notificationCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {notificationCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${!notification.isRead ? 'bg-blue-50' : ''
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(notification._id, e)}
                        className="text-purple-600 hover:text-purple-700 transition"
                        title="Mark as read"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FiBell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => {
                  navigate('/admin/notifications');
                  onClose();
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition"
              >
                View All Notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
