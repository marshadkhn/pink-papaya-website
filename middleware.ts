import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "auth";

function base64urlToString(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4;
  const padded = pad ? b64 + "=".repeat(4 - pad) : b64;
  return atob(padded);
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function hmacSha256Base64Url(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toBase64Url(new Uint8Array(sig));
}

async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.AUTH_SECRET || "dev-secret";
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [b64, sig] = parts;
  try {
    const expected = await hmacSha256Base64Url(secret, b64);
    if (sig !== expected) return false;
    const json = base64urlToString(b64);
    const payload = JSON.parse(json) as { exp?: number };
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const ok = token ? await verifyToken(token) : false;
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = search ? `?next=${encodeURIComponent(pathname + search)}` : `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
