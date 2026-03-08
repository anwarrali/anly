/**
 * routes/adminRoutes.js
 * Admin-only: dashboard stats + user management
 *
 * GET    /api/admin/stats           — dashboard stats
 * GET    /api/admin/users           — all users
 * GET    /api/admin/users/:id       — single user
 * PUT    /api/admin/users/:id       — update user
 * DELETE /api/admin/users/:id       — delete user
 */

import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// All admin routes require auth + admin role
router.use(protect, requireRole("admin"));

router.get("/stats", getDashboardStats);

router.route("/users").get(getAllUsers);

router.route("/users/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default router;
