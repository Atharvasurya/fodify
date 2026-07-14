import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiStar, FiArrowRight } from 'react-icons/fi';
import { FaCircle } from 'react-icons/fa';

/**
 * Restaurant Card Component
 * Ultra-Premium "Liquid Neon" UI: Spring animations, glassmorphism, dynamic gradients
 */
const RestaurantCard = ({ restaurant }) => {
  const { _id, name, description, image, cuisine, rating, deliveryTime, costForTwo } = restaurant;
  const [offer, setOffer] = useState(null);
  const [foodTypes, setFoodTypes] = useState({ hasVeg: false, hasNonVeg: false });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffer();
    fetchFoodTypes();
  }, [_id]);

  const fetchOffer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/offers/restaurant/${_id}`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setOffer(data.data[0]); 
      }
    } catch (error) {
      console.error(`⚠️ Error fetching offer for ${name}:`, error);
    }
  };

  const fetchFoodTypes = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/foods/restaurant/${_id}`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        const hasVeg = data.data.some(food => food.isVeg === true);
        const hasNonVeg = data.data.some(food => food.isVeg === false);
        setFoodTypes({ hasVeg, hasNonVeg });
      }
    } catch (error) {
      console.error('Error fetching food types:', error);
    }
  };

  return (
    <motion.div
      onClick={() => navigate(`/restaurant/${_id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl border border-stone-100 cursor-pointer group transition-all duration-300 transform hover:-translate-y-1 relative h-full flex flex-col sm:flex-col"
    >
        {/* Image */}
        <div className="relative h-48 sm:h-52 lg:h-64 overflow-hidden rounded-[1.5rem] m-2 sm:m-2 shrink-0 bg-gray-100">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-90"></div>

          {/* Top Info Bar (Cuisine Tags) - Glass effect */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex flex-wrap gap-2 transform group-hover:translate-x-1 transition-transform">
              {cuisine.slice(0, 2).map((c, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-[10px] uppercase tracking-widest backdrop-blur-xl bg-white/20 text-white rounded-full font-black shadow-2xl border border-white/30"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Veg/Non-Veg Indicators */}
            <div className="flex gap-1.5 backdrop-blur-xl bg-white/20 p-1.5 rounded-full shadow-2xl border border-white/30 transform group-hover:-translate-x-1 transition-transform">
              {foodTypes.hasVeg && (
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                  <FaCircle className="text-green-400 w-2.5 h-2.5 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                </div>
              )}
              {foodTypes.hasNonVeg && (
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                  <FaCircle className="text-red-400 w-2.5 h-2.5 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                </div>
              )}
            </div>
          </div>

          {/* Rating Badge */}
          {rating && (
            <div className="absolute bottom-4 right-4 backdrop-blur-xl bg-black/40 border border-white/20 rounded-full px-2.5 py-1.5 flex items-center gap-1 shadow-2xl transform group-hover:-translate-x-1 transition-transform z-20">
              <FiStar className="fill-yellow-400 text-yellow-400 w-3.5 h-3.5" />
              <span className="text-xs font-bold text-white">{rating}</span>
            </div>
          )}

          {/* Title hovering inside image for depth */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10 flex flex-col items-start gap-1">
             <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-500 transition-all line-clamp-1 w-full pr-12">
              {name}
            </h3>
            {/* Free Delivery Badge */}
            <span className="bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded text-gray-800 shadow-sm flex items-center gap-1 mt-0.5 transform group-hover:translate-x-1 transition-transform">
              <span className="text-green-600">⚡</span> Free Delivery {'>'} ₹250
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 pt-2 sm:pt-3 flex flex-col flex-1 relative z-10 bg-white">
          <p className="font-sans text-xs sm:text-sm lg:text-base text-gray-500 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Offer Badges */}
          {offer && (
            <div className="mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-bold border border-orange-100/50 w-full transform group-hover:-translate-y-1 transition-transform">
                <span className="animate-pulse">✨</span>
                <span className="flex-1 truncate uppercase tracking-wide text-[10px] sm:text-xs lg:text-sm">{offer.title || "Special Offer"}</span>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100 flex justify-between items-center text-xs sm:text-sm lg:text-base font-sans">
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 font-bold bg-gray-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <FiClock className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
              <span>{deliveryTime}</span>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 text-gray-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs lg:text-sm">
              ₹{costForTwo} <span className="text-[8px] sm:text-[10px] lg:text-[11px]">For Two</span>
            </div>
          </div>
        </div>
      </motion.div>
  );
};

export default RestaurantCard;
