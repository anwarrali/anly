/**
 * server.js — Main entry point for the Anly SaaS Backend
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./utils/connectDB.js";

// ----- Routes -----------------------------------------------
import authRoutes from "./routes/authRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// ----- Error middleware --------------------------------------
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
//  Global Middleware
// ============================================================
const allowedOrigins = ["https://anlycode.pages.dev", "http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (development only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Global rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api", limiter);
// ============================================================
//  API Routes
// ============================================================
app.use("/api/auth", authRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Static folders
app.use("/uploads/templates", express.static("uploads/templates"));

// Health-check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Anly SaaS API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
//  Error Handling
// ============================================================
app.use(notFound);
app.use(errorHandler);

// ============================================================
//  Bootstrap
// ============================================================
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(
      `\n🚀  Anly SaaS Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });
};

start();
