import { NextResponse } from "next/server";
import { getUserByUsername, verifyPassword } from "@/lib/authStore";
import { setSessionCookie } from "@/lib/auth";
import getLogger from "@/lib/logger";

const logger = getLogger("API");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Accept either "email" or legacy "username" field
    const email = (body.email || body.username || "").trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await getUserByUsername(email);
    if (!user) {
      logger.warn("Login attempt for unknown email", { email });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await verifyPassword(user, password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await setSessionCookie(user);
    return NextResponse.json({ ok: true });
  } catch (e) {
    logger.error("Login route error", { error: (e as any)?.message });
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
