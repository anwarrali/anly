/**
 * routes/paymentRoutes.js
 *
 * POST   /api/payments/checkout/:orderId — create Bank of Palestine session [client]
 * POST   /api/payments/webhook           — Bank of Palestine webhook        [public]
 * GET    /api/payments                   — all payments                     [admin]
 * GET    /api/payments/:orderId          — payment for order                [owner|admin]
 */

import { Router } from "express";
import {
  createPayment,
  bopWebhook,
  getPaymentByOrder,
  getAllPayments,
} from "../controllers/paymentController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// Webhook / Verification endpoint
router.post("/webhook", bopWebhook);

// All other routes require auth
router.use(protect);

router.post("/checkout/:orderId", createPayment);
router.get("/", requireRole("admin"), getAllPayments);
router.get("/:orderId", getPaymentByOrder);

export default router;
