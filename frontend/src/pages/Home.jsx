import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiChevronDown, FiSearch } from 'react-icons/fi';
import { FiCrosshair } from 'react-icons/fi';
import RestaurantCard from '../components/RestaurantCard';
import FoodCategoryCarousel from '../components/FoodCategoryCarousel';
import SearchAutocomplete from '../components/SearchAutocomplete';
import { RestaurantCardSkeleton } from '../components/Skeleton';
import restaurantService from '../services/restaurantService';
import foodService from '../services/foodService';
import toast from 'react-hot-toast';
import AITrendingSection from '../components/AITrendingSection';
import AIMoodFinder from '../components/AIMoodFinder';
import AIRecommendations from '../components/AIRecommendations';
import AIReviewInsights from '../components/AIReviewInsights';

/**
 * Home Page
 * Restaurant listing with search and filters
 */
const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [quickFilter, setQuickFilter] = useState('');
  const [searchMode, setSearchMode] = useState('restaurants'); // 'restaurants' or 'dishes'
  const [location, setLocation] = useState('WRXR+6QW, P&T Colony...');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const cuisines = ['All', 'Indian', 'Chinese', 'Italian', 'American', 'South Indian'];

  // Get current location using browser's Geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // For now, just show coordinates. In production, you'd use a reverse geocoding API
        const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setLocation(locationString);
        setShowLocationDropdown(false);
        setLoadingLocation(false);
        toast.success('Location detected successfully!');
      },
      (error) => {
        setLoadingLocation(false);
        let errorMessage = 'Unable to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      fetchRestaurants();
    }
  }, [searchQuery, selectedCuisine]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setSearchMode('restaurants');
      const params = {};
      if (selectedCuisine && selectedCuisine !== 'All') params.cuisine = selectedCuisine;

      const response = await restaurantService.getRestaurants(params);
      setRestaurants(response.data);
      setSearchResults([]);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      console.log('🔍 Search triggered with query:', searchQuery);
      setLoading(true);

      // Build params with search and cuisine filter
      const params = { search: searchQuery };
      if (selectedCuisine && selectedCuisine !== 'All') {
        params.cuisine = selectedCuisine;
      }

      // Search both restaurants and food items
      const [restaurantsRes, foodsRes] = await Promise.all([
        restaurantService.getRestaurants(params),
        foodService.searchFoods(searchQuery)
      ]);

      console.log('📊 Restaurant results:', restaurantsRes.data);
      console.log('🍕 Food results:', foodsRes.data);

      const restaurantResults = restaurantsRes.data;
      const foodResults = foodsRes.data;

      // If we found dishes, show them with their restaurants
      if (foodResults.length > 0) {
        setSearchMode('dishes');
        setSearchResults(foodResults);

        // Also get unique restaurants from food results
        const uniqueRestaurantIds = [...new Set(foodResults.map(food => food.restaurantId?._id))];
        const restaurantsWithDishes = restaurantResults.filter(r =>
          uniqueRestaurantIds.includes(r._id)
        );
        setRestaurants(restaurantsWithDishes);
      } else {
        setSearchMode('restaurants');
        setRestaurants(restaurantResults);
        setSearchResults([]);
      }

      console.log('✅ Search complete. Mode:', searchMode, 'Restaurants:', restaurantResults.length, 'Foods:', foodResults.length);
    } catch (error) {
      console.error('❌ Search error:', error);
      toast.error(error.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRestaurants = () => {
    return restaurants.filter(restaurant => {
      if (quickFilter === 'Deals Under ₹250') return restaurant.costForTwo <= 250;
      if (quickFilter === 'Top Rated') return restaurant.rating >= 4.5;
      if (quickFilter === 'Pure Veg') return restaurant.cuisine.some(c => c.toLowerCase().includes('veg'));
      if (quickFilter === 'Free Delivery') return true; // Assuming free delivery is globally applied over 250
      return true;
    });
  };

  const displayRestaurants = getFilteredRestaurants();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Mobile-Only Header (Zomato Style) */}
      <div className="md:hidden bg-white px-4 pt-4 pb-3 sticky top-0 z-50 shadow-sm">
        
        {/* Top Row: Logo & Profile */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-3xl font-display font-bold text-gradient">Fodify</div>
          <button 
            onClick={() => {
              const isAuthenticated = localStorage.getItem('token'); // Simplest check if redux not available
              navigate(isAuthenticated ? '/orders' : '/login');
            }} 
            className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0 border-2 border-orange-200"
          >
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
        
        <div className="w-full relative z-50 mb-2">
          <SearchAutocomplete onSearch={(query) => setSearchQuery(query)} />
        </div>
      </div>

      {/* Ultra-Premium Hero Section (Desktop Only) */}
      <div 
        className="hidden md:block relative text-gray-900 py-16 md:py-24 rounded-b-[2.5rem] shadow-2xl z-20 bg-orange-50 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      >
        {/* Full-width transparent blur overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md rounded-b-[2.5rem]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-5xl w-full"
          >
            {/* Catchy Tagline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-8 leading-tight tracking-tight text-gray-900 drop-shadow-sm">
              Order food & groceries. Discover<br />
              best restaurants. Foodify it!
            </h1>

            {/* Search & Location Bar */}
            <div className="max-w-4xl mx-auto w-full relative z-20">
              <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-center">

                {/* Search Input */}
                <div className="w-full flex-1 relative z-50">
                  <SearchAutocomplete onSearch={(query) => setSearchQuery(query)} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content with Background Pattern */}
      <div
        className="relative min-h-screen"
        style={{
          background: 'transparent',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* AI Features */}
          <AIMoodFinder />
          <AIRecommendations />
          <AIReviewInsights />
          <AITrendingSection />

          {/* Food Category Carousel */}
          <FoodCategoryCarousel onCategorySelect={(category) => setSearchQuery(category)} />

          {/* Horizontal Divider */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Quick Filters */}
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-stone-900 mb-5">Quick Filters</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Free Delivery', icon: '⚡', color: 'text-green-500' },
                { name: 'Deals Under ₹250', icon: '💰', color: 'text-orange-500' },
                { name: 'Top Rated', icon: '⭐', color: 'text-yellow-500' },
                { name: 'Pure Veg', icon: '🥗', color: '' },
              ].map(filter => (
                <button
                  key={filter.name}
                  onClick={() => setQuickFilter(quickFilter === filter.name ? '' : filter.name)}
                  className={`flex items-center gap-2 whitespace-nowrap border px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    quickFilter === filter.name
                      ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={filter.color}>{filter.icon}</span> {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Filter */}
          <div className="mb-10">
            <h2 className="text-2xl font-display font-bold text-stone-900 mb-5">Filter by Cuisine</h2>
            <div className="flex flex-wrap gap-3">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine === 'All' ? '' : cuisine)}
                  className={`px-6 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 ${(cuisine === 'All' && !selectedCuisine) || selectedCuisine === cuisine
                    ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-100'
                    }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Dish Search Results (if searching for dishes) */}
          {searchQuery && searchMode === 'dishes' && searchResults.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-display font-bold text-stone-900 mb-6">
                Dishes matching "{searchQuery}" ({searchResults.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {searchResults.map((food) => (
                  <motion.div
                    key={food._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => navigate(`/restaurant/${food.restaurantId._id}`)}
                    className="bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 border border-stone-100 cursor-pointer transition-all"
                  >
                    <div className="flex gap-4">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-20 h-20 rounded-[1rem] object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{food.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{food.restaurantId.name}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-primary-600 font-bold">₹{food.price}</span>
                          <span className={`text-xs px-2 py-1 rounded ${food.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {food.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              {restaurants.length > 0 && (
                <div className="border-t border-gray-200 my-8"></div>
              )}
            </div>
          )}

          {/* Restaurant Grid */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-display font-bold text-stone-900">
                {searchQuery || selectedCuisine || quickFilter
                  ? `Search Results (${displayRestaurants.length})`
                  : `All Restaurants (${displayRestaurants.length})`
                }
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            ) : displayRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {displayRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No restaurants found</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
