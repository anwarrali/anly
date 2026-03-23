/**
 * controllers/orderController.js
 * Supabase implementation for platform orders
 */

import asyncHandler from "express-async-handler";
import supabase from "../utils/supabase.js";
import { sendSuccess } from "../utils/apiResponse.js";

// ============================================================
//  @desc    Create a new order
//  @route   POST /api/orders
//  @access  Private (client)
// ============================================================
export const createOrder = asyncHandler(async (req, res) => {
  const { templateId, serviceType, siteData, currency = "usd" } = req.body;

  let amount = req.body.amount || 0;
  let editLimit = 0;

  // Logic to determine amount/editLimit based on service types
  if (serviceType === "free_template") {
    amount = 0;
    editLimit = 0;
  } else if (serviceType === "basic_setup" || serviceType === "custom_basic") {
    amount = 0;
    editLimit = 5;
  } else if (serviceType === "standard_setup" || serviceType === "custom_standard") {
    amount = 0;
    editLimit = 10;
  } else if (serviceType === "premium_setup" || serviceType === "custom_premium") {
    amount = 0;
    editLimit = 999999;
  } else if (serviceType === "template_purchase" && templateId) {
    const { data: template } = await supabase
      .from("templates")
      .select("price")
      .eq("id", templateId)
      .single();
    if (template) amount = template.price;
  }

  if (serviceType.endsWith("_setup") && templateId) {
    const { data: template } = await supabase
      .from("templates")
      .select("price")
      .eq("id", templateId)
      .single();
    if (template) amount += template.price;
  }

  // Determine initial status
  const initialStatus = ["free_template", "template_purchase"].includes(serviceType)
    ? "pending"
    : "confirmed";

  // 1. Insert into orders
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([{
      user_id: req.user.id,
      template_id: templateId || null,
      service_type: serviceType,
      amount,
      currency,
      edit_limit: editLimit,
      status: initialStatus
    }])
    .select()
    .single();

  if (orderError) {
    res.status(400);
    throw new Error(orderError.message);
  }

  // 2. Insert into customization_requests if siteData exists
  if (siteData) {
    const { error: customError } = await supabase
      .from("customization_requests")
      .insert([{
        order_id: order.id,
        business_name: siteData.businessName || "",
        website_goal: siteData.websiteGoal || "",
        color_preference: siteData.colorPreference || "",
        brand_assets: siteData.brandAssets || [],
        additional_notes: siteData.additionalNotes || "",
        requirements: siteData.requirements || "",
        phone: siteData.phone || "",
        timeline: siteData.timeline || "",
        budget_range: siteData.budgetRange || ""
      }]);
    
    if (customError) {
      process.env.NODE_ENV !== 'production' && console.error("Customization request insert failed:", customError);
      // We don't throw here as the order was already created
    }
  }

  sendSuccess(res, 201, "Order created successfully", order);
});

// ============================================================
//  @desc    Get all orders for logged-in client
//  @route   GET /api/orders/my
//  @access  Private (client)
// ============================================================
export const getMyOrders = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      templates(title, preview_images, price, download_url, template_file_url)
    `)
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(res, 200, "Orders retrieved", data);
});

// ============================================================
//  @desc    Get single order (owner or admin)
//  @route   GET /api/orders/:id
//  @access  Private
// ============================================================
export const getOrderById = asyncHandler(async (req, res) => {
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles(name, email),
      templates(title, price, preview_images),
      customization_requests(*)
    `)
    .eq("id", req.params.id)
    .single();

  if (error || !order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user_id !== req.user.id && req.user.role !== "admin") {
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

  let query = supabase
    .from("orders")
    .select(`
      *,
      profiles(name, email),
      templates(title, price, download_url, template_file_url)
    `, { count: "exact" });

  if (status) query = query.eq("status", status);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);

  const from = (Number(page) - 1) * Number(limit);
  const to = from + Number(limit) - 1;

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(res, 200, "All orders retrieved", {
    orders: data || [],
    pagination: {
      total: count,
      page: Number(page),
      pages: Math.ceil((count || 0) / Number(limit)),
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

  const { data, error } = await supabase
    .from("orders")
    .update({ 
      status, 
      payment_status: paymentStatus, 
      admin_note: adminNote, 
      delivery_date: deliveryDate 
    })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(res, 200, "Order updated", data);
});

// ============================================================
//  @desc    Cancel own order (only if still pending)
//  @route   DELETE /api/orders/:id
//  @access  Private (client)
// ============================================================
export const cancelOrder = asyncHandler(async (req, res) => {
  const { data: order, error: getError } = await supabase
    .from("orders")
    .select("user_id, status")
    .eq("id", req.params.id)
    .single();

  if (getError || !order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user_id !== req.user.id) {
    res.status(403);
    throw new Error("Access denied");
  }

  if (order.status !== "pending") {
    res.status(400);
    throw new Error("Only pending orders can be cancelled");
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", req.params.id);

  if (updateError) {
    res.status(400);
    throw new Error(updateError.message);
  }

  sendSuccess(res, 200, "Order cancelled");
});

// ============================================================
//  @desc    Request an edit for a subscription
//  @route   POST /api/orders/:id/request-edit
//  @access  Private (client)
// ============================================================
export const requestEdit = asyncHandler(async (req, res) => {
  const { data: order, error: getError } = await supabase
    .from("orders")
    .select("user_id, edit_count, edit_limit")
    .eq("id", req.params.id)
    .single();

  if (getError || !order) {
    res.status(404);
    throw new Error("Subscription not found");
  }

  if (order.user_id !== req.user.id) {
    res.status(403);
    throw new Error("Access denied");
  }

  if (order.edit_count >= order.edit_limit) {
    res.status(400);
    throw new Error("Edit limit reached. Please upgrade your plan.");
  }

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({ edit_count: order.edit_count + 1 })
    .eq("id", req.params.id)
    .select()
    .single();

  if (updateError) {
    res.status(400);
    throw new Error(updateError.message);
  }

  sendSuccess(res, 200, "Edit request received", updated);
});
