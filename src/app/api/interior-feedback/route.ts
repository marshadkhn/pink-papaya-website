import { NextResponse } from "next/server";
import { addInteriorFeedback, readInteriorFeedback, type InteriorFeedbackItem } from "@/lib/interiorFeedbackStore";

export const revalidate = 300;

export async function GET() {
  const list = await readInteriorFeedback();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as InteriorFeedbackItem;
    if (!body?.id || !body?.name || !body?.text || !body?.avatar) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const created = await addInteriorFeedback(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to create" }, { status: 400 });
  }
}
