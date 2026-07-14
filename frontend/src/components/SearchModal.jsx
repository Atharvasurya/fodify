import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import restaurantService from '../services/restaurantService';
import foodService from '../services/foodService';

/**
 * SearchModal Component
 * Full-screen search modal for restaurants and food items
 */
const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.length > 2) {
      performSearch();
    } else {
      setRestaurants([]);
      setFoods([]);
    }
  }, [searchQuery]);

  const performSearch = async () => {
    try {
      setLoading(true);

      // Use proper API endpoints for search
      const [restaurantsRes, foodsRes] = await Promise.all([
        restaurantService.getRestaurants({ search: searchQuery }),
        foodService.searchFoods(searchQuery)
      ]);

      setRestaurants(restaurantsRes.data.slice(0, 5));
      setFoods(foodsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
      setRestaurants([]);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (id) => {
    navigate(`/restaurant/${id}`);
    onClose();
    setSearchQuery('');
  };

  const handleFoodClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
    onClose();
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4"
        >
          {/* Search Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <FiSearch className="w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg outline-none"
                autoFocus
              />
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto p-4">
            {loading && (
              <div className="text-center py-8 text-gray-500">
                Searching...
              </div>
            )}

            {!loading && searchQuery.length > 2 && restaurants.length === 0 && foods.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}

            {!loading && searchQuery.length > 0 && searchQuery.length <= 2 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Type at least 3 characters to search
              </div>
            )}

            {/* Restaurants Results */}
            {!loading && restaurants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
                  RESTAURANTS
                </h3>
                <div className="space-y-2">
                  {restaurants.map((restaurant) => (
                    <motion.div
                      key={restaurant._id}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      onClick={() => handleRestaurantClick(restaurant._id)}
                      className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition"
                    >
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {restaurant.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {restaurant.cuisine.join(', ')}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-green-600 font-semibold">
                            ★ {restaurant.rating}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {restaurant.deliveryTime}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Foods Results */}
            {!loading && foods.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
                  DISHES
                </h3>
                <div className="space-y-2">
                  {foods.map((food) => (
                    <motion.div
                      key={food._id}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      onClick={() => handleFoodClick(food.restaurantId?._id || food.restaurantId)}
                      className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition"
                    >
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {food.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {food.restaurantId?.name || 'Restaurant'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${food.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {food.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs font-semibold text-gray-900">
                            ₹{food.price}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery.length === 0 && (
              <div className="text-center py-12">
                <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">
                  Start typing to search for restaurants or dishes
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchModal;
