import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiSearch, FiTag, FiHelpCircle, FiMenu, FiGrid } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from './SearchModal';
import HelpModal from './HelpModal';

/**
 * Navbar Component
 * Main navigation bar with search, offers, help, cart and user menu
 */
const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showSearchModal, setShowSearchModal] = React.useState(false);
  const [showHelpModal, setShowHelpModal] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [window.location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userLocation');
    dispatch(logout());
    setShowUserMenu(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="hidden md:block bg-white shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Mobile Hamburger Menu Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-stone-600 hover:text-orange-500 transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-2 flex-1 md:flex-none justify-center md:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-display font-bold text-gradient"
              >
                Fodify
              </motion.div>
            </Link>

            {/* Center - Search, Offers, Help */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearchModal(true)}
                className="flex items-center gap-2 text-stone-600 hover:text-orange-500 transition-colors"
              >
                <FiSearch className="w-5 h-5" />
                <span className="font-sans font-bold">Search</span>
              </motion.button>

              {/* ApnaBaazar */}
              <Link to="/grocery">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-stone-600 hover:text-orange-500 transition-colors relative pr-8"
                >
                  <FiGrid className="w-5 h-5 text-indigo-500" />
                  <span className="font-sans font-bold">ApnaBaazar</span>
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shadow-sm">
                    10 MIN
                  </span>
                </motion.button>
              </Link>

              {/* Offers */}
              <Link to="/offers">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-stone-600 hover:text-orange-500 transition-colors relative pr-8"
                >
                  <FiTag className="w-5 h-5" />
                  <span className="font-sans font-bold">Offers</span>
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shadow-sm">
                    NEW
                  </span>
                </motion.button>
              </Link>

              {/* Help */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHelpModal(true)}
                className="flex items-center gap-2 text-stone-600 hover:text-orange-500 transition-colors"
              >
                <FiHelpCircle className="w-5 h-5" />
                <span className="font-sans font-bold">Help</span>
              </motion.button>
            </div>

            {/* Right side - Cart & User */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search Icon */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearchModal(true)}
                className="md:hidden p-2 text-stone-600 hover:text-orange-500 transition-colors"
              >
                <FiSearch className="w-6 h-6" />
              </motion.button>

              {/* Cart */}
              <Link to="/cart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-stone-600 hover:text-orange-500 transition-colors"
                >
                  <FiShoppingCart className="w-6 h-6" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* User Menu (Desktop only) */}
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-100 transition-colors"
                    >
                      <FiUser className="w-5 h-5" />
                      <span className="font-bold font-sans">{user?.name?.split(' ')[0]}</span>
                    </motion.button>

                    {/* Dropdown */}
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl py-2 border border-stone-100"
                      >
                        <Link
                          to="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-2 px-4 py-2.5 hover:bg-stone-50 text-stone-700 font-sans font-bold transition-colors"
                        >
                          <FiPackage className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary"
                    >
                      Login
                    </motion.button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Side Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />
            
            {/* Mobile Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-3/4 max-w-sm bg-white z-[70] shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <span className="text-2xl font-display font-bold text-gradient">Fodify</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 bg-white rounded-full shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info (if logged in) */}
              {isAuthenticated ? (
                <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="p-5 border-b border-gray-100">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full btn-primary py-3">Login to Order</button>
                  </Link>
                </div>
              )}

              <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
                <Link to="/home" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                  <FiSearch className="w-5 h-5" /> Home & Search
                </Link>

                <Link to="/grocery" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                  <div className="flex items-center gap-3">
                    <FiGrid className="w-5 h-5 text-indigo-500" /> ApnaBaazar
                  </div>
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">10 MIN</span>
                </Link>
                
                <Link to="/offers" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                  <div className="flex items-center gap-3">
                    <FiTag className="w-5 h-5 text-orange-500" /> Offers
                  </div>
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase">NEW</span>
                </Link>
                
                {isAuthenticated && (
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                    <FiPackage className="w-5 h-5 text-purple-500" /> My Orders
                  </Link>
                )}

                <button onClick={() => { setIsMobileMenuOpen(false); setShowHelpModal(true); }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium w-full text-left">
                  <FiHelpCircle className="w-5 h-5 text-blue-500" /> Help & Support
                </button>
              </div>

              {/* Logout at bottom */}
              {isAuthenticated && (
                <div className="p-4 border-t border-gray-100">
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-medium w-full text-left hover:bg-red-50">
                    <FiLogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </>
  );
};

export default Navbar;
