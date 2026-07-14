import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Food Category Carousel Component
 * Swiggy-style horizontal scrolling category selector
 */
const FoodCategoryCarousel = ({ onCategorySelect }) => {
  const scrollContainerRef = useRef(null);

  const categories = [
    {
      name: 'Biryani',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029856/PC_Creative%20refresh/3D_bau/banners_new/Biryani.png',
      searchTerm: 'Biryani'
    },
    {
      name: 'Burger',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029845/PC_Creative%20refresh/3D_bau/banners_new/Burger.png',
      searchTerm: 'Burger'
    },
    {
      name: 'Pizza',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029874/PC_Creative%20refresh/3D_bau/banners_new/Pizza.png',
      searchTerm: 'Pizza'
    },
    {
      name: 'Rolls',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029858/PC_Creative%20refresh/3D_bau/banners_new/Rolls.png',
      searchTerm: 'Roll'
    },
    {
      name: 'Noodles',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029848/PC_Creative%20refresh/3D_bau/banners_new/Noodles.png',
      searchTerm: 'Noodles'
    },
    {
      name: 'Dosa',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029846/PC_Creative%20refresh/3D_bau/banners_new/Dosa.png',
      searchTerm: 'Dosa'
    },
    {
      name: 'Idli',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029850/PC_Creative%20refresh/3D_bau/banners_new/Idli.png',
      searchTerm: 'Idli'
    },
    {
      name: 'Cake',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029844/PC_Creative%20refresh/3D_bau/banners_new/Cakes.png',
      searchTerm: 'Cake'
    },
    {
      name: 'Pasta',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029854/PC_Creative%20refresh/3D_bau/banners_new/Pasta.png',
      searchTerm: 'Pasta'
    },
    {
      name: 'Paratha',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029856/PC_Creative%20refresh/3D_bau/banners_new/Paratha.png',
      searchTerm: 'Paratha'
    },
    {
      name: 'Khichdi',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029851/PC_Creative%20refresh/3D_bau/banners_new/Khichdi.png',
      searchTerm: 'Khichdi'
    },
    {
      name: 'Shawarma',
      image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/v1674029860/PC_Creative%20refresh/3D_bau/banners_new/Shawarma.png',
      searchTerm: 'Shawarma'
    }
  ];

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      const newScrollPosition = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">What's on your mind?</h2>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll left"
          >
            <FiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll right"
          >
            <FiChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onCategorySelect && onCategorySelect(category.searchTerm)}
            className="flex-shrink-0 cursor-pointer group snap-start"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mb-2 transform group-hover:scale-105 transition-transform duration-300">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <p className="text-center text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
              {category.name}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FoodCategoryCarousel;
