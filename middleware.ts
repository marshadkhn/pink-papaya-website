import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

const COOKIE_NAME = "auth";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const PUBLIC_WRITE_API_PATHS = new Set(["/api/login", "/api/logout"]);
const ALWAYS_PROTECTED_API_PREFIXES = ["/api/admin", "/api/cms", "/api/debug"];

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

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
  if (!env.AUTH_SECRET) {
    return false;
  }

  const secret = env.AUTH_SECRET;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [b64, sig] = parts;
  try {
    const expected = await hmacSha256Base64Url(secret, b64);
    if (sig.length !== expected.length) return false;
    if (!constantTimeEqual(sig, expected)) return false;
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

  if (pathname.startsWith("/api")) {
    const isWrite = !SAFE_METHODS.has(req.method);
    const isAlwaysProtected = ALWAYS_PROTECTED_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    const isPublicWrite = PUBLIC_WRITE_API_PATHS.has(pathname);

    if (isAlwaysProtected || (isWrite && !isPublicWrite)) {
      const token = req.cookies.get(COOKIE_NAME)?.value;
      const ok = token ? await verifyToken(token) : false;
      if (!ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const ok = token ? await verifyToken(token) : false;
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      const nextPath = pathname + search;
      url.search = `?next=${encodeURIComponent(nextPath)}`;
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/cms")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const ok = token ? await verifyToken(token) : false;
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      const nextPath = pathname + search;
      url.search = `?next=${encodeURIComponent(nextPath)}`;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cms/:path*", "/api/:path*"],
};
