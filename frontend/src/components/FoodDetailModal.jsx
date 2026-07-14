import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiShoppingCart, FiStar, FiClock } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import AINutritionCard from './AINutritionCard';

// A specialized, ultra-premium badge for offers overlaying the image
const GlassOfferBadge = ({ offer }) => {
  if (!offer) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute top-6 left-6 z-20 overflow-hidden rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl p-1"
    >
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-inner">
        {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
      </div>
    </motion.div>
  );
};

const FoodDetailModal = ({ food, isOpen, onClose, restaurantId }) => {
  const [quantity, setQuantity] = useState(1);
  const [offer, setOffer] = useState(null);
  const dispatch = useDispatch();

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  useEffect(() => {
    if (isOpen && food) {
      fetchOffer();
      setQuantity(1);
      // Lock body scroll when open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen, food]);

  const fetchOffer = async () => {
    if (!food?._id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/offers/food/${food._id}`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setOffer(data.data[0]);
      } else {
        setOffer(null);
      }
    } catch (error) {
      console.error('Error fetching offer:', error);
    }
  };

  const calculateDiscountedPrice = () => {
    if (!offer) return food.price;
    let discount = 0;
    if (offer.discountType === 'percentage') {
      discount = (food.price * offer.discountValue) / 100;
      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    } else {
      discount = offer.discountValue;
    }
    return Math.max(0, food.price - discount);
  };

  const handleAddToCart = () => {
    const finalPrice = calculateDiscountedPrice();
    dispatch(addToCart({
      ...food,
      restaurantId,
      quantity,
      finalPrice,
      originalPrice: food.price,
      offer: offer ? {
        title: offer.title,
        discountType: offer.discountType,
        discountValue: offer.discountValue
      } : null
    }));
    toast.success(
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900">{quantity}x {food.name} added!</p>
          <p className="text-xs text-gray-500">Cart updated successfully</p>
        </div>
      </div>,
      { duration: 4000 }
    );
    onClose();
  };

  if (!food) return null;

  const finalPrice = calculateDiscountedPrice();
  const hasDiscount = offer && finalPrice < food.price;

  // Stagger variants for right-side content
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center md:items-center p-0 md:p-6 lg:p-12"
        >
          {/* Immersive backdrop with heavy blur and dark overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: '100%', opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[90vh] md:h-[85vh] bg-white rounded-t-[2rem] md:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20 ring-1 ring-black/5"
          >
            {/* Close button - absolute floating over everything */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2.5 bg-black/5 hover:bg-black/10 backdrop-blur-md rounded-full text-gray-700 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </motion.button>

            {/* LEFT SIDE: Edge-to-edge Immersive Image (Hidden on small mobile, huge on desktop) */}
            <div className="w-full h-48 sm:h-64 md:h-full md:w-1/2 relative overflow-hidden shrink-0 group">
              <motion.div 
                className="w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Inner subtle shadow for depth */}
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] pointer-events-none" />
              
              <GlassOfferBadge offer={offer} />

              {/* Floating floating Veg/Non-Veg Badge bottom left */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="absolute bottom-6 left-6 z-20 flex gap-2"
              >
                {food.isVeg !== undefined && (
                  <div className={`px-4 py-2 backdrop-blur-md bg-white/30 border border-white/50 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold ${food.isVeg ? 'text-green-900' : 'text-red-900'}`}>
                    <span className={`w-3 h-3 rounded-full ${food.isVeg ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_10px_rgba(0,0,0,0.3)]`} />
                    {food.isVeg ? 'Pure Veg' : 'Non-Veg'}
                  </div>
                )}
                {food.rating && (
                  <div className="px-4 py-2 backdrop-blur-md bg-white/30 border border-white/50 rounded-2xl shadow-xl flex items-center gap-1.5 text-sm font-bold text-gray-900">
                    <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {food.rating}
                  </div>
                )}
              </motion.div>
            </div>

            {/* RIGHT SIDE: Content Area */}
            <div className="w-full md:w-1/2 h-full flex flex-col relative bg-white/95">
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32 custom-scrollbar">
                <motion.div variants={containerVariants} initial="hidden" animate="show">
                  <motion.div variants={itemVariants} className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-purple-600">
                    {food.category || 'Specialty'}
                  </motion.div>
                  
                  <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                    {food.name}
                  </motion.h2>

                  {food.description && (
                    <motion.p variants={itemVariants} className="text-gray-600 text-lg leading-relaxed mb-8">
                      {food.description}
                    </motion.p>
                  )}

                  {food.ingredients && food.ingredients.length > 0 && (
                    <motion.div variants={itemVariants} className="mb-10">
                      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Crafted With</h3>
                      <div className="flex flex-wrap gap-2">
                        {food.ingredients.map((ingredient, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gray-50 border border-gray-100 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="mb-4">
                    <AINutritionCard foodId={food._id} />
                  </motion.div>

                  {/* Delivery Info Card */}
                  <motion.div variants={itemVariants} className="mb-8 p-4 rounded-xl bg-orange-50/80 border border-orange-100 flex items-start gap-3">
                    <span className="text-xl">🛵</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Delivery Information</h4>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {finalPrice * quantity >= 250 
                          ? <span className="text-green-600 font-bold">🎉 Free Delivery applies to this order!</span>
                          : <span>Add items worth ₹{(250 - (finalPrice * quantity)).toFixed(0)} more for <span className="font-bold text-green-600">Free Delivery</span>. Otherwise, ₹40 delivery fee applies.</span>
                        }
                      </p>
                    </div>
                  </motion.div>

                </motion.div>
              </div>

              {/* Sticky Bottom Action Bar with Glass Effect */}
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
                className="absolute bottom-0 left-0 right-0 p-6 pt-10 bg-gradient-to-t from-white via-white to-transparent"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-3xl p-4 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
                  
                  {/* Price Display */}
                  <div className="flex-1 flex items-center justify-between sm:justify-start gap-4 w-full">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Price</span>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-gray-900">₹{(finalPrice * quantity).toFixed(0)}</span>
                        {hasDiscount && (
                          <span className="text-lg font-bold text-gray-400 line-through decoration-rose-500/50 decoration-2">
                            ₹{(food.price * quantity).toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector inside Action Bar */}
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-100 rounded-2xl">
                      <button onClick={decrementQuantity} className="p-1 hover:bg-white rounded-lg transition-colors shadow-sm">
                        <FiMinus className="w-4 h-4 text-gray-700" />
                      </button>
                      <span className="text-xl font-bold text-gray-900 w-8 text-center">{quantity}</span>
                      <button onClick={incrementQuantity} className="p-1 hover:bg-white rounded-lg transition-colors shadow-sm">
                        <FiPlus className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl font-bold text-lg hover:from-violet-500 hover:to-fuchsia-500 transform hover:scale-[1.02] transition-all shadow-xl shadow-violet-500/30 flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />
                    <FiShoppingCart className="w-5 h-5 group-hover:-rotate-12 transition-transform relative z-10" />
                    <span className="relative z-10">Add to Order</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render the modal in a portal attached to document.body
  return createPortal(modalContent, document.body);
};

export default FoodDetailModal;
