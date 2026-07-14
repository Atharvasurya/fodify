import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiCpu } from 'react-icons/fi';
import toast from 'react-hot-toast';
import aiService from '../services/aiService';
import AIBadge from './AIBadge';
import { addToCart } from '../store/slices/cartSlice';

const AIFoodPairing = ({ cartItems }) => {
  const dispatch = useDispatch();
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setPairings([]);
      return;
    }

    const lastItem = cartItems[cartItems.length - 1];
    
    const fetchPairings = async () => {
      setLoading(true);
      try {
        const res = await aiService.getFoodPairings(lastItem.food._id);
        if (res.data?.success) {
          // Filter out items already in cart
          const existingIds = cartItems.map(item => item.food._id);
          const filtered = res.data.data.pairings.filter(p => !existingIds.includes(p.food._id));
          setPairings(filtered);
        }
      } catch (error) {
        console.error('Error fetching pairings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPairings();
  }, [cartItems]);

  const handleAdd = (food) => {
    dispatch(addToCart({
      ...food,
      restaurantId: food.restaurantId,
      restaurantName: cartItems[0]?.restaurantName || 'Restaurant',
      quantity: 1,
      finalPrice: food.price,
      originalPrice: food.price
    }));
    toast.success(`${food.name} added to cart`);
  };

  if (cartItems.length === 0 || (!loading && pairings.length === 0)) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mb-6 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl p-4 border border-purple-100 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            🍽️ Complete Your Meal
          </h3>
          <AIBadge size="sm" />
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto">
            {[1, 2].map(i => (
              <div key={i} className="min-w-[200px] h-20 bg-white/50 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
            {pairings.map((item, i) => (
              <motion.div 
                key={item.food._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="snap-start min-w-[240px] bg-white rounded-xl p-3 shadow-sm border border-purple-50 flex gap-3 items-center"
              >
                <img src={item.food.image} alt={item.food.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex flex-col flex-grow">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.food.name}</h4>
                  <p className="text-[10px] text-purple-600 mb-1 line-clamp-1 flex items-center gap-1">
                    <FiCpu size={10}/> {item.reason}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-sm">₹{item.food.price}</span>
                    <button 
                      onClick={() => handleAdd(item.food)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-1.5 rounded-full transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AIFoodPairing;
