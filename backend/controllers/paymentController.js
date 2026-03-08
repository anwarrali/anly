import asyncHandler from "express-async-handler";
import {
  createCheckoutSession,
  verifyOrderPayment,
} from "../services/bopService.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import { sendSuccess } from "../utils/apiResponse.js";

// ============================================================
//  @desc    Create BOP Payment Session (Bank of Palestine)
//  @route   POST /api/payments/checkout/:orderId
//  @access  Private (client)
// ============================================================
export const createPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate("templateId");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  if (order.paymentStatus === "paid") {
    res.status(400);
    throw new Error("Order is already paid");
  }

  const template = order.templateId;
  if (!template) {
    res.status(400);
    throw new Error("Template not found for this order");
  }

  // Create session with Bank of Palestine
  const checkout = await createCheckoutSession(order, template, req.user);

  // Store references
  order.checkoutUrl = checkout.url;
  order.bopSessionId = checkout.sessionId;
  await order.save();

  sendSuccess(res, 200, "Checkout created", { url: checkout.url });
});

// ============================================================
//  @desc    BOP Webhook / Verification Endpoint
//  @route   POST /api/payments/webhook
//  @access  Public (Called by BOP or periodically via returnURL)
// ============================================================
export const bopWebhook = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).send("No orderId provided in webhook payload");
  }

  // Verify the actual transaction status directly with BOP servers
  let bopData;
  try {
    bopData = await verifyOrderPayment(orderId);
  } catch (err) {
    return res.status(500).send("Verification failed");
  }

  // If the Bank of Palestine confirms the order is fully paid/captured
  const orderStatus = bopData.order?.status; // Usually "CAPTURED" or "AUTHORIZED"

  if (
    orderStatus === "CAPTURED" ||
    orderStatus === "AUTHORIZED" ||
    orderStatus === "APPROVED"
  ) {
    const order = await Order.findById(orderId);

    if (order && order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.status = "confirmed";
      order.bopReceiptId = bopData.transaction?.[0]?.transaction?.receipt; // example path
      await order.save();

      // Record the payment
      const transaction = bopData.transaction?.[0] || {};
      await Payment.create({
        orderId: order._id,
        userId: order.userId,
        bopTransactionId: transaction.transaction?.id || "N/A",
        amount: parseFloat(bopData.order.amount),
        currency: bopData.order.currency,
        status: "succeeded",
        paymentMethod:
          transaction.sourceOfFunds?.provided?.card?.brand || "card",
      });
    }
  }

  res.status(200).json({ received: true });
});

// ============================================================
//  @desc    Get payment record for an order
//  @route   GET /api/payments/:orderId
//  @access  Private
// ============================================================
export const getPaymentByOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (
    order.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Access denied");
  }

  const payment = await Payment.findOne({ orderId: req.params.orderId }).lean();
  if (!payment) {
    res.status(404);
    throw new Error("Payment record not found");
  }

  sendSuccess(res, 200, "Payment retrieved", payment);
});

// ============================================================
//  @desc    Admin — get all payments
//  @route   GET /api/payments
//  @access  Admin
// ============================================================
export const getAllPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Payment.countDocuments();

  const payments = await Payment.find()
    .populate("userId", "name email")
    .populate("orderId", "serviceType status")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  sendSuccess(res, 200, "All payments retrieved", {
    payments,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});
