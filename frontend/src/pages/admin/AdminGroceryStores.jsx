import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Restaurant Management Page
 * Add, edit, and delete restaurants
 */
const AdminGroceryStores = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    address: '',
    phone: '',
    email: '',
    image: '',
    isOpen: true,
    deliveryTime: '30-40 mins',
    rating: 4.0
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/restaurants?businessType=grocery');
      setRestaurants(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingRestaurant) {
        // Update existing restaurant
        await axios.put(
          `http://localhost:5000/api/restaurants/${editingRestaurant._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            }
          }
        );
        toast.success('Restaurant updated successfully');
      } else {
        // Create new grocery store
        await axios.post('http://localhost:5000/api/restaurants', { ...formData, businessType: 'grocery' }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Restaurant added successfully');
      }

      fetchRestaurants();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save restaurant');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/restaurants/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success('Restaurant deleted successfully');
      fetchRestaurants();
    } catch (error) {
      toast.error('Failed to delete restaurant');
    }
  };

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      address: restaurant.address,
      phone: restaurant.phone || '',
      email: restaurant.email || '',
      image: restaurant.image,
      isOpen: restaurant.isOpen,
      deliveryTime: restaurant.deliveryTime || '30-40 mins',
      rating: restaurant.rating || 4.0
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRestaurant(null);
    setFormData({
      name: '',
      cuisine: '',
      address: '',
      phone: '',
      email: '',
      image: '',
      isOpen: true,
      deliveryTime: '30-40 mins',
      rating: 4.0
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grocery Stores Management</h1>
          <p className="text-gray-600 mt-1">Add and manage grocery stores (ApnaBaazar)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add Grocery Store
        </button>
      </div>

      {/* Restaurants Grid */}
      {loading ? (
        <div className="text-center py-12">Loading restaurants...</div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No restaurants found. Add your first restaurant!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <motion.div
              key={restaurant._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={restaurant.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${restaurant.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {restaurant.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{restaurant.cuisine}</p>
                <p className="text-sm text-gray-600 mt-1">
                  📍 {typeof restaurant.address === 'string'
                    ? restaurant.address
                    : `${restaurant.address?.street || ''}, ${restaurant.address?.city || ''}, ${restaurant.address?.pincode || ''}`.trim()}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 font-semibold">{restaurant.rating}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(restaurant)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
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
                  {editingRestaurant ? 'Edit Grocery Store' : 'Add New Grocery Store'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Type *
                    </label>
                    <input
                      type="text"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Italian, Chinese, Indian"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Time
                    </label>
                    <input
                      type="text"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      placeholder="30-40 mins"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isOpen"
                    checked={formData.isOpen}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Restaurant is currently open
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    {editingRestaurant ? 'Update Store' : 'Add Store'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
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

export default AdminGroceryStores;
