import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getRecommendations,
  getGuestRecs,
  getMood,
  smartSearch,
  getPairings,
  getNutrition,
  getTrending,
  getReorderSuggestions,
  getReviewInsights,
  getAdminInsights,
  getAdminForecast,
  getAdminSentiment,
  getAdminSegments,
  getAdminMenuPerformance,
  getAdminPricing,
  getAdminAnomalies,
  getAdminDemandHeatmap
} from '../controllers/aiController.js';

const router = express.Router();

// User AI Endpoints
router.get('/recommendations', protect, getRecommendations);
router.get('/recommendations/guest', getGuestRecs);
router.get('/mood/:mood', getMood);
router.get('/search/smart', smartSearch);
router.get('/pairing/:foodId', getPairings);
router.get('/nutrition/:foodId', getNutrition);
router.get('/trending', getTrending);
router.get('/reorder-suggestions', protect, getReorderSuggestions);
router.get('/review-insights/:restaurantId', getReviewInsights);

// Admin AI Endpoints
router.get('/admin/insights', protect, admin, getAdminInsights);
router.get('/admin/forecast', protect, admin, getAdminForecast);
router.get('/admin/sentiment', protect, admin, getAdminSentiment);
router.get('/admin/segments', protect, admin, getAdminSegments);
router.get('/admin/menu-performance', protect, admin, getAdminMenuPerformance);
router.get('/admin/pricing', protect, admin, getAdminPricing);
router.get('/admin/anomalies', protect, admin, getAdminAnomalies);
router.get('/admin/demand-heatmap', protect, admin, getAdminDemandHeatmap);

export default router;
