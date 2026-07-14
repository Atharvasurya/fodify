import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiHome, FiTag, FiShoppingBag, FiPackage, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  const { totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const navItems = [
    { name: 'Home', path: '/home', icon: FiHome },
    { name: 'Grocery', path: '/grocery', icon: FiShoppingCart },
    { name: 'Cart', path: '/cart', icon: FiShoppingBag, badge: totalItems },
    { name: 'Orders', path: '/orders', icon: FiPackage, requiresAuth: true },
  ];

  // If on initial landing page or admin, hide
  if (location.pathname === '/' || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-50 px-2 py-2 pb-safe-area">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          if (item.requiresAuth && !isAuthenticated) return null;
          
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 relative w-16 transition-colors ${
                isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute -top-3 w-8 h-1 bg-gradient-to-r from-orange-400 to-pink-500 rounded-b-full"
                />
              )}
              
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'fill-orange-100 stroke-2' : 'stroke-[1.5]'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
