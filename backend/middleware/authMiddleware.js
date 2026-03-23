/**
 * middleware/authMiddleware.js
 * Verifies Supabase JWT and attaches public profile to req.user.
 */

import asyncHandler from "express-async-handler";
import supabase from "../utils/supabase.js";

// ---- protect: require valid Supabase JWT ----------------------------
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  // Verify JWT with Supabase Auth
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    res.status(401);
    throw new Error("Not authorized — invalid or expired token");
  }

  // Fetch the extended profile from our public schema
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    res.status(401);
    throw new Error("Not authorized — profile not found");
  }

  if (!profile.is_active) {
    res.status(403);
    throw new Error("Account has been deactivated");
  }

  // Attach profile to request
  req.user = profile;
  next();
});

// ---- requireRole: role-based access control ----------------
export const requireRole = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      const err = new Error(
        `Access denied — requires role: ${roles.join(", ")}`,
      );
      err.statusCode = 403;
      throw err;
    }
    next();
  });
