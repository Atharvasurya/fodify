import mongoose from 'mongoose';

/**
 * Notification Schema
 * Stores admin notifications for important events
 */
const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['new_order', 'order_cancelled', 'new_review', 'new_restaurant_signup', 'new_issue'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for unread notifications
notificationSchema.index({ isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
