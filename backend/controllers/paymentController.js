/**
 * controllers/paymentController.js
 * Supabase implementation for platform payments
 */

import asyncHandler from "express-async-handler";
import supabase from "../utils/supabase.js";
import {
  createCheckoutSession,
  verifyOrderPayment,
} from "../services/bopService.js";
import { sendSuccess } from "../utils/apiResponse.js";

// ============================================================
//  @desc    Create BOP Payment Session (Bank of Palestine)
//  @route   POST /api/payments/checkout/:orderId
//  @access  Private (client)
// ============================================================
export const createPayment = asyncHandler(async (req, res) => {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, templates(*)")
    .eq("id", req.params.orderId)
    .single();

  if (orderError || !order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user_id !== req.user.id) {
    res.status(403);
    throw new Error("Access denied");
  }

  if (order.payment_status === "paid") {
    res.status(400);
    throw new Error("Order is already paid");
  }

  const template = order.templates;
  if (!template) {
    res.status(400);
    throw new Error("Template not found for this order");
  }

  // Create session with Bank of Palestine
  const checkout = await createCheckoutSession(order, template, req.user);

  // Store references in Supabase
  const { error: updateError } = await supabase
    .from("orders")
    .update({ 
      checkout_url: checkout.url, 
      bop_session_id: checkout.sessionId 
    })
    .eq("id", order.id);

  if (updateError) {
    res.status(400);
    throw new Error(updateError.message);
  }

  sendSuccess(res, 200, "Checkout created", { url: checkout.url });
});

// ============================================================
//  @desc    BOP Webhook / Verification Endpoint
//  @route   POST /api/payments/webhook
//  @access  Public
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

  const orderStatus = bopData.order?.status; 

  if (
    orderStatus === "CAPTURED" ||
    orderStatus === "AUTHORIZED" ||
    orderStatus === "APPROVED"
  ) {
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (order && order.payment_status !== "paid") {
      // 1. Update order
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          payment_status: "paid", 
          status: "confirmed", 
          bop_receipt_id: bopData.transaction?.[0]?.transaction?.receipt || "" 
        })
        .eq("id", orderId);

      if (!updateError) {
        // 2. Record the payment
        const transaction = bopData.transaction?.[0] || {};
        await supabase
          .from("payments")
          .insert([{
            order_id: order.id,
            user_id: order.user_id,
            transaction_id: transaction.transaction?.id || "N/A",
            amount: parseFloat(bopData.order.amount),
            currency: bopData.order.currency,
            status: "succeeded",
            payment_method: transaction.sourceOfFunds?.provided?.card?.brand || "card"
          }]);
      }
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
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("user_id")
    .eq("id", req.params.orderId)
    .single();

  if (orderError || !order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user_id !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Access denied");
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", req.params.orderId)
    .single();

  if (paymentError || !payment) {
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

  const from = (Number(page) - 1) * Number(limit);
  const to = from + Number(limit) - 1;

  const { data, count, error } = await supabase
    .from("payments")
    .select(`
      *,
      profiles(name, email),
      orders(service_type, status)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(res, 200, "All payments retrieved", {
    payments: data || [],
    pagination: {
      total: count,
      page: Number(page),
      pages: Math.ceil((count || 0) / Number(limit)),
    },
  });
});
