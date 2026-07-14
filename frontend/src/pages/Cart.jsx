import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import orderService from '../services/orderService';
import toast from 'react-hot-toast';
import AIFoodPairing from '../components/AIFoodPairing';

/**
 * Cart Page
 * Shows cart items and checkout functionality
 */
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(localStorage.getItem('userLocation') || '');

  // Keep it updated if the user sets it somehow during checkout
  React.useEffect(() => {
    const loc = localStorage.getItem('userLocation');
    if (loc) setUserLocation(loc);
  }, []);

  // Group items by restaurant
  const orderGroups = items.reduce((groups, item) => {
    // SAFEGUARD: Ignore malformed items (like those incorrectly added before the AI Food Pairing fix)
    if (!item || !item._id || !item.name) {
      return groups;
    }

    const restaurantId = item.restaurantId;
    if (!groups[restaurantId]) {
      groups[restaurantId] = {
        restaurantId,
        items: [],
        subtotal: 0
      };
    }
    groups[restaurantId].items.push(item);
    groups[restaurantId].subtotal += item.price * item.quantity;
    return groups;
  }, {});

  let totalDeliveryFee = 0;
  Object.values(orderGroups).forEach(group => {
    if (group.subtotal < 250) {
      totalDeliveryFee += 40;
    }
  });

  const tax = Math.round(totalAmount * 0.05); // 5% GST
  const platformFee = 5; // Standard platform fee
  const finalAmount = totalAmount + totalDeliveryFee + tax + platformFee;

  const [showMobileBill, setShowMobileBill] = useState(false);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item removed from cart');
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    if (!userLocation && (!user.address || !user.address.street)) {
      toast.error('Please set a delivery location first.');
      return;
    }

    try {
      setLoading(true);

      // Create an order for each restaurant group
      const orderPromises = Object.values(orderGroups).map(group => {
        const groupTax = Math.round(group.subtotal * 0.05);
        const groupDelivery = group.subtotal >= 250 ? 0 : 40;
        const groupTotal = group.subtotal + groupDelivery + groupTax + platformFee; 

        const orderData = {
          restaurantId: group.restaurantId,
          items: group.items.map(item => ({
            foodId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          totalAmount: groupTotal,
          deliveryAddress: userLocation 
            ? { street: userLocation, city: 'Local Area', pincode: user.address?.pincode || '000000' } 
            : user.address,
          paymentMethod: 'COD'
        };

        return orderService.createOrder(orderData);
      });

      await Promise.all(orderPromises);

      toast.success('Order placed successfully! 🎉');
      dispatch(clearCart());
      navigate('/orders');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <FiShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
          <button
            onClick={() => navigate('/home')}
            className="btn-primary"
          >
            Browse Restaurants
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Your Cart ({items.length} items)
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Grouped by Restaurant */}
          <div className="lg:col-span-2 space-y-8">
            <AIFoodPairing cartItems={items} />

            {Object.values(orderGroups).map((group) => (
              <div key={group.restaurantId} className="bg-white rounded-lg p-6 shadow-card">
                <div className="border-b pb-3 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">
                    Order from Restaurant
                  </h3>
                </div>

                <div className="space-y-6">
                  {group.items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600">₹{item.price}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-3 mt-3">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="p-1 rounded-full bg-primary-600 text-white hover:bg-primary-700"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                          <span className="ml-auto font-bold text-lg">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-t-3xl lg:rounded-lg p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-card fixed lg:sticky bottom-0 lg:top-24 left-0 right-0 z-50 lg:z-auto"
            >
              <h2 className="text-xl font-semibold mb-4 hidden lg:block">Bill Details</h2>

              <div className="mb-4 p-4 bg-orange-50 border border-orange-100 rounded-xl hidden lg:flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Delivering to</span>
                  <span className="text-gray-800 font-semibold text-sm truncate">{userLocation || 'Location not set'}</span>
                </div>
              </div>

              <div className="space-y-3 text-sm hidden lg:block">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item Total</span>
                  <span className="font-medium">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">
                    {totalDeliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${totalDeliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & GST (5%)</span>
                  <span className="font-medium">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee</span>
                  <span className="font-medium">₹{platformFee}</span>
                </div>
              </div>

              <div className="border-t-0 lg:border-t pt-0 lg:pt-3 mt-0 lg:mt-3 relative z-10">
                <div className="flex flex-row lg:flex-col justify-between items-center lg:items-stretch gap-4 lg:gap-0 text-lg font-bold">
                  <div 
                    className="flex flex-col lg:flex-row justify-between w-auto lg:w-full shrink-0 cursor-pointer lg:cursor-default group"
                    onClick={() => setShowMobileBill(!showMobileBill)}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm lg:text-lg text-gray-500 lg:text-gray-900 leading-tight">TO PAY</span>
                      <svg className={`w-4 h-4 lg:hidden text-gray-500 transform transition-transform ${showMobileBill ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </div>
                    <span className="text-primary-600 text-xl sm:text-2xl lg:text-lg leading-tight">₹{finalAmount}</span>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="btn-primary flex-1 lg:flex-none lg:w-full mt-0 lg:mt-6 py-3 sm:py-3.5 px-6 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base z-20"
                  >
                    {loading ? 'Placing...' : 'Checkout'}
                  </button>
                </div>
              </div>

              {/* Mobile Expanding Bill Details */}
              <div className={`lg:hidden absolute bottom-full left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)] p-6 transition-transform duration-300 transform ${showMobileBill ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Bill Details</h2>
                  <button onClick={() => setShowMobileBill(false)} className="p-1 text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                
                <div className="mb-4 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-full shrink-0">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Delivering to</span>
                    <span className="text-gray-800 font-semibold text-sm truncate">{userLocation || 'Location not set'}</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item Total</span>
                    <span className="font-medium">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {totalDeliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${totalDeliveryFee}`}
                    </span>
                  </div>
                  {totalDeliveryFee === 0 && (
                    <div className="text-[10px] text-green-600 font-medium text-right -mt-2 mb-1">
                      You saved ₹40 on delivery! 🎉
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & GST (5%)</span>
                    <span className="font-medium">₹{tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-medium">₹{platformFee}</span>
                  </div>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span>₹{finalAmount}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mt-3 hidden lg:block">
                Cash on Delivery available
              </p>
            </motion.div>
            {/* Spacer for mobile to prevent content hiding behind fixed footer */}
            <div className="h-32 lg:hidden"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
