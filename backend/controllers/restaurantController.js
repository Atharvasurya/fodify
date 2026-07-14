import Restaurant from '../models/Restaurant.js';

/**
 * @desc    Get all restaurants
 * @route   GET /api/restaurants
 * @access  Public
 */
export const getRestaurants = async (req, res) => {
  try {
    const { search, cuisine, businessType } = req.query;

    let query = { isActive: true };

    // Default to 'food' if not requesting grocery specifically, allowing backwards compatibility
    if (businessType) {
      query.businessType = businessType;
    } else {
      query.$or = [
        { businessType: 'food' },
        { businessType: { $exists: false } }
      ];
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = { $in: [cuisine] };
    }

    const restaurants = await Restaurant.find(query).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching restaurants'
    });
  }
};

/**
 * @desc    Get single restaurant by ID
 * @route   GET /api/restaurants/:id
 * @access  Public
 */
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching restaurant'
    });
  }
};

/**
 * @desc    Create a new restaurant
 * @route   POST /api/restaurants
 * @access  Private/Admin
 */
export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating restaurant'
    });
  }
};

/**
 * @desc    Update a restaurant
 * @route   PUT /api/restaurants/:id
 * @access  Private/Admin
 */
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedRestaurant
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Delete a restaurant
 * @route   DELETE /api/restaurants/:id
 * @access  Private/Admin
 */
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
