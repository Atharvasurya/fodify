import mongoose from 'mongoose';

/**
 * Order Schema
 * Stores order details with user and restaurant references
 */
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  items: [{
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: 0
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryTime: {
    type: String,
    default: '30-40 mins'
  },
  deliveredAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  },
  cancelledAt: {
    type: Date
  }
});

// Add timestamps for createdAt and updatedAt
orderSchema.set('timestamps', true);

// Index for efficient user order queries
orderSchema.index({ userId: 1, orderDate: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
