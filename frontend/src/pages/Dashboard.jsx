import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiShield, FiArrowRight } from 'react-icons/fi';
import { MdRestaurantMenu, MdDashboard } from 'react-icons/md';

/**
 * Dashboard Landing Page
 * Entry point with User and Admin options
 */
const Dashboard = () => {
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e11d48' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-7xl font-display font-bold text-gray-900 mb-4">
            Welcome to <span className="text-primary-600">Fodify</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            AI Powered Food Ordering Platform
          </p>
          <p className="text-lg text-gray-500">
            Choose how you'd like to continue
          </p>
        </motion.div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* User Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => navigate('/home')}
            className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary-500 overflow-hidden"
          >
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-20 h-20 bg-primary-100 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                <FiUser className="w-10 h-10 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 group-hover:text-white mb-4 transition-colors duration-300">
                User Portal
              </h2>

              {/* Description */}
              <p className="text-gray-600 group-hover:text-white/90 mb-6 transition-colors duration-300">
                Browse restaurants, order delicious food, track your orders, and manage your profile.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 group-hover:text-white/90 transition-colors duration-300">
                  <MdRestaurantMenu className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Browse 100+ Restaurants</span>
                </li>
                <li className="flex items-center text-gray-700 group-hover:text-white/90 transition-colors duration-300">
                  <MdRestaurantMenu className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Order Your Favorite Food</span>
                </li>
                <li className="flex items-center text-gray-700 group-hover:text-white/90 transition-colors duration-300">
                  <MdRestaurantMenu className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Track Orders in Real-time</span>
                </li>
              </ul>

              {/* Button */}
              <div className="flex items-center justify-between">
                <span className="text-primary-600 group-hover:text-white font-semibold text-lg transition-colors duration-300">
                  Continue as User
                </span>
                <FiArrowRight className="w-6 h-6 text-primary-600 group-hover:text-white transform group-hover:translate-x-2 transition-all duration-300" />
              </div>
            </div>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => navigate('/admin')}
            className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-500 overflow-hidden"
          >
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-20 h-20 bg-purple-100 group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                <FiShield className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-900 group-hover:text-white mb-4 transition-colors duration-300">
                Admin Portal
              </h2>

              {/* Description */}
              <p className="text-gray-600 group-hover:text-white/90 mb-6 transition-colors duration-300">
                Manage restaurants, food items, orders, and monitor the entire platform.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 group-hover:text-white/90 transition-colors duration-300">
                  <MdDashboard className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Manage Restaurants & Menus</span>
                </li>
                <li className="flex items-center text-gray-700 group-hover:text-white/90 transition-colors duration-300">
                  <MdDashboard className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Track All Orders</span>
                </li>
                <li className="flex items-center text-gray-700 group-hover:text-white/90 transition-colors duration-300">
                  <MdDashboard className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>View Analytics & Reports</span>
                </li>
              </ul>

              {/* Button */}
              <div className="flex items-center justify-between">
                <span className="text-purple-600 group-hover:text-white font-semibold text-lg transition-colors duration-300">
                  Continue as Admin
                </span>
                <FiArrowRight className="w-6 h-6 text-purple-600 group-hover:text-white transform group-hover:translate-x-2 transition-all duration-300" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-gray-500 text-center"
        >
          Desgined and Developed by Atharva Ravindra Suryawanshi 🍕
        </motion.p>
      </div>
    </div>
  );
};

export default Dashboard;
