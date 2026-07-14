import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiMenu } from 'react-icons/fi';
import adminService from '../../services/adminService';
import NotificationDropdown from './NotificationDropdown';

/**
 * Admin Topbar
 * Search bar, notifications, and admin profile
 */
const AdminTopbar = ({ toggleSidebar }) => {
  const { admin } = useSelector((state) => state.adminAuth);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotificationCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const response = await adminService.getUnreadCount();
      setNotificationCount(response.count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Left: Mobile Menu + Search */}
      <div className="flex items-center flex-1">
        <button
          onClick={toggleSidebar}
          className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
        >
          <FiMenu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, orders, restaurants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
        </form>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-600 hover:text-gray-900 transition"
          >
            <FiBell className="w-6 h-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notificationCount={notificationCount}
            onUpdate={fetchNotificationCount}
          />
        </div>

        {/* Admin Profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500">{admin?.role || 'Administrator'}</p>
          </div>
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {admin?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;

