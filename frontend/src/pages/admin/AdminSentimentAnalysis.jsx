import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSmile, FiMeh, FiFrown, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import aiService from '../../services/aiService';

const AdminSentimentAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const res = await aiService.getAdminSentiment();
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching sentiment analysis:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSentiment();
  }, []);

  if (loading) {
    return <div className="p-6"><div className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div></div>;
  }

  const { overall, distribution, aspectScores, recentReviews, trends } = data;
  
  const aspectData = Object.entries(aspectScores).map(([key, value]) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: value ? Math.round(value * 100) : 0,
    fill: value >= 0.7 ? '#10b981' : (value >= 0.4 ? '#fbbf24' : '#ef4444')
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🎭 Sentiment Analysis</h1>
        <p className="text-gray-500 mt-2">NLP-powered analysis of all customer feedback and reviews</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Overall Score */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <FiSmile className="w-32 h-32" />
          </div>
          <h3 className="text-gray-500 font-medium mb-4 relative z-10">Overall Brand Sentiment</h3>
          <div className="relative w-40 h-40 flex items-center justify-center mb-2 z-10">
            <svg className="w-40 h-40 -rotate-90 absolute">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-100" />
              <circle 
                cx="80" 
                cy="80" 
                r="70" 
                stroke="currentColor" 
                strokeWidth="12" 
                fill="none" 
                strokeDasharray="439.8" 
                strokeDashoffset={439.8 - (439.8 * overall.score)}
                className={overall.score >= 0.7 ? 'text-green-500' : (overall.score >= 0.4 ? 'text-yellow-500' : 'text-red-500')}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className={`text-4xl font-bold ${overall.score >= 0.7 ? 'text-green-500' : (overall.score >= 0.4 ? 'text-yellow-500' : 'text-red-500')}`}>
                {Math.round(overall.score * 100)}%
              </span>
              <span className="text-sm text-gray-600 font-medium">{overall.label}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2 z-10">Analyzed from {overall.totalReviews} total reviews</p>
        </div>

        {/* Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-500 font-medium mb-6">Sentiment Breakdown</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="flex items-center gap-2 text-green-700 font-medium"><FiSmile /> Positive</span>
                <span className="font-bold">{distribution.positive}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{width: `${(distribution.positive / overall.totalReviews) * 100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="flex items-center gap-2 text-yellow-600 font-medium"><FiMeh /> Neutral</span>
                <span className="font-bold">{distribution.neutral}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{width: `${(distribution.neutral / overall.totalReviews) * 100}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="flex items-center gap-2 text-red-600 font-medium"><FiFrown /> Negative</span>
                <span className="font-bold">{distribution.negative}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{width: `${(distribution.negative / overall.totalReviews) * 100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Aspect Scores */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <h3 className="text-gray-500 font-medium mb-6">Aspect-Based Sentiment</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aspectData} layout="vertical" margin={{top:0, right:30, left:20, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#4b5563'}} width={90} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [`${value}% Positive`, 'Score']}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                  {aspectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4 mt-12">Live NLP Analysis</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-700">User & Restaurant</th>
                <th className="p-4 font-semibold text-gray-700 w-1/3">Raw Review</th>
                <th className="p-4 font-semibold text-gray-700">AI Sentiment</th>
                <th className="p-4 font-semibold text-gray-700">Extracted Aspects</th>
              </tr>
            </thead>
            <tbody>
              {recentReviews?.map((item, index) => (
                <motion.tr 
                  initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: index*0.05}}
                  key={item.review._id} 
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="p-4">
                    <div className="font-bold text-sm text-gray-900">{item.userName}</div>
                    <div className="text-xs text-gray-500">{item.restaurantName}</div>
                    <div className="text-xs text-yellow-500 font-bold mt-1">{'★'.repeat(item.review.rating)}{'☆'.repeat(5-item.review.rating)}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 italic">
                    "{item.review.comment}"
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${item.sentiment.score >= 0.7 ? 'bg-green-100 text-green-700' : (item.sentiment.score >= 0.4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700')}`}>
                      {item.sentiment.label.replace('_', ' ').toUpperCase()} ({Math.round(item.sentiment.score*100)}%)
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(item.aspects).filter(([_,v]) => v !== null).map(([k, v]) => (
                        <span key={k} className={`text-[10px] px-1.5 py-0.5 rounded border ${v >= 0.6 ? 'bg-green-50 border-green-200 text-green-700' : (v >= 0.4 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-red-50 border-red-200 text-red-700')}`}>
                          {k.replace('_', ' ')}
                        </span>
                      ))}
                      {Object.values(item.aspects).every(v => v === null) && <span className="text-xs text-gray-400">None detected</span>}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSentimentAnalysis;
