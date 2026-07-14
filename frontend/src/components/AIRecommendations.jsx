import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import aiService from '../services/aiService';
import AIBadge from './AIBadge';

const AIRecommendations = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = isAuthenticated 
          ? await aiService.getRecommendations()
          : await aiService.getGuestRecommendations();
          
        if (res.data?.success) {
          setRecommendations(res.data.data.recommendations);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="my-12">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="flex gap-6 overflow-x-auto">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="min-w-[300px] h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="my-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {isAuthenticated ? '🧠 Recommended For You' : '🧠 Popular Right Now'}
        </h2>
        <AIBadge />
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x hide-scrollbar">
        {recommendations.map((item, index) => (
          <Link 
            to={`/restaurant/${item.food.restaurantId._id || item.food.restaurantId}`} 
            key={item.food._id}
            className="snap-start min-w-[360px] max-w-[360px]"
          >
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-card-hover border border-gray-100 flex gap-5 transition-all h-full"
            >
              <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 relative">
                <img src={item.food.image} alt={item.food.name} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-white p-0.5 rounded-sm">
                  <span className={`w-3 h-3 block rounded-sm border ${item.food.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.food.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-1">{item.food.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-1 mb-1">{item.food.restaurantId?.name || 'Restaurant'}</p>
                  
                  {/* AI Score / Reason */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="relative w-6 h-6 flex items-center justify-center bg-purple-50 rounded-full">
                      <svg className="w-6 h-6 -rotate-90 absolute">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" className="text-purple-100" />
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="62.8" strokeDashoffset={62.8 - (62.8 * item.score) / 100} className="text-purple-500" />
                      </svg>
                      <span className="text-[8px] font-bold text-purple-700">{item.score}%</span>
                    </div>
                    <span className="text-[10px] text-purple-600 font-medium truncate max-w-[120px] bg-purple-50 px-2 py-0.5 rounded-full">
                      {item.reasons[0]}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-gray-900">₹{item.food.price}</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-white bg-green-600 px-1.5 py-0.5 rounded">
                    {item.food.rating || 4.0} <FiStar className="fill-white" size={10} />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
