import express from 'express';
import Offer from '../models/Offer.js';

const router = express.Router();

/**
 * @desc    Get active offers for a restaurant
 * @route   GET /api/offers/restaurant/:id
 * @access  Public
 */
export const getRestaurantOffers = async (req, res) => {
  try {
    const now = new Date();
    console.log(`[Offer Debug] Fetching offers for restaurant: ${req.params.id}`);
    console.log(`[Offer Debug] Current server time: ${now.toISOString()}`);

    // Check if any offer exists for this restaurant ignoring date/status
    const allOffersForRestaurant = await Offer.find({
      applicableTo: 'restaurant',
      targetId: req.params.id
    });
    console.log(`[Offer Debug] Total offers found for this restaurant (ignoring validity): ${allOffersForRestaurant.length}`);
    if (allOffersForRestaurant.length > 0) {
      allOffersForRestaurant.forEach(o => {
        console.log(`[Offer Debug] Offer: ${o.title}, Active: ${o.isActive}, From: ${o.validFrom}, Until: ${o.validUntil}, Matches Date: ${o.validFrom <= now && o.validUntil >= now}`);
      });
    }

    const offers = await Offer.find({
      applicableTo: 'restaurant',
      targetId: req.params.id,
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });

    console.log(`[Offer Debug] Valid active offers found: ${offers.length}`);

    res.status(200).json({
      success: true,
      data: offers
    });
  } catch (error) {
    console.error('Get restaurant offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching offers'
    });
  }
};

/**
 * @desc    Get active offers for a food item
 * @route   GET /api/offers/food/:id
 * @access  Public
 */
export const getFoodOffers = async (req, res) => {
  try {
    const now = new Date();

    const offers = await Offer.find({
      applicableTo: 'food',
      targetId: req.params.id,
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    });

    res.status(200).json({
      success: true,
      data: offers
    });
  } catch (error) {
    console.error('Get food offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching offers'
    });
  }
};
