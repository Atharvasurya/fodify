import Order from '../models/Order.js';

/**
 * Auto-progress orders through stages
 * Timeline:
 * - 0 min: Order Placed (pending)
 * - 1 min: Confirmed
 * - 3 min: Preparing
 * - 6 min: Out for Delivery
 * - 10 min: Delivered
 */
export const autoProgressOrders = async () => {
  try {
    const now = new Date();
    let updatedCount = 0;

    // 1. Pending → Confirmed (after 1 minute)
    const pendingOrders = await Order.find({
      status: 'pending',
      createdAt: { $lte: new Date(now - 1 * 60 * 1000) }
    });

    for (const order of pendingOrders) {
      order.status = 'confirmed';
      await order.save();
      updatedCount++;
      console.log(`✅ Order ${order._id.toString().slice(-6)} → Confirmed`);
    }

    // 2. Confirmed → Preparing (after 3 minutes)
    const confirmedOrders = await Order.find({
      status: 'confirmed',
      createdAt: { $lte: new Date(now - 3 * 60 * 1000) }
    });

    for (const order of confirmedOrders) {
      order.status = 'preparing';
      await order.save();
      updatedCount++;
      console.log(`👨‍🍳 Order ${order._id.toString().slice(-6)} → Preparing`);
    }

    // 3. Preparing → Out for Delivery (after 6 minutes)
    const preparingOrders = await Order.find({
      status: 'preparing',
      createdAt: { $lte: new Date(now - 6 * 60 * 1000) }
    });

    for (const order of preparingOrders) {
      order.status = 'out_for_delivery';
      await order.save();
      updatedCount++;
      console.log(`🚚 Order ${order._id.toString().slice(-6)} → Out for Delivery`);
    }

    // 4. Out for Delivery → Delivered (after 10 minutes)
    const outForDeliveryOrders = await Order.find({
      status: 'out_for_delivery',
      createdAt: { $lte: new Date(now - 10 * 60 * 1000) }
    });

    for (const order of outForDeliveryOrders) {
      order.status = 'delivered';
      order.deliveredAt = new Date();
      await order.save();
      updatedCount++;
      console.log(`📦 Order ${order._id.toString().slice(-6)} → Delivered`);
    }

    if (updatedCount > 0) {
      console.log(`\n🔄 Auto-progressed ${updatedCount} order(s)\n`);
    }
  } catch (error) {
    console.error('Auto-progress error:', error);
  }
};

/**
 * Start the auto-progression scheduler
 * Runs every 30 seconds for smooth transitions
 */
export const startAutoDeliveryScheduler = () => {
  console.log('🚀 Auto-delivery scheduler started');
  console.log('📋 Order progression timeline:');
  console.log('   0 min  → Pending');
  console.log('   1 min  → Confirmed');
  console.log('   3 min  → Preparing');
  console.log('   6 min  → Out for Delivery');
  console.log('   10 min → Delivered\n');

  // Run immediately on start
  autoProgressOrders();

  // Then run every 30 seconds
  setInterval(autoProgressOrders, 30 * 1000);
};
