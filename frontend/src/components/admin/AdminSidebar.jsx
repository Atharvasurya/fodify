import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FiHome, FiUsers, FiShoppingBag, FiStar, FiTag,
  FiBell, FiAlertCircle, FiLogOut, FiMenu, FiX,
  FiPieChart, FiTrendingUp, FiDollarSign, FiSmile,
  FiShoppingCart, FiPackage
} from 'react-icons/fi';
import { MdRestaurantMenu, MdFastfood } from 'react-icons/md';
import { logout } from '../../store/slices/adminAuthSlice';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Admin Sidebar Navigation
 * Responsive sidebar with navigation links
 */
const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    adminService.logout();
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const menuItems = [
    { name: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
    { name: 'Analytics', icon: FiPieChart, path: '/admin/analytics' },
    { name: 'AI Dashboard', icon: FiStar, path: '/admin/ai-dashboard' },
    { name: 'Demand Forecast', icon: FiTrendingUp, path: '/admin/forecast' },
    { name: 'Menu Engineering', icon: MdRestaurantMenu, path: '/admin/menu-performance' },
    { name: 'Smart Pricing', icon: FiDollarSign, path: '/admin/pricing' },
    { name: 'Sentiment Analysis', icon: FiSmile, path: '/admin/sentiment' },
    { name: 'Customer Segments', icon: FiUsers, path: '/admin/segments' },
    { name: 'Restaurants', icon: MdRestaurantMenu, path: '/admin/restaurants' },
    { name: 'Food Items', icon: MdFastfood, path: '/admin/foods' },
    { name: 'Grocery Stores', icon: FiShoppingCart, path: '/admin/grocery-stores' },
    { name: 'Grocery Items', icon: FiPackage, path: '/admin/grocery-items' },
    { name: 'Users', icon: FiUsers, path: '/admin/users' },
    { name: 'Orders', icon: FiShoppingBag, path: '/admin/orders' },
    { name: 'Reviews', icon: FiStar, path: '/admin/reviews' },
    { name: 'Offers', icon: FiTag, path: '/admin/offers' },
    { name: 'Notifications', icon: FiBell, path: '/admin/notifications' },
    { name: 'Issues', icon: FiAlertCircle, path: '/admin/issues' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-purple-700">
          <div>
            <h1 className="text-2xl font-bold">Fodify Admin</h1>
            <p className="text-xs text-purple-300">Management Panel</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white hover:text-purple-300"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 hover:bg-purple-700 transition ${isActive ? 'bg-purple-700 border-r-4 border-white' : ''
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-purple-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg transition"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
