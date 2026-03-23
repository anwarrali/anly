/**
 * controllers/authController.js
 * Handles: register, login, getProfile, updateProfile via Supabase Auth
 */

import asyncHandler from "express-async-handler";
import supabase from "../utils/supabase.js";
import { sendSuccess } from "../utils/apiResponse.js";

// ============================================================
//  @desc    Register a new user
//  @route   POST /api/auth/register
//  @access  Public
// ============================================================
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Supabase Auth Admin Create (Bypasses email rate limits and confirms instantly)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  if (error) {
    console.error("❌ Registration error from Supabase:", error);
    res.status(400);
    throw new Error(error.message);
  }

  // After successful creation, immediately sign the user in to get a session
  const { data: signData, error: signError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signError) {
    console.error("❌ Auto-login error after registration:", signError);
    // Don't fail the whole request, but return null session
  }

  sendSuccess(res, 201, "Registration successful", {
    token: signData.session?.access_token || null,
    user: signData.user || data.user,
    profileSync: "Profiles are synced via background trigger"
  });
});

// ============================================================
//  @desc    Login user & return Access Token
//  @route   POST /api/auth/login
//  @access  Public
// ============================================================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Supabase Auth SignIn
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Fetch expanded profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (!profile || !profile.is_active) {
    res.status(403);
    throw new Error("Account has been deactivated. Contact support.");
  }

  sendSuccess(res, 200, "Login successful", {
    token: data.session.access_token,
    user: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      avatar_url: profile.avatar_url
    }
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
  const { name, avatar_url, password } = req.body;
  const userId = req.user.id;

  // 1. Update Profile (Public Table)
  const updates = {};
  if (name) updates.name = name;
  if (avatar_url) updates.avatar_url = avatar_url;

  if (Object.keys(updates).length > 0) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);
    
    if (profileError) {
      res.status(400);
      throw new Error("Profile update failed: " + profileError.message);
    }
  }

  // 2. Update Auth (Password/Metadata)
  if (password || name) {
    const authUpdate = {};
    if (password) authUpdate.password = password;
    if (name) authUpdate.data = { name };

    const { error: authError } = await supabase.auth.updateUser(authUpdate);
    if (authError) {
      res.status(400);
      throw new Error("Auth update failed: " + authError.message);
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  sendSuccess(res, 200, "Profile updated", profile);
});
