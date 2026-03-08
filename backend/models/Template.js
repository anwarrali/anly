/**
 * models/Template.js — Mongoose schema for website templates
 */

import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Template title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    titleAr: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
    },
    downloadUrl: {
      type: String,
      trim: true,
    },
    templateFile: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "business",
        "portfolio",
        "ecommerce",
        "blog",
        "landing",
        "restaurant",
        "realEstate",
        "health",
        "saas",
        "other",
      ],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    previewImages: {
      type: [String],
      default: [],
    },
    demoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    descriptionAr: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    techStack: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    includes: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewItem: {
      type: Boolean,
      default: true,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
  
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// Full-text search index
templateSchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model("Template", templateSchema);
