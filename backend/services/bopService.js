/**
 * services/bopService.js
 * Abstracts Bank of Palestine (BOP) / Mastercard Payment Gateway Services (MPGS) interactions.
 *
 * Flow:
 *  1. Server requests a Checkout Session from BOP API
 *  2. Server returns Session ID to the frontend
 *  3. Frontend redirects user to BOP Hosted Checkout Page
 *  4. Upon return or webhook, Server verifies the order status with BOP API
 */

import axios from "axios";

// BOP usually provides these through their MPGS portal
const MERCHANT_ID = process.env.BOP_MERCHANT_ID;
const API_PASSWORD = process.env.BOP_API_PASSWORD;

// BOP API endpoint (often version 61 to 71 depending on what they assign you)
const API_VERSION = "71";
const API_BASE = `https://bop.gateway.mastercard.com/api/rest/version/${API_VERSION}/merchant/${MERCHANT_ID}`;

// Helper to generate Basic Auth header from merchant ID and password
const getAuthHeader = () => {
  const credentials = `merchant.${MERCHANT_ID}:${API_PASSWORD}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
};

// ============================================================
//  Create a Hosted Checkout Session
// ============================================================
export const createCheckoutSession = async (order, template, user) => {
  const orderId = order._id.toString();
  const amount = order.amount.toFixed(2);
  const currency = "USD"; // Common for BOP: USD, ILS, JOD

  const returnUrl = `${process.env.CLIENT_URL}/dashboard?payment=success&orderId=${orderId}`;
  const cancelUrl = `${process.env.CLIENT_URL}/dashboard?payment=cancelled`;

  const payload = {
    apiOperation: "INITIATE_CHECKOUT",
    order: {
      id: orderId,
      amount: amount,
      currency: currency,
      description: template.title || "Website Template",
    },
    interaction: {
      operation: "PURCHASE",
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
      merchant: {
        name: "Anly SaaS",
      },
    },
    customer: {
      email: user.email,
      firstName: user.name?.split(" ")[0] || "Customer",
    },
  };

  try {
    const res = await axios.post(`${API_BASE}/session`, payload, {
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    const sessionId = res.data.session.id;

    // The Hosted Checkout URL structure based on MPGS documentation
    // Note: MPGS often handles redirect by embedding a JS script on the frontend,
    // but they also provide a direct hosted checkout link via the session ID:
    const checkoutUrl = `https://bop.gateway.mastercard.com/checkout/pay/${sessionId}`;

    return {
      url: checkoutUrl,
      sessionId: sessionId,
    };
  } catch (error) {
    console.error("BOP API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error?.explanation ||
        "Failed to create Bank of Palestine session",
    );
  }
};

// ============================================================
//  Verify Payment Status
// ============================================================
export const verifyOrderPayment = async (orderId) => {
  try {
    const res = await axios.get(`${API_BASE}/order/${orderId}`, {
      headers: {
        Authorization: getAuthHeader(),
      },
    });

    return res.data; // Includes order.status, totalAuthorizedAmount, etc.
  } catch (error) {
    console.error("BOP Verify Error:", error.response?.data || error.message);
    throw new Error("Could not verify order status with Bank of Palestine");
  }
};
