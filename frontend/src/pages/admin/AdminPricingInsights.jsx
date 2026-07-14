import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiCheck, FiInfo } from 'react-icons/fi';
import aiService from '../../services/aiService';

const AdminPricingInsights = () => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await aiService.getAdminPricing();
        if (res.data?.success) {
          setPricing(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching pricing insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const handleApplyPrice = async (suggestion) => {
    try {
      // Import toast inside component to use it
      const { default: toast } = await import('react-hot-toast');
      const { default: adminService } = await import('../../services/adminService');
      
      await adminService.updateFood(suggestion.food._id, { price: suggestion.suggestedPrice });
      toast.success(`Price updated to ₹${suggestion.suggestedPrice} for ${suggestion.food.name}`);
      
      // Remove from list
      setPricing(prev => ({
        ...prev,
        suggestions: prev.suggestions.filter(s => s.food._id !== suggestion.food._id)
      }));
    } catch (error) {
      console.error('Error updating price:', error);
      import('react-hot-toast').then(m => m.default.error('Failed to update price'));
    }
  };

  const handleIgnore = (foodId) => {
    setPricing(prev => ({
      ...prev,
      suggestions: prev.suggestions.filter(s => s.food._id !== foodId)
    }));
  };

  const handleApplyAll = async () => {
    try {
      const { default: toast } = await import('react-hot-toast');
      const { default: adminService } = await import('../../services/adminService');
      
      toast.loading('Applying all prices...', { id: 'apply-all' });
      for (const suggestion of pricing.suggestions) {
        await adminService.updateFood(suggestion.food._id, { price: suggestion.suggestedPrice });
      }
      toast.success('Successfully applied all AI pricing suggestions!', { id: 'apply-all' });
      
      setPricing(prev => ({
        ...prev,
        suggestions: []
      }));
    } catch (error) {
      console.error('Error applying all prices:', error);
      import('react-hot-toast').then(m => m.default.error('Failed to apply some prices', { id: 'apply-all' }));
    }
  };

  if (loading) {
    return <div className="p-6"><div className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">💰 Smart Pricing Engine</h1>
        <p className="text-gray-500 mt-2">AI-driven dynamic pricing recommendations based on demand elasticity</p>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white mb-8 shadow-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
            <FiCheck className="bg-white/20 p-1 rounded-full w-6 h-6" /> 
            AI Analysis Complete
          </h2>
          <p className="text-purple-100">Found {pricing?.summary?.totalSuggestions} pricing opportunities with an estimated {pricing?.summary?.estimatedRevenueImpact} revenue impact.</p>
        </div>
        <button 
          onClick={handleApplyAll}
          className="bg-white text-purple-700 font-bold px-6 py-2.5 rounded-xl hover:bg-purple-50 transition shadow-sm"
        >
          Apply All Suggestions
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricing?.suggestions?.map((suggestion, index) => (
          <motion.div 
            key={suggestion.food._id}
            initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: index*0.05}}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 rounded-full ${suggestion.direction === 'increase' ? 'bg-green-100' : 'bg-red-100'}`}></div>
            
            <div className="flex gap-4 mb-4 relative z-10">
              <img src={suggestion.food.image} alt={suggestion.food.name} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <h3 className="font-bold text-gray-900">{suggestion.food.name}</h3>
                <p className="text-xs text-gray-500">{suggestion.restaurant?.name || 'Restaurant'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">Confidence: {suggestion.confidence}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Current Price</p>
                <p className="font-bold text-gray-900 line-through decoration-red-500">₹{suggestion.currentPrice}</p>
              </div>
              <div className="text-gray-300 font-bold text-xl">→</div>
              <div className="text-center">
                <p className="text-xs text-purple-600 font-semibold mb-1">AI Suggested</p>
                <p className="font-bold text-green-600 text-lg">₹{suggestion.suggestedPrice}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
              <FiInfo className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-800 font-medium text-xs mb-1">AI Reasoning</p>
                <p className="text-blue-600 text-xs leading-relaxed">{suggestion.reason}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => handleIgnore(suggestion.food._id)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-50 text-sm transition"
              >
                Ignore
              </button>
              <button 
                onClick={() => handleApplyPrice(suggestion)}
                className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 text-sm transition shadow-sm"
              >
                Apply Price
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminPricingInsights;
