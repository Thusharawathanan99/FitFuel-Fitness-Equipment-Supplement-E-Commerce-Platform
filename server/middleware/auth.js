import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fitfuel_jwt_super_secret_key_2026_fitness_ecommerce');
    
    // Attempt database lookup
    let user = null;
    try {
      user = await User.findById(decoded.id).select('-password');
    } catch {
      // In-memory or fallback
    }

    if (!user) {
      // In-memory or token payload fallback
      user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role || 'customer'
      };
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed: Invalid or expired token.'
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin credentials required.'
    });
  }
};
