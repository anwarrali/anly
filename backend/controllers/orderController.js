/**
 * controllers/orderController.js
 * Client: create/view orders | Admin: view/update all orders
 */

import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Template from "../models/Template.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { sendAdminNotification } from "../utils/emailService.js";

// ============================================================
//  @desc    Create a new order
//  @route   POST /api/orders
//  @access  Private (client)
// ============================================================
export const createOrder = asyncHandler(async (req, res) => {
  const { templateId, serviceType, siteData, currency = "usd" } = req.body;

  let amount = req.body.amount || 0;
  let editLimit = 0;

  if (serviceType === "free_template") {
    amount = 0;
    editLimit = 0;
  } else if (serviceType === "basic_setup" || serviceType === "custom_basic") {
    amount = 50;
    editLimit = 5;
  } else if (
    serviceType === "standard_setup" ||
    serviceType === "custom_standard"
  ) {
    amount = 80;
    editLimit = 10;
  } else if (
    serviceType === "premium_setup" ||
    serviceType === "custom_premium"
  ) {
    amount = 120;
    editLimit = 999999;
  } else if (serviceType === "template_purchase" && templateId) {
    const template = await Template.findById(templateId);
    if (!template) {
      res.status(404);
      throw new Error("Template not found");
    }
    amount = template.price;
  }

  // If it's a template setup (not custom), add the template price to the subscription
  if (serviceType.endsWith("_setup") && templateId) {
    const template = await Template.findById(templateId);
    if (template) {
      amount += template.price;
    }
  }

  const order = await Order.create({
    userId: req.user._id,
    templateId: templateId || null,
    serviceType,
    amount,
    currency,
    editLimit,
    siteData: siteData || {},
    status: ["free_template", "template_purchase"].includes(serviceType)
      ? "pending"
      : "confirmed",
  });

  const populated = await order.populate([
    { path: "userId", select: "name email" },
    { path: "templateId", select: "title price" },
  ]);

  // Notify Admin for modifications or custom requests
  if (serviceType !== "template_purchase") {
    await sendAdminNotification(populated, req.user);
  }

  sendSuccess(res, 201, "Order created successfully", populated);
});

// ============================================================
//  @desc    Get all orders for logged-in client
//  @route   GET /api/orders/my
//  @access  Private (client)
// ============================================================
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate(
      "templateId",
      "title previewImages price downloadUrl templateFile",
    )
    .sort({ createdAt: -1 })
    .lean();

  sendSuccess(res, 200, "Orders retrieved", orders);
});

// ============================================================
//  @desc    Get single order (owner or admin)
//  @route   GET /api/orders/:id
//  @access  Private
// ============================================================
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("userId", "name email")
    .populate("templateId", "title price previewImages");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Only owner or admin can view
  if (
    order.userId._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Access denied");
  }

  sendSuccess(res, 200, "Order retrieved", order);
});

// ============================================================
//  @desc    Admin — get ALL orders (with filters)
//  @route   GET /api/orders
//  @access  Admin
// ============================================================
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, paymentStatus, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);

  const orders = await Order.find(query)
    .populate("userId", "name email")
    .populate("templateId", "title price downloadUrl templateFile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  sendSuccess(res, 200, "All orders retrieved", {
    orders,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// ============================================================
//  @desc    Admin — update order status / admin note
//  @route   PUT /api/orders/:id
//  @access  Admin
// ============================================================
export const updateOrder = asyncHandler(async (req, res) => {
  const { status, paymentStatus, adminNote, deliveryDate } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (adminNote) order.adminNote = adminNote;
  if (deliveryDate) order.deliveryDate = deliveryDate;

  const updated = await order.save();
  sendSuccess(res, 200, "Order updated", updated);
});

// ============================================================
//  @desc    Cancel own order (only if still pending)
//  @route   DELETE /api/orders/:id
//  @access  Private (client)
// ============================================================
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  if (order.status !== "pending") {
    res.status(400);
    throw new Error("Only pending orders can be cancelled");
  }

  order.status = "cancelled";
  await order.save();
  sendSuccess(res, 200, "Order cancelled");
});

// ============================================================
//  @desc    Request an edit for a subscription
//  @route   POST /api/orders/:id/request-edit
//  @access  Private (client)
// ============================================================
export const requestEdit = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Subscription not found");
  }

  if (order.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  if (order.editCount >= order.editLimit) {
    res.status(400);
    throw new Error("Edit limit reached. Please upgrade your plan.");
  }

  order.editCount += 1;
  await order.save();

  sendSuccess(res, 200, "Edit request received", order);
});
