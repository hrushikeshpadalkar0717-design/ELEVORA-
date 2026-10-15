import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'elevora_fallback_jwt_secret_key_2026';

/**
 * Extracts a JWT from either:
 *   1. HttpOnly cookie named `elevora_token`  (preferred, XSS-safe)
 *   2. Authorization: Bearer <token> header   (backwards compat with localStorage)
 */
const extractToken = (req) => {
  // 1. Prefer the HttpOnly cookie
  if (req.cookies && req.cookies.elevora_token) {
    return req.cookies.elevora_token;
  }
  // 2. Fallback to Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

export const protect = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no authentication token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized — user account not found' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired — please log in again' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized — invalid token' });
    }
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Not authorized' });
  }
};
