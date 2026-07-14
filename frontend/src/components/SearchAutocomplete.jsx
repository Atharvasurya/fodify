import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { MdRestaurant, MdFastfood } from 'react-icons/md';
import restaurantService from '../services/restaurantService';
import foodService from '../services/foodService';
import aiService from '../services/aiService';
import AIBadge from './AIBadge';

/**
 * Search Autocomplete Component
 * Swiggy-style search with live suggestions
 */
const SearchAutocomplete = ({ onSearch }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ dishes: [], restaurants: [], smartInterpretation: null });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length >= 2) {
      // Clear previous timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Set new timeout
      debounceTimeout.current = setTimeout(() => {
        fetchSuggestions();
      }, 300); // 300ms delay

      return () => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
      };
    } else {
      setSuggestions({ dishes: [], restaurants: [], smartInterpretation: null });
      setShowSuggestions(false);
    }
  }, [query]);

    const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const [restaurantsRes, foodsRes, smartRes] = await Promise.all([
        restaurantService.getRestaurants({ search: query }),
        foodService.searchFoods(query),
        aiService.smartSearch(query)
      ]);

      // Combine smart search results with regular search results
      let combinedDishes = [...foodsRes.data];
      if (smartRes.data?.success && smartRes.data.data.results) {
          smartRes.data.data.results.forEach(smartDish => {
              if(!combinedDishes.find(d => d._id === smartDish._id)) {
                  combinedDishes.push(smartDish);
              }
          });
      }

      setSuggestions({
        dishes: combinedDishes.slice(0, 3), // Show top 3 dishes
        restaurants: restaurantsRes.data.slice(0, 3), // Show top 3 restaurants
        smartInterpretation: smartRes.data?.success ? smartRes.data.data.interpretation : null
      });
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setQuery('');
    setSuggestions({ dishes: [], restaurants: [], smartInterpretation: null });
    setShowSuggestions(false);
    onSearch && onSearch('');
  };

  const handleDishClick = (dish) => {
    setShowSuggestions(false);
    navigate(`/restaurant/${dish.restaurantId._id}`);
  };

  const handleRestaurantClick = (restaurant) => {
    setShowSuggestions(false);
    navigate(`/restaurant/${restaurant._id}`);
  };

  const handleSeeAllResults = () => {
    setShowSuggestions(false);
    onSearch && onSearch(query);
  };

  const hasResults = suggestions.dishes.length > 0 || suggestions.restaurants.length > 0;

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for restaurant, item or more"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          className="w-full pl-12 pr-12 py-3.5 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-lg hover:shadow-xl transition-all font-medium placeholder:text-gray-400 placeholder:font-normal"
        />
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : hasResults ? (
              <div className="max-h-96 overflow-y-auto">
                {/* AI Interpretation */}
                {suggestions.smartInterpretation && (
                  <div className="bg-purple-50 p-3 border-b border-purple-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-800 flex items-center gap-2">
                       {suggestions.smartInterpretation}
                    </span>
                    <AIBadge size="sm" />
                  </div>
                )}

                {/* Dish Suggestions */}
                {suggestions.dishes.length > 0 && (
                  <div className="p-2">
                    {suggestions.dishes.map((dish) => (
                      <button
                        key={dish._id}
                        onClick={() => handleDishClick(dish)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{dish.name}</h4>
                          <p className="text-sm text-gray-500">Dish</p>
                        </div>
                        <MdFastfood className="text-gray-400 w-5 h-5" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Restaurant Suggestions */}
                {suggestions.restaurants.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    {suggestions.restaurants.map((restaurant) => (
                      <button
                        key={restaurant._id}
                        onClick={() => handleRestaurantClick(restaurant)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                          <p className="text-sm text-gray-500">Restaurant</p>
                        </div>
                        <MdRestaurant className="text-gray-400 w-5 h-5" />
                      </button>
                    ))}
                  </div>
                )}

                {/* See All Results */}
                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={handleSeeAllResults}
                    className="w-full flex items-center justify-center gap-2 p-3 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                  >
                    <FiSearch className="w-4 h-4" />
                    See all results for "{query}"
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No results found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAutocomplete;
