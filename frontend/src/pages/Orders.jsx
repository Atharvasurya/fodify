import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiClock, FiCheck, FiTruck, FiStar, FiX } from 'react-icons/fi';
import { OrderCardSkeleton } from '../components/Skeleton';
import orderService from '../services/orderService';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Orders Page with Order Tracking and Reviews
 * Shows user's order history with status tracking and review functionality
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [cancelData, setCancelData] = useState({
    reason: '',
    otherReason: ''
  });

  const cancellationReasons = [
    'Changed my mind',
    'Ordered by mistake',
    'Found a better deal',
    'Delivery time too long',
    'Want to modify order',
    'Other'
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDeliveryTime = (orderDate, status) => {
    if (status === 'delivered') return 'Delivered';
    if (status === 'cancelled') return 'Cancelled';

    const ordered = new Date(orderDate);
    const estimated = new Date(ordered.getTime() + 45 * 60000); // 45 minutes
    const now = new Date();

    if (estimated < now) return 'Arriving soon';

    const diff = Math.floor((estimated - now) / 60000);
    return `${diff} mins`;
  };

  const getOrderSteps = (status) => {
    const steps = [
      { id: 'pending', label: 'Order Placed', icon: FiCheck },
      { id: 'confirmed', label: 'Confirmed', icon: FiCheck },
      { id: 'preparing', label: 'Preparing', icon: FiPackage },
      { id: 'out_for_delivery', label: 'Out for Delivery', icon: FiTruck },
      { id: 'delivered', label: 'Delivered', icon: FiCheck }
    ];

    const statusOrder = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const handleSubmitReview = async () => {
    if (!reviewData.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/reviews',
        {
          restaurantId: selectedOrder.restaurantId._id,
          orderId: selectedOrder._id,
          rating: reviewData.rating,
          comment: reviewData.comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Review submitted successfully! It will be visible after admin approval.');
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
      setSelectedOrder(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const formatDeliveryTime = (deliveredAt) => {
    if (!deliveredAt) return null;
    return new Date(deliveredAt).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async () => {
    if (!cancelData.reason) {
      toast.error('Please select a cancellation reason');
      return;
    }

    if (cancelData.reason === 'Other' && !cancelData.otherReason.trim()) {
      toast.error('Please specify your reason');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const finalReason = cancelData.reason === 'Other'
        ? cancelData.otherReason
        : cancelData.reason;

      await axios.patch(
        `http://localhost:5000/api/orders/${selectedOrder._id}/cancel`,
        { reason: finalReason },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Order cancelled successfully');
      setShowCancelModal(false);
      setCancelData({ reason: '', otherReason: '' });
      setSelectedOrder(null);
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <FiPackage className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500">Your order history will appear here</p>
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
          My Orders ({orders.length})
        </motion.h1>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4 sm:gap-0">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {order.restaurantId?.image && (
                      <img
                        src={order.restaurantId.image}
                        alt={order.restaurantId.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {order.restaurantId?.name || 'Restaurant'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center mt-1">
                        <FiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                        {formatDate(order.createdAt || order.orderDate)}
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
                        Order ID: #{order._id.slice(-8)}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 border-gray-100">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                    </span>
                    {order.status === 'delivered' && order.deliveredAt && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Delivered: {formatDeliveryTime(order.deliveredAt)}
                      </p>
                    )}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <p className="text-sm text-gray-600 mt-2">
                        ETA: <span className="font-semibold text-purple-600">
                          {getEstimatedDeliveryTime(order.createdAt || order.orderDate, order.status)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Tracking Timeline */}
                {order.status !== 'cancelled' && (
                  <div className="mt-6 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex items-center justify-between relative min-w-[500px]">
                      {/* Progress Line */}
                      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                        <div
                          className="h-full bg-purple-600 transition-all duration-500"
                          style={{
                            width: `${(getOrderSteps(order.status).filter(s => s.completed).length - 1) * 25}%`
                          }}
                        ></div>
                      </div>

                      {/* Steps */}
                      {getOrderSteps(order.status).map((step, idx) => (
                        <div key={step.id} className="flex flex-col items-center z-10 relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'
                            } ${step.active ? 'ring-4 ring-purple-200' : ''}`}>
                            <step.icon className="w-5 h-5" />
                          </div>
                          <p className={`text-xs mt-2 text-center max-w-20 ${step.completed ? 'text-gray-900 font-medium' : 'text-gray-500'
                            }`}>
                            {step.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="p-6 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Order Items:</p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-700">
                        {item.name} <span className="text-gray-500">x {item.quantity}</span>
                      </span>
                      <span className="text-gray-900 font-semibold">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                  <div>
                    <p className="text-sm text-gray-600">
                      Payment: <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                    </p>
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowReviewModal(true);
                        }}
                        className="mt-2 flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        <FiStar className="w-4 h-4 mr-1" />
                        Write a Review
                      </button>
                    )}

                    {/* Cancel Button - Only show if order is not delivered or cancelled */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCancelModal(true);
                        }}
                        className="mt-2 flex items-center text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        <FiX className="w-4 h-4 mr-1" />
                        Cancel Order
                      </button>
                    )}
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto flex justify-between sm:block border-t sm:border-0 pt-3 sm:pt-0 border-gray-200">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl sm:text-2xl font-bold text-purple-600">₹{order.totalAmount}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[2rem] sm:rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl sm:shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Write a Review</h3>
                <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`text-3xl ${star <= reviewData.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  rows="4"
                  placeholder="Share your experience with the food and delivery..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancelModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[2rem] sm:rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl sm:shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-red-600">Cancel Order</h3>
                <button onClick={() => setShowCancelModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 mb-4">Please select a reason for cancellation:</p>

              <div className="space-y-3 mb-4">
                {cancellationReasons.map((reason) => (
                  <label key={reason} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      name="cancelReason"
                      checked={cancelData.reason === reason}
                      onChange={() => setCancelData({ ...cancelData, reason })}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-3 text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>

              {cancelData.reason === 'Other' && (
                <div className="mb-4">
                  <textarea
                    value={cancelData.otherReason}
                    onChange={(e) => setCancelData({ ...cancelData, otherReason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    rows="3"
                    placeholder="Please specify your reason..."
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Confirm Cancellation
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelData({ reason: '', otherReason: '' });
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Keep Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
