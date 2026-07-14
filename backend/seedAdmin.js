import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

/**
 * Create Admin User
 * Run this script to create a default admin account
 * Usage: node seedAdmin.js
 */

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@fodify.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('   Email: admin@fodify.com');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Fodify Admin',
      email: 'admin@fodify.com',
      password: 'Admin@123',
      phone: '9999999999',
      role: 'admin',
      isBlocked: false
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@fodify.com');
    console.log('🔑 Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdmin();
