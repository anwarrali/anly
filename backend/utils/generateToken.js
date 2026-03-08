/**
 * utils/generateToken.js — Generate signed JWT
 */

import jwt from "jsonwebtoken";

/**
 * @param {string} id - MongoDB ObjectId of the user
 * @returns {string} signed JWT token
 */
export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
