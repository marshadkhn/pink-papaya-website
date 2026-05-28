import { NextResponse } from "next/server";
import { prisma } from "@/lib/cms/store";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const perms = await getRolePermissions(session.role);
    if (!perms.has("cms.media.read")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    const items = await prisma.mediaLibrary.findMany({
      where: q ? {
        OR: [
          { fileName: { contains: q, mode: 'insensitive' } },
          { key: { contains: q, mode: 'insensitive' } }
        ]
      } : undefined,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
