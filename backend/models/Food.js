import mongoose from 'mongoose';

/**
 * Food Schema
 * Stores food items with restaurant reference
 */
const foodSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  description: {
    type: String,
    default: 'Delicious food item'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
  },
  category: {
    type: String,
    default: 'Main Course'
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },
  itemType: {
    type: String,
    enum: ['food', 'grocery'],
    default: 'food'
  },
  unit: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying by restaurant
foodSchema.index({ restaurantId: 1, category: 1 });

const Food = mongoose.model('Food', foodSchema);

export default Food;
