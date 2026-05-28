import { NextResponse } from "next/server";
import { prisma } from "@/lib/cms/store";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";
import { deletePublicAsset } from "@/lib/s3";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const perms = await getRolePermissions(session.role);
    if (!perms.has("cms.media.write")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await Promise.resolve(params);

    const media = await prisma.mediaLibrary.findUnique({ where: { id } });
    if (!media) return NextResponse.json({ error: "Media not found" }, { status: 404 });

    await deletePublicAsset({ key: media.key });
    await prisma.mediaLibrary.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
