import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiAlertTriangle, FiInfo, FiActivity } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import aiService from '../../services/aiService';

const AdminAIDashboard = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await aiService.getAdminInsights();
        if (res.data?.success) {
          setInsights(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching admin AI insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>)}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  const getIcon = (type) => {
    switch(type) {
      case 'growth': return <FiTrendingUp className="text-green-500 w-6 h-6" />;
      case 'warning': return <FiAlertTriangle className="text-red-500 w-6 h-6" />;
      case 'info': return <FiInfo className="text-blue-500 w-6 h-6" />;
      default: return <FiActivity className="text-purple-500 w-6 h-6" />;
    }
  };

  const getBg = (type) => {
    switch(type) {
      case 'growth': return 'bg-green-50 border-green-100';
      case 'warning': return 'bg-red-50 border-red-100';
      case 'info': return 'bg-blue-50 border-blue-100';
      default: return 'bg-purple-50 border-purple-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            🧠 AI Business Intelligence
          </h1>
          <p className="text-gray-500 mt-2">Automated insights and anomaly detection for your business</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Weekly Orders</h3>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-3xl font-bold text-gray-900">{insights?.summary?.currentWeek?.orders || 0}</span>
            <span className={`text-sm font-medium ${insights?.summary?.changes?.orders > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {insights?.summary?.changes?.orders > 0 ? '+' : ''}{insights?.summary?.changes?.orders}%
            </span>
          </div>
        </motion.div>
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Weekly Revenue</h3>
          <div className="flex items-end gap-3 mt-2">
            <span className="text-3xl font-bold text-gray-900">₹{insights?.summary?.currentWeek?.revenue || 0}</span>
            <span className={`text-sm font-medium ${insights?.summary?.changes?.revenue > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {insights?.summary?.changes?.revenue > 0 ? '+' : ''}{insights?.summary?.changes?.revenue}%
            </span>
          </div>
        </motion.div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Key AI Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {insights?.insights?.map((insight, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl border ${getBg(insight.type)}`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {getIcon(insight.type)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{insight.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{insight.metric}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${insight.change > 0 ? 'bg-green-100 text-green-700' : (insight.change < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700')}`}>
                    {insight.change > 0 ? '+' : ''}{insight.change}%
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-black/5 text-xs text-gray-700 font-medium flex items-start gap-1">
                  <span>💡</span> {insight.recommendation}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminAIDashboard;
