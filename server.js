require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify().catch((error) => {
  console.error('SMTP configuration error:', error.message);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check for uptime monitoring and platform deployers
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

const handleMailerError = (res) => {
  res.status(500).send('Oops! An error occurred and your message could not be sent.');
};

const sendNotificationEmail = async ({ subject, text, replyTo }) => {
  const toAddress = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `GPublishing Services <${process.env.SMTP_USER}>`,
    to: toAddress,
    subject,
    text,
    replyTo,
  });
};

const sendConfirmationEmail = async ({ email, subject, body }) => {
  if (!email) {
    return;
  }

  await transporter.sendMail({
    from: `GPublishing Services <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text: body,
  });
};

app.post('/api/contact', async (req, res) => {
  const { name = '', email = '', subject = '', message = '' } = req.body;

  if (!name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).send('Please provide your name, email, and message.');
  }

  try {
    const summary = `Name: ${name}\nEmail: ${email}\nSubject: ${subject || '—'}\nMessage:\n${message}`;

    const tasks = [
      sendNotificationEmail({
        subject: `New contact enquiry: ${subject || 'No subject provided'}`,
        text: summary,
        replyTo: email,
      }),
      sendConfirmationEmail({
        email,
        subject: 'Thanks for contacting GPublishing Services',
        body: `Hi ${name || 'there'},\n\nYour ideas were good and inspiring! Our support team will contact you shortly.\n\nBest regards,\nGPublishing Services`,
      }).catch((error) => {
        console.error('Failed to send contact confirmation email:', error.message);
      }),
    ];

    await Promise.all(tasks);

    res.send('Your ideas were good and inspiring! Our support team will contact you shortly.');
  } catch (error) {
    console.error('Failed to send contact email:', error.message);
    handleMailerError(res);
  }
});

app.post('/api/appointment', async (req, res) => {
  const {
    fullName = '',
    email = '',
    phone = '',
    projectOption = '',
    message = '',
  } = req.body;

  if (!fullName.trim() || !email.trim() || !phone.trim()) {
    return res.status(400).send('Name, email, and phone number are required.');
  }

  try {
    const summary = `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nProject Option: ${projectOption || '—'}\nMessage:\n${message || '—'}`;

    const tasks = [
      sendNotificationEmail({
        subject: 'New appointment request',
        text: summary,
        replyTo: email,
      }),
      sendConfirmationEmail({
        email,
        subject: 'Your appointment request with GPublishing Services',
        body: `Hi ${fullName || 'there'},\n\nYour ideas were good and inspiring! Our support team will contact you shortly.\nYour appointment is scheduled for 10:30 AM - 1:00 PM.\n\nBest regards,\nGPublishing Services`,
      }).catch((error) => {
        console.error('Failed to send appointment confirmation email:', error.message);
      }),
    ];

    await Promise.all(tasks);

    res.send('Your appointment is scheduled for 10:30 AM - 1:00 PM. Our support team will contact you shortly.');
  } catch (error) {
    console.error('Failed to send appointment email:', error.message);
    handleMailerError(res);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
