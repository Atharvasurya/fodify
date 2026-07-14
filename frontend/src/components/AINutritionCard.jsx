import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp, FiCheckCircle } from 'react-icons/fi';
import aiService from '../services/aiService';

const AINutritionCard = ({ foodId }) => {
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!foodId) return;
    
    const fetchNutrition = async () => {
      setLoading(true);
      try {
        const res = await aiService.getNutrition(foodId);
        if (res.data?.success) {
          setNutrition(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching nutrition:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNutrition();
  }, [foodId]);

  if (loading) {
    return (
      <div className="my-4 bg-gray-50 rounded-xl p-4 animate-pulse">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-2 w-full bg-gray-200 rounded"></div>
          <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!nutrition) return null;

  const maxMacros = Math.max(nutrition.protein, nutrition.carbs, nutrition.fat, 1);

  return (
    <div className="my-4 bg-white border border-cyan-100 rounded-xl overflow-hidden shadow-sm">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-cyan-800">Nutrition Info ✨</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
            Estimated
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-700">{nutrition.calories} kcal</span>
          {expanded ? <FiChevronUp className="text-cyan-600" /> : <FiChevronDown className="text-cyan-600" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-4 border-t border-cyan-100 bg-white"
          >
            <div className="space-y-4">
              {/* Macros */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">Protein</span>
                  <span className="font-bold text-gray-800">{nutrition.protein}g</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(nutrition.protein / maxMacros) * 100}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">Carbs</span>
                  <span className="font-bold text-gray-800">{nutrition.carbs}g</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(nutrition.carbs / maxMacros) * 100}%` }}
                    className="h-full bg-yellow-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">Fat</span>
                  <span className="font-bold text-gray-800">{nutrition.fat}g</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(nutrition.fat / maxMacros) * 100}%` }}
                    className="h-full bg-orange-500 rounded-full"
                  />
                </div>
              </div>

              {/* Health Tags */}
              {nutrition.healthTags && nutrition.healthTags.length > 0 && (
                <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                  {nutrition.healthTags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                      <FiCheckCircle size={10} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-gray-400 flex justify-between pt-1">
                <span>Per {nutrition.servingSize}</span>
                <span>Confidence: {nutrition.confidence}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AINutritionCard;
