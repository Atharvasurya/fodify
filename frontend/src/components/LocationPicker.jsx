import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiCrosshair, FiChevronDown, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LocationPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('Detect Location');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAddressFromCoords = async (lat, lon) => {
    try {
      // Using OpenStreetMap Nominatim API for free reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      
      if (data && data.address) {
        // Construct a short, readable address
        const suburb = data.address.suburb || data.address.neighbourhood || '';
        const city = data.address.city || data.address.town || data.address.state_district || '';
        
        let shortAddress = data.display_name;
        if (suburb && city) {
          shortAddress = `${suburb}, ${city}`;
        } else if (city) {
          shortAddress = city;
        }

        // Keep it reasonably short for the UI
        if (shortAddress.length > 25) {
          shortAddress = shortAddress.substring(0, 22) + '...';
        }
        
        setAddress(shortAddress);
        toast.success(`Location set to ${city || 'your area'}`);
      } else {
        setAddress('Location Found');
        toast.success('Coordinates retrieved');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Could not determine exact address');
      setAddress('Location Found');
    } finally {
      setLoading(false);
      setIsOpen(false);
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
            toast.error('Please allow location access in your browser');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('An unknown error occurred');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 w-full h-[52px] px-4 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-xl transition-all font-medium text-gray-800"
      >
        <FiMapPin className="text-orange-400 text-xl shrink-0" />
        <span className="truncate text-left flex-1 font-bold tracking-wide">
          {address}
        </span>
        <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            <button
              onClick={handleGetLocation}
              disabled={loading}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-orange-50 transition-colors text-left disabled:opacity-50 group"
            >
              {loading ? (
                <FiLoader className="text-orange-500 text-xl animate-spin shrink-0" />
              ) : (
                <FiCrosshair className="text-orange-500 text-xl shrink-0 group-hover:scale-110 transition-transform" />
              )}
              <div className="flex flex-col">
                <span className="font-bold text-orange-600">
                  {loading ? 'Detecting...' : 'Get Current Location'}
                </span>
                <span className="text-xs text-gray-400 font-medium mt-0.5">
                  Using GPS
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationPicker;
