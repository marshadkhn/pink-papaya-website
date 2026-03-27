import { NextResponse } from "next/server";
import { getUserByUsername, verifyPassword } from "@/lib/authStore";
import { setSessionCookie } from "@/lib/auth";
import getLogger from "@/lib/logger";

const logger = getLogger("API");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = (body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      logger.warn("Login attempt for unknown user", { username });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await verifyPassword(user, password);
    if (!ok) {
      logger.warn("Invalid credentials", { username });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await setSessionCookie(user);
    logger.info("User logged in", { username });
    return NextResponse.json({ ok: true });
  } catch (e) {
    logger.error("Login route error", { error: (e as any)?.message });
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
