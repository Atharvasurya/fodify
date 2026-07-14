import Issue from '../models/Issue.js';

/**
 * @desc    Get all customer issues
 * @route   GET /api/admin/issues
 * @access  Private/Admin
 */
export const getAllIssues = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', category = '' } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    const issues = await Issue.find(query)
      .populate('userId', 'name email phone')
      .populate('orderId')
      .populate('resolvedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Issue.countDocuments(query);

    res.status(200).json({
      success: true,
      data: issues,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get all issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching issues'
    });
  }
};

/**
 * @desc    Update issue status and notes
 * @route   PUT /api/admin/issues/:id
 * @access  Private/Admin
 */
export const updateIssue = async (req, res) => {
  try {
    const { status, adminNotes, priority } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    if (status) issue.status = status;
    if (adminNotes) issue.adminNotes = adminNotes;
    if (priority) issue.priority = priority;

    if (status === 'resolved' || status === 'closed') {
      issue.resolvedBy = req.user._id;
      issue.resolvedAt = Date.now();
    }

    await issue.save();

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: issue
    });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating issue'
    });
  }
};
