import Razorpay from 'razorpay';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';

// ─── Server-Controlled Plan Definitions & Pricing ────────────────────────────
// Prices in paise: ₹200 = 20000 paise, ₹500 = 50000 paise
// Billing model: ELEVORA defines one-time pricing for plans.
export const PLAN_CONFIG = {
  free: {
    id: 'free',
    name: 'Free',
    amount: 0,
    currency: 'INR',
    resumeLimit: 1,
    description: 'Get started with essential features',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    amount: 20000, // 20,000 paise = ₹200.00
    currency: 'INR',
    resumeLimit: 10,
    description: 'Up to 10 resumes, all 10+ templates, full ATS features',
  },
  ultra: {
    id: 'ultra',
    name: 'Ultra',
    amount: 50000, // 50,000 paise = ₹500.00
    currency: 'INR',
    resumeLimit: Infinity,
    description: 'Unlimited resumes, all templates, priority ATS & AI features',
  },
};

/**
 * Initialize Razorpay SDK instance using server environment variables.
 */
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    const error = new Error('Razorpay credentials are not configured in server/.env (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)');
    error.statusCode = 503;
    throw error;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

/**
 * Constant-time string comparison to prevent timing attacks.
 */
const safeCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

// ─── 1. Public Payment Config ─────────────────────────────────────────────────
// @desc    Get Razorpay public key ID and official plan definitions
// @route   GET /api/payments/config
export const getPaymentConfig = (req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID || '',
    isConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    plans: PLAN_CONFIG,
    mode: (process.env.RAZORPAY_KEY_ID || '').startsWith('rzp_live') ? 'live' : 'test',
  });
};

// ─── 2. Create Payment Order ──────────────────────────────────────────────────
// @desc    Create Razorpay order on backend using trusted plan configuration
// @route   POST /api/payments/create-order
// @access  Protected
export const createPaymentOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    // Validate plan ID exists
    if (!planId || !PLAN_CONFIG[planId]) {
      return res.status(400).json({
        message: `Invalid plan specified. Valid plans are: ${Object.keys(PLAN_CONFIG).join(', ')}`,
      });
    }

    // Free plan requires no payment
    if (planId === 'free') {
      return res.status(400).json({
        message: 'Free plan does not require a payment transaction.',
      });
    }

    // Check if user is already on this or a higher plan
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.plan === planId) {
      return res.status(400).json({
        message: `You are already active on the ${PLAN_CONFIG[planId].name} plan.`,
      });
    }

    if (currentUser.plan === 'ultra' && planId === 'pro') {
      return res.status(400).json({
        message: 'You are currently on Ultra, which already includes all Pro features.',
      });
    }

    const selectedPlan = PLAN_CONFIG[planId];
    const amountInPaise = selectedPlan.amount; // Server-controlled: ₹200 -> 20000, ₹500 -> 50000

    const razorpay = getRazorpayInstance();

    // Unique receipt: rcpt_<userId_suffix>_<timestamp>
    const receipt = `rcpt_${req.user._id.toString().slice(-6)}_${Date.now().toString().slice(-8)}`;

    const options = {
      amount: amountInPaise,
      currency: selectedPlan.currency,
      receipt,
      notes: {
        userId: req.user._id.toString(),
        userEmail: currentUser.email,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Persist Payment record in MongoDB with 'created' status
    const paymentRecord = await Payment.create({
      user: req.user._id,
      plan: selectedPlan.id,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      status: 'created',
      metadata: {
        notes: razorpayOrder.notes,
        createdAt: razorpayOrder.created_at,
      },
    });

    res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount, // in paise
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      receipt: razorpayOrder.receipt,
      paymentRecordId: paymentRecord._id,
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error creating payment order',
    });
  }
};

// ─── 3. Verify Payment Signature ──────────────────────────────────────────────
// @desc    Verify HMAC SHA-256 signature after checkout completion
// @route   POST /api/payments/verify
// @access  Protected
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification parameters (order_id, payment_id, or signature).',
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(503).json({
        success: false,
        message: 'Server Razorpay secret is not configured.',
      });
    }

    // Step A: Calculate HMAC SHA-256 signature
    const dataToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(dataToSign)
      .digest('hex');

    // Step B: Constant-time comparison
    const isSignatureValid = safeCompare(generatedSignature, razorpay_signature);

    if (!isSignatureValid) {
      // Find order to record failed verification attempt
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: 'failed',
          failureReason: 'HMAC signature verification mismatch',
        }
      );

      console.warn(`[Security Alert] Payment signature mismatch for order ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid transaction signature.',
      });
    }

    // Step C: Find and update payment document
    const payment = await Payment.findOne({ orderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment order record not found in system.',
      });
    }

    // Check idempotency: If already captured, don't duplicate activation
    if (payment.status === 'captured') {
      return res.json({
        success: true,
        message: 'Payment was already verified and processed.',
        plan: payment.plan,
      });
    }

    // Ensure the order belongs to the requesting authenticated user
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized payment verification attempt for another user.',
      });
    }

    // Update payment record to 'captured'
    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = 'captured';
    await payment.save();

    // Step D: Activate the trusted plan on the authenticated user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { plan: payment.plan },
      { new: true }
    ).select('-password');

    console.log(`✅ Plan ${payment.plan} successfully activated for user ${req.user.email} (Order: ${payment.orderId})`);

    res.json({
      success: true,
      message: `Congratulations! Your ${PLAN_CONFIG[payment.plan]?.name || payment.plan} plan has been activated successfully.`,
      plan: updatedUser.plan,
      paymentId: payment.paymentId,
      orderId: payment.orderId,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal error verifying payment',
    });
  }
};

// ─── 4. Razorpay Webhook Handler ──────────────────────────────────────────────
// @desc    Process asynchronous Razorpay webhook events with signature verification
// @route   POST /api/payments/webhook
// @access  Public (Signature-Verified via X-Razorpay-Signature)
export const handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!webhookSignature) {
      console.warn('Webhook received without X-Razorpay-Signature header.');
      return res.status(400).json({ message: 'Missing webhook signature header' });
    }

    if (!webhookSecret) {
      console.error('Webhook secret not configured in server/.env');
      return res.status(500).json({ message: 'Webhook secret not configured' });
    }

    // Use rawBody buffer to ensure exact byte match for HMAC calculation
    const rawPayload = req.rawBody ? req.rawBody.toString('utf-8') : JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawPayload)
      .digest('hex');

    if (!safeCompare(expectedSignature, webhookSignature)) {
      console.warn('⚠️ Webhook signature verification failed! Potential spoofed request.');
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body;
    const eventType = event.event;
    console.log(`📥 Razorpay Webhook Event: ${eventType}`);

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;
      const notes = paymentEntity?.notes || orderEntity?.notes || {};

      if (!orderId) {
        console.warn('Webhook event missing order ID:', eventType);
        return res.status(200).json({ status: 'ignored_missing_order_id' });
      }

      // Check existing payment in database
      let payment = await Payment.findOne({ orderId });

      if (payment) {
        // Idempotency: If already marked captured, do nothing and respond 200
        if (payment.status === 'captured') {
          console.log(`Webhook: Payment ${orderId} already marked captured. Skipping duplicate.`);
          return res.status(200).json({ status: 'already_processed' });
        }

        payment.status = 'captured';
        if (paymentId) payment.paymentId = paymentId;
        payment.metadata = { ...payment.metadata, webhookEvent: eventType, eventTime: new Date() };
        await payment.save();

        // Activate plan on user
        await User.findByIdAndUpdate(payment.user, { plan: payment.plan });
        console.log(`Webhook: Activated ${payment.plan} for user ${payment.user}`);
      } else if (notes.userId && notes.planId) {
        // Fallback: Webhook arrived before backend verify
        await Payment.create({
          user: notes.userId,
          plan: notes.planId,
          orderId,
          paymentId: paymentId || null,
          amount: paymentEntity?.amount || 0,
          currency: paymentEntity?.currency || 'INR',
          status: 'captured',
          metadata: { webhookEvent: eventType, notes },
        });

        await User.findByIdAndUpdate(notes.userId, { plan: notes.planId });
        console.log(`Webhook: Created payment & activated ${notes.planId} for user ${notes.userId}`);
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;

      if (orderId) {
        await Payment.findOneAndUpdate(
          { orderId },
          {
            status: 'failed',
            paymentId: paymentEntity.id,
            failureReason: paymentEntity.error_description || 'Payment failed',
            metadata: { error: paymentEntity.error_reason, eventTime: new Date() },
          }
        );
        console.log(`Webhook: Marked order ${orderId} as failed.`);
      }
    }

    // Always return 200 to Razorpay so it acknowledges successful event ingestion
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ message: 'Internal error processing webhook' });
  }
};

// ─── 5. Current User Plan Status & History ────────────────────────────────────
// @desc    Get authenticated user's current plan and payment transaction history
// @route   GET /api/payments/my-status
// @access  Protected
export const getMyPlanStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('plan email fullName');
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('orderId paymentId plan amount currency status createdAt');

    res.json({
      currentPlan: user.plan || 'free',
      planDetails: PLAN_CONFIG[user.plan || 'free'],
      payments,
    });
  } catch (error) {
    console.error('Get plan status error:', error);
    res.status(500).json({ message: 'Error retrieving plan status' });
  }
};
