import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiUser, FiPackage, FiMapPin, FiGrid, FiArrowRight } from 'react-icons/fi';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Admin Search Results Page
 * Displays search results from global search API
 */
const AdminSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query param on mount and update
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [location.search]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return;

    setLoading(true);
    try {
      const response = await adminService.search(encodeURIComponent(searchTerm));

      if (response && (response.data || response.users)) {
        // Handle both response structures (wrapped in data or direct)
        setResults(response.data || response);
      } else {
        setResults({ users: [], restaurants: [], foods: [], orders: [] });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error performing search');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Helper to check if results exist
  const hasResults = results && (
    (results.users && results.users.length > 0) ||
    (results.restaurants && results.restaurants.length > 0) ||
    (results.foods && results.foods.length > 0) ||
    (results.orders && results.orders.length > 0)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-600">
          Showing results for "<span className="font-semibold text-purple-600">{query}</span>"
        </p>
      </div>

      {!hasResults ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">No results found</h2>
          <p className="text-gray-500 mt-2">Try searching for something else</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8"
        >
          {/* Restaurants Section */}
          {results.restaurants && results.restaurants.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                <FiMapPin className="text-purple-600" /> Restaurants
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.restaurants.map((restaurant) => (
                  <motion.div variants={itemVariants} key={restaurant._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <img src={restaurant.image} alt={restaurant.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                        <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                        <Link to={`/admin/restaurants?edit=${restaurant._id}`} className="text-xs text-purple-600 font-medium hover:underline mt-1 block">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Foods Section */}
          {results.foods && results.foods.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                <FiPackage className="text-green-600" /> Food Items
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.foods.map((food) => (
                  <motion.div variants={itemVariants} key={food._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <img src={food.image} alt={food.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{food.name}</h3>
                        <p className="text-sm text-gray-500">₹{food.price}</p>
                        <p className="text-xs text-gray-400">{food.restaurantId?.name || 'Unknown Restaurant'}</p>
                        <Link to={`/admin/foods?edit=${food._id}`} className="text-xs text-purple-600 font-medium hover:underline mt-1 block">
                          Edit Item
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Orders Section */}
          {results.orders && results.orders.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                <FiGrid className="text-blue-600" /> Orders
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.orders.map((order) => (
                  <motion.div variants={itemVariants} key={order._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-mono font-semibold text-gray-900 text-sm">#{order._id.slice(-6).toUpperCase()}</h3>
                        <p className="text-sm text-gray-600 mt-1">{order.userId?.name}</p>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full capitalize mb-1
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Users Section */}
          {results.users && results.users.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                <FiUser className="text-orange-600" /> Users
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.map((user) => (
                  <motion.div variants={itemVariants} key={user._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className="text-xs text-gray-400 capitalize">{user.role}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdminSearch;
