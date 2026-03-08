/**
 * services/emailService.js
 * Sends transactional emails via Nodemailer.
 * Swap the transporter config for SendGrid / Mailgun in production.
 */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generic send helper.
 */
const send = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Anly Platform" <no-reply@anly.io>',
    to,
    subject,
    html,
  });
};

// ---- Exported email templates --------------------------------

export const sendWelcomeEmail = (user) =>
  send({
    to: user.email,
    subject: `Welcome to Anly — Let's build something great!`,
    html: `
      <h2>Hi ${user.name} 👋</h2>
      <p>Thank you for joining Anly. Browse our premium templates or order a custom website today.</p>
      <p><a href="${process.env.CLIENT_URL}/templates">Explore Templates →</a></p>
    `,
  });

export const sendOrderConfirmationEmail = (user, order) =>
  send({
    to: user.email,
    subject: `Order Confirmed — #${order._id}`,
    html: `
      <h2>Your order is confirmed ✅</h2>
      <p>Order ID: <strong>${order._id}</strong></p>
      <p>Service: <strong>${order.serviceType}</strong></p>
      <p>We'll be in touch shortly. You can track your order in your dashboard.</p>
      <p><a href="${process.env.CLIENT_URL}/dashboard">Go to Dashboard →</a></p>
    `,
  });

export const sendPaymentSuccessEmail = (user, payment) =>
  send({
    to: user.email,
    subject: "Payment Received — Anly",
    html: `
      <h2>Payment received 💳</h2>
      <p>Amount: <strong>$${payment.amount} ${payment.currency.toUpperCase()}</strong></p>
      <p>Your project is now in our queue. We'll update you on progress shortly.</p>
    `,
  });
