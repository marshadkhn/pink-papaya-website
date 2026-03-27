import { NextResponse } from "next/server";
import { addPost, readPosts, type BlogPost } from "@/lib/blogStore";

export const revalidate = 300;

export async function GET() {
  const list = await readPosts();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BlogPost;
    if (!body?.id || !body?.title || !body?.imageUrl || !body?.author || !body?.date || !body?.excerpt || !body?.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const created = await addPost(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to create post" }, { status: 400 });
  }
}
