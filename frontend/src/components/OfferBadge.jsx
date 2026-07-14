import React from 'react';
import { FiTag } from 'react-icons/fi';

/**
 * OfferBadge Component
 * Displays discount offers on restaurant and food cards
 */
const OfferBadge = ({ offer, className = '' }) => {
  console.log('🎫 OfferBadge render - offer:', offer);

  if (!offer) {
    console.log('🎫 No offer - not rendering badge');
    return null;
  }

  const getDiscountText = () => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    }
    return `₹${offer.discountValue} OFF`;
  };

  const discountText = getDiscountText();
  console.log('🎫 Rendering badge with text:', discountText);

  return (
    <div className={`absolute top-2 left-2 z-10 ${className}`}>
      <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-transform">
        <FiTag className="w-3 h-3" />
        <span className="text-xs font-bold">{discountText}</span>
      </div>
    </div>
  );
};

export default OfferBadge;
