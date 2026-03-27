import { NextRequest, NextResponse } from "next/server";
import { updateLocation, deleteLocation, getLocationById, type Location } from "@/lib/locationsStore";

export const revalidate = 300;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const location = await getLocationById(id);
  if (!location) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(location);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = (await req.json()) as Partial<Location>;
    const updated = await updateLocation(id, body);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await deleteLocation(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to delete" }, { status: 400 });
  }
}
