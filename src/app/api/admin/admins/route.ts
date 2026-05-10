import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listAdmins, createAdmin, deleteAdminById } from "@/lib/authStore";
import getLogger from "@/lib/logger";

const logger = getLogger("API");

async function requireAdmin() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const admins = await listAdmins();
    return NextResponse.json({ admins });
  } catch (e: any) {
    logger.error("List admins error", { error: e?.message });
    return NextResponse.json({ error: "Failed to list admins" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const email = (body.email || "").trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    await createAdmin(email, password, session.username);
    logger.info("Admin created via portal", { email, by: session.username });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const msg = e?.message ?? "Failed to create admin";
    logger.error("Create admin error", { error: msg });
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "Admin ID required" }, { status: 400 });

    await deleteAdminById(id);
    logger.info("Admin deleted via portal", { id, by: session.username });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const msg = e?.message ?? "Failed to delete admin";
    logger.error("Delete admin error", { error: msg });
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
