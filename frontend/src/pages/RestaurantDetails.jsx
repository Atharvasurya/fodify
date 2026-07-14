import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiMapPin, FiArrowLeft } from 'react-icons/fi';
import FoodCard from '../components/FoodCard';
import { FoodCardSkeleton } from '../components/Skeleton';
import restaurantService from '../services/restaurantService';
import foodService from '../services/foodService';
import reviewService from '../services/reviewService';
import toast from 'react-hot-toast';
import AIReviewInsights from '../components/AIReviewInsights';

/**
 * Restaurant Details Page
 * Shows restaurant info and menu items
 */
const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRestaurantData();
  }, [id]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);

      // Fetch restaurant, foods, and reviews in parallel
      const [restaurantRes, foodsRes, reviewsRes] = await Promise.all([
        restaurantService.getRestaurantById(id),
        foodService.getFoodsByRestaurant(id),
        reviewService.getRestaurantReviews(id)
      ]);

      setRestaurant(restaurantRes.data);
      setFoods(foodsRes.data);
      setReviews(reviewsRes.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch restaurant details');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['All', ...new Set(foods.map(food => food.category))];

  // Filter foods by category
  const filteredFoods = selectedCategory === 'All'
    ? foods
    : foods.filter(food => food.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-64 skeleton"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600">Restaurant not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Restaurant Header */}
      <div className="relative min-h-[22rem] md:min-h-[24rem] flex flex-col justify-end bg-gradient-to-br from-violet-900 via-fuchsia-900 to-orange-900 rounded-b-[2.5rem] shadow-2xl overflow-hidden z-10 pt-20 pb-6 md:pb-10">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/50 to-transparent"></div>

        {/* Mobile Back Button */}
        <div className="absolute top-4 left-4 z-20 md:hidden">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-white/20 transition-all"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-20 text-white px-6 md:px-10 w-full">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl md:text-6xl font-display font-black mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                {restaurant.name}
              </h1>
              <p className="text-lg text-gray-300 mb-6 font-medium">{restaurant.description}</p>

              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center space-x-1.5 backdrop-blur-md bg-white/20 border border-white/30 px-3 py-1.5 rounded-full shadow-xl">
                  <FiStar className="fill-yellow-400 text-yellow-400 w-4 h-4" />
                  <span className="font-bold">{restaurant.rating}</span>
                </div>
                <div className="flex items-center space-x-1.5 backdrop-blur-md bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                  <FiClock className="w-4 h-4 text-orange-400" />
                  <span className="font-bold tracking-wide">{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-1.5 backdrop-blur-md bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                  <FiMapPin className="w-4 h-4 text-orange-400" />
                  <span className="font-bold tracking-wide">{restaurant.address.city}</span>
                </div>
                <div className="font-bold backdrop-blur-md bg-white/10 px-3 py-1.5 rounded-full border border-white/20 tracking-wide">
                  ₹{restaurant.costForTwo} for two
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-20">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-3xl font-display font-black text-gray-900 mb-6">Menu</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 ${selectedCategory === category
                  ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items */}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                restaurantId={id}
                restaurantName={restaurant.name}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No items in this category</p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-16">
          {/* AI Review Insights */}
          <AIReviewInsights restaurantId={id} />

          <h2 className="text-3xl font-display font-black text-gray-900 mb-8 mt-12">
            Customer Reviews ({reviews.length})
          </h2>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-orange-400 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg">
                      {review.userId?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    <div className="flex-1">
                      {/* User Name and Date */}
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {review.userId?.name || 'Anonymous'}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                              }`}
                          />
                        ))}
                        <span className="text-sm font-medium text-gray-700 ml-1">
                          {review.rating}.0
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center">
              <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Be the first to review this restaurant!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
