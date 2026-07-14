import Review from '../models/Review.js';

/**
 * @desc    Get all reviews with filters
 * @route   GET /api/admin/reviews
 * @access  Private/Admin
 */
export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    const reviews = await Review.find(query)
      .populate('userId', 'name email')
      .populate('restaurantId', 'name image')
      .populate('foodId', 'name image')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews'
    });
  }
};

/**
 * @desc    Approve review
 * @route   PUT /api/admin/reviews/:id/approve
 * @access  Private/Admin
 */
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = 'approved';
    review.isApproved = true;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving review'
    });
  }
};

/**
 * @desc    Reject review
 * @route   PUT /api/admin/reviews/:id/reject
 * @access  Private/Admin
 */
export const rejectReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = 'rejected';
    review.isApproved = false;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review rejected successfully',
      data: review
    });
  } catch (error) {
    console.error('Reject review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error rejecting review'
    });
  }
};

/**
 * @desc    Flag review as abusive
 * @route   PUT /api/admin/reviews/:id/flag
 * @access  Private/Admin
 */
export const flagReview = async (req, res) => {
  try {
    const { reason } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = 'flagged';
    review.flagReason = reason || 'Abusive content';
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review flagged successfully',
      data: review
    });
  } catch (error) {
    console.error('Flag review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error flagging review'
    });
  }
};
