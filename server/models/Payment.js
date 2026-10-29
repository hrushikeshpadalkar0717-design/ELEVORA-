import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'ultra'],
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    paymentId: {
      type: String,
      default: null,
      trim: true,
      sparse: true,
      index: true,
    },
    signature: {
      type: String,
      default: null,
    },
    amount: {
      type: Number, // Stored in paise (e.g. 20000 for ₹200, 50000 for ₹500)
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['created', 'captured', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },
    receipt: {
      type: String,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model('Payment', PaymentSchema);
