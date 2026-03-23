/**
 * controllers/templateController.js
 * Supabase implementation for platform templates
 */

import asyncHandler from "express-async-handler";
import supabase from "../utils/supabase.js";
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

  let query = supabase
    .from("templates")
    .select("*", { count: "exact" })
    .eq("is_published", true);

  if (category) {
    query = query.eq("category", category);
  }
  if (featured === "true") {
    query = query.eq("is_featured", true);
  }
  if (search) {
    // Requires a text search index on 'title' and 'description'
    query = query.textSearch("title_description", search);
  }

  const from = (Number(page) - 1) * Number(limit);
  const to = from + Number(limit) - 1;

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(res, 200, "Templates retrieved", {
    templates: data || [],
    pagination: {
      total: count,
      page: Number(page),
      pages: Math.ceil((count || 0) / Number(limit)),
    },
  });
});

// ============================================================
//  @desc    Get single template by ID
//  @route   GET /api/templates/:id
//  @access  Public
// ============================================================
export const getTemplateById = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error || !data) {
    res.status(404);
    throw new Error("Template not found");
  }

  sendSuccess(res, 200, "Template retrieved", data);
});

// ============================================================
//  @desc    Create a new template
//  @route   POST /api/templates
//  @access  Admin
// ============================================================
export const createTemplate = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("templates")
    .insert([{ ...req.body, created_by: req.user.id }])
    .select()
    .single();

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(res, 201, "Template created", data);
});

// ============================================================
//  @desc    Update a template
//  @route   PUT /api/templates/:id
//  @access  Admin
// ============================================================
export const updateTemplate = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("templates")
    .update(req.body)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(res, 200, "Template updated", data);
});

// ============================================================
//  @desc    Delete a template
//  @route   DELETE /api/templates/:id
//  @access  Admin
// ============================================================
export const deleteTemplate = asyncHandler(async (req, res) => {
  const { error } = await supabase
    .from("templates")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(res, 200, "Template deleted");
});

// ============================================================
//  @desc    Toggle featured status
//  @route   PATCH /api/templates/:id/featured
//  @access  Admin
// ============================================================
export const toggleFeatured = asyncHandler(async (req, res) => {
  // First get current status
  const { data: current, error: getError } = await supabase
    .from("templates")
    .select("is_featured")
    .eq("id", req.params.id)
    .single();

  if (getError) {
    res.status(404);
    throw new Error("Template not found");
  }

  const { data, error } = await supabase
    .from("templates")
    .update({ is_featured: !current.is_featured })
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  sendSuccess(
    res,
    200,
    `Template ${data.is_featured ? "featured" : "unfeatured"}`,
    data,
  );
});

// ============================================================
//  @desc    Securely download template ZIP
//  @route   GET /api/templates/download/:id
//  @access  Private (Paid users only)
// ============================================================
export const downloadTemplate = asyncHandler(async (req, res) => {
  const templateId = req.params.id;

  const { data: template, error: tplError } = await supabase
    .from("templates")
    .select("*")
    .eq("id", templateId)
    .single();

  if (tplError || !template) {
    res.status(404);
    throw new Error("Template not found");
  }

  // Check if user has a paid order for this template
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", req.user.id)
    .eq("template_id", templateId)
    .eq("payment_status", "paid")
    .limit(1)
    .maybeSingle();

  if (!order && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You must purchase this template to download it.");
  }

  if (!template.template_file_url) {
    res.status(404);
    throw new Error("No file uploaded for this template.");
  }

  // Handle local file vs Supabase storage (assuming legacy local path for now)
  const filePath = path.resolve(template.template_file_url);

  if (!fs.existsSync(filePath)) {
    res.status(404);
    throw new Error("File not found on server.");
  }

  res.download(filePath, `${template.title.replace(/\s+/g, "_")}.zip`);
});
