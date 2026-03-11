import nodemailer from "nodemailer";

/**
 * Send an email notification to the administrator
 */
export const sendAdminNotification = async (order, user) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Anly SaaS" <${process.env.EMAIL_USER}>`,
      to: "grandtwoaar@gmail.com",
      subject: `New Request: ${order.serviceType} from ${user.name}`,
      html: `
        <h2>New Order/Request Received</h2>
        <p><strong>Service Type:</strong> ${order.serviceType}</p>
        <p><strong>User:</strong> ${user.name} (${user.email})</p>
        <p><strong>Company:</strong> ${order.siteData?.businessName || "N/A"}</p>
        <p><strong>Project Goal:</strong> ${order.siteData?.websiteGoal || "N/A"}</p>
        <p><strong>Details/Requirements:</strong><br/>
        <pre>${order.siteData?.additionalNotes || "None"}</pre></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Notification sent to admin for order ${order._id}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send email for order ${order._id}:`, error);
  }
};
