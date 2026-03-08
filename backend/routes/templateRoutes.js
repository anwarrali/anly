/**
 * routes/templateRoutes.js
 *
 * GET    /api/templates             — list templates  [public]
 * GET    /api/templates/:id         — single template [public]
 * POST   /api/templates             — create          [admin]
 * PUT    /api/templates/:id         — update          [admin]
 * DELETE /api/templates/:id         — delete          [admin]
 * PATCH  /api/templates/:id/featured — toggle featured [admin]
 * POST   /api/templates/upload       — upload image    [admin]
 */
import { upload } from "../utils/upload.js";
import { zipUpload } from "../utils/zipUpload.js";
import { sendSuccess } from "../utils/apiResponse.js";

import { Router } from "express";
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  toggleFeatured,
  downloadTemplate,
} from "../controllers/templateController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = Router();

const adminOnly = [protect, requireRole("admin")];

// --- Specialized routes first ---
router.post("/upload", ...adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }
  const url = `${req.protocol}://${req.get("host")}/uploads/templates/${req.file.filename}`;
  sendSuccess(res, 200, "Image uploaded", { url });
});

router.post(
  "/upload-zip",
  ...adminOnly,
  zipUpload.single("file"),
  (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("No file uploaded");
    }
    // Store the path relative to server root
    sendSuccess(res, 200, "File uploaded", { path: req.file.path });
  },
);

router.get("/download/:id", protect, downloadTemplate);

router.patch("/:id/featured", ...adminOnly, toggleFeatured);

// --- General routes ---
router
  .route("/")
  .get(getTemplates)
  .post(...adminOnly, createTemplate);

router
  .route("/:id")
  .get(getTemplateById)
  .put(...adminOnly, updateTemplate)
  .delete(...adminOnly, deleteTemplate);

export default router;
