import Food from '../models/Food.js';

/**
 * @desc    Search food items globally across all restaurants
 * @route   GET /api/foods/search?q=query
 * @access  Public
 */
export const searchFoods = async (req, res) => {
  try {
    const { q, itemType } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const query = {
      name: { $regex: q, $options: 'i' },
      isAvailable: true
    };

    if (itemType) {
      query.itemType = itemType;
    } else {
      query.$or = [
        { itemType: 'food' },
        { itemType: { $exists: false } }
      ];
    }

    const foods = await Food.find(query).populate('restaurantId', 'name image address cuisine rating deliveryTime').limit(20);

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    console.error('Search foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching food items'
    });
  }
};

/**
 * @desc    Get all food items for a restaurant
 * @route   GET /api/foods/restaurant/:restaurantId
 * @access  Public
 */
export const getFoodsByRestaurant = async (req, res) => {
  try {
    const { category } = req.query;

    let query = {
      restaurantId: req.params.restaurantId,
      isAvailable: true
    };

    // Filter by category
    if (category) {
      query.category = category;
    }

    const foods = await Food.find(query).sort({ category: 1, rating: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching food items'
    });
  }
};

/**
 * @desc    Get single food item by ID
 * @route   GET /api/foods/:id
 * @access  Public
 */
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurantId', 'name');

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: food
    });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching food item'
    });
  }
};

/**
 * @desc    Create a new food item
 * @route   POST /api/foods
 * @access  Private/Admin
 */
export const createFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: food
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating food item'
    });
  }
};

/**
 * @desc    Get all food items (for admin)
 * @route   GET /api/foods
 * @access  Public
 */
export const getAllFoods = async (req, res) => {
  try {
    const { itemType } = req.query;
    let query = {};
    if (itemType) {
      query.itemType = itemType;
    } else {
      query.$or = [
        { itemType: 'food' },
        { itemType: { $exists: false } }
      ];
    }

    const foods = await Food.find(query)
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    console.error('Get all foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching food items'
    });
  }
};

/**
 * @desc    Update a food item
 * @route   PUT /api/foods/:id
 * @access  Private/Admin
 */
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('restaurantId', 'name');

    res.json({
      success: true,
      data: updatedFood
    });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a food item
 * @route   DELETE /api/foods/:id
 * @access  Private/Admin
 */
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
