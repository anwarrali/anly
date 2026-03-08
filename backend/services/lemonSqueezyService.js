import {
  lemonSqueezySetup,
  createCheckout as lsCreateCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";
import crypto from "crypto";

/**
 * services/lemonSqueezyService.js
 * Abstracts all Lemon Squeezy interactions.
 */

// Initialize Lemon Squeezy
lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY,
  onError: (error) => console.error("Lemon Squeezy Error:", error),
});

/**
 * Create a Lemon Squeezy Checkout Link
 */
export const createCheckout = async (variantId, order, user) => {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;

  const { data, error } = await lsCreateCheckout(storeId, variantId, {
    checkoutData: {
      email: user.email,
      name: user.name,
      custom: {
        orderId: order._id.toString(),
        userId: user._id.toString(),
      },
    },
    productOptions: {
      redirectUrl: `${process.env.CLIENT_URL}/dashboard?payment=success`,
      enabledVariants: [parseInt(variantId)],
    },
  });

  if (error) {
    throw new Error(`Lemon Squeezy Checkout Error: ${error.message}`);
  }

  return {
    url: data.data.attributes.url,
    id: data.data.id,
  };
};

/**
 * Verify Lemon Squeezy Webhook Signature
 */
export const verifyWebhookSignature = (rawBody, signature) => {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature, "hex"),
  );
};
