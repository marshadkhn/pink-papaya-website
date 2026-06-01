import { NextResponse } from "next/server";
import { z } from "zod";
import getLogger from "@/lib/logger";
import { Role, RolePermission } from "@/lib/models/Cms";
import { connectToDatabase } from "@/lib/mongodb";
import { ALL_CMS_PERMISSION_KEYS } from "@/lib/cms/permissions";
import { ensureCmsRbacSeeded, invalidateCmsRoleCache, requireCmsPermission } from "@/lib/cms/rbac";

export const runtime = "nodejs";

const logger = getLogger("API");

export async function GET() {
  try {
    await requireCmsPermission("cms.roles.read");
    await ensureCmsRbacSeeded();
    await connectToDatabase();

    const roles = await Role.find().sort({ key: 1 });
    const allRolePerms = await RolePermission.find();
    
    return NextResponse.json({
      roles: roles.map((r) => {
        const perms = allRolePerms.filter(rp => rp.roleKey === r.key).map(rp => rp.permissionKey);
        return {
          key: r.key,
          name: r.name,
          permissionKeys: perms,
        };
      }),
    });
  } catch (e: any) {
    const status = e?.status ?? 500;
    if (status >= 500) logger.error("CMS list roles error", { error: e?.message });
    return NextResponse.json({ error: status === 403 ? "Forbidden" : e?.message ?? "Failed" }, { status });
  }
}

const updateSchema = z.object({
  key: z.enum(["super_admin", "admin", "editor", "content_manager"]),
  permissionKeys: z.array(z.enum(ALL_CMS_PERMISSION_KEYS as any)).default([]),
});

export async function PUT(req: Request) {
  try {
    const { session } = await requireCmsPermission("cms.roles.write");
    if (session.role !== "super_admin") {
      return NextResponse.json({ error: "Only Super Admin can manage roles" }, { status: 403 });
    }

    const json = await req.json();
    const parsed = updateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
    }

    await connectToDatabase();
    
    await RolePermission.deleteMany({ roleKey: parsed.data.key });
    if (parsed.data.permissionKeys.length > 0) {
       await RolePermission.insertMany(
         parsed.data.permissionKeys.map(k => ({ roleKey: parsed.data.key, permissionKey: k }))
       );
    }

    await invalidateCmsRoleCache();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.status ?? 500;
    if (status >= 500) logger.error("CMS update role error", { error: e?.message });
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status });
  }
}
