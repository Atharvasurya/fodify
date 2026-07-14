import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiClock, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import aiService from '../services/aiService';
import AIBadge from './AIBadge';
import { addToCart } from '../store/slices/cartSlice';

const AISmartReorder = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchReorder = async () => {
      try {
        const res = await aiService.getReorderSuggestions();
        if (res.data?.success) {
          setSuggestions(res.data.data.suggestions);
        }
      } catch (error) {
        console.error('Error fetching reorder suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReorder();
  }, [isAuthenticated]);

  if (!isAuthenticated || loading || suggestions.length === 0) {
    return null;
  }

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      food: item.food,
      restaurantId: item.restaurant?._id || item.restaurant,
      restaurantName: item.restaurant?.name || 'Restaurant',
      price: item.food.price
    }));
    toast.success('Added to cart!');
  };

  return (
    <div className="my-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🔄 Order Again
        </h2>
        <AIBadge />
        <span className="text-sm text-gray-500 hidden sm:inline ml-2 border-l pl-4 border-gray-300">
          Smart predictions based on your habits
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((item, index) => (
          <motion.div 
            key={item.food._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md border border-purple-100 flex gap-4 relative overflow-hidden"
          >
            {/* AI Insight banner */}
            <div className="absolute top-0 left-0 right-0 bg-purple-50 px-4 py-1 flex items-center gap-2 text-xs font-medium text-purple-700 border-b border-purple-100">
              <FiClock className="shrink-0" /> {item.timingInsight}
            </div>

            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 mt-6 relative">
              <img src={item.food.image} alt={item.food.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col justify-between flex-grow mt-6">
              <div>
                <h4 className="font-bold text-gray-900 line-clamp-1">{item.food.name}</h4>
                <p className="text-xs text-gray-500">{item.restaurant?.name || 'Restaurant'}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Ordered {item.orderCount} times</p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-gray-900">₹{item.food.price}</span>
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <FiRefreshCw size={12} /> Reorder
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AISmartReorder;
