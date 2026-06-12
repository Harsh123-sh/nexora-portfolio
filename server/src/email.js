import nodemailer from "nodemailer";

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendLeadNotification(lead) {
  if (!hasSmtpConfig()) {
    console.warn("SMTP is not configured. Lead email notification skipped.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const ownerEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: ownerEmail,
    replyTo: lead.email,
    subject: `New Nexora lead: ${lead.name}`,
    text: [
      "A new contact form lead was submitted.",
      "",
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Phone: ${lead.phone || "-"}`,
      `Company: ${lead.company || "-"}`,
      `Project Type: ${lead.project_type || "-"}`,
      `Budget: ${lead.budget || "-"}`,
      "",
      "Message:",
      lead.message
    ].join("\n"),
    html: `
      <div style="font-family: Inter, Arial, sans-serif; color: #111827;">
        <h2 style="margin: 0 0 14px;">New Nexora Website Lead</h2>
        <table cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(lead.name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(lead.email)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(lead.phone || "-")}</td></tr>
          <tr><td><strong>Company</strong></td><td>${escapeHtml(lead.company || "-")}</td></tr>
          <tr><td><strong>Project Type</strong></td><td>${escapeHtml(lead.project_type || "-")}</td></tr>
          <tr><td><strong>Budget</strong></td><td>${escapeHtml(lead.budget || "-")}</td></tr>
        </table>
        <p style="margin-top: 18px;"><strong>Message</strong></p>
        <p style="white-space: pre-line;">${escapeHtml(lead.message)}</p>
      </div>
    `
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
