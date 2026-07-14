import mongoose from 'mongoose';

/**
 * Restaurant Schema
 * Stores restaurant details, location, and metadata
 */
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
  },
  cuisine: {
    type: [String],
    default: ['Multi-Cuisine']
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },
  deliveryTime: {
    type: String,
    default: '30-40 mins'
  },
  costForTwo: {
    type: Number,
    default: 400
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: 'Mumbai' },
    pincode: { type: String, default: '' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  businessType: {
    type: String,
    enum: ['food', 'grocery'],
    default: 'food'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better search performance
restaurantSchema.index({ name: 'text', cuisine: 1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
