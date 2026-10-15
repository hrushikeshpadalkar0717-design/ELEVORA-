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
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Local authentication ──────────────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

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
