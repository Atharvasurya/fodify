import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Admin Offers Management Page
 * Create, edit, and manage discount offers for restaurants and food items
 */
const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    applicableTo: 'restaurant',
    targetId: '',
    validFrom: '',
    validUntil: '',
    minOrderValue: 0,
    maxDiscount: '',
    isActive: true
  });

  useEffect(() => {
    fetchOffers();
    fetchRestaurants();
    fetchFoods();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      console.log('Fetching offers...');
      const response = await adminService.getOffers();
      console.log('Offers API response:', response);
      console.log('Offers data:', response.data);

      // Handle the response data - it's already the parsed response from adminService
      if (response && response.data) {
        setOffers(response.data);
        console.log('Set offers:', response.data);
      } else {
        console.log('No data in response, setting empty array');
        setOffers([]);
      }
    } catch (error) {
      console.error('Failed to fetch offers - Error:', error);
      console.error('Error response:', error.response);
      toast.error('Failed to fetch offers');
      setOffers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants');
      const data = await response.json();
      setRestaurants(data.data || []);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    }
  };

  const fetchFoods = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/foods');
      const data = await response.json();
      setFoods(data.data || []);
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const offerData = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null
      };

      if (editingOffer) {
        await adminService.updateOffer(editingOffer._id, offerData);
        toast.success('Offer updated successfully');
      } else {
        await adminService.createOffer(offerData);
        toast.success('Offer created successfully');
      }

      setShowModal(false);
      setEditingOffer(null);
      resetForm();
      fetchOffers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save offer');
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      applicableTo: offer.applicableTo,
      targetId: offer.targetId._id || offer.targetId,
      validFrom: offer.validFrom.split('T')[0],
      validUntil: offer.validUntil.split('T')[0],
      minOrderValue: offer.minOrderValue || 0,
      maxDiscount: offer.maxDiscount || '',
      isActive: offer.isActive
    });
    // Refresh data before opening modal
    fetchRestaurants();
    fetchFoods();
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;

    try {
      await adminService.deleteOffer(id);
      toast.success('Offer deleted successfully');
      fetchOffers();
    } catch (error) {
      toast.error('Failed to delete offer');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      applicableTo: 'restaurant',
      targetId: '',
      validFrom: '',
      validUntil: '',
      minOrderValue: 0,
      maxDiscount: '',
      isActive: true
    });
  };

  const getDiscountText = (offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    }
    return `₹${offer.discountValue} OFF`;
  };

  const getTargetName = (offer) => {
    if (offer.targetId && typeof offer.targetId === 'object') {
      return offer.targetId.name || 'Unknown';
    }
    return 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offers Management</h1>
          <p className="text-gray-600 mt-1">Create and manage discount offers</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingOffer(null);
            // Refresh data before opening modal
            fetchRestaurants();
            fetchFoods();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <FiPlus className="w-5 h-5" />
          Create Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : offers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FiTag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No offers found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first offer to get started</p>
          </div>
        ) : (
          offers.map((offer) => (
            <motion.div
              key={offer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full">
                      {getDiscountText(offer)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{offer.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium capitalize">{offer.applicableTo}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Target:</span>
                  <span className="font-medium">{getTargetName(offer)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Valid Until:</span>
                  <span className="font-medium">
                    {new Date(offer.validUntil).toLocaleDateString()}
                  </span>
                </div>
                {offer.minOrderValue > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Min Order:</span>
                    <span className="font-medium">₹{offer.minOrderValue}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(offer)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Offer Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="e.g., Weekend Special"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      rows="3"
                      placeholder="Describe the offer..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Applicable To
                    </label>
                    <select
                      value={formData.applicableTo}
                      onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value, targetId: '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="restaurant">Restaurant</option>
                      <option value="food">Food Item</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.applicableTo === 'restaurant' ? 'Select Restaurant' : 'Select Food Item'}
                    </label>
                    <select
                      required
                      value={formData.targetId}
                      onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="">Choose...</option>
                      {formData.applicableTo === 'restaurant'
                        ? restaurants.map((restaurant) => (
                          <option key={restaurant._id} value={restaurant._id}>
                            {restaurant.name}
                          </option>
                        ))
                        : foods.map((food) => (
                          <option key={food._id} value={food._id}>
                            {food.name}
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid From
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Order Value (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Discount (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="No limit"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    {editingOffer ? 'Update Offer' : 'Create Offer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOffers;
