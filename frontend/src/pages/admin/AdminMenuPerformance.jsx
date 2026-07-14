import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiTrendingDown, FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import aiService from '../../services/aiService';

const AdminMenuPerformance = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await aiService.getAdminMenuPerformance();
        if (res.data?.success) {
          setPerformance(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching menu performance:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  if (loading) {
    return <div className="p-6"><div className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div></div>;
  }

  const getCategoryConfig = (category) => {
    switch(category) {
      case 'star': return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: '⭐', label: 'Star (High Volume, High Revenue)' };
      case 'cash_cow': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: '💰', label: 'Cash Cow (Low Volume, High Margin)' };
      case 'question_mark': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: '❓', label: 'Question Mark (High Volume, Low Margin)' };
      case 'dog': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '📉', label: 'Dog (Low Volume, Low Revenue)' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', icon: '•', label: 'Unknown' };
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🍽️ Menu Engineering</h1>
        <p className="text-gray-500 mt-2">AI analysis of menu item performance (BCG Matrix)</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-3xl font-bold text-gray-900">{performance?.summary?.stars}</div>
          <div className="text-sm text-gray-500 font-medium">Stars</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-3xl font-bold text-gray-900">{performance?.summary?.cashCows}</div>
          <div className="text-sm text-gray-500 font-medium">Cash Cows</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="text-2xl mb-1">❓</div>
          <div className="text-3xl font-bold text-gray-900">{performance?.summary?.questionMarks}</div>
          <div className="text-sm text-gray-500 font-medium">Question Marks</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <div className="text-2xl mb-1">📉</div>
          <div className="text-3xl font-bold text-gray-900">{performance?.summary?.dogs}</div>
          <div className="text-sm text-gray-500 font-medium">Dogs</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-700">Item Name</th>
                <th className="p-4 font-semibold text-gray-700">Restaurant</th>
                <th className="p-4 font-semibold text-gray-700">Orders</th>
                <th className="p-4 font-semibold text-gray-700">Revenue</th>
                <th className="p-4 font-semibold text-gray-700">Classification</th>
                <th className="p-4 font-semibold text-gray-700">AI Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {performance?.items?.map((item, index) => {
                const config = getCategoryConfig(item.category);
                return (
                  <motion.tr 
                    initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: index*0.05}}
                    key={item.food._id} 
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={item.food.image} alt={item.food.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-semibold text-gray-900">{item.food.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{item.restaurant?.name || 'N/A'}</td>
                    <td className="p-4 font-medium">{item.orders}</td>
                    <td className="p-4 font-medium text-green-600">₹{item.revenue}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
                        {config.icon} {config.label.split(' ')[0]}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">💡</span>
                        <span>{item.recommendation}</span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMenuPerformance;
