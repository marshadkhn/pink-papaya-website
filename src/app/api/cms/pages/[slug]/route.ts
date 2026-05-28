import { NextResponse } from "next/server";
import { readCmsPage } from "@/lib/cms/store";
import { getSession } from "@/lib/auth";
import { getRolePermissions } from "@/lib/cms/rbac";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const perms = await getRolePermissions(session.role);
    if (!perms.has("cms.pages.read")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Next.js 15 app router params is asynchronous sometimes, but typed differently here.
    // Ensure we handle it correctly.
    const { slug } = await Promise.resolve(params);

    const data = await readCmsPage(slug);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
