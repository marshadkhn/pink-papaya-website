import { NextResponse } from "next/server";
import { z } from "zod";
import { sendFormEmail, isMailConfigured, type FormField } from "@/lib/mailer";
import { env } from "@/lib/env";
import getLogger from "@/lib/logger";

export const runtime = "nodejs";

const logger = getLogger("API:contact");

/**
 * Forward a submission to a Google Apps Script web app (logs to a Sheet).
 * Sends URL-encoded params so the script can read them via e.parameter.
 */
async function forwardToSheet(
  url: string,
  formType: string,
  data: Record<string, string | undefined>
): Promise<void> {
  const params = new URLSearchParams();
  params.set("formType", formType);
  params.set("submittedAt", new Date().toISOString());
  for (const [k, v] of Object.entries(data)) {
    if (v != null && String(v).trim() !== "") params.set(k, String(v));
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    // Apps Script 302-redirects to googleusercontent.com; fetch follows it.
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`sheet responded ${res.status}`);
}

const str = z.string().max(5000);

const schema = z.object({
  formType: z.enum(["contact", "partner", "interior"]),
  // Honeypot: real users leave this empty; bots tend to fill every field.
  website: z.string().optional(),
  data: z.record(z.string(), str.optional()).default({}),
});

const FORM_META: Record<
  string,
  { subject: string; fields: { key: string; label: string }[] }
> = {
  contact: {
    subject: "New Contact Enquiry",
    fields: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "message", label: "Message" },
    ],
  },
  partner: {
    subject: "New Partner / Host Enquiry",
    fields: [
      { key: "name", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "location", label: "Property Location" },
    ],
  },
  interior: {
    subject: "New Interior Design Enquiry",
    fields: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "location", label: "Project Location" },
      { key: "scale", label: "Project Scale" },
      { key: "timeline", label: "Timeline" },
      { key: "service", label: "Service Required" },
      { key: "details", label: "Project Details" },
    ],
  },
};

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    const { formType, website, data } = parsed.data;

    // Silently accept honeypot hits so bots don't learn they were caught.
    if (website && website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const meta = FORM_META[formType];
    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const sheetUrl = formType === "partner" ? env.PARTNER_SHEET_WEBHOOK_URL : undefined;
    const mailReady = isMailConfigured();

    if (!sheetUrl && !mailReady) {
      logger.error("Contact form received but no delivery channel is configured", { formType });
      return NextResponse.json(
        { error: "Submissions are not configured. Please try again later." },
        { status: 503 }
      );
    }

    // Deliver to every configured channel; succeed if at least one works.
    let delivered = false;

    if (sheetUrl) {
      try {
        await forwardToSheet(sheetUrl, formType, data);
        delivered = true;
      } catch (e: any) {
        logger.error("Google Sheet forward failed", { error: e?.message });
      }
    }

    if (mailReady) {
      try {
        const fields: FormField[] = meta.fields.map((f) => ({
          label: f.label,
          value: (data[f.key] || "").trim(),
        }));
        await sendFormEmail({
          subject: `${meta.subject} — ${name}`,
          fields,
          replyTo: email,
        });
        delivered = true;
      } catch (e: any) {
        logger.error("Form email failed", { error: e?.message });
      }
    }

    if (!delivered) {
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    logger.error("Contact form error", { error: e?.message });
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }
}
