import nodemailer from "nodemailer";

/**
 * Send an email notification to the administrator
 */
export const sendAdminNotification = async (order, user) => {
  // Logic for sending email
  // You would configure your SMTP settings here
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Anly SaaS" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New ${order.serviceType} Request from ${user.name}`,
    text: `New request details...\nUser: ${user.email}`,
  };

  await transporter.sendMail(mailOptions);
  */
  console.log(
    `[EMAIL SIMULATION] Notification sent to admin for order ${order._id}`,
  );
};
