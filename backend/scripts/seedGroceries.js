import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const groceries = [
  // Fresh Fruits
  { name: 'Fresh Cavendish Bananas', category: 'Fresh Fruits', price: 65, image: 'https://spoonacular.com/cdn/ingredients_500x500/bananas.jpg', unit: '1 kg', brand: 'Farm Fresh' },
  { name: 'Washington Apples', category: 'Fresh Fruits', price: 240, image: 'https://spoonacular.com/cdn/ingredients_500x500/apple.jpg', unit: '4 pcs', brand: 'Imported' },
  { name: 'Nagpur Oranges', category: 'Fresh Fruits', price: 120, image: 'https://spoonacular.com/cdn/ingredients_500x500/orange.jpg', unit: '1 kg', brand: 'Farm Fresh' },
  { name: 'Watermelon Kiran', category: 'Fresh Fruits', price: 90, image: 'https://spoonacular.com/cdn/ingredients_500x500/watermelon.jpg', unit: '1 pc (2-3 kg)', brand: 'Farm Fresh' },

  // Vegetables
  { name: 'Onion', category: 'Vegetables', price: 45, image: 'https://spoonacular.com/cdn/ingredients_500x500/onion.jpg', unit: '1 kg', brand: 'Farm Fresh' },
  { name: 'Potato', category: 'Vegetables', price: 35, image: 'https://spoonacular.com/cdn/ingredients_500x500/potatoes-yukon-gold.jpg', unit: '1 kg', brand: 'Farm Fresh' },
  { name: 'Tomato - Hybrid', category: 'Vegetables', price: 60, image: 'https://spoonacular.com/cdn/ingredients_500x500/tomato.png', unit: '500 g', brand: 'Farm Fresh' },
  { name: 'Fresh Coriander Leaves', category: 'Vegetables', price: 15, image: 'https://spoonacular.com/cdn/ingredients_500x500/cilantro.png', unit: '1 bunch', brand: 'Farm Fresh' },

  // Dairy, Bread & Eggs
  { name: 'Amul Taaza Toned Milk', category: 'Dairy, Bread & Eggs', price: 27, image: 'https://spoonacular.com/cdn/ingredients_500x500/milk.png', unit: '500 ml', brand: 'Amul' },
  { name: 'Amul Butter - Pasteurized', category: 'Dairy, Bread & Eggs', price: 58, image: 'https://spoonacular.com/cdn/ingredients_500x500/butter.jpg', unit: '100 g', brand: 'Amul' },
  { name: 'Farm Fresh White Eggs', category: 'Dairy, Bread & Eggs', price: 45, image: 'https://spoonacular.com/cdn/ingredients_500x500/egg.png', unit: '6 pcs', brand: 'Farm Fresh' },
  { name: 'Modern 100% Whole Wheat Bread', category: 'Dairy, Bread & Eggs', price: 50, image: 'https://spoonacular.com/cdn/ingredients_500x500/white-bread.jpg', unit: '400 g', brand: 'Modern' },
  { name: 'Milky Mist Paneer', category: 'Dairy, Bread & Eggs', price: 85, image: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Paneer_%28cottage_cheese%29.jpg', unit: '200 g', brand: 'Milky Mist' },

  // Snacks & Munchies
  { name: 'Lay\'s India\'s Magic Masala', category: 'Snacks & Munchies', price: 20, image: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Lays-potato-chips.jpg', unit: '52 g', brand: 'Lay\'s' },
  { name: 'Haldiram\'s Bhujia Sev', category: 'Snacks & Munchies', price: 55, image: 'https://spoonacular.com/cdn/ingredients_500x500/bombay-mix.png', unit: '200 g', brand: 'Haldiram\'s' },
  { name: 'Bingo! Mad Angles Tomato', category: 'Snacks & Munchies', price: 20, image: 'https://spoonacular.com/cdn/ingredients_500x500/tortilla-chips.jpg', unit: '66 g', brand: 'Bingo!' },
  { name: 'Doritos Nacho Cheese', category: 'Snacks & Munchies', price: 30, image: 'https://spoonacular.com/cdn/ingredients_500x500/doritos.jpg', unit: '60 g', brand: 'Doritos' },

  // Sweet Tooth
  { name: 'Dairy Milk Silk Chocolate', category: 'Sweet Tooth', price: 85, image: 'https://spoonacular.com/cdn/ingredients_500x500/milk-chocolate.jpg', unit: '60 g', brand: 'Cadbury' },
  { name: 'Nutella Hazelnut Spread', category: 'Sweet Tooth', price: 360, image: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Nutella_jar.jpg', unit: '350 g', brand: 'Nutella' },
  { name: 'Kwality Wall\'s Magnum Truffle', category: 'Sweet Tooth', price: 90, image: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Magnum_Classic.jpg', unit: '80 ml', brand: 'Kwality Wall\'s' },
  
  // Cold Drinks & Juices
  { name: 'Coca-Cola Original', category: 'Cold Drinks & Juices', price: 40, image: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/15-09-26-RalfR-WLC-0098_-_Coca-Cola_glass_bottle_%28Germany%29.jpg', unit: '750 ml', brand: 'Coca-Cola' },
  { name: 'Red Bull Energy Drink', category: 'Cold Drinks & Juices', price: 125, image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Red_Bull_can.jpg', unit: '250 ml', brand: 'Red Bull' },
  { name: 'Tropicana 100% Orange Juice', category: 'Cold Drinks & Juices', price: 110, image: 'https://spoonacular.com/cdn/ingredients_500x500/orange-juice.jpg', unit: '1 L', brand: 'Tropicana' },

  // Atta, Rice & Dal
  { name: 'Aashirvaad Shudh Chakki Atta', category: 'Atta, Rice & Dal', price: 235, image: 'https://spoonacular.com/cdn/ingredients_500x500/flour.png', unit: '5 kg', brand: 'Aashirvaad' },
  { name: 'India Gate Basmati Rice', category: 'Atta, Rice & Dal', price: 115, image: 'https://spoonacular.com/cdn/ingredients_500x500/rice-white-long-grain-or-basmatii-cooked.jpg', unit: '1 kg', brand: 'India Gate' },
  { name: 'Tata Sampann Toor Dal', category: 'Atta, Rice & Dal', price: 165, image: 'https://spoonacular.com/cdn/ingredients_500x500/lentils-brown.jpg', unit: '1 kg', brand: 'Tata Sampann' },

  // Cleaning Essentials
  { name: 'Surf Excel Easy Wash', category: 'Cleaning Essentials', price: 135, image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Washing_powder.jpg', unit: '1 kg', brand: 'Surf Excel' },
  { name: 'Vim Dishwash Liquid Lemon', category: 'Cleaning Essentials', price: 110, image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Dishwashing_liquid.jpg', unit: '500 ml', brand: 'Vim' },
  { name: 'Lizol Floor Cleaner Citrus', category: 'Cleaning Essentials', price: 95, image: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Bleach_bottle.jpg', unit: '500 ml', brand: 'Lizol' },
];

const seedGroceries = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create or find ApnaBaazar Store
    let store = await Restaurant.findOne({ name: 'ApnaBaazar Main Store' });
    if (!store) {
      store = new Restaurant({
        name: 'ApnaBaazar Main Store',
        description: 'Superfast Grocery Delivery in 10 minutes',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000',
        address: { street: 'Central Hub', city: 'City', state: 'State', zipCode: '000000', coordinates: { lat: 0, lng: 0 } },
        cuisine: ['Groceries', 'Daily Needs'],
        rating: 4.8,
        deliveryTime: '10-15 mins',
        costForTwo: 500,
        businessType: 'grocery',
        isPromoted: true,
      });
      await store.save();
      console.log('Created ApnaBaazar Main Store');
    } else {
      console.log('Store already exists');
    }

    // Delete existing groceries for this store
    await Food.deleteMany({ restaurantId: store._id });
    
    // Add groceries
    const groceryDocs = groceries.map(g => ({
      ...g,
      restaurantId: store._id,
      itemType: 'grocery',
      isVeg: true,
      isAvailable: true,
    }));

    await Food.insertMany(groceryDocs);
    console.log(`Successfully inserted ${groceryDocs.length} grocery items!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedGroceries();
