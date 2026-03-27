import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use host/port for SMTP
  auth: {
    user: process.env.EMAIL_USER || 'grandtwoaar@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { subject, to, template, data } = req.body;

    // Build email body based on data keys
    const bodyText = Object.entries(data)
      .map(([key, value]) => `${key.toUpperCase()}:\n${value}\n`)
      .join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER || 'grandtwoaar@gmail.com',
      to: to || 'grandtwoaar@gmail.com', // Admin email
      subject: subject || `SeeV ${template} Request`,
      text: bodyText,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error: any) {
    console.error('Email API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Email API running on port ${PORT}`);
});
