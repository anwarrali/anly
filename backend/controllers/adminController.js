/**
 * controllers/adminController.js
 * Supabase implementation for admin-specific APIs
 */

import asyncHandler from "express-async-handler";
import supabase from "../utils/supabase.js";
import { sendSuccess } from "../utils/apiResponse.js";

// ============================================================
//  @desc    Dashboard statistics
//  @route   GET /api/admin/stats
//  @access  Admin
// ============================================================
export const getDashboardStats = asyncHandler(async (_req, res) => {
  // 1. Fetch Counts & Revenue in Parallel
  const [userCount, orderCount, templateCount, paymentsData] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("templates").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("payments").select("amount").eq("status", "succeeded")
  ]);

  const totalUsers = userCount.count || 0;
  const totalOrders = orderCount.count || 0;
  const totalTemplates = templateCount.count || 0;
  
  const revenue = (paymentsData.data || []).reduce((acc, curr) => acc + Number(curr.amount), 0);

  // 2. Fetch Recent Orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      *,
      profiles(name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  sendSuccess(res, 200, "Dashboard stats retrieved", {
    totalUsers,
    totalOrders,
    totalTemplates,
    revenue,
    recentOrders,
  });
});

// ============================================================
//  @desc    Get all users
//  @route   GET /api/admin/users
//  @access  Admin
// ============================================================
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" });

  if (role) {
    query = query.eq("role", role);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const from = (Number(page) - 1) * Number(limit);
  const to = from + Number(limit) - 1;

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(res, 200, "Users retrieved", {
    users: data || [],
    pagination: {
      total: count,
      page: Number(page),
      pages: Math.ceil((count || 0) / Number(limit)),
    },
  });
});

// ============================================================
//  @desc    Get single user
//  @route   GET /api/admin/users/:id
//  @access  Admin
// ============================================================
export const getUserById = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !data) {
    res.status(404);
    throw new Error("User not found");
  }

  sendSuccess(res, 200, "User retrieved", data);
});

// ============================================================
//  @desc    Update user (role, isActive)
//  @route   PUT /api/admin/users/:id
//  @access  Admin
// ============================================================
export const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  
  const updates = {};
  if (role !== undefined) updates.role = role;
  if (isActive !== undefined) updates.is_active = isActive;

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(res, 200, "User updated", data);
});

// ============================================================
//  @desc    Delete user
//  @route   DELETE /api/admin/users/:id
//  @access  Admin
// ============================================================
export const deleteUser = asyncHandler(async (req, res) => {
  // Using Service Role Client allows deleting from auth.users via supabase.auth.admin.deleteUser
  // Profiles table will CASCADE delete due to FK constraint
  const { error } = await supabase.auth.admin.deleteUser(req.params.id);

  if (error) {
    res.status(400);
    throw new Error("Delete failed: " + error.message);
  }

  sendSuccess(res, 200, "User deleted from SeeV ecosystem");
});
