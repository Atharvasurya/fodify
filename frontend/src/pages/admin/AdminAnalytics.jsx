import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp,
  FiClock, FiStar, FiPackage, FiPieChart
} from 'react-icons/fi';
import { MdRestaurantMenu } from 'react-icons/md';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, AreaChart, Area
} from 'recharts';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Detailed Analytics Page
 * Comprehensive analytics dashboard with charts and insights
 */
const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [orderAnalytics, setOrderAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('week');

  const COLORS = {
    primary: '#7c3aed',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f97316'
  };

  const PIE_COLORS = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.danger, COLORS.info];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timePeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [statsRes, analyticsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getOrderAnalytics(timePeriod)
      ]);

      setStats(statsRes.data);
      setOrderAnalytics(analyticsRes.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const orderStatusData = stats ? [
    { name: 'New', value: stats.orders?.new || 0 },
    { name: 'Confirmed', value: stats.orders?.confirmed || 0 },
    { name: 'Preparing', value: stats.orders?.preparing || 0 },
    { name: 'Out for Delivery', value: stats.orders?.outForDelivery || 0 },
    { name: 'Delivered', value: stats.orders?.delivered || 0 },
    { name: 'Cancelled', value: stats.orders?.cancelled || 0 }
  ].filter(item => item.value > 0) : [];

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
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
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights and metrics</p>
        </div>

        {/* Time Period Filter */}
        <div className="flex gap-2">
          {['today', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${timePeriod === period
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`₹${stats?.revenue?.toLocaleString() || 0}`}
          icon={FiDollarSign}
          color="green"
          trend="+12.5%"
        />
        <MetricCard
          title="Total Orders"
          value={stats?.orders?.total || 0}
          icon={FiShoppingBag}
          color="purple"
          trend="+8.2%"
        />
        <MetricCard
          title="Active Users"
          value={stats?.users || 0}
          icon={FiUsers}
          color="blue"
          trend="+15.3%"
        />
        <MetricCard
          title="Avg Order Value"
          value={`₹${stats?.revenue && stats?.orders?.total ? Math.round(stats.revenue / stats.orders.total) : 0}`}
          icon={FiTrendingUp}
          color="orange"
          trend="+5.1%"
        />
      </div>

      {/* Revenue & Orders Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <ChartCard title="Revenue Trend" icon={FiDollarSign}>
          {orderAnalytics && orderAnalytics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={orderAnalytics}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.success}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={FiDollarSign} message="No revenue data available" />
          )}
        </ChartCard>

        {/* Orders Trend */}
        <ChartCard title="Orders Trend" icon={FiShoppingBag}>
          {orderAnalytics && orderAnalytics.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={FiShoppingBag} message="No order data available" />
          )}
        </ChartCard>
      </div>

      {/* Order Status & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <ChartCard title="Order Status Distribution" icon={FiPieChart}>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => {
                    // Map specific colors to order statuses
                    const getColor = (name) => {
                      switch (name) {
                        case 'New': return COLORS.info; // Blue
                        case 'Confirmed': return COLORS.purple; // Purple
                        case 'Preparing': return COLORS.warning; // Orange
                        case 'Out for Delivery': return COLORS.primary; // Purple
                        case 'Delivered': return COLORS.success; // Green
                        case 'Cancelled': return COLORS.danger; // Red
                        default: return PIE_COLORS[index % PIE_COLORS.length];
                      }
                    };

                    return (
                      <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                    );
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={FiPieChart} message="No status data available" />
          )}
        </ChartCard>

        {/* Quick Stats */}
        <ChartCard title="Quick Overview" icon={FiPackage}>
          <div className="grid grid-cols-2 gap-6 p-6">
            <StatItem
              label="Preparing"
              value={stats?.orders?.preparing || 0}
              color="purple"
            />
            <StatItem
              label="Out for Delivery"
              value={stats?.orders?.outForDelivery || 0}
              color="blue"
            />
            <StatItem
              label="Delivered Today"
              value={stats?.orders?.delivered || 0}
              color="green"
            />
            <StatItem
              label="Cancelled"
              value={stats?.orders?.cancelled || 0}
              color="red"
            />
            <StatItem
              label="Total Restaurants"
              value={stats?.restaurants || 0}
              color="orange"
            />
            <StatItem
              label="Pending Reviews"
              value={stats?.reviews?.pending || 0}
              color="yellow"
            />
          </div>
        </ChartCard>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PerformanceCard
          title="Order Completion Rate"
          value="94.5%"
          description="Orders successfully delivered"
          icon={FiPackage}
          color="green"
        />
        <PerformanceCard
          title="Average Delivery Time"
          value="32 mins"
          description="From order to delivery"
          icon={FiClock}
          color="blue"
        />
        <PerformanceCard
          title="Customer Satisfaction"
          value="4.6/5"
          description="Average rating from reviews"
          icon={FiStar}
          color="yellow"
        />
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-sm font-medium text-green-600 flex items-center gap-1">
            <FiTrendingUp className="w-4 h-4" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600 mt-1">{title}</p>
    </motion.div>
  );
};

// Chart Card Component
const ChartCard = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
  >
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-gray-700" />
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </motion.div>
);

// Empty State Component
const EmptyState = ({ icon: Icon, message }) => (
  <div className="h-[300px] flex items-center justify-center text-gray-400">
    <div className="text-center">
      <Icon className="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p>{message}</p>
    </div>
  </div>
);

// Stat Item Component
const StatItem = ({ label, value, color }) => {
  const colorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-600'
  };

  return (
    <div className="text-center">
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
};

// Performance Card Component
const PerformanceCard = ({ title, value, description, icon: Icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
    >
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-base font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </motion.div>
  );
};

export default AdminAnalytics;
