// src/app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deletePost, getPostById, updatePost, type BlogPost } from "@/lib/blogStore";

export const revalidate = 300;

type AsyncRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _req: NextRequest,
  context: AsyncRouteContext
): Promise<NextResponse<BlogPost | { error: string }>> {
  try {
    const { id } = await context.params;
    const post = await getPostById(id);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: AsyncRouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const patch = await req.json();
    const updated = await updatePost(id, patch);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to update post" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: AsyncRouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to delete post" }, { status: 400 });
  }
}
