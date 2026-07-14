import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiX, FiArrowRight } from 'react-icons/fi';
import aiService from '../services/aiService';
import AIBadge from './AIBadge';

const moods = [
  { id: 'happy', name: 'Happy', emoji: '😊', desc: 'Celebratory & sweet', color: 'from-amber-400 via-orange-400 to-rose-400' },
  { id: 'sad', name: 'Sad', emoji: '😢', desc: 'Comforting & warm', color: 'from-blue-500 via-indigo-500 to-purple-600' },
  { id: 'stressed', name: 'Stressed', emoji: '😰', desc: 'Indulgent treats', color: 'from-rose-400 via-fuchsia-500 to-indigo-500' },
  { id: 'adventurous', name: 'Adventurous', emoji: '🤠', desc: 'Spicy & exotic', color: 'from-emerald-400 via-teal-500 to-cyan-600' },
  { id: 'romantic', name: 'Romantic', emoji: '🥰', desc: 'Premium dining', color: 'from-pink-500 via-rose-500 to-red-500' },
  { id: 'lazy', name: 'Lazy', emoji: '😴', desc: 'Quick & easy', color: 'from-violet-400 via-purple-400 to-fuchsia-400' },
  { id: 'energetic', name: 'Energetic', emoji: '💪', desc: 'Healthy & light', color: 'from-cyan-400 via-blue-500 to-indigo-500' },
  { id: 'celebrating', name: 'Celebrating', emoji: '🎉', desc: 'The absolute best', color: 'from-yellow-300 via-amber-400 to-orange-500' }
];

const AIMoodFinder = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    try {
      const res = await aiService.getMoodSuggestions(mood.id);
      if (res.data?.success) {
        setResults(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching mood suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeResults = () => {
    setSelectedMood(null);
    setResults(null);
  };

  return (
    <div className="my-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🧠 AI Mood Finder
        </h2>
        <AIBadge />
      </div>

      <AnimatePresence mode="wait">
        {!selectedMood ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {moods.map((mood, index) => (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleMoodSelect(mood)}
                className={`bg-gradient-to-br ${mood.color} p-4 rounded-2xl text-white shadow-md hover:shadow-lg text-left relative overflow-hidden group`}
              >
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-30 group-hover:scale-110 transition-transform">{mood.emoji}</div>
                <div className="text-3xl mb-2 relative z-10">{mood.emoji}</div>
                <h3 className="font-bold text-lg relative z-10">{mood.name}</h3>
                <p className="text-xs text-white/90 relative z-10">{mood.desc}</p>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-card overflow-hidden border border-gray-100"
          >
            <div className={`bg-gradient-to-r ${selectedMood.color} p-6 text-white relative`}>
              <button 
                onClick={closeResults}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/30 p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <FiX size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="text-5xl">{selectedMood.emoji}</div>
                <div>
                  <h3 className="text-2xl font-bold">You're feeling {selectedMood.name}</h3>
                  <p className="text-white/90 max-w-xl mt-1">
                    {loading ? 'AI is analyzing the perfect menu for your mood...' : results?.reasoning}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-white rounded-2xl animate-pulse shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                       <div className="text-4xl animate-bounce mb-2">🧠</div>
                       <div className="text-sm text-gray-400">AI is thinking...</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results?.foods?.map((food, i) => (
                    <motion.div 
                      key={food._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className={`w-4 h-4 rounded-sm border ${food.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center bg-white`}>
                            <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h4 className="font-bold text-gray-900 mb-1">{food.name}</h4>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{food.description}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-bold text-lg text-gray-900">₹{food.price}</span>
                          <Link 
                            to={`/restaurant/${food.restaurantId._id || food.restaurantId}`}
                            className="text-purple-600 font-medium text-sm flex items-center gap-1 hover:text-purple-700"
                          >
                            View Menu <FiArrowRight />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIMoodFinder;
