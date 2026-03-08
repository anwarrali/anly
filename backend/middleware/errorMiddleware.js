/**
 * middleware/errorMiddleware.js
 * Centralised 404 + error handler for Express.
 */

// ----- 404 handler ------------------------------------------
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found — ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// ----- Global error handler ---------------------------------
export const errorHandler = (err, req, res, _next) => {
  // Mongoose duplicate-key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
    });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: `Invalid ID format: ${err.value}` });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, message: messages.join(", ") });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res
      .status(401)
      .json({ success: false, message: "Token expired — please login again" });
  }

  const statusCode = err.statusCode || res.statusCode || 500;
  res.status(statusCode < 400 ? 500 : statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
