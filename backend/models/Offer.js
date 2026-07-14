import mongoose from 'mongoose';

/**
 * Offer Schema
 * Stores discount offers for food items and restaurants
 */
const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Offer description is required']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    required: true
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: 0
  },
  applicableTo: {
    type: String,
    enum: ['food', 'restaurant'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'applicableTo',
    required: true
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for active offers
offerSchema.index({ isActive: 1, validUntil: 1 });
offerSchema.index({ applicableTo: 1, targetId: 1 });

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
