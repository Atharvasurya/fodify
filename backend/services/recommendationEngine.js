import Order from '../models/Order.js';
import Food from '../models/Food.js';
import Restaurant from '../models/Restaurant.js';

export const buildUserProfile = async (userId) => {
  const orders = await Order.find({ userId }).populate('items.foodId');
  
  if (!orders || orders.length === 0) {
    return { favoriteCuisines: [], preferredPriceRange: { min: 0, max: 1000 }, vegPreference: 0.5, favoriteCategories: [], orderFrequency: 0, totalOrders: 0, averageOrderValue: 0 };
  }
  
  const cuisineCounts = {};
  const categoryCounts = {};
  let vegItems = 0;
  let totalItems = 0;
  let totalSpend = 0;
  const prices = [];
  
  for (const order of orders) {
    totalSpend += order.totalAmount;
    if (order.restaurantId) {
      const restaurant = await Restaurant.findById(order.restaurantId);
      if (restaurant && restaurant.cuisine) {
        restaurant.cuisine.forEach(c => {
          cuisineCounts[c] = (cuisineCounts[c] || 0) + 1;
        });
      }
    }
    
    order.items.forEach(item => {
      const food = item.foodId;
      if (food) {
        prices.push(food.price);
        categoryCounts[food.category] = (categoryCounts[food.category] || 0) + item.quantity;
        if (food.isVeg) vegItems += item.quantity;
        totalItems += item.quantity;
      }
    });
  }
  
  const favoriteCuisines = Object.keys(cuisineCounts).sort((a,b) => cuisineCounts[b] - cuisineCounts[a]).slice(0, 3);
  const favoriteCategories = Object.keys(categoryCounts).sort((a,b) => categoryCounts[b] - categoryCounts[a]).slice(0, 3);
  const vegPreference = totalItems > 0 ? vegItems / totalItems : 0.5;
  
  prices.sort((a,b) => a - b);
  const minPrice = prices.length > 0 ? prices[Math.floor(prices.length * 0.1)] : 0;
  const maxPrice = prices.length > 0 ? prices[Math.floor(prices.length * 0.9)] : 1000;
  
  return {
    favoriteCuisines,
    preferredPriceRange: { min: minPrice, max: maxPrice },
    vegPreference,
    favoriteCategories,
    orderFrequency: orders.length,
    totalOrders: orders.length,
    averageOrderValue: totalSpend / orders.length
  };
};

export const contentBasedScore = async (userProfile, foodItem) => {
  let score = 0;
  const reasons = [];
  
  // Veg preference
  if (userProfile.vegPreference > 0.8 && foodItem.isVeg) {
    score += 0.3;
    reasons.push('Matches your vegetarian preference');
  } else if (userProfile.vegPreference < 0.2 && !foodItem.isVeg) {
    score += 0.3;
    reasons.push('Matches your non-veg preference');
  }
  
  // Price range
  if (foodItem.price >= userProfile.preferredPriceRange.min && foodItem.price <= userProfile.preferredPriceRange.max) {
    score += 0.2;
    reasons.push('In your typical price range');
  }
  
  // Category
  if (userProfile.favoriteCategories.includes(foodItem.category)) {
    score += 0.3;
    reasons.push(`You often order ${foodItem.category}`);
  }
  
  // Cuisine
  const restaurant = await Restaurant.findById(foodItem.restaurantId);
  if (restaurant && restaurant.cuisine) {
    const matchingCuisine = restaurant.cuisine.find(c => userProfile.favoriteCuisines.includes(c));
    if (matchingCuisine) {
      score += 0.2;
      reasons.push(`Matches your love for ${matchingCuisine} cuisine`);
    }
  }
  
  return { score: Math.min(1, score), reasons };
};

export const collaborativeScore = async (userId, allOrders) => {
  // Simplified collaborative filtering: find top 5 foods ordered across all users
  const foodCounts = {};
  allOrders.forEach(o => {
    o.items.forEach(i => {
      if(i.foodId) {
        const id = i.foodId._id ? i.foodId._id.toString() : i.foodId.toString();
        foodCounts[id] = (foodCounts[id] || 0) + i.quantity;
      }
    });
  });
  return foodCounts;
};

export const hybridRecommend = async (userId, limit = 10) => {
  const userProfile = await buildUserProfile(userId);
  const allOrders = await Order.find().populate('items.foodId');
  const collabScores = await collaborativeScore(userId, allOrders);
  
  const allFoods = await Food.find({ isAvailable: true }).populate('restaurantId', 'name cuisine');
  
  const scoredFoods = [];
  
  for (const food of allFoods) {
    const cb = await contentBasedScore(userProfile, food);
    
    let collab = 0;
    const foodIdStr = food._id.toString();
    if (collabScores[foodIdStr]) {
      collab = Math.min(1, collabScores[foodIdStr] / 20); // normalize
      if(collab > 0.5 && !cb.reasons.includes('Popular among users')) {
          cb.reasons.push('Popular among users');
      }
    }
    
    const popularity = food.rating ? food.rating / 5 : 0.8;
    
    const finalScore = (cb.score * 0.6) + (collab * 0.3) + (popularity * 0.1);
    
    if (finalScore > 0.3) {
      scoredFoods.push({
        food,
        score: Math.round(finalScore * 100),
        reasons: cb.reasons.length > 0 ? cb.reasons : ['Highly rated']
      });
    }
  }
  
  scoredFoods.sort((a, b) => b.score - a.score);
  return scoredFoods.slice(0, limit);
};

export const getGuestRecommendations = async (limit = 10) => {
  const foods = await Food.find({ isAvailable: true }).sort({ rating: -1 }).limit(limit).populate('restaurantId', 'name');
  return foods.map(f => ({
    food: f,
    score: Math.round((f.rating / 5) * 100),
    reasons: ['Popular choice', 'Highly rated']
  }));
};

export const getSmartReorderSuggestions = async (userId, limit = 5) => {
  const orders = await Order.find({ userId }).populate('items.foodId').populate('restaurantId', 'name');
  
  const itemFreq = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.foodId) {
        const id = item.foodId._id.toString();
        if (!itemFreq[id]) {
          itemFreq[id] = { food: item.foodId, count: 0, lastOrder: order.orderDate, restaurant: order.restaurantId };
        }
        itemFreq[id].count += item.quantity;
        if (new Date(order.orderDate) > new Date(itemFreq[id].lastOrder)) {
          itemFreq[id].lastOrder = order.orderDate;
        }
      }
    });
  });
  
  const suggestions = Object.values(itemFreq)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(item => {
      const day = new Date(item.lastOrder).getDay();
      const days = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
      return {
        food: item.food,
        orderCount: item.count,
        lastOrdered: item.lastOrder,
        timingInsight: `You often order this on ${days[day]}!`,
        restaurant: item.restaurant
      };
    });
    
  return suggestions;
};
