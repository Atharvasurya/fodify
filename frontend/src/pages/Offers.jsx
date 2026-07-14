import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTag, FiPercent, FiCreditCard, FiGift } from 'react-icons/fi';
import { Link } from 'react-router-dom';

/**
 * Offers Page
 * Display all available offers and promotions
 */
const Offers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Sample offers data
    const sampleOffers = [
      {
        id: 1,
        title: '50% OFF on First Order',
        description: 'Get 50% off on your first order. Maximum discount ₹100.',
        code: 'FIRST50',
        type: 'first-order',
        icon: FiGift,
        color: 'from-purple-500 to-pink-500',
        discount: '50% OFF',
        minOrder: 199,
        maxDiscount: 100,
        validTill: '2026-02-28'
      },
      {
        id: 2,
        title: 'Flat ₹150 OFF',
        description: 'Flat ₹150 off on orders above ₹500',
        code: 'SAVE150',
        type: 'flat',
        icon: FiTag,
        color: 'from-emerald-500 to-teal-500',
        discount: '₹150 OFF',
        minOrder: 500,
        maxDiscount: 150,
        validTill: '2026-02-15'
      },
      {
        id: 3,
        title: '30% OFF with HDFC Cards',
        description: 'Get 30% off on orders with HDFC credit/debit cards',
        code: 'HDFC30',
        type: 'bank',
        icon: FiCreditCard,
        color: 'from-blue-500 to-cyan-500',
        discount: '30% OFF',
        minOrder: 300,
        maxDiscount: 200,
        validTill: '2026-02-20'
      },
      {
        id: 4,
        title: 'Weekend Special - 40% OFF',
        description: 'Enjoy 40% off on all orders this weekend',
        code: 'WEEKEND40',
        type: 'weekend',
        icon: FiPercent,
        color: 'from-orange-500 to-red-500',
        discount: '40% OFF',
        minOrder: 250,
        maxDiscount: 120,
        validTill: '2026-02-02'
      },
      {
        id: 5,
        title: 'Free Delivery',
        description: 'Free delivery on orders above ₹199',
        code: 'FREEDEL',
        type: 'delivery',
        icon: FiTag,
        color: 'from-green-500 to-emerald-500',
        discount: 'FREE DELIVERY',
        minOrder: 199,
        maxDiscount: 50,
        validTill: '2026-03-31'
      },
      {
        id: 6,
        title: 'Paytm Cashback',
        description: 'Get 20% cashback up to ₹100 with Paytm',
        code: 'PAYTM20',
        type: 'cashback',
        icon: FiCreditCard,
        color: 'from-indigo-500 to-purple-500',
        discount: '20% CASHBACK',
        minOrder: 300,
        maxDiscount: 100,
        validTill: '2026-02-25'
      }
    ];

    setOffers(sampleOffers);
  }, []);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here
    alert(`Code ${code} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiTag className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Offers & Deals</h1>
            </div>
            <p className="text-primary-100 text-lg">
              Save more with our exclusive offers and promotions
            </p>
          </motion.div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${offer.color} p-6 text-white`}>
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8" />
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                      {offer.discount}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-white/90 text-sm">{offer.description}</p>
                </div>

                {/* Offer Details */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Min. Order:</span>
                      <span className="font-semibold text-gray-900">₹{offer.minOrder}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max. Discount:</span>
                      <span className="font-semibold text-gray-900">₹{offer.maxDiscount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Valid Till:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(offer.validTill).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="border-2 border-dashed border-primary-300 rounded-lg p-3 bg-primary-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Promo Code</p>
                        <p className="font-bold text-primary-700 text-lg tracking-wider">
                          {offer.code}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyCode(offer.code)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold text-sm hover:bg-primary-700 transition"
                      >
                        Copy
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-primary-100 mb-6">
            Browse our restaurants and apply these amazing offers at checkout
          </p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Explore Restaurants
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Offers;
