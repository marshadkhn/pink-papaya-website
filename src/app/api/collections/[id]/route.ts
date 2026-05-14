import { NextRequest, NextResponse } from "next/server";
import { updateCollection, deleteCollection, getCollectionById, type Collection } from "@/lib/collectionsStore";

export const revalidate = 300;

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const col = await getCollectionById(id);
  if (!col) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(col);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = (await req.json()) as Partial<Collection>;
    const updated = await updateCollection(id, body);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await deleteCollection(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to delete" }, { status: 400 });
  }
}
