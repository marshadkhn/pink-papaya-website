import { NextResponse } from "next/server";
import { uploadPublicAsset } from "@/lib/media-storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const { url, key } = await uploadPublicAsset({
      bytes,
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      folder: "uploads",
    });

    return NextResponse.json({ url, key });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Upload failed" }, { status: 500 });
  }
}
