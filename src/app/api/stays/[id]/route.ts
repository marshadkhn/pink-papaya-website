// src/app/api/stays/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deleteStay, getStayById, updateStay, type Stay } from "@/lib/staysStore";

export const revalidate = 180;

type AsyncRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _req: NextRequest,
  context: AsyncRouteContext
): Promise<NextResponse<Stay | { error: string }>> {
  try {
    const { id } = await context.params;
    const stay = await getStayById(id);
    if (!stay) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(stay);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to fetch stay" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: AsyncRouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const patch = await req.json();
    const updated = await updateStay(id, patch);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to update" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: AsyncRouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    await deleteStay(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to delete" }, { status: 400 });
  }
}
