import { NextResponse } from "next/server";
import { z } from "zod";
import getLogger from "@/lib/logger";
import { requireCmsPermission } from "@/lib/cms/rbac";
import { createCmsUser, deleteUserById, listAllUsers, updateUserRoleById } from "@/lib/authStore";

export const runtime = "nodejs";

const logger = getLogger("API");

const roleSchema = z.enum(["super_admin", "admin", "editor", "content_manager"]);

export async function GET() {
  try {
    await requireCmsPermission("cms.users.read");
    const users = await listAllUsers();
    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        createdBy: u.createdBy ?? null,
        createdAt: u.createdAt,
      })),
    });
  } catch (e: any) {
    const status = e?.status ?? 500;
    if (status >= 500) logger.error("CMS list users error", { error: e?.message });
    return NextResponse.json({ error: status === 403 ? "Forbidden" : e?.message ?? "Failed" }, { status });
  }
}

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: roleSchema,
});

export async function POST(req: Request) {
  try {
    const { session } = await requireCmsPermission("cms.users.write");
    const json = await req.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
    }

    const role = parsed.data.role as string;

    // Admins can only manage editors (per spec)
    if (session.role === "admin" && role !== "editor") {
      return NextResponse.json({ error: "Admins can only create Editor users" }, { status: 403 });
    }

    await createCmsUser({
      email: parsed.data.email,
      password: parsed.data.password,
      role,
      createdBy: session.username,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.status ?? 500;
    const msg = e?.message ?? "Failed";
    if (status >= 500) logger.error("CMS create user error", { error: msg });
    return NextResponse.json({ error: msg }, { status });
  }
}

const patchSchema = z.object({
  id: z.string().min(1),
  role: roleSchema,
});

export async function PATCH(req: Request) {
  try {
    const { session } = await requireCmsPermission("cms.users.write");
    const json = await req.json();
    const parsed = patchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
    }

    const role = parsed.data.role as string;

    if (session.role === "admin" && role !== "editor") {
      return NextResponse.json({ error: "Admins can only assign the Editor role" }, { status: 403 });
    }

    await updateUserRoleById(parsed.data.id, role);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.status ?? 500;
    if (status >= 500) logger.error("CMS update user role error", { error: e?.message });
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status });
  }
}

const deleteSchema = z.object({ id: z.string().min(1) });

export async function DELETE(req: Request) {
  try {
    const { session } = await requireCmsPermission("cms.users.write");
    const json = await req.json();
    const parsed = deleteSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
    }

    if (parsed.data.id === session.sub) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    if (session.role === "admin") {
      // Admins manage editors only; don't allow deleting non-editor users.
      const users = await listAllUsers();
      const target = users.find((u) => u.id === parsed.data.id);
      if (target && target.role !== "editor") {
        return NextResponse.json({ error: "Admins can only delete Editor users" }, { status: 403 });
      }
    }

    await deleteUserById(parsed.data.id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.status ?? 500;
    if (status >= 500) logger.error("CMS delete user error", { error: e?.message });
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status });
  }
}
