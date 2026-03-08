/**
 * controllers/templateController.js
 * Public + Admin CRUD for website templates
 */

import asyncHandler from "express-async-handler";
import Template from "../models/Template.js";
import Order from "../models/Order.js";
import path from "path";
import fs from "fs";
import { sendSuccess } from "../utils/apiResponse.js";

// ============================================================
//  @desc    Get all published templates (with filters & pagination)
//  @route   GET /api/templates
//  @access  Public
// ============================================================
export const getTemplates = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 12, featured } = req.query;

  const query = { isPublished: true };
  if (category) query.category = category;
  if (featured) query.isFeatured = true;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Template.countDocuments(query);

  const templates = await Template.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  sendSuccess(res, 200, "Templates retrieved", {
    templates,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// ============================================================
//  @desc    Get single template by ID
//  @route   GET /api/templates/:id
//  @access  Public
// ============================================================
export const getTemplateById = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id).lean();
  if (!template) {
    res.status(404);
    throw new Error("Template not found");
  }
  sendSuccess(res, 200, "Template retrieved", template);
});

// ============================================================
//  @desc    Create a new template
//  @route   POST /api/templates
//  @access  Admin
// ============================================================
export const createTemplate = asyncHandler(async (req, res) => {
  const template = await Template.create({
    ...req.body,
    createdBy: req.user._id,
  });
  sendSuccess(res, 201, "Template created", template);
});

// ============================================================
//  @desc    Update a template
//  @route   PUT /api/templates/:id
//  @access  Admin
// ============================================================
export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!template) {
    res.status(404);
    throw new Error("Template not found");
  }
  sendSuccess(res, 200, "Template updated", template);
});

// ============================================================
//  @desc    Delete a template
//  @route   DELETE /api/templates/:id
//  @access  Admin
// ============================================================
export const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findByIdAndDelete(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error("Template not found");
  }
  sendSuccess(res, 200, "Template deleted");
});

// ============================================================
//  @desc    Toggle featured status
//  @route   PATCH /api/templates/:id/featured
//  @access  Admin
// ============================================================
export const toggleFeatured = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error("Template not found");
  }
  template.isFeatured = !template.isFeatured;
  await template.save();
  sendSuccess(
    res,
    200,
    `Template ${template.isFeatured ? "featured" : "unfeatured"}`,
    template,
  );
});

// ============================================================
//  @desc    Securely download template ZIP
//  @route   GET /api/templates/download/:id
//  @access  Private (Paid users only)
// ============================================================
export const downloadTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Template not found");
  }

  // Check if user has a paid order for this template
  const order = await Order.findOne({
    userId: req.user._id,
    templateId: template._id,
    paymentStatus: "paid",
  });

  if (!order && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You must purchase this template to download it.");
  }

  if (!template.templateFile) {
    res.status(404);
    throw new Error("No file uploaded for this template.");
  }

  const filePath = path.resolve(template.templateFile);

  if (!fs.existsSync(filePath)) {
    res.status(404);
    throw new Error("File not found on server.");
  }

  res.download(filePath, `${template.title.replace(/\s+/g, "_")}.zip`);
});
