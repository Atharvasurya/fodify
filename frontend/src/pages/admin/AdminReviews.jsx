import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiFlag } from 'react-icons/fi';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

/**
 * Reviews Management Page
 * Approve, reject, or flag reviews
 */
const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [page, statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReviews({
        page,
        limit: 10,
        status: statusFilter
      });
      setReviews(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error('Failed to fetch reviews');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveReview(id);
      toast.success('Review approved');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectReview(id);
      toast.success('Review rejected');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to reject review');
    }
  };

  const handleFlag = async (id) => {
    const reason = prompt('Enter flag reason:');
    if (!reason) return;

    try {
      await adminService.flagReview(id, reason);
      toast.success('Review flagged');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to flag review');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
        <p className="text-gray-600 mt-1">Moderate customer reviews</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="w-full md:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">All Reviews</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-6">
        {loading ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">No reviews found</div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                      {review.userId?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">{review.userId?.name || 'Anonymous'}</p>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  {/* Restaurant/Food Info */}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Restaurant:</span> {review.restaurantId?.name || 'N/A'}
                    {review.foodId && (
                      <>
                        {' • '}
                        <span className="font-medium">Food:</span> {review.foodId?.name}
                      </>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${review.status === 'approved' ? 'bg-green-100 text-green-800' :
                        review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          review.status === 'flagged' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                      }`}>
                      {review.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {review.status === 'pending' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      title="Approve"
                    >
                      <FiCheck className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(review._id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      title="Reject"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleFlag(review._id)}
                      className="p-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
                      title="Flag"
                    >
                      <FiFlag className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
