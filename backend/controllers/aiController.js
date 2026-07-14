import { hybridRecommend, getGuestRecommendations, getSmartReorderSuggestions } from '../services/recommendationEngine.js';
import { getMoodSuggestions, parseNaturalLanguageQuery, getFoodPairings, estimateNutrition, getTrendingItems } from '../services/aiService.js';
import { generateReviewSummary, analyzeSentiment, extractAspects } from '../services/sentimentEngine.js';
import { forecastOrders, forecastRevenue, getDemandHeatmap, detectAnomalies, getBusinessInsights, getCustomerSegments, getMenuPerformance, getSmartPricing, getAnomalyAlerts } from '../services/forecastEngine.js';
import Review from '../models/Review.js';

// User endpoints
export const getRecommendations = async (req, res) => {
  try {
    const recommendations = await hybridRecommend(req.user._id);
    res.json({ success: true, data: { recommendations } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGuestRecs = async (req, res) => {
  try {
    const recommendations = await getGuestRecommendations();
    res.json({ success: true, data: { recommendations } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMood = async (req, res) => {
  try {
    const data = await getMoodSuggestions(req.params.mood);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const smartSearch = async (req, res) => {
  try {
    const data = await parseNaturalLanguageQuery(req.query.q || '');
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPairings = async (req, res) => {
  try {
    const data = await getFoodPairings(req.params.foodId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNutrition = async (req, res) => {
  try {
    const data = await estimateNutrition(req.params.foodId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrending = async (req, res) => {
  try {
    const data = await getTrendingItems();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReorderSuggestions = async (req, res) => {
  try {
    const suggestions = await getSmartReorderSuggestions(req.user._id);
    res.json({ success: true, data: { suggestions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewInsights = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId, isApproved: true });
    const data = generateReviewSummary(reviews);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin endpoints
export const getAdminInsights = async (req, res) => {
  try {
    const data = await getBusinessInsights();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminForecast = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const orderForecast = await forecastOrders(days);
    const revenueForecast = await forecastRevenue(days);
    res.json({ success: true, data: { orderForecast, revenueForecast } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminSentiment = async (req, res) => {
  try {
    const reviews = await Review.find().populate('userId', 'name').populate('restaurantId', 'name').sort({ createdAt: -1 });
    const summary = generateReviewSummary(reviews);
    
    // Add sentiment to individual reviews for the dashboard
    
    const recentReviews = reviews.slice(0, 50).map(r => {
      const text = r.comment || '';
      const sentiment = analyzeSentiment(text);
      const aspects = extractAspects(text);
      return {
        review: r,
        sentiment,
        aspects,
        userName: r.userId ? r.userId.name : 'Unknown',
        restaurantName: r.restaurantId ? r.restaurantId.name : 'Unknown'
      };
    });
    
    const trends = [];
    // Mocked trend data for simplicity
    for(let i=14; i>=0; i--) {
        const d = new Date(Date.now() - i*24*3600*1000);
        trends.push({ date: d.toISOString().split('T')[0], avgSentiment: 0.5 + Math.random()*0.4, count: Math.floor(Math.random()*10) });
    }
    
    res.json({ 
        success: true, 
        data: { 
            overall: { score: summary.overallSentiment, label: summary.overallSentiment > 0.6 ? 'Positive' : 'Neutral', totalReviews: summary.totalReviews, averageRating: summary.averageRating },
            distribution: summary.sentimentDistribution,
            aspectScores: summary.aspectScores,
            recentReviews,
            trends
        } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminSegments = async (req, res) => {
  try {
    const data = await getCustomerSegments();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminMenuPerformance = async (req, res) => {
  try {
    const data = await getMenuPerformance();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminPricing = async (req, res) => {
  try {
    const data = await getSmartPricing();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminAnomalies = async (req, res) => {
  try {
    const anomalies = await detectAnomalies();
    const alerts = await getAnomalyAlerts();
    
    let high = 0, medium = 0, low = 0;
    [...anomalies, ...alerts].forEach(a => {
        if(a.severity === 'high') high++;
        else if(a.severity === 'medium') medium++;
        else low++;
    });
    
    res.json({ 
        success: true, 
        data: { 
            anomalies, 
            alerts, 
            summary: { totalAnomalies: anomalies.length + alerts.length, highSeverity: high, mediumSeverity: medium, lowSeverity: low } 
        } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminDemandHeatmap = async (req, res) => {
  try {
    const data = await getDemandHeatmap();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
