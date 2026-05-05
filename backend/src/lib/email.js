import nodemailer from "nodemailer";

// Create transporter using Gmail SMTP
const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

/**
 * Send an interview session invite email to a candidate.
 * @param {string} toEmail - Candidate's email address
 * @param {string} sessionTitle - Name of the session
 * @param {string} sessionUrl - Full URL to the session page
 * @param {string} hostName - Interviewer's name
 */
export async function sendInviteEmail({ toEmail, sessionTitle, sessionUrl, hostName }) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping invite email.");
    return { success: false, reason: "Email not configured" };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
      <h2 style="color: #4f46e5; margin-bottom: 8px;">You've been invited to an interview</h2>
      <p style="color: #374151; font-size: 15px;">
        <strong>${hostName}</strong> has scheduled an interview session for you.
      </p>

      <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Session</p>
        <p style="margin: 0; font-size: 18px; font-weight: bold; color: #111827;">${sessionTitle}</p>
      </div>

      <p style="color: #374151; font-size: 14px;">Click the button below to join. You'll be asked to sign in if you haven't already.</p>

      <a href="${sessionUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: bold; margin-top: 8px;">
        Join Interview Session →
      </a>

      <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
        If the button doesn't work, copy this link: <a href="${sessionUrl}" style="color: #4f46e5;">${sessionUrl}</a>
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Interview System" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `Interview Invite: ${sessionTitle}`,
      html,
    });
    console.log(`[email] Invite sent to ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error("[email] Failed to send invite:", error.message);
    return { success: false, reason: error.message };
  }
}
