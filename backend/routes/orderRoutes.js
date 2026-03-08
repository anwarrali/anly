/**
 * routes/orderRoutes.js
 *
 * POST   /api/orders          — create order            [client]
 * GET    /api/orders          — get all orders          [admin]
 * GET    /api/orders/my       — get my orders           [client]
 * GET    /api/orders/:id      — get single order        [owner|admin]
 * PUT    /api/orders/:id      — update order status     [admin]
 * DELETE /api/orders/:id      — cancel order            [client]
 */

import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrder,
  cancelOrder,
  requestEdit,
} from "../controllers/orderController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

// All order routes require authentication
router.use(protect);

router.get("/my", getMyOrders);

router.route("/").post(createOrder).get(requireRole("admin"), getAllOrders);

router
  .route("/:id")
  .get(getOrderById)
  .put(requireRole("admin"), updateOrder)
  .delete(cancelOrder);

router.post("/:id/request-edit", requestEdit);

export default router;
