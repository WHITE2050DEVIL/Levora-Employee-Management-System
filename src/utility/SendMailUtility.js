//External Lib Import
const nodemailer = require("nodemailer");

const SendMailUtility = async (emailTo, emailText, emailSubject) => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || "mail.sujon.one";
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 25);
  const secure = String(process.env.SMTP_SECURE || process.env.EMAIL_SECURE || "false").toLowerCase() === "true";
  const user = process.env.SMTP_USER || process.env.EMAIL_USERNAME;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
  const fromAddress = process.env.MAIL_FROM || process.env.SMTP_FROM || `no-reply@${host}`;
  const applicationName = process.env.APPLICATION_NAME || "Levora";

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM in your environment.",
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOption = {
    from: `${applicationName} <${fromAddress}>`,
    to: emailTo,
    subject: emailSubject,
    html: emailText,
  };

  try {
    return await transporter.sendMail(mailOption);
  } catch (error) {
    console.error("SMTP SEND FAILED:", error);
    throw new Error(`Failed to send recovery email: ${error.message}`);
  }
};

module.exports = SendMailUtility;
