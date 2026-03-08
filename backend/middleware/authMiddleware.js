/**
 * middleware/authMiddleware.js
 * Verifies JWT and attaches req.user.
 * Also provides a role-guard factory: requireRole('admin')
 */

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// ---- protect: require valid JWT ----------------------------
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized — user no longer exists");
    }

    if (!req.user.isActive) {
      res.status(403);
      throw new Error("Account has been deactivated");
    }

    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized — invalid token");
  }
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
