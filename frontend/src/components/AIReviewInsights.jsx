import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import aiService from '../services/aiService';
import AIBadge from './AIBadge';

const AIReviewInsights = ({ restaurantId }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchInsights = async () => {
      try {
        const res = await aiService.getReviewInsights(restaurantId);
        if (res.data?.success) {
          setInsights(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching review insights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="skeleton h-6 w-48 rounded mb-6"></div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-32 h-32 rounded-full skeleton mx-auto md:mx-0"></div>
          <div className="flex-1 space-y-4">
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-3/4 rounded"></div>
            <div className="skeleton h-4 w-5/6 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!insights || insights.totalReviews === 0) return null;

  const scoreColor = insights.overallSentiment >= 0.7 ? 'text-green-500' : (insights.overallSentiment >= 0.4 ? 'text-yellow-500' : 'text-red-500');
  const scoreStroke = insights.overallSentiment >= 0.7 ? 'stroke-green-500' : (insights.overallSentiment >= 0.4 ? 'stroke-yellow-500' : 'stroke-red-500');

  const { positive, neutral, negative } = insights.sentimentDistribution;
  const totalDist = positive + neutral + negative || 1;

  const renderAspectBar = (label, score) => {
    if (score === null) return null;
    const value = Math.round(score * 100);
    const colorClass = value >= 70 ? 'bg-green-500' : (value >= 40 ? 'bg-yellow-500' : 'bg-red-500');
    return (
      <div className="mb-2" key={label}>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600 capitalize">{label.replace('_', ' ')}</span>
          <span className="font-medium text-gray-800">{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${colorClass}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-6 shadow-sm border border-purple-100 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          🧠 Review Analysis
        </h2>
        <AIBadge size="sm" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center min-w-[140px]">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-32 h-32 -rotate-90 absolute">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-100" />
              <motion.circle 
                cx="64" 
                cy="64" 
                r="56" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray="351.8" 
                initial={{ strokeDashoffset: 351.8 }}
                animate={{ strokeDashoffset: 351.8 - (351.8 * insights.overallSentiment) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className={scoreStroke} 
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center text-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>
                {Math.round(insights.overallSentiment * 100)}%
              </span>
              <span className="text-xs text-gray-500 font-medium">Positive</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Based on {insights.totalReviews} reviews</p>
        </div>

        {/* Aspects & Distribution */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Sentiment Breakdown</h4>
            
            <div className="flex h-3 w-full rounded-full overflow-hidden mb-2">
              <div style={{ width: `${(positive/totalDist)*100}%` }} className="bg-green-500"></div>
              <div style={{ width: `${(neutral/totalDist)*100}%` }} className="bg-yellow-400"></div>
              <div style={{ width: `${(negative/totalDist)*100}%` }} className="bg-red-500"></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Positive ({positive})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Neutral ({neutral})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Negative ({negative})</span>
            </div>

            <h4 className="text-sm font-semibold text-gray-700 mb-2">Aspect Scores</h4>
            {Object.entries(insights.aspectScores).map(([k, v]) => renderAspectBar(k, v))}
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <FiCheckCircle className="text-green-500" /> Top Praises
              </h4>
              <ul className="text-xs space-y-2">
                {insights.topPraises.length > 0 ? insights.topPraises.map((p, i) => (
                  <li key={i} className="bg-green-50 text-green-800 p-2 rounded-md line-clamp-2 border border-green-100">"{p}"</li>
                )) : <li className="text-gray-400 italic">Not enough data</li>}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <FiAlertTriangle className="text-red-500" /> Top Complaints
              </h4>
              <ul className="text-xs space-y-2">
                {insights.topComplaints.length > 0 ? insights.topComplaints.map((c, i) => (
                  <li key={i} className="bg-red-50 text-red-800 p-2 rounded-md line-clamp-2 border border-red-100">"{c}"</li>
                )) : <li className="text-gray-400 italic">No major complaints detected</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIReviewInsights;
