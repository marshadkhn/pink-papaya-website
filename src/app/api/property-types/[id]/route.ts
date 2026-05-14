import { NextRequest, NextResponse } from "next/server";
import { updatePropertyType, deletePropertyType, getPropertyTypeById, type PropertyType } from "@/lib/propertyTypesStore";

export const revalidate = 300;

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const pt = await getPropertyTypeById(id);
  if (!pt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pt);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = (await req.json()) as Partial<PropertyType>;
    const updated = await updatePropertyType(id, body);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    await deletePropertyType(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to delete" }, { status: 400 });
  }
}
