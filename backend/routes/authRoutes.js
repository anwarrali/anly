/**
 * routes/authRoutes.js
 *
 * POST   /api/auth/register  — register
 * POST   /api/auth/login     — login
 * GET    /api/auth/profile   — get profile  [protected]
 * PUT    /api/auth/profile   — update profile [protected]
 */

import { Router } from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = Router();

// ----- Register validation rules ----------------------------
const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

// ----- Login validation rules -------------------------------
const loginRules = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerRules, validate, registerUser);
router.post("/login", loginRules, validate, loginUser);

router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

export default router;
