import { NextResponse } from "next/server";
import { updateCmsSeo } from "@/lib/cms/store";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const perms = await getRolePermissions(session.role);
    if (!perms.has("cms.pages.write_seo")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await Promise.resolve(params);
    const body = await req.json();

    await updateCmsSeo({
      slug,
      seo: body,
      updatedBy: session.username,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.status === 400) {
      return NextResponse.json({ error: "Validation error", details: error.details }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
