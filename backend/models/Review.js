import mongoose from 'mongoose';

/**
 * Review Schema
 * Stores customer reviews for restaurants and food items
 */
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    default: null
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  isPublic: {
    type: Boolean,
    default: true,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  flagReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
reviewSchema.index({ restaurantId: 1, status: 1 });
reviewSchema.index({ userId: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
