import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiSearch, FiChevronRight } from 'react-icons/fi';
import api from '../services/api';
import SearchAutocomplete from '../components/SearchAutocomplete';
import GroceryCard from '../components/GroceryCard';

/**
 * ApnaBaazar (Instamart Clone) Grocery Home
 */
const GroceryHome = () => {
  const [groceryItems, setGroceryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchGroceryItems();
  }, []);

  const fetchGroceryItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/foods?itemType=grocery');
      const items = response.data.data || [];
      setGroceryItems(items);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(items.map(item => item.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching groceries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? groceryItems 
    : groceryItems.filter(item => item.category === selectedCategory);

  // Fallback images for categories
  const categoryImages = {
    'Fresh Fruits': '🍎',
    'Vegetables': '🥦',
    'Dairy, Bread & Eggs': '🥛',
    'Snacks & Munchies': '🥨',
    'Sweet Tooth': '🍫',
    'Cold Drinks & Juices': '🧃',
    'Atta, Rice & Dal': '🌾',
    'Cleaning Essentials': '🧼',
    'All': '🛒'
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-24 md:pb-10">
      
      {/* Mobile Top Header (ApnaBaazar style) */}
      <div className="md:hidden bg-gradient-to-r from-purple-700 to-indigo-800 text-white px-4 pt-4 pb-14 rounded-b-3xl shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tight flex items-center gap-2">
              ApnaBaazar <FiClock className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </span>
            <span className="text-sm text-purple-200 font-medium">Delivery in 10-15 mins</span>
          </div>
        </div>
        <div className="absolute -bottom-6 left-4 right-4 text-gray-900 shadow-xl rounded-2xl bg-white p-1">
          <SearchAutocomplete />
        </div>
      </div>

      {/* Desktop Top Header */}
      <div className="hidden md:block bg-gradient-to-r from-purple-700 to-indigo-800 py-12 px-6 lg:px-8 mb-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h1 className="text-4xl lg:text-5xl font-black mb-2 flex items-center gap-3">
              Fodify ApnaBaazar <FiClock className="text-yellow-400" />
            </h1>
            <p className="text-xl text-purple-200">Groceries delivered in 10 minutes.</p>
          </div>
          <div className="w-full md:w-1/2 max-w-lg bg-white p-2 rounded-2xl shadow-xl flex gap-2">
            <div className="flex-1 text-gray-900">
              <SearchAutocomplete />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area (Sidebar + Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-8">
        
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar / Top Horizontal Scroll */}
          <div className="w-full md:w-64 shrink-0">
            <div className="md:sticky md:top-24 bg-white md:bg-transparent rounded-2xl md:rounded-none shadow-sm md:shadow-none p-3 md:p-0">
              <h2 className="text-lg font-black text-gray-900 mb-4 hidden md:block px-2">Categories</h2>
              
              <div className="flex overflow-x-auto md:flex-col gap-2 pb-2 md:pb-0 hide-scrollbar scroll-smooth">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-3 whitespace-nowrap md:whitespace-normal px-4 py-3 md:py-3.5 rounded-xl font-bold text-sm transition-all md:w-full text-left ${
                      selectedCategory === cat 
                        ? 'bg-purple-100 text-purple-800 shadow-inner' 
                        : 'bg-white md:bg-white text-gray-600 border border-gray-100 md:border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{categoryImages[cat] || '📦'}</span>
                    <span className="truncate">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {selectedCategory === 'All' ? 'Explore Aisles' : selectedCategory}
              </h2>
              <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                {filteredItems.length} items
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl h-64 shadow-sm border border-gray-100"></div>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredItems.map(item => (
                  <GroceryCard 
                    key={item._id} 
                    food={item} 
                    restaurantId={item.restaurantId} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500">We couldn't find any groceries in this category.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GroceryHome;
