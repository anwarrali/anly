/**
 * utils/apiResponse.js — Consistent API response helpers
 */

/**
 * Send a success response.
 * @param {object} res - Express response object
 * @param {number} statusCode
 * @param {string} message
 * @param {*}      data      - Payload to include
 */
export const sendSuccess = (
  res,
  statusCode = 200,
  message = "Success",
  data = null,
) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  res.status(statusCode).json(body);
};

/**
 * Send an error response.
 * @param {object} res
 * @param {number} statusCode
 * @param {string} message
 */
export const sendError = (
  res,
  statusCode = 500,
  message = "Internal Server Error",
) => {
  res.status(statusCode).json({ success: false, message });
};
