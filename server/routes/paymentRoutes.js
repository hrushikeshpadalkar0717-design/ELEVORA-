import express from 'express';
import {
  getPaymentConfig,
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
  getMyPlanStatus,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to fetch Razorpay public key ID and plans
router.get('/config', getPaymentConfig);

// Protected payment endpoints
router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my-status', protect, getMyPlanStatus);

// Webhook endpoint (Signature is verified inside handleWebhook)
router.post('/webhook', handleWebhook);

export default router;
