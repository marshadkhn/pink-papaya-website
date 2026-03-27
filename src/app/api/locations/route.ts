import { NextResponse } from "next/server";
import { addLocation, readLocations, type Location } from "@/lib/locationsStore";

export const revalidate = 300;

export async function GET() {
  const list = await readLocations();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Location;
    if (!body?.id || !body?.name) {
      return NextResponse.json({ error: "Missing required fields (id, name)" }, { status: 400 });
    }
    const created = await addLocation({ ...body, stayIds: body.stayIds ?? [] });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to create" }, { status: 400 });
  }
}
