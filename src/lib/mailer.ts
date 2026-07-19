import nodemailer, { type Transporter } from "nodemailer";
import { env } from "@/lib/env";
import getLogger from "@/lib/logger";

const logger = getLogger("Mailer");

let transporter: Transporter | null = null;

/** True when SMTP is configured enough to send mail. */
export function isMailConfigured(): boolean {
  return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS);
}

function getTransporter(): Transporter {
  if (transporter) return transporter;
  if (!isMailConfigured()) {
    throw new Error("SMTP is not configured");
  }
  const port = Number(env.SMTP_PORT);
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    // Implicit TLS on 465; STARTTLS otherwise. Overridable via SMTP_SECURE.
    secure: env.SMTP_SECURE ? env.SMTP_SECURE === "true" : port === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return transporter;
}

export type FormField = { label: string; value: string };

/**
 * Send a form submission to the configured recipient. `replyTo` is set to the
 * submitter's email so replies go straight back to them.
 */
export async function sendFormEmail(input: {
  subject: string;
  fields: FormField[];
  replyTo?: string;
}): Promise<void> {
  const to = env.CONTACT_EMAIL_TO;
  const from = env.CONTACT_EMAIL_FROM || env.SMTP_USER;
  if (!to) throw new Error("CONTACT_EMAIL_TO is not configured");

  const rows = input.fields
    .filter((f) => f.value && f.value.trim() !== "")
    .map(
      (f) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#16323C;vertical-align:top;white-space:nowrap">${escapeHtml(
          f.label
        )}</td><td style="padding:6px 12px;color:#333">${escapeHtml(f.value).replace(/\n/g, "<br/>")}</td></tr>`
    )
    .join("");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px">
    <h2 style="color:#16323C;margin:0 0 16px">${escapeHtml(input.subject)}</h2>
    <table style="border-collapse:collapse;width:100%;background:#faf7f2;border-radius:8px">${rows}</table>
    <p style="color:#999;font-size:12px;margin-top:16px">Sent from the Pink Papaya website.</p>
  </div>`;

  const text = input.fields
    .filter((f) => f.value && f.value.trim() !== "")
    .map((f) => `${f.label}: ${f.value}`)
    .join("\n");

  await getTransporter().sendMail({
    from: `"Pink Papaya Website" <${from}>`,
    to,
    replyTo: input.replyTo || undefined,
    subject: input.subject,
    text,
    html,
  });

  logger.info("Form email sent", { subject: input.subject });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
