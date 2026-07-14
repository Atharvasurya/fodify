import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCrosshair, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const GlobalLocationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  useEffect(() => {
    // Check if location is already set
    const savedLocation = localStorage.getItem('userLocation');
    if (!savedLocation) {
      // Small delay to not immediately block the user on first render
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveLocation = (addressStr) => {
    localStorage.setItem('userLocation', addressStr);
    toast.success(`Delivery location set to ${addressStr}`);
    setIsOpen(false);
  };

  const fetchAddressFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const suburb = data.address.suburb || data.address.neighbourhood || '';
        const city = data.address.city || data.address.town || data.address.state_district || '';
        
        let shortAddress = data.display_name;
        if (suburb && city) {
          shortAddress = `${suburb}, ${city}`;
        } else if (city) {
          shortAddress = city;
        }

        saveLocation(shortAddress);
      } else {
        saveLocation('Location Found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Could not determine exact address');
      saveLocation('Unknown Location');
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchAddressFromCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setLoading(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Please allow location access or type it below');
            break;
          default:
            toast.error('Could not detect location. Please type it manually.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualAddress.trim().length < 3) {
      toast.error('Please enter a valid address or area');
      return;
    }
    saveLocation(manualAddress.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md overflow-hidden"
          >
            {/* Header Icon */}
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMapPin className="w-8 h-8 text-orange-500" />
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Where are we delivering?
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Please set your location so we can show you the best restaurants and deals nearby.
            </p>

            {/* Detect Location Button */}
            <button
              onClick={handleGetLocation}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md shadow-orange-500/20 disabled:opacity-70"
            >
              {loading ? (
                <FiLoader className="w-6 h-6 animate-spin" />
              ) : (
                <FiCrosshair className="w-6 h-6" />
              )}
              {loading ? 'Detecting Location...' : 'Use Current Location'}
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-500 font-medium">
                OR
              </span>
            </div>

            {/* Manual Entry Form */}
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your area or city"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
              >
                Set
              </button>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLocationModal;
