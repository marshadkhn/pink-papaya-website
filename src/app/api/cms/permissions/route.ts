import { NextResponse } from "next/server";
import { requireCmsPermission } from "@/lib/cms/rbac";
import { CMS_PERMISSIONS } from "@/lib/cms/permissions";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireCmsPermission("cms.permissions.read");
    return NextResponse.json({ permissions: CMS_PERMISSIONS });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ error: status === 403 ? "Forbidden" : e?.message ?? "Failed" }, { status });
  }
}
