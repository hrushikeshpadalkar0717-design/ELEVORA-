import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Returns the configured JWT secret. In production, refuses to operate
 * if JWT_SECRET is unset, preventing forged session tokens.
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is missing in production.');
    }
    return 'elevora_dev_jwt_secret_strictly_local_do_not_use_in_prod';
  }
  return secret;
};

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
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);

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
