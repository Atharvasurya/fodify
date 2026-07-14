import React from 'react';
import { motion } from 'framer-motion';

/**
 * Admin Portal Page - Placeholder
 * To be implemented with admin features
 */
const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Portal</h1>
        <p className="text-xl text-gray-600 mb-8">
          Coming Soon! 🚀
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Planned Features:</h3>
          <ul className="text-left space-y-2 text-gray-700">
            <li>✅ Restaurant Management</li>
            <li>✅ Food Item CRUD Operations</li>
            <li>✅ Order Management & Status Updates</li>
            <li>✅ User Management</li>
            <li>✅ Analytics Dashboard</li>
            <li>✅ Reports & Insights</li>
          </ul>
        </div>

        <a
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          ← Back to Dashboard
        </a>
      </motion.div>
    </div>
  );
};

export default Admin;
