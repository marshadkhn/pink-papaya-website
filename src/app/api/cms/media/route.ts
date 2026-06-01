import { NextResponse } from "next/server";
import { MediaLibrary } from "@/lib/models/MediaLibrary";
import { connectToDatabase } from "@/lib/mongodb";
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

    await connectToDatabase();
    const query = q ? {
      $or: [
        { fileName: { $regex: q, $options: 'i' } },
        { key: { $regex: q, $options: 'i' } }
      ]
    } : {};

    const itemsDocs = await MediaLibrary.find(query).sort({ createdAt: -1 });
    const items = itemsDocs.map(doc => {
      const obj = doc.toObject() as any;
      obj.id = doc._id.toString();
      delete obj._id;
      delete obj.__v;
      return obj;
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
