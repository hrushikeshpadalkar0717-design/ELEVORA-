import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  googleAuthRedirect,
  googleCallback,
  linkedinAuthRedirect,
  linkedinCallback,
  getCurrentUser,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  exchangeOAuthCode,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

// ── Local authentication ──────────────────────────────────────────────────────
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.put('/reset-password/:token', passwordResetLimiter, resetPassword);
router.post('/oauth-exchange', exchangeOAuthCode);

// ── Google OAuth (Authorization Code Flow) ────────────────────────────────────
router.get('/google', googleAuthRedirect);             // 1. Redirect user to Google
router.get('/google/callback', googleCallback);        // 2. Google redirects back here

// ── LinkedIn OAuth (Authorization Code Flow / OIDC) ───────────────────────────
router.get('/linkedin', linkedinAuthRedirect);         // 1. Redirect user to LinkedIn
router.get('/linkedin/callback', linkedinCallback);    // 2. LinkedIn redirects back here

// ── Protected profile routes ──────────────────────────────────────────────────
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateUserProfile);

export default router;
