/**
 * controllers/authController.js
 * Handles: register, login, getProfile, updateProfile
 */

import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendSuccess } from "../utils/apiResponse.js";

// ============================================================
//  @desc    Register a new user
//  @route   POST /api/auth/register
//  @access  Public
// ============================================================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(user._id);

  sendSuccess(res, 201, "Registration successful", {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// ============================================================
//  @desc    Login user & return JWT
//  @route   POST /api/auth/login
//  @access  Public
// ============================================================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Include password for comparison
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Account has been deactivated. Contact support.");
  }

  const token = generateToken(user._id);

  sendSuccess(res, 200, "Login successful", {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ============================================================
//  @desc    Get current user profile
//  @route   GET /api/auth/profile
//  @access  Private
// ============================================================
export const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Profile retrieved", req.user);
});

// ============================================================
//  @desc    Update current user profile
//  @route   PUT /api/auth/profile
//  @access  Private
// ============================================================
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");

  const { name, email, password } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password; // pre-save hook will hash

  const updated = await user.save();

  sendSuccess(res, 200, "Profile updated", {
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });
});
