import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiShoppingBag, FiUsers, FiDollarSign, FiStar,
  FiTrendingUp, FiPackage, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../../components/admin/StatCard';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Admin Dashboard Page
 * Main dashboard with statistics and charts
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orderAnalytics, setOrderAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(() => {
      fetchDashboardData(true); // Silent refresh
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const [statsRes, analyticsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getOrderAnalytics('week')
      ]);

      setStats(statsRes.data);
      setOrderAnalytics(analyticsRes.data);
      setLastUpdated(new Date());
    } catch (error) {
      if (!silent) {
        toast.error('Failed to fetch dashboard data');
      }
      console.error(error);
    } finally {
      if (!silent) setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Auto-refreshes every 10s</p>
          <p className="text-xs text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats?.orders?.total || 0}
          icon={FiShoppingBag}
          color="purple"
        />
        <StatCard
          title="Total Users"
          value={stats?.users || 0}
          icon={FiUsers}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.revenue?.toLocaleString() || 0}`}
          icon={FiDollarSign}
          color="green"
        />
        <StatCard
          title="Total Restaurants"
          value={stats?.restaurants || 0}
          icon={MdRestaurantMenu}
          color="orange"
        />
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="New Orders"
          value={stats?.orders?.new || 0}
          icon={FiPackage}
          color="indigo"
        />
        <StatCard
          title="Confirmed"
          value={stats?.orders?.confirmed || 0}
          icon={FiCheckCircle}
          color="blue"
        />
        <StatCard
          title="Delivered"
          value={stats?.orders?.delivered || 0}
          icon={FiCheckCircle}
          color="green"
        />
        <StatCard
          title="Cancelled"
          value={stats?.orders?.cancelled || 0}
          icon={FiXCircle}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Over Time</h3>
          {orderAnalytics && orderAnalytics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Orders', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  name="Orders"
                  dot={{ fill: '#7c3aed', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FiPackage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No order data available yet</p>
                <p className="text-xs mt-1">Place some orders to see the chart</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h3>
          {orderAnalytics && orderAnalytics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  name="Revenue (₹)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FiDollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No revenue data available yet</p>
                <p className="text-xs mt-1">Complete some orders to see revenue</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats?.orders?.preparing || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Preparing</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats?.orders?.outForDelivery || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Out for Delivery</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats?.reviews?.pending || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Pending Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats?.reviews?.total || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Total Reviews</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
