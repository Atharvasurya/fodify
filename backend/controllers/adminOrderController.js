import Order from '../models/Order.js';
import Notification from '../models/Notification.js';

/**
 * @desc    Get all orders with filters
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query._id = search;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('restaurantId', 'name image')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching orders'
    });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/admin/orders/:id
 * @access  Private/Admin
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('restaurantId', 'name image address phone')
      .populate('items.foodId', 'name price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order'
    });
  }
};

/**
 * @desc    Update order status
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
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

    // Set deliveredAt timestamp when order is marked as delivered
    if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    // Set cancelledAt timestamp when order is cancelled
    if (status === 'cancelled' && !order.cancelledAt) {
      order.cancelledAt = new Date();
    }

    await order.save();

    // Create notification for status change
    if (status === 'delivered' || status === 'cancelled') {
      await Notification.create({
        type: status === 'delivered' ? 'order_delivered' : 'order_cancelled',
        message: `Order #${order._id} has been ${status}`,
        orderId: order._id,
        userId: order.userId
      });
    }

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
