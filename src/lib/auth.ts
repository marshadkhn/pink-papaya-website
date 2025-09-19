import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth";
const DEFAULT_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

function getSecret() {
  return process.env.AUTH_SECRET || "dev-secret";
}

export type SessionPayload = {
  sub: string; // user id
  username: string;
  role?: string;
  exp: number; // seconds since epoch
};

function base64url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(payload: SessionPayload): string {
  const data = JSON.stringify(payload);
  const b64 = base64url(data);
  const hmac = crypto.createHmac("sha256", getSecret()).update(b64).digest("base64url");
  return `${b64}.${hmac}`;
}

function verify(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  const expected = crypto.createHmac("sha256", getSecret()).update(b64).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const json = Buffer.from(b64, "base64").toString("utf8");
    const payload = JSON.parse(json) as SessionPayload;
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(
  user: { id: string; username: string; role?: string },
  ttlSeconds: number = DEFAULT_TTL
) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const token = sign({ sub: user.id, username: user.username, role: user.role, exp });
  (await cookies()).set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: ttlSeconds,
  });
}

export async function clearSessionCookie() {
  (await cookies()).set({ name: COOKIE_NAME, value: "", expires: new Date(0), path: "/" });
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = (await cookies()).get(COOKIE_NAME);
  if (!c?.value) return null;
  return verify(c.value);
}

export const AuthCookie = { name: COOKIE_NAME, verify };
