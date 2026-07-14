import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware: Protect routes - Verify JWT token
 * Attaches user to request object if authenticated
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

/**
 * Middleware: Admin authorization
 * Requires protect middleware to run first
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
};

/**
 * Middleware: Combined admin protection
 */
export const adminProtect = [protect, admin];

/**
 * Middleware: Restaurateur authorization
 * Requires protect middleware to run first
 */
export const restaurateur = (req, res, next) => {
  if (req.user && (req.user.role === 'restaurateur' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as restaurateur'
    });
  }
};
