import Offer from '../models/Offer.js';

/**
 * @desc    Get all offers
 * @route   GET /api/admin/offers
 * @access  Private/Admin
 */
export const getAllOffers = async (req, res) => {
  try {
    console.log('📋 GET /api/admin/offers called');
    console.log('Query params:', req.query);

    const { page = 1, limit = 100, isActive = '' } = req.query;

    const query = {};

    if (isActive !== '') {
      query.isActive = isActive === 'true';
    }

    console.log('Database query:', query);

    // Find offers without populate first
    const offers = await Offer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    console.log(`Found ${offers.length} offers`);

    // Manually populate based on applicableTo
    const populatedOffers = await Promise.all(
      offers.map(async (offer) => {
        const offerObj = offer.toObject();
        try {
          if (offer.applicableTo === 'restaurant') {
            const Restaurant = (await import('../models/Restaurant.js')).default;
            offerObj.targetId = await Restaurant.findById(offer.targetId);
          } else if (offer.applicableTo === 'food') {
            const Food = (await import('../models/Food.js')).default;
            offerObj.targetId = await Food.findById(offer.targetId);
          }
        } catch (err) {
          console.error('Error populating targetId:', err);
          // Keep original targetId if populate fails
        }
        return offerObj;
      })
    );

    const count = await Offer.countDocuments(query);

    const response = {
      success: true,
      data: populatedOffers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    };

    console.log('Sending response:', { success: true, count: populatedOffers.length });

    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Get all offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching offers'
    });
  }
};

/**
 * @desc    Create new offer
 * @route   POST /api/admin/offers
 * @access  Private/Admin
 */
export const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating offer'
    });
  }
};

/**
 * @desc    Update offer
 * @route   PUT /api/admin/offers/:id
 * @access  Private/Admin
 */
export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
    });
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating offer'
    });
  }
};

/**
 * @desc    Delete offer
 * @route   DELETE /api/admin/offers/:id
 * @access  Private/Admin
 */
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting offer'
    });
  }
};
