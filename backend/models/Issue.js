import mongoose from 'mongoose';

/**
 * Issue Schema
 * Stores customer complaints and support tickets
 */
const issueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  category: {
    type: String,
    enum: ['delivery_delay', 'food_quality', 'payment_issue', 'wrong_order', 'missing_items', 'other'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Issue description is required']
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  adminNotes: {
    type: String,
    default: null
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for filtering
issueSchema.index({ status: 1, createdAt: -1 });
issueSchema.index({ userId: 1 });

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
