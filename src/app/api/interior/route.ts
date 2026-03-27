import { NextResponse } from "next/server";
import { addInteriorProject, readInteriorProjects, type InteriorProject } from "@/lib/interiorStore";

export const revalidate = 300;

export async function GET() {
  const list = await readInteriorProjects();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as InteriorProject;
    if (!body?.id || !body?.title || !body?.imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const created = await addInteriorProject({
      ...body,
      photos: body.photos ?? [],
      longDescription: body.longDescription ?? [],
      beforeAfter: body.beforeAfter ?? [],
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to create" }, { status: 400 });
  }
}
