import { NextResponse } from "next/server";
import { prisma } from "@/lib/cms/store";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";
import { uploadPublicAsset } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const perms = await getRolePermissions(session.role);
    if (!perms.has("cms.media.write")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { key, url } = await uploadPublicAsset({
      bytes: buffer,
      fileName: file.name,
      contentType: file.type,
      folder: "cms-media",
    });

    const media = await prisma.mediaLibrary.create({
      data: {
        key,
        url,
        fileName: file.name,
        contentType: file.type,
        size: file.size,
        createdBy: session.username,
      },
    });

    return NextResponse.json({ media });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
