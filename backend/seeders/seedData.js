import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';

dotenv.config();

/**
 * Seed Database with Sample Restaurants and Food Items
 */
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Restaurant.deleteMany();
    await Food.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Sample Restaurants - Expanded to 16 restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Spice Paradise',
        description: 'Authentic Indian cuisine with a modern twist',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
        cuisine: ['Indian', 'North Indian', 'Mughlai'],
        rating: 4.5,
        deliveryTime: '30-40 mins',
        costForTwo: 500,
        address: { street: 'MG Road', city: 'Mumbai', pincode: '400001' }
      },
      {
        name: 'Dragon Wok',
        description: 'Sizzling Chinese and Asian delicacies',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        cuisine: ['Chinese', 'Asian', 'Thai'],
        rating: 4.3,
        deliveryTime: '25-35 mins',
        costForTwo: 450,
        address: { street: 'Linking Road', city: 'Mumbai', pincode: '400050' }
      },
      {
        name: 'Pizza Hub',
        description: 'Wood-fired pizzas and Italian favorites',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
        cuisine: ['Italian', 'Pizza', 'Pasta'],
        rating: 4.6,
        deliveryTime: '20-30 mins',
        costForTwo: 600,
        address: { street: 'Carter Road', city: 'Mumbai', pincode: '400052' }
      },
      {
        name: 'Burger Bite',
        description: 'Gourmet burgers and American classics',
        image: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=800',
        cuisine: ['American', 'Fast Food', 'Burgers'],
        rating: 4.2,
        deliveryTime: '15-25 mins',
        costForTwo: 350,
        address: { street: 'Hill Road', city: 'Mumbai', pincode: '400050' }
      },
      {
        name: 'South Spice',
        description: 'Traditional South Indian breakfast and meals',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800',
        cuisine: ['South Indian', 'Breakfast'],
        rating: 4.4,
        deliveryTime: '25-35 mins',
        costForTwo: 300,
        address: { street: 'LBS Marg', city: 'Mumbai', pincode: '400070' }
      },
      {
        name: 'Cafe Latte',
        description: 'Coffee, desserts, and continental snacks',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        cuisine: ['Cafe', 'Beverages', 'Desserts'],
        rating: 4.5,
        deliveryTime: '20-30 mins',
        costForTwo: 400,
        address: { street: 'Colaba', city: 'Mumbai', pincode: '400005' }
      },
      {
        name: 'Taco Fiesta',
        description: 'Authentic Mexican street food and tacos',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
        cuisine: ['Mexican', 'Tex-Mex', 'Latin'],
        rating: 4.4,
        deliveryTime: '20-30 mins',
        costForTwo: 450,
        address: { street: 'Bandra West', city: 'Mumbai', pincode: '400050' }
      },
      {
        name: 'Sushi Station',
        description: 'Fresh sushi and Japanese delicacies',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        cuisine: ['Japanese', 'Sushi', 'Asian'],
        rating: 4.7,
        deliveryTime: '30-40 mins',
        costForTwo: 800,
        address: { street: 'Worli', city: 'Mumbai', pincode: '400018' }
      },
      {
        name: 'Mediterranean Grill',
        description: 'Fresh and healthy Mediterranean cuisine',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
        cuisine: ['Mediterranean', 'Greek', 'Lebanese'],
        rating: 4.5,
        deliveryTime: '25-35 mins',
        costForTwo: 550,
        address: { street: 'Juhu', city: 'Mumbai', pincode: '400049' }
      },
      {
        name: 'BBQ Nation',
        description: 'Grilled meats and barbecue specialties',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
        cuisine: ['BBQ', 'Grill', 'American'],
        rating: 4.3,
        deliveryTime: '35-45 mins',
        costForTwo: 700,
        address: { street: 'Andheri', city: 'Mumbai', pincode: '400053' }
      },
      {
        name: 'Thai Orchid',
        description: 'Authentic Thai curries and noodles',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
        cuisine: ['Thai', 'Asian', 'Noodles'],
        rating: 4.6,
        deliveryTime: '30-40 mins',
        costForTwo: 500,
        address: { street: 'Powai', city: 'Mumbai', pincode: '400076' }
      },
      {
        name: 'Sweet Treats',
        description: 'Desserts, cakes, and sweet delights',
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
        cuisine: ['Desserts', 'Bakery', 'Sweets'],
        rating: 4.8,
        deliveryTime: '15-25 mins',
        costForTwo: 300,
        address: { street: 'Dadar', city: 'Mumbai', pincode: '400014' }
      },
      {
        name: 'Green Bowl',
        description: 'Healthy salads, smoothies, and bowls',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        cuisine: ['Healthy', 'Salads', 'Vegan'],
        rating: 4.4,
        deliveryTime: '20-30 mins',
        costForTwo: 400,
        address: { street: 'Lower Parel', city: 'Mumbai', pincode: '400013' }
      },
      {
        name: 'Ocean Catch',
        description: 'Fresh seafood and coastal delicacies',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        cuisine: ['Seafood', 'Coastal', 'Fish'],
        rating: 4.5,
        deliveryTime: '35-45 mins',
        costForTwo: 650,
        address: { street: 'Versova', city: 'Mumbai', pincode: '400061' }
      },
      {
        name: 'The Breakfast Club',
        description: 'All-day breakfast and brunch favorites',
        image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800',
        cuisine: ['Breakfast', 'Brunch', 'American'],
        rating: 4.6,
        deliveryTime: '20-30 mins',
        costForTwo: 350,
        address: { street: 'Khar', city: 'Mumbai', pincode: '400052' }
      },
      {
        name: 'Street Bites',
        description: 'Mumbai street food and chaat',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
        cuisine: ['Street Food', 'Chaat', 'Indian'],
        rating: 4.3,
        deliveryTime: '15-25 mins',
        costForTwo: 200,
        address: { street: 'Vile Parle', city: 'Mumbai', pincode: '400056' }
      }
    ]);

    console.log('✅ Restaurants seeded');

    // Sample Food Items for each restaurant
    const foodItems = [];

    // Spice Paradise - Indian Restaurant
    const spiceParadise = restaurants[0];
    foodItems.push(
      { restaurantId: spiceParadise._id, name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken', price: 320, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500', rating: 4.6 },
      { restaurantId: spiceParadise._id, name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection', price: 280, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500', rating: 4.5 },
      { restaurantId: spiceParadise._id, name: 'Dal Makhani', description: 'Black lentils cooked overnight with cream and butter', price: 240, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500', rating: 4.7 },
      { restaurantId: spiceParadise._id, name: 'Biryani', description: 'Fragrant basmati rice with aromatic spices', price: 350, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', rating: 4.8 },
      { restaurantId: spiceParadise._id, name: 'Gulab Jamun', description: 'Sweet milk-solid dumplings in rose syrup', price: 80, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1589828546168-1c92be25c0b1?w=500', rating: 4.4 },
      { restaurantId: spiceParadise._id, name: 'Tandoori Chicken', description: 'Chicken marinated in yogurt and spices', price: 340, category: 'Starter', isVeg: false, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500', rating: 4.7 }
    );

    // Dragon Wok - Chinese Restaurant
    const dragonWok = restaurants[1];
    foodItems.push(
      { restaurantId: dragonWok._id, name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables', price: 180, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500', rating: 4.3 },
      { restaurantId: dragonWok._id, name: 'Chilli Chicken', description: 'Spicy Indo-Chinese chicken appetizer', price: 260, category: 'Starter', isVeg: false, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500', rating: 4.5 },
      { restaurantId: dragonWok._id, name: 'Veg Manchurian', description: 'Vegetable dumplings in spicy gravy', price: 200, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500', rating: 4.2 },
      { restaurantId: dragonWok._id, name: 'Fried Rice', description: 'Wok-tossed rice with vegetables and sauces', price: 170, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500', rating: 4.1 },
      { restaurantId: dragonWok._id, name: 'Spring Rolls', description: 'Crispy vegetable-filled rolls', price: 140, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1669290965808-ae1e0f78adc3?w=500', rating: 4.4 },
      { restaurantId: dragonWok._id, name: 'Schezwan Noodles', description: 'Spicy noodles with Schezwan sauce', price: 200, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500', rating: 4.4 }
    );

    // Pizza Hub - Italian Restaurant
    const pizzaHub = restaurants[2];
    foodItems.push(
      { restaurantId: pizzaHub._id, name: 'Margherita Pizza', description: 'Classic tomato sauce, mozzarella, and basil', price: 299, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500', rating: 4.7 },
      { restaurantId: pizzaHub._id, name: 'Pepperoni Pizza', description: 'Loaded with pepperoni and cheese', price: 399, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500', rating: 4.6 },
      { restaurantId: pizzaHub._id, name: 'Pasta Alfredo', description: 'Creamy white sauce pasta', price: 280, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500', rating: 4.5 },
      { restaurantId: pizzaHub._id, name: 'Garlic Bread', description: 'Toasted bread with garlic butter', price: 120, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1573140401552-388e68f338e4?w=500', rating: 4.3 },
      { restaurantId: pizzaHub._id, name: 'Tiramisu', description: 'Italian coffee-flavored dessert', price: 180, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500', rating: 4.8 },
      { restaurantId: pizzaHub._id, name: 'Lasagna', description: 'Layered pasta with meat and cheese', price: 350, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500', rating: 4.6 }
    );

    // Burger Bite - American Restaurant
    const burgerBite = restaurants[3];
    foodItems.push(
      { restaurantId: burgerBite._id, name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, and special sauce', price: 199, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', rating: 4.4 },
      { restaurantId: burgerBite._id, name: 'Veggie Burger', description: 'Plant-based patty with fresh veggies', price: 179, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500', rating: 4.2 },
      { restaurantId: burgerBite._id, name: 'Chicken Wings', description: 'Spicy buffalo wings with ranch', price: 249, category: 'Starter', isVeg: false, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500', rating: 4.5 },
      { restaurantId: burgerBite._id, name: 'French Fries', description: 'Crispy golden fries', price: 99, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500', rating: 4.1 },
      { restaurantId: burgerBite._id, name: 'Chocolate Shake', description: 'Thick and creamy chocolate milkshake', price: 120, category: 'Beverage', isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500', rating: 4.6 },
      { restaurantId: burgerBite._id, name: 'Cheese Burger', description: 'Double cheese with beef patty', price: 229, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500', rating: 4.5 }
    );

    // South Spice - South Indian Restaurant
    const southSpice = restaurants[4];
    foodItems.push(
      { restaurantId: southSpice._id, name: 'Masala Dosa', description: 'Crispy crepe with spiced potato filling', price: 120, category: 'Breakfast', isVeg: true, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=500', rating: 4.7 },
      { restaurantId: southSpice._id, name: 'Idli Sambar', description: 'Steamed rice cakes with lentil curry', price: 90, category: 'Breakfast', isVeg: true, image: 'https://images.unsplash.com/photo-1627662168781-4e1e7c7e3a3f?w=500', rating: 4.5 },
      { restaurantId: southSpice._id, name: 'Vada', description: 'Crispy lentil fritters', price: 80, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1645696329654-e59a7d1f25c8?w=500', rating: 4.3 },
      { restaurantId: southSpice._id, name: 'Uttapam', description: 'Thick pancake with vegetable toppings', price: 110, category: 'Breakfast', isVeg: true, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500', rating: 4.4 },
      { restaurantId: southSpice._id, name: 'Filter Coffee', description: 'Traditional South Indian filter coffee', price: 50, category: 'Beverage', isVeg: true, image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=500', rating: 4.8 },
      { restaurantId: southSpice._id, name: 'Rava Dosa', description: 'Crispy semolina crepe', price: 130, category: 'Breakfast', isVeg: true, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500', rating: 4.6 }
    );

    // Cafe Latte - Cafe
    const cafeLatte = restaurants[5];
    foodItems.push(
      { restaurantId: cafeLatte._id, name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 150, category: 'Beverage', isVeg: true, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500', rating: 4.6 },
      { restaurantId: cafeLatte._id, name: 'Latte', description: 'Smooth espresso with steamed milk', price: 140, category: 'Beverage', isVeg: true, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500', rating: 4.5 },
      { restaurantId: cafeLatte._id, name: 'Croissant', description: 'Buttery, flaky French pastry', price: 100, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500', rating: 4.4 },
      { restaurantId: cafeLatte._id, name: 'Brownie', description: 'Rich chocolate brownie', price: 120, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1604522808190-c8b131875ebc?w=500', rating: 4.7 },
      { restaurantId: cafeLatte._id, name: 'Sandwich', description: 'Grilled vegetable sandwich', price: 180, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500', rating: 4.3 },
      { restaurantId: cafeLatte._id, name: 'Cheesecake', description: 'Creamy New York style cheesecake', price: 200, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500', rating: 4.8 }
    );

    // Taco Fiesta - Mexican Restaurant
    const tacoFiesta = restaurants[6];
    foodItems.push(
      { restaurantId: tacoFiesta._id, name: 'Chicken Tacos', description: 'Soft tacos with grilled chicken and salsa', price: 220, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500', rating: 4.5 },
      { restaurantId: tacoFiesta._id, name: 'Veggie Burrito', description: 'Wrapped tortilla with beans and vegetables', price: 200, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500', rating: 4.3 },
      { restaurantId: tacoFiesta._id, name: 'Nachos', description: 'Tortilla chips with cheese and jalapeños', price: 180, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500', rating: 4.4 },
      { restaurantId: tacoFiesta._id, name: 'Quesadilla', description: 'Grilled tortilla with cheese filling', price: 190, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500', rating: 4.2 },
      { restaurantId: tacoFiesta._id, name: 'Guacamole', description: 'Fresh avocado dip with chips', price: 150, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1623961990059-e6a1cb4e8d4c?w=500', rating: 4.6 }
    );

    // Sushi Station - Japanese Restaurant
    const sushiStation = restaurants[7];
    foodItems.push(
      { restaurantId: sushiStation._id, name: 'California Roll', description: 'Crab, avocado, and cucumber sushi roll', price: 380, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500', rating: 4.7 },
      { restaurantId: sushiStation._id, name: 'Salmon Nigiri', description: 'Fresh salmon on pressed rice', price: 420, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500', rating: 4.8 },
      { restaurantId: sushiStation._id, name: 'Vegetable Tempura', description: 'Lightly battered and fried vegetables', price: 280, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500', rating: 4.5 },
      { restaurantId: sushiStation._id, name: 'Miso Soup', description: 'Traditional Japanese soup with tofu', price: 150, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500', rating: 4.4 },
      { restaurantId: sushiStation._id, name: 'Ramen Bowl', description: 'Noodle soup with vegetables and egg', price: 350, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500', rating: 4.6 }
    );

    // Mediterranean Grill - Mediterranean Restaurant
    const mediterraneanGrill = restaurants[8];
    foodItems.push(
      { restaurantId: mediterraneanGrill._id, name: 'Falafel Wrap', description: 'Crispy chickpea balls in pita bread', price: 220, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500', rating: 4.5 },
      { restaurantId: mediterraneanGrill._id, name: 'Hummus Platter', description: 'Chickpea dip with pita bread', price: 180, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1571096123935-1f9c4c5e1a2f?w=500', rating: 4.6 },
      { restaurantId: mediterraneanGrill._id, name: 'Greek Salad', description: 'Fresh vegetables with feta cheese', price: 200, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500', rating: 4.4 },
      { restaurantId: mediterraneanGrill._id, name: 'Shawarma', description: 'Grilled meat wrapped in flatbread', price: 250, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500', rating: 4.7 },
      { restaurantId: mediterraneanGrill._id, name: 'Baklava', description: 'Sweet pastry with nuts and honey', price: 120, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500', rating: 4.8 }
    );

    // BBQ Nation - BBQ Restaurant
    const bbqNation = restaurants[9];
    foodItems.push(
      { restaurantId: bbqNation._id, name: 'BBQ Ribs', description: 'Slow-cooked pork ribs with BBQ sauce', price: 450, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', rating: 4.6 },
      { restaurantId: bbqNation._id, name: 'Grilled Chicken', description: 'Marinated and grilled chicken pieces', price: 380, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500', rating: 4.5 },
      { restaurantId: bbqNation._id, name: 'Corn on Cob', description: 'Grilled corn with butter and spices', price: 120, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1551462147-37a217a0f40b?w=500', rating: 4.3 },
      { restaurantId: bbqNation._id, name: 'Grilled Vegetables', description: 'Assorted vegetables on skewers', price: 200, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=500', rating: 4.4 },
      { restaurantId: bbqNation._id, name: 'Pulled Pork Sandwich', description: 'Slow-cooked pork in a bun', price: 320, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1619740455993-9e8c4e8d8f2e?w=500', rating: 4.7 }
    );

    // Thai Orchid - Thai Restaurant
    const thaiOrchid = restaurants[10];
    foodItems.push(
      { restaurantId: thaiOrchid._id, name: 'Pad Thai', description: 'Stir-fried rice noodles with peanuts', price: 280, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500', rating: 4.6 },
      { restaurantId: thaiOrchid._id, name: 'Green Curry', description: 'Spicy coconut curry with vegetables', price: 300, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500', rating: 4.7 },
      { restaurantId: thaiOrchid._id, name: 'Tom Yum Soup', description: 'Hot and sour Thai soup', price: 180, category: 'Starter', isVeg: false, image: 'https://images.unsplash.com/photo-1547928576-4a1f8f3a9f06?w=500', rating: 4.5 },
      { restaurantId: thaiOrchid._id, name: 'Spring Rolls', description: 'Fresh vegetable rolls with peanut sauce', price: 150, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1669290965808-ae1e0f78adc3?w=500', rating: 4.4 },
      { restaurantId: thaiOrchid._id, name: 'Mango Sticky Rice', description: 'Sweet rice with fresh mango', price: 140, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=500', rating: 4.8 }
    );

    // Sweet Treats - Dessert Shop
    const sweetTreats = restaurants[11];
    foodItems.push(
      { restaurantId: sweetTreats._id, name: 'Chocolate Cake', description: 'Rich chocolate layer cake', price: 180, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', rating: 4.8 },
      { restaurantId: sweetTreats._id, name: 'Red Velvet Cupcake', description: 'Classic red velvet with cream cheese frosting', price: 100, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500', rating: 4.7 },
      { restaurantId: sweetTreats._id, name: 'Ice Cream Sundae', description: 'Vanilla ice cream with toppings', price: 150, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500', rating: 4.6 },
      { restaurantId: sweetTreats._id, name: 'Macarons', description: 'French almond meringue cookies', price: 120, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500', rating: 4.9 },
      { restaurantId: sweetTreats._id, name: 'Donuts', description: 'Glazed donuts with sprinkles', price: 80, category: 'Dessert', isVeg: true, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500', rating: 4.5 }
    );

    // Green Bowl - Healthy Food
    const greenBowl = restaurants[12];
    foodItems.push(
      { restaurantId: greenBowl._id, name: 'Buddha Bowl', description: 'Quinoa with roasted vegetables', price: 280, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500', rating: 4.6 },
      { restaurantId: greenBowl._id, name: 'Acai Bowl', description: 'Acai berries with granola and fruits', price: 250, category: 'Breakfast', isVeg: true, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500', rating: 4.7 },
      { restaurantId: greenBowl._id, name: 'Green Smoothie', description: 'Spinach, banana, and almond milk', price: 180, category: 'Beverage', isVeg: true, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500', rating: 4.5 },
      { restaurantId: greenBowl._id, name: 'Kale Salad', description: 'Fresh kale with lemon dressing', price: 200, category: 'Starter', isVeg: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500', rating: 4.4 },
      { restaurantId: greenBowl._id, name: 'Protein Bowl', description: 'Grilled chicken with quinoa and veggies', price: 320, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500', rating: 4.6 }
    );

    // Ocean Catch - Seafood Restaurant
    const oceanCatch = restaurants[13];
    foodItems.push(
      { restaurantId: oceanCatch._id, name: 'Fish and Chips', description: 'Battered fish with crispy fries', price: 380, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=500', rating: 4.5 },
      { restaurantId: oceanCatch._id, name: 'Prawn Curry', description: 'Spicy coastal prawn curry', price: 420, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=500', rating: 4.7 },
      { restaurantId: oceanCatch._id, name: 'Grilled Salmon', description: 'Fresh salmon with lemon butter', price: 480, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500', rating: 4.8 },
      { restaurantId: oceanCatch._id, name: 'Calamari Rings', description: 'Crispy fried squid rings', price: 320, category: 'Starter', isVeg: false, image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=500', rating: 4.4 },
      { restaurantId: oceanCatch._id, name: 'Lobster Roll', description: 'Lobster meat in a toasted bun', price: 550, category: 'Main Course', isVeg: false, image: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=500', rating: 4.9 }
    );

    // The Breakfast Club - Breakfast Restaurant
    const breakfastClub = restaurants[14];
    foodItems.push(
      { restaurantId: breakfastClub._id, name: 'Pancakes', description: 'Fluffy pancakes with maple syrup', price: 180, category: 'Breakfast', isVeg: true, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500', rating: 4.6 },
      { restaurantId: breakfastClub._id, name: 'Eggs Benedict', description: 'Poached eggs with hollandaise sauce', price: 220, category: 'Breakfast', isVeg: false, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500', rating: 4.7 },
      { restaurantId: breakfastClub._id, name: 'French Toast', description: 'Brioche bread with cinnamon sugar', price: 170, category: 'Breakfast', isVeg: true, image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500', rating: 4.5 },
      { restaurantId: breakfastClub._id, name: 'Avocado Toast', description: 'Smashed avocado on sourdough', price: 200, category: 'Breakfast', isVeg: true, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500', rating: 4.8 },
      { restaurantId: breakfastClub._id, name: 'Breakfast Burrito', description: 'Eggs, beans, and cheese wrapped', price: 210, category: 'Breakfast', isVeg: false, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500', rating: 4.6 }
    );

    // Street Bites - Street Food
    const streetBites = restaurants[15];
    foodItems.push(
      { restaurantId: streetBites._id, name: 'Pani Puri', description: 'Crispy shells with spicy water', price: 60, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', rating: 4.7 },
      { restaurantId: streetBites._id, name: 'Pav Bhaji', description: 'Spiced vegetable curry with bread', price: 100, category: 'Main Course', isVeg: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500', rating: 4.6 },
      { restaurantId: streetBites._id, name: 'Vada Pav', description: 'Potato fritter in a bun', price: 40, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500', rating: 4.5 },
      { restaurantId: streetBites._id, name: 'Bhel Puri', description: 'Puffed rice with chutneys', price: 70, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500', rating: 4.4 },
      { restaurantId: streetBites._id, name: 'Dabeli', description: 'Spiced potato filling in pav', price: 50, category: 'Snack', isVeg: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', rating: 4.6 }
    );

    await Food.insertMany(foodItems);
    console.log('✅ Food items seeded');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Total Restaurants: ${restaurants.length}`);
    console.log(`📊 Total Food Items: ${foodItems.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
