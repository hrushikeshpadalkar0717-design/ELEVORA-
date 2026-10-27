import nodemailer from 'nodemailer';

/**
 * Send an email via configured SMTP (e.g. Gmail) or fallback to Ethereal / development logger
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text version
 * @param {string} options.html - HTML version
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const emailService = process.env.EMAIL_SERVICE || (smtpUser && smtpUser.includes('@gmail.com') ? 'gmail' : undefined);
  const fromAddress = process.env.EMAIL_FROM || (smtpUser ? `"ELEVORA" <${smtpUser}>` : `"ELEVORA" <no-reply@elevora.com>`);

  let transporter;
  const isRealSmtp = Boolean(smtpUser && smtpPass);

  if (isRealSmtp) {
    // Production / Configured SMTP (e.g. Gmail with App Password)
    if (emailService === 'gmail') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }
  } else {
    // Development fallback: Try Ethereal sandbox
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch {
      transporter = null;
    }
  }

  const mailOptions = {
    from: fromAddress,
    to,
    subject,
    text,
    html,
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      const previewUrl = nodemailer.getTestMessageUrl(info);

      if (isRealSmtp) {
        console.log(`✅ [REAL EMAIL DELIVERED] Dispatched to ${to} (MessageID: ${info.messageId})`);
      } else {
        console.log(`ℹ️ [SANDBOX EMAIL DISPATCHED] To: ${to}`);
        if (previewUrl) {
          console.log(`🔗 Ethereal Sandbox Preview URL: ${previewUrl}`);
        }
      }

      return {
        success: true,
        messageId: info.messageId,
        previewUrl,
        isRealSmtp,
      };
    } catch (err) {
      console.warn(`⚠️ SMTP dispatch error: ${err.message}.`);
      if (isRealSmtp) {
        throw new Error(`Email delivery failed: ${err.message}. Please check your EMAIL_USER and EMAIL_PASS (Google App Password).`);
      }
    }
  }

  // Local console fallback
  console.log('\n======================================================');
  console.log('📧 [ELEVORA LOCAL EMAIL DISPATCH]');
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('------------------------------------------------------');
  console.log(text);
  console.log('======================================================\n');

  return { success: true, simulated: true, isRealSmtp: false };
};
