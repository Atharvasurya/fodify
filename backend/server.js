import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { startAutoDeliveryScheduler } from './utils/autoDelivery.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Start auto-delivery scheduler
startAutoDeliveryScheduler();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? true  // Allow all origins in production (Vercel, etc.)
    : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/admin/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🍔 Welcome to Fodify API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      restaurants: '/api/restaurants',
      foods: '/api/foods',
      orders: '/api/orders'
    }
  });
});

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Temporary Seeding Endpoint
app.get('/api/seed', (req, res) => {
  res.json({ message: 'Seeding triggered. Check server logs for progress.' });
  
  const seedProcess = spawn('node', ['seeders/seedData.js'], { cwd: __dirname, stdio: 'inherit' });
  seedProcess.on('close', (code) => {
    console.log(`Restaurants seed process exited with code ${code}`);
    if (code === 0) {
      const groceryProcess = spawn('node', ['scripts/seedGroceries.js'], { cwd: __dirname, stdio: 'inherit' });
      groceryProcess.on('close', (code) => {
        console.log(`Groceries seed process exited with code ${code}`);
      });
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}`);
  console.log(`\n✨ Fodify Backend is ready!\n`);
});
