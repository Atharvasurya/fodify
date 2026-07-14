import Order from '../models/Order.js';
import { createNotification } from '../routes/notificationRoutes.js';

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress, paymentMethod } = req.body;

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required'
      });
    }

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'COD'
    });

    // Populate order details
    await order.populate('restaurantId', 'name image');
    await order.populate('userId', 'name');

    // Create notification for admin
    await createNotification(
      'new_order',
      `New order #${order.orderNumber} from ${order.userId.name} - ₹${totalAmount}`,
      {
        orderId: order._id,
        userId: req.user._id,
        restaurantId,
        priority: 'high'
      }
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating order'
    });
  }
};

/**
 * @desc    Get user orders
 * @route   GET /api/orders/user
 * @access  Private
 */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('restaurantId', 'name image')
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching orders'
    });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId', 'name image address')
      .populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user can only access their own orders
    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order'
    });
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;

    // Update payment status if delivered
    if (status === 'delivered' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'completed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating order status'
    });
  }
};

/**
 * @desc    Cancel order by user
 * @route   PATCH /api/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify user owns this order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled (not already delivered or cancelled)
    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a delivered order'
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancellationReason = reason || 'No reason provided';
    order.cancelledAt = new Date();

    await order.save();

    // Populate user details for notification
    await order.populate('userId', 'name');

    // Create notification for admin
    await createNotification(
      'order_cancelled',
      `Order #${order.orderNumber} was cancelled by ${order.userId.name}`,
      {
        orderId: order._id,
        userId: req.user._id,
        priority: 'medium'
      }
    );

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling order'
    });
  }
};
