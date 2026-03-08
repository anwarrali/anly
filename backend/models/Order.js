/**
 * models/Order.js — Mongoose schema for client orders
 */

import mongoose from "mongoose";

const siteDataSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: "" },
    websiteGoal: { type: String, default: "" },
    colorPreference: { type: String, default: "" },
    brandAssets: { type: [String], default: [] },
    additionalNotes: { type: String, default: "" },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      // null when ordering a custom service, not a template
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      enum: [
        "free_template",
        "basic_setup",
        "standard_setup",
        "premium_setup",
        "custom_basic",
        "custom_standard",
        "custom_premium",
        "template_purchase",
        "template_modification",
        "full_customization",
      ],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in_progress",
        "review",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed"],
      default: "unpaid",
    },
    amount: {
      type: Number,
      required: [true, "Order amount is required"],
      min: 0,
    },
    currency: {
      type: String,
      default: "usd",
    },
    siteData: {
      type: siteDataSchema,
      default: () => ({}),
    },
    deliveryDate: { type: Date },
    adminNote: { type: String, default: "" },
    bopSessionId: { type: String, default: "" },
    bopReceiptId: { type: String, default: "" },
    checkoutUrl: { type: String, default: "" },
    editLimit: { type: Number, default: 0 },
    editCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
