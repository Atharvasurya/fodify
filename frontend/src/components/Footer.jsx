import React from 'react';
import { FiGithub, FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';
import { Link } from 'react-router-dom';

/**
 * Footer Component
 * Site footer with links and social media
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-[#1a0b2e] to-black text-gray-300 py-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] bg-violet-600/10 rounded-full mix-blend-overlay filter blur-3xl animate-[spin_20s_linear_infinite]" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-[spin_15s_linear_infinite_reverse]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/home" className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-6 inline-block hover:scale-105 transition-transform">
              Fodify
            </Link>
            <p className="text-gray-400 text-sm">
              Order delicious food from your favorite restaurants, delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* For Restaurants */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">For Restaurants</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Partner with Us</a></li>
              <li><a href="#" className="hover:text-white transition">Restaurant Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            </ul>
          </div>

          {/* Admin & User Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">User & Admin</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition text-purple-400 font-bold">Switch Mode (User/Admin)</Link>
              </li>
              <li>
                <a href="/cart" className="hover:text-white transition">Cart</a>
              </li>
              <li>
                <a href="/orders" className="hover:text-white transition">Orders</a>
              </li>
              <li>
                <a href="/admin" className="text-orange-400 hover:text-orange-300 transition font-bold flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin Login
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiGithub className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            &copy; {currentYear} Fodify. All rights reserved. Made by Atharva Ravindra Suryawanshi for food lovers.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
