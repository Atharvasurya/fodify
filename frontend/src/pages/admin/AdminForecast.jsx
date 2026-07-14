import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import aiService from '../../services/aiService';

const AdminForecast = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchForecast = async () => {
      setLoading(true);
      try {
        const res = await aiService.getAdminForecast(days);
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching forecast:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [days]);

  if (loading && !data) {
    return <div className="p-6"><div className="h-96 bg-gray-200 animate-pulse rounded-2xl"></div></div>;
  }

  // Combine historical and forecast data for charts
  const formatChartData = (historical, forecast, key) => {
    const combined = [];
    historical?.slice(-14).forEach(h => combined.push({ date: h.date.split('-').slice(1).join('/'), actual: h[key], predicted: null, lower: null, upper: null }));
    forecast?.forEach(f => combined.push({ date: f.date.split('-').slice(1).join('/'), actual: null, predicted: f.predicted, lower: f.lower, upper: f.upper }));
    return combined;
  };

  const orderData = data ? formatChartData(data.orderForecast.historical, data.orderForecast.forecast, 'count') : [];
  const revenueData = data ? formatChartData(data.revenueForecast.historical, data.revenueForecast.forecast, 'amount') : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📈 Demand Forecasting</h1>
          <p className="text-gray-500 mt-2">Predict future order volumes and revenue</p>
        </div>
        <select 
          value={days} 
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value={7}>Next 7 Days</option>
          <option value={14}>Next 14 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Forecast Chart */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Order Volume Forecast</h3>
              <p className="text-sm text-gray-500">Expected trend: <span className="font-semibold text-purple-600 capitalize">{data?.orderForecast?.trend}</span></p>
            </div>
            <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
              {data?.orderForecast?.accuracy.toFixed(1)}% Accuracy
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Actual</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Predicted</div>
          </div>
        </motion.div>

        {/* Revenue Forecast Chart */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Forecast</h3>
              <p className="text-sm text-gray-500">Expected trend: <span className="font-semibold text-purple-600 capitalize">{data?.revenueForecast?.trend}</span></p>
            </div>
            <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
              {data?.revenueForecast?.accuracy.toFixed(1)}% Accuracy
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredictedRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="predicted" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorPredictedRev)" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Actual</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-pink-500"></span> Predicted</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminForecast;
