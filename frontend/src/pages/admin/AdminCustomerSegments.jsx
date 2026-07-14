import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import aiService from '../../services/aiService';

const AdminCustomerSegments = () => {
  const [segments, setSegments] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const res = await aiService.getAdminSegments();
        if (res.data?.success) {
          setSegments(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching customer segments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSegments();
  }, []);

  if (loading) {
    return <div className="p-6"><div className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">👥 Customer Segmentation</h1>
        <p className="text-gray-500 mt-2">AI-driven RFM (Recency, Frequency, Monetary) analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-gray-900 mb-6 self-start">Segment Distribution</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments?.segments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {segments?.segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value} Users (${props.payload.percentage}%)`, name]}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {segments?.segments.map(s => (
              <div key={s.name} className="flex items-center gap-1 text-xs font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: s.color}}></span>
                {s.name}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {segments?.segments.map((segment, i) => (
            <motion.div 
              key={segment.name}
              initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: i*0.1}}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{backgroundColor: segment.color}}></span>
                  <h4 className="font-bold text-gray-900">{segment.name}</h4>
                </div>
                <div className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-bold">
                  {segment.percentage}%
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 flex-grow">{segment.description}</p>
              
              <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-50">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Avg Spend</div>
                  <div className="font-bold text-gray-900">₹{segment.avgSpend}</div>
                </div>
                <div className="text-right">
                   <div className="text-xs text-purple-600 font-semibold mb-1">AI Action Plan</div>
                   <div className="text-[10px] text-gray-600 max-w-[120px] leading-tight bg-purple-50 p-1.5 rounded">{segment.action}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerSegments;
