import { NextResponse } from "next/server";
import { getCmsActorOrThrow, getRolePermissions } from "@/lib/cms/rbac";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getCmsActorOrThrow();
    const perms = await getRolePermissions(session.role);
    return NextResponse.json({
      user: { id: session.sub, email: session.username, role: session.role ?? null },
      permissions: Array.from(perms),
    });
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status });
  }
}
