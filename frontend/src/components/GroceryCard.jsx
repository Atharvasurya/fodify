import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { addToCart, updateQuantity } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const GroceryCard = ({ food, restaurantId }) => {
  const { items, restaurantId: cartRestaurantId } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const cartItem = items.find(item => item._id === food._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items');
      return;
    }
    
    // Ensure restaurant ID is passed down or falls back to food.restaurantId
    const finalRestaurantId = restaurantId || food.restaurantId;

    if (cartRestaurantId && cartRestaurantId !== finalRestaurantId) {
      if (!window.confirm('Your cart contains items from another store. Replace cart?')) return;
    }

    dispatch(addToCart({
      ...food,
      restaurantId: finalRestaurantId,
      quantity: 1,
      finalPrice: food.price,
      originalPrice: food.price,
    }));
    toast.success('Added to cart');
  };

  const handleUpdateQuantity = (e, newQty) => {
    e.stopPropagation();
    dispatch(updateQuantity({ itemId: food._id, quantity: newQty }));
  };

  return (
    <div className="bg-white rounded-2xl flex flex-col group relative p-3 transition-transform hover:shadow-lg border border-transparent hover:border-gray-100">
      
      {/* Product Image Container */}
      <div className="relative pt-[100%] bg-gray-50 rounded-2xl overflow-hidden mb-4">
        <img 
          src={food.image} 
          alt={food.name}
          className="absolute inset-0 w-full h-full object-contain p-2 mix-blend-multiply" 
          loading="lazy"
        />
        
        {/* Floating Add Button / Quantity Control (Top Right) */}
        <div className="absolute top-2 right-2 shadow-md rounded-xl bg-white border border-blue-600/20 overflow-hidden z-10 flex items-center justify-center min-w-[36px] h-9">
          <div onClick={(e) => e.stopPropagation()} className="w-full h-full flex items-center justify-center">
            {quantity > 0 ? (
              <div className="flex items-center w-full h-full text-blue-600">
                <button 
                  onClick={(e) => handleUpdateQuantity(e, quantity - 1)} 
                  className="w-8 h-full flex items-center justify-center hover:bg-blue-50 transition"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm font-bold">{quantity}</span>
                <button 
                  onClick={(e) => handleUpdateQuantity(e, quantity + 1)} 
                  className="w-8 h-full flex items-center justify-center hover:bg-blue-50 transition"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full h-full px-2 text-blue-600 hover:bg-blue-50 transition flex items-center justify-center font-bold text-xl"
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow text-left">
        {/* Delivery Time */}
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-1.5">
          10-15 MINS
        </span>
        
        {/* Title */}
        <h3 className="text-sm font-bold text-gray-800 leading-snug mb-1 line-clamp-2">
          {food.name}
        </h3>
        
        {/* Description / Subtitle */}
        <p className="text-[11px] text-gray-500 line-clamp-2 mb-4 min-h-[32px] leading-relaxed">
          {food.description || `Fresh ${food.name} for daily nutrition`}
        </p>

        {/* Unit & Price (Bottom fixed) */}
        <div className="mt-auto pt-2 border-t border-gray-50 flex flex-col gap-1">
          {/* Unit selection style */}
          <div className="flex items-center gap-1 text-gray-600 cursor-pointer w-fit group/unit">
            <span className="text-xs">{food.unit || '1 pc'}</span>
            <svg className="w-3 h-3 text-blue-500 group-hover/unit:mt-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
          
          {/* Price */}
          <span className="text-base font-black text-gray-900 mt-0.5">₹{food.price}</span>
        </div>
      </div>
    </div>
  );
};

export default GroceryCard;
