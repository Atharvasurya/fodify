import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Food Management Page
 * Add, edit, and delete food items
 */
const AdminGroceryItems = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Dairy',
    image: '',
    restaurantId: '',
    isVeg: true,
    isAvailable: true,
    unit: '',
    brand: ''
  });

  useEffect(() => {
    fetchFoods();
    fetchRestaurants();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/foods?itemType=grocery');
      setFoods(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants?businessType=grocery');
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Failed to fetch restaurants');
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
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        itemType: 'grocery'
      };

      if (editingFood) {
        await axios.put(
          `http://localhost:5000/api/foods/${editingFood._id}`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`
            }
          }
        );
        toast.success('Food item updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/foods', dataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Grocery item added successfully');
      }

      fetchFoods();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save food item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/foods/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success('Food item deleted successfully');
      fetchFoods();
    } catch (error) {
      toast.error('Failed to delete food item');
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      image: food.image,
      restaurantId: food.restaurantId._id || food.restaurantId,
      isVeg: food.isVeg,
      isAvailable: food.isAvailable
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Starters',
      image: '',
      restaurantId: '',
      isVeg: true,
      isAvailable: true,
      unit: '',
      brand: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grocery Items Management</h1>
          <p className="text-gray-600 mt-1">Add and manage grocery products</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add Grocery Item
        </button>
      </div>

      {/* Foods Grid */}
      {loading ? (
        <div className="text-center py-12">Loading food items...</div>
      ) : foods.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">No food items found. Add your first dish!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <motion.div
              key={food._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Image */}
              <div className="relative h-40">
                <img
                  src={food.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${food.isVeg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                  {food.isVeg ? '🌱 Veg' : '🍖 Non-Veg'}
                </span>
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded ${food.isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {food.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {food.restaurantId?.name || 'Unknown Restaurant'}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{food.description}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-lg font-bold text-purple-600">₹{food.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(food)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(food._id)}
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
                  {editingFood ? 'Edit Grocery Item' : 'Add New Grocery Item'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
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
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Dairy, Snacks, Vegetables"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grocery Store *
                  </label>
                  <select
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select Grocery Store</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
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
                    placeholder="https://example.com/grocery-image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit (e.g., 500g, 1L)
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand (e.g., Amul)
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVeg"
                      checked={formData.isVeg}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Vegetarian
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Currently Available
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    {editingFood ? 'Update Grocery Item' : 'Add Grocery Item'}
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

export default AdminGroceryItems;
