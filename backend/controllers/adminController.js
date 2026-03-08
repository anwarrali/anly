/**
 * controllers/adminController.js
 * Admin-specific APIs: dashboard stats, user management
 */

import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Template from "../models/Template.js";
import { sendSuccess } from "../utils/apiResponse.js";

// ============================================================
//  @desc    Dashboard statistics
//  @route   GET /api/admin/stats
//  @access  Admin
// ============================================================
export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalOrders, totalTemplates, revenueResult] =
    await Promise.all([
      User.countDocuments({ role: "client" }),
      Order.countDocuments(),
      Template.countDocuments({ isPublished: true }),
      Payment.aggregate([
        { $match: { status: "succeeded" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

  const revenue = revenueResult[0]?.total || 0;

  const recentOrders = await Order.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

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

  const query = {};
  if (role) query.role = role;
  if (search)
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  sendSuccess(res, 200, "Users retrieved", {
    users,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// ============================================================
//  @desc    Get single user
//  @route   GET /api/admin/users/:id
//  @access  Admin
// ============================================================
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  sendSuccess(res, 200, "User retrieved", user);
});

// ============================================================
//  @desc    Update user (role, isActive)
//  @route   PUT /api/admin/users/:id
//  @access  Admin
// ============================================================
export const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  const updated = await user.save();
  sendSuccess(res, 200, "User updated", {
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    isActive: updated.isActive,
  });
});

// ============================================================
//  @desc    Delete user
//  @route   DELETE /api/admin/users/:id
//  @access  Admin
// ============================================================
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  sendSuccess(res, 200, "User deleted");
});
