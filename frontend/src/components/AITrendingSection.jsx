import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiActivity } from 'react-icons/fi';
import aiService from '../services/aiService';
import AIBadge from './AIBadge';

const AITrendingSection = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await aiService.getTrending();
        if (res.data?.success) {
          setTrending(res.data.data.trending);
        }
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="my-10 bg-gradient-to-r from-purple-50/50 to-cyan-50/50 p-6 rounded-2xl">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="min-w-[280px] h-[320px] bg-white rounded-xl shadow-sm animate-pulse border border-gray-100 p-4">
               <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
               <div className="h-6 bg-gray-200 rounded mb-2"></div>
               <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
               <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (trending.length === 0) return null;

  return (
    <div className="my-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🔥 Trending Now
        </h2>
        <AIBadge />
      </div>
      
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x hide-scrollbar">
        {trending.map((item, index) => (
          <Link 
            to={`/restaurant/${item.food.restaurantId}`} 
            key={item.food._id}
            className="snap-start"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="min-w-[280px] w-[280px] bg-white rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden border border-gray-100 relative group transition-all"
            >
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full shadow-sm text-gray-800 flex items-center gap-1">
                  {item.velocity === 'rising' ? '🔥🔥🔥' : item.velocity === 'stable' ? '🔥' : '✨'}
                  {item.velocity === 'rising' ? 'Rising Fast' : item.velocity === 'stable' ? 'Popular' : 'New'}
                </span>
              </div>
              
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={item.food.image} 
                  alt={item.food.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-semibold text-lg truncate leading-tight">{item.food.name}</p>
                    <p className="text-sm text-white/80 truncate">{item.restaurant?.name || 'Restaurant'}</p>
                </div>
              </div>
              
              <div className="p-4 flex justify-between items-center">
                <p className="font-bold text-gray-900">₹{item.food.price}</p>
                <div className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                  <FiActivity />
                  {item.orderCount24h} orders today
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AITrendingSection;
