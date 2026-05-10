import { NextResponse } from "next/server";
import { addStay, readStays, type Stay } from "@/lib/staysStore";
import getLogger from "@/lib/logger";

const logger = getLogger("API:stays");
export const revalidate = 180;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const location = searchParams.get("location") || undefined;
    const guests = searchParams.get("guests") || undefined;

    const list = await readStays({ category, location, guests });
    return NextResponse.json(list);
  } catch (e: any) {
    logger.error("GET /api/stays error", { error: e?.message });
    return NextResponse.json({ error: e?.message ?? "Failed to read stays" }, { status: 500 });
  }
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
    logger.error("POST /api/stays error", { error: e?.message });
    return NextResponse.json({ error: e?.message ?? "Failed to create" }, { status: 400 });
  }
}
