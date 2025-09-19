import { NextResponse } from "next/server";
import { addStay, readStays, type Stay } from "@/lib/staysStore";

export async function GET() {
  const list = await readStays();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Stay;
    if (!body?.id || !body?.title || !body?.imageUrl || !body?.area || !body?.bed || !body?.guests) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const created = await addStay({ ...body, images: body.images ?? [] });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to create" }, { status: 400 });
  }
}
