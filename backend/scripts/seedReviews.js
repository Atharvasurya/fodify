import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';

dotenv.config();

/**
 * Seed Script for Sample Reviews
 * Adds realistic sample reviews for restaurants
 */

const sampleReviews = [
  {
    comment: "Absolutely amazing food! The pasta was cooked to perfection and the sauce was incredible. Will definitely order again!",
    rating: 5,
    isPublic: true
  },
  {
    comment: "Great experience overall. Food arrived hot and fresh. The pizza was delicious with generous toppings.",
    rating: 5,
    isPublic: true
  },
  {
    comment: "Very good food and quick delivery. The biryani was flavorful and had the right amount of spice.",
    rating: 4,
    isPublic: true
  },
  {
    comment: "Tasty food but delivery took a bit longer than expected. Still worth it though!",
    rating: 4,
    isPublic: true
  },
  {
    comment: "Loved the desserts! The chocolate cake was moist and rich. Perfect ending to a meal.",
    rating: 5,
    isPublic: true
  },
  {
    comment: "Good quality food at reasonable prices. The portions were generous too.",
    rating: 4,
    isPublic: true
  },
  {
    comment: "Excellent service and delicious food. The burger was juicy and cooked perfectly.",
    rating: 5,
    isPublic: true
  },
  {
    comment: "Nice variety on the menu. Tried the noodles and they were really good!",
    rating: 4,
    isPublic: true
  },
  {
    comment: "Fresh ingredients and authentic taste. The curry was spot on!",
    rating: 5,
    isPublic: true
  },
  {
    comment: "Decent food, good packaging. Everything arrived in perfect condition.",
    rating: 4,
    isPublic: true
  },
  {
    comment: "The sandwiches were fresh and tasty. Great for a quick lunch!",
    rating: 4,
    isPublic: true
  },
  {
    comment: "Fantastic restaurant! The food quality is consistently excellent.",
    rating: 5,
    isPublic: true
  },
  {
    comment: "Really enjoyed my meal. The flavors were well-balanced and delicious.",
    rating: 5,
    isPublic: true
  },
  {
    comment: "Good food but could use a bit more seasoning. Still a solid choice though.",
    rating: 3,
    isPublic: true
  },
  {
    comment: "Impressed with the quality! Will be ordering from here regularly.",
    rating: 5,
    isPublic: true
  }
];

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');

    // Get all restaurants
    const restaurants = await Restaurant.find().limit(10);

    if (restaurants.length === 0) {
      console.log('❌ No restaurants found. Please seed restaurants first.');
      process.exit(1);
    }

    // Get or create sample users
    let users = await User.find({ role: 'user' }).limit(5);

    if (users.length === 0) {
      console.log('📝 No users found. Creating sample users...');
      const sampleUsers = [
        { name: 'Alice Smith', email: 'alice@example.com', password: 'password123', role: 'user' },
        { name: 'Bob Johnson', email: 'bob@example.com', password: 'password123', role: 'user' },
        { name: 'Carol Williams', email: 'carol@example.com', password: 'password123', role: 'user' },
        { name: 'David Brown', email: 'david@example.com', password: 'password123', role: 'user' },
        { name: 'Emma Davis', email: 'emma@example.com', password: 'password123', role: 'user' }
      ];

      users = await User.insertMany(sampleUsers);
      console.log(`✅ Created ${users.length} sample users`);
    }

    console.log(`Found ${restaurants.length} restaurants and ${users.length} users`);

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing reviews');

    // Create reviews
    const reviews = [];
    let reviewIndex = 0;

    for (const restaurant of restaurants) {
      // Add 2-3 reviews per restaurant
      const numReviews = Math.floor(Math.random() * 2) + 2; // 2-3 reviews

      for (let i = 0; i < numReviews && reviewIndex < sampleReviews.length; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const reviewData = sampleReviews[reviewIndex];

        reviews.push({
          userId: randomUser._id,
          restaurantId: restaurant._id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          isPublic: reviewData.isPublic,
          status: 'approved', // Auto-approve sample reviews
          isApproved: true,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        });

        reviewIndex++;
      }
    }

    await Review.insertMany(reviews);
    console.log(`✅ Created ${reviews.length} sample reviews`);
    console.log('🎉 Sample reviews seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
};

seedReviews();
