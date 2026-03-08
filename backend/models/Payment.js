/**
 * models/Payment.js — Mongoose schema for Lemon Squeezy payment records
 */

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bopTransactionId: { type: String, sparse: true },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String, // 'card' | 'visa' | 'mastercard'
    },
    receiptUrl: {
      type: String,
    },
    refundedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
