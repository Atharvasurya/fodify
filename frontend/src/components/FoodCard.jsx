import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiStar, FiPlus, FiMinus } from 'react-icons/fi';
import { addToCart, updateQuantity } from '../store/slices/cartSlice';
import FoodDetailModal from './FoodDetailModal';
import toast from 'react-hot-toast';

/**
 * FoodCard Component  
 * Ultra-Premium "Liquid Neon" UI: Spring animations, glassmorphism, dynamic gradients
 */
const FoodCard = ({ food, restaurantId, restaurantName }) => {
  const [offer, setOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { items, restaurantId: cartRestaurantId } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const cartItem = items.find(item => item._id === food._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    fetchOffer();
  }, [food._id]);

  const fetchOffer = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/offers/food/${food._id}`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setOffer(data.data[0]); 
      }
    } catch (error) {
      // Silently fail
    }
  };

  const calculateDiscountedPrice = () => {
    if (!offer) return food.price;
    let discount = 0;
    if (offer.discountType === 'percentage') {
      discount = (food.price * offer.discountValue) / 100;
      if (offer.maxDiscount && discount > offer.maxDiscount) discount = offer.maxDiscount;
    } else {
      discount = offer.discountValue;
    }
    return Math.max(0, parseInt(food.price - discount));
  };

  const finalPrice = calculateDiscountedPrice();
  const hasDiscount = offer && finalPrice < food.price;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items');
      return;
    }
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      if (!window.confirm('Your cart contains items from another restaurant. Replace cart?')) return;
    }

    dispatch(addToCart({
      ...food,
      restaurantId,
      quantity: 1,
      finalPrice,
      originalPrice: food.price,
      offer: offer ? {
        title: offer.title,
        discountType: offer.discountType,
        discountValue: offer.discountValue
      } : null
    }));
    toast.success('Added to cart');
  };

  const handleUpdateQuantity = (e, newQty) => {
    e.stopPropagation();
    dispatch(updateQuantity({ itemId: food._id, quantity: newQty }));
  };

  const getDiscountPercentage = () => {
    if (!offer) return null;
    if (offer.discountType === 'percentage') return offer.discountValue;
    return Math.round((offer.discountValue / food.price) * 100);
  };

  const discountPercent = getDiscountPercentage();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowModal(true)}
        className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl border border-stone-100 cursor-pointer group transition-all duration-300 transform hover:-translate-y-1 relative flex flex-col sm:flex-col"
      >
        {/* Image with Parallax-style zoom */}
        <div className="relative h-48 sm:h-52 lg:h-56 w-full overflow-hidden p-3 sm:p-4 shrink-0">
          <div className="absolute inset-3 sm:inset-4 rounded-[1.5rem] overflow-hidden">
            <img 
              src={food.image} 
              alt={food.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          
          {/* Floating Glass Badges */}
          <div className="absolute top-6 left-6 backdrop-blur-xl bg-white/20 border border-white/30 rounded-full px-3 py-1.5 shadow-2xl flex items-center gap-2 transform group-hover:translate-x-1 transition-transform">
            <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-green-400' : 'bg-red-400'} shadow-[0_0_10px_rgba(0,0,0,0.3)]`} />
            <span className="text-white font-black tracking-widest text-xs uppercase">{food.isVeg ? 'Veg' : 'Non-Veg'}</span>
          </div>

          {/* Rating Badge */}
          {food.rating && (
            <div className="absolute top-6 right-6 backdrop-blur-xl bg-black/40 border border-white/20 rounded-full px-2.5 py-1.5 flex items-center gap-1 shadow-2xl transform group-hover:-translate-x-1 transition-transform">
              <FiStar className="fill-yellow-400 text-yellow-400 w-3 h-3" />
              <span className="text-xs font-bold text-white">{food.rating}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 pt-2 sm:pt-4 bg-white relative z-10 flex flex-col gap-3 sm:gap-4 flex-1">
          
          <div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1 leading-tight line-clamp-1">{food.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium line-clamp-1">{restaurantName}</p>
          </div>

          {offer && (
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 px-3 py-2 rounded-xl flex items-center gap-2 text-[10px] sm:text-xs font-bold border border-orange-100/50 w-fit">
               <span className="animate-pulse">✨</span> 
               <span>{discountPercent}% OFF</span>
            </div>
          )}

          <div className="flex justify-between items-end mt-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</span>
              {hasDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="font-black text-gray-900 text-xl sm:text-2xl">₹{finalPrice}</span>
                  <span className="text-xs sm:text-sm text-gray-400 line-through decoration-rose-500/50 decoration-2">₹{food.price}</span>
                </div>
              ) : (
                <span className="font-black text-gray-900 text-xl sm:text-2xl">₹{food.price}</span>
              )}
            </div>

              {/* Animated Action Button */}
            <div onClick={(e) => e.stopPropagation()}>
              {quantity > 0 ? (
                <div className="flex items-center bg-gray-900 text-white rounded-2xl overflow-hidden shadow-lg transform group-hover:-translate-y-1 transition-transform border border-gray-800 h-10 sm:h-12">
                  <button onClick={(e) => handleUpdateQuantity(e, quantity - 1)} className="w-10 sm:w-12 h-full flex items-center justify-center hover:bg-gray-800 transition text-gray-400 hover:text-white">
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-6 sm:w-8 text-center text-sm font-bold text-white">{quantity}</span>
                  <button onClick={(e) => handleUpdateQuantity(e, quantity + 1)} className="w-10 sm:w-12 h-full flex items-center justify-center hover:bg-gray-800 transition text-gray-400 hover:text-white">
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 h-10 sm:h-12 shadow-lg shadow-violet-500/30 flex items-center gap-1.5 sm:gap-2 transform group-hover:-translate-y-1 hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-400/40 transition-all duration-300 text-sm sm:text-base"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
                  <span className="relative z-10 flex items-center gap-1 tracking-wide">
                    ADD <FiPlus className="group-hover:rotate-90 transition-transform duration-300" />
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <FoodDetailModal
        food={food}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        restaurantId={restaurantId}
      />
    </>
  );
};

export default FoodCard;
