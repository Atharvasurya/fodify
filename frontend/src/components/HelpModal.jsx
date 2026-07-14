import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiPhone, FiMessageCircle, FiHelpCircle } from 'react-icons/fi';

/**
 * HelpModal Component
 * Help modal with FAQs and contact information
 */
const HelpModal = ({ isOpen, onClose }) => {
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Browse restaurants, add items to cart, and proceed to checkout. You can track your order in the Orders section.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and cash on delivery.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery time varies by restaurant, typically 20-45 minutes. Check the estimated time on each restaurant page.'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order before the restaurant accepts it. Go to My Orders and select cancel.'
    },
    {
      question: 'Do you have minimum order value?',
      answer: 'Minimum order value varies by restaurant. Check the restaurant details page for specific requirements.'
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiHelpCircle className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Help & Support</h2>
                  <p className="text-primary-100 text-sm">We're here to help you</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Contact Options */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href="mailto:support@fodify.com"
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <FiMail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Email</p>
                    <p className="text-xs text-gray-600">support@fodify.com</p>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href="tel:+911234567890"
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <FiPhone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Phone</p>
                    <p className="text-xs text-gray-600">+91 123 456 7890</p>
                  </div>
                </motion.a>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                >
                  <FiMessageCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Live Chat</p>
                    <p className="text-xs text-gray-600">Chat with us</p>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* FAQs */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional Help */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Can't find what you're looking for?{' '}
                <a href="mailto:support@fodify.com" className="text-primary-600 hover:underline font-semibold">
                  Contact our support team
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HelpModal;
