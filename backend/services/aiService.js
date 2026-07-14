import Food from '../models/Food.js';
import Order from '../models/Order.js';

export const getMoodSuggestions = async (mood) => {
  let searchFilters = { isAvailable: true };
  let reasoning = '';
  let emoji = '😐';
  let description = '';

  switch (mood.toLowerCase()) {
    case 'happy':
      searchFilters.category = { $in: ['Dessert', 'Snack', 'Starter'] };
      reasoning = 'Celebratory foods and sweet treats to keep the good vibes going!';
      emoji = '😊';
      description = 'Keep the good times rolling with these treats.';
      break;
    case 'sad':
      searchFilters.category = 'Main Course';
      reasoning = 'Warm, comforting main courses like biryani or pasta to hug your soul.';
      emoji = '😢';
      description = 'Comfort food to make everything better.';
      break;
    case 'stressed':
      searchFilters.category = { $in: ['Dessert', 'Beverage'] };
      reasoning = 'Sweet and indulgent items to help you relax and de-stress.';
      emoji = '😰';
      description = 'Indulge a little, you deserve a break.';
      break;
    case 'adventurous':
      searchFilters.isVeg = false;
      searchFilters.category = { $in: ['Starter', 'Snack'] };
      reasoning = 'Spicy and exotic non-veg starters for your adventurous palate.';
      emoji = '🤠';
      description = 'Try something new and exciting today.';
      break;
    case 'romantic':
      searchFilters.category = { $in: ['Dessert', 'Main Course'] };
      searchFilters.price = { $gte: 300 };
      reasoning = 'Premium main courses and desserts for a perfect date night.';
      emoji = '🥰';
      description = 'Set the mood with these premium choices.';
      break;
    case 'lazy':
      reasoning = 'Quick and easy foods that arrive fast and require zero effort.';
      emoji = '😴';
      description = 'Zero effort required. Just eat and chill.';
      break;
    case 'energetic':
      searchFilters.isVeg = true;
      reasoning = 'Healthy, light vegetarian options to keep your energy up.';
      emoji = '💪';
      description = 'Fuel your body with these healthy picks.';
      break;
    case 'celebrating':
      searchFilters.price = { $gte: 400 };
      reasoning = 'The highest rated premium dishes for your special moment.';
      emoji = '🎉';
      description = 'Go all out with these top-rated dishes.';
      break;
    default:
      reasoning = 'Popular choices that everyone loves.';
  }

  let foods = await Food.find(searchFilters).populate('restaurantId', 'name').limit(6).sort({ rating: -1 });
  if (foods.length === 0) {
      foods = await Food.find({ isAvailable: true }).limit(6);
  }

  return { mood, description, emoji, foods, reasoning };
};

export const parseNaturalLanguageQuery = async (query) => {
  const q = query.toLowerCase();
  const filters = { isAvailable: true };
  const parsedFilters = {};
  let interpretation = [];

  // Price
  if (q.includes('under 200') || q.includes('cheap') || q.includes('budget')) {
    filters.price = { $lte: 200 };
    parsedFilters.maxPrice = 200;
    interpretation.push('budget-friendly');
  } else if (q.includes('above 500') || q.includes('expensive')) {
    filters.price = { $gte: 500 };
    parsedFilters.minPrice = 500;
    interpretation.push('premium');
  }

  // Dietary
  if (q.includes('non-veg') || q.includes('nonveg') || q.includes('chicken') || q.includes('mutton') || q.includes('fish') || q.includes('meat')) {
    filters.isVeg = false;
    parsedFilters.isVeg = false;
    interpretation.push('non-vegetarian');
  } else if (q.includes('veg') && !q.includes('non-veg') && !q.includes('nonveg')) {
    filters.isVeg = true;
    parsedFilters.isVeg = true;
    interpretation.push('vegetarian');
  }

  // Category
  const categories = ['Breakfast', 'Dessert', 'Beverage', 'Snack', 'Starter', 'Main Course'];
  for (const cat of categories) {
    if (q.includes(cat.toLowerCase()) || (cat === 'Beverage' && q.includes('drink'))) {
      filters.category = cat;
      parsedFilters.category = cat;
      interpretation.push(cat.toLowerCase());
      break;
    }
  }

  // Name/Description search for descriptors
  const keywords = q.split(' ').filter(w => !['under', 'above', 'veg', 'non-veg', 'cheap', 'food', 'something', 'options'].includes(w) && w.length > 2);
  if (keywords.length > 0) {
    filters.$or = [
      { name: { $regex: keywords.join('|'), $options: 'i' } },
      { description: { $regex: keywords.join('|'), $options: 'i' } }
    ];
  }

  const results = await Food.find(filters).populate('restaurantId', 'name').limit(10);
  
  return {
    parsedFilters,
    interpretation: interpretation.length > 0 ? `Looking for ${interpretation.join(' ')} options` : `Looking for "${query}"`,
    results
  };
};

export const getFoodPairings = async (foodId) => {
  const food = await Food.findById(foodId);
  if (!food) return { pairings: [], message: 'Food not found' };

  let pairCategory = [];
  switch (food.category) {
    case 'Starter': pairCategory = ['Main Course', 'Beverage']; break;
    case 'Main Course': pairCategory = ['Starter', 'Dessert', 'Beverage']; break;
    case 'Dessert': pairCategory = ['Beverage']; break;
    case 'Beverage': pairCategory = ['Snack', 'Starter']; break;
    case 'Snack': pairCategory = ['Beverage']; break;
    default: pairCategory = ['Beverage'];
  }

  const pairings = await Food.find({
    restaurantId: food.restaurantId,
    _id: { $ne: food._id },
    category: { $in: pairCategory },
    isAvailable: true
  }).limit(3);

  const formatted = pairings.map(p => ({
    food: p,
    reason: `Great ${p.category} to complete your meal`,
    pairingScore: 85 + Math.floor(Math.random() * 10)
  }));

  return { pairings: formatted, message: 'Complete your meal with these' };
};

export const estimateNutrition = async (foodId) => {
  const food = await Food.findById(foodId);
  if (!food) return null;

  const name = food.name.toLowerCase();
  let baseCal = 250;
  let protein = 10;
  let carbs = 30;
  let fat = 10;
  const healthTags = [];

  if (name.includes('biryani')) { baseCal = 550; protein = 20; carbs = 65; fat = 22; }
  else if (name.includes('chicken')) { baseCal = 300; protein = 25; carbs = 10; fat = 15; healthTags.push('High Protein'); }
  else if (name.includes('pizza')) { baseCal = 450; protein = 18; carbs = 50; fat = 20; healthTags.push('Indulgent'); }
  else if (name.includes('burger')) { baseCal = 500; protein = 25; carbs = 40; fat = 28; healthTags.push('Comfort Food'); }
  else if (name.includes('salad')) { baseCal = 120; protein = 5; carbs = 15; fat = 5; healthTags.push('Low Cal'); healthTags.push('Light'); }
  else if (name.includes('dosa')) { baseCal = 170; protein = 4; carbs = 28; fat = 5; }
  else if (food.category === 'Dessert') { baseCal = 350; protein = 4; carbs = 45; fat = 15; healthTags.push('Sweet'); }
  else if (food.category === 'Beverage') { baseCal = 150; protein = 2; carbs = 30; fat = 2; }

  if (name.includes('fried')) { baseCal *= 1.3; fat *= 1.5; }
  if (name.includes('grilled')) { baseCal *= 0.9; fat *= 0.8; }
  if (name.includes('butter') || name.includes('cheese')) { baseCal *= 1.2; fat *= 1.3; }

  return {
    calories: Math.round(baseCal),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    healthTags,
    confidence: 'medium',
    servingSize: '1 serving'
  };
};

export const getTrendingItems = async (limit = 12) => {
  const pastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const past24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const orders = await Order.find({ orderDate: { $gte: pastWeek } }).populate('items.foodId');
  
  const counts = {};
  orders.forEach(o => {
    const isRecent = new Date(o.orderDate) >= past24h;
    o.items.forEach(i => {
      if (i.foodId) {
        const id = i.foodId._id.toString();
        if (!counts[id]) counts[id] = { food: i.foodId, week: 0, day: 0 };
        counts[id].week += i.quantity;
        if (isRecent) counts[id].day += i.quantity;
      }
    });
  });

  const trending = Object.values(counts)
    .map(c => {
      const trendScore = (c.day * 3) + (c.week * 1) + (c.food.rating * 2);
      let velocity = 'stable';
      if (c.day > c.week / 3) velocity = 'rising';
      if (c.week < 3) velocity = 'new';
      
      return {
        food: c.food,
        restaurant: null, // Would populate, but frontend expects just name or will use food.restaurantId if populated
        trendScore,
        orderCount24h: c.day,
        orderCountWeek: c.week,
        velocity
      };
    })
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit);

  // Populate restaurants
  for (let t of trending) {
      if (t.food.restaurantId) {
          t.restaurant = await Restaurant.findById(t.food.restaurantId).select('name');
      }
  }

  return { trending };
};
