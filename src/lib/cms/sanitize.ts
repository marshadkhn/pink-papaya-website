const TAG_RE = /<[^>]*>/g;

export function sanitizePlainText(value: string) {
  // CMS values are rendered as plain text in React nodes.
  // Strip tags defensively to avoid accidental HTML usage later.
  return String(value ?? "")
    .replace(TAG_RE, "")
    .replace(/\u0000/g, "")
    .trim();
}

export function sanitizeOptionalUrl(value: string) {
  const v = String(value ?? "").trim();
  if (!v) return "";

  if (v.startsWith("/")) {
    return v;
  }

  try {
    const u = new URL(v);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.toString();
  } catch {
    return "";
  }
}
