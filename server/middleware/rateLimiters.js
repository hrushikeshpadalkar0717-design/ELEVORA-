import rateLimit from 'express-rate-limit';

/**
 * Authentication Rate Limiter
 * Guards /api/auth/login and /api/auth/register against brute-force & credential stuffing.
 * Allows 20 requests per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Password Reset Rate Limiter
 * Guards /api/auth/forgot-password and /api/auth/reset-password against email bombing / enumeration.
 * Allows 5 requests per 15 minutes per IP.
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many password reset requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Resume Upload Rate Limiter
 * Guards /api/upload/resume against DoS via heavy PDF/DOCX multi-megabyte parsing.
 * Allows 25 uploads per 15 minutes per IP.
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Resume upload limit exceeded. Please wait a few minutes before uploading additional files.',
  },
});

/**
 * General API Rate Limiter
 * Fallback DDoS protection across all /api endpoints.
 * Allows 300 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP. Please slow down and try again later.',
  },
});
