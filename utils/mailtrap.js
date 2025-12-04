// /**
//  * Utility for sending emails using Mailtrap's official SDK.
//  * Requires MAILTRAP_TOKEN and MAILTRAP_SENDER in your .env file.
//  * Install dependencies:
//  *   yarn add mailtrap
//  *   # or
//  *   npm install mailtrap
//  */
// const { MailtrapClient } = require('mailtrap');
// const TOKEN = process.env.MAILTRAP_TOKEN || '';
// const SENDER_EMAIL = process.env.MAILTRAP_SENDER || '';

// const client = new MailtrapClient({ token: TOKEN });

// /**
//  * Send an email using Mailtrap.
//  * @param to Recipient email address
//  * @param subject Email subject
//  * @param text Plain text body
//  * @param html Optional HTML body
//  */
// export async function sendMailtrapMail({
//     to,
//     subject,
//     text,
//     html,
//     fromName = 'Abuja Night of Glory',
// }: {
//     to: string;
//     subject: string;
//     text: string;
//     html?: string;
//     fromName?: string;
// }): Promise<void> {
//     const sender = { name: fromName, email: SENDER_EMAIL };
//     await client.send({
//         from: sender,
//         to: [{ email: to }],
//         subject,
//         text,
//         html,
//     });
// }
// backend/utils/mailtrap.js
const { MailtrapClient } = require('mailtrap');

const TOKEN = process.env.MAILTRAP_TOKEN;
const SENDER_EMAIL = process.env.MAILTRAP_SENDER || 'noreply@abujanightofglory.com';

const client = new MailtrapClient({ token: TOKEN });

const sender = {
  email: SENDER_EMAIL,
  name: "Abuja Night of Glory 2025",
};

/**
 * Send email via Mailtrap
 * @param {string} to 
 * @param {string} subject 
 * @param {string} text 
 */
const sendMailtrapMail = async (to, subject, text) => {
  if (!TOKEN) {
    console.warn("MAILTRAP_TOKEN not set — email not sent (dev mode)");
    return;
  }

  try {
    await client.send({
      from: sender,
      to: [{ email: to }],
      subject,
      text,
      // You can add html later if needed
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    // Don't throw — we don't want to fail the whole approve/reject because of email
  }
};

module.exports = sendMailtrapMail;