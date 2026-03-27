import { NextRequest, NextResponse } from "next/server";
import { deleteInteriorFeedback, getInteriorFeedbackById, updateInteriorFeedback, type InteriorFeedbackItem } from "@/lib/interiorFeedbackStore";

export const revalidate = 300;

type AsyncRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _req: NextRequest,
  context: AsyncRouteContext
): Promise<NextResponse<InteriorFeedbackItem | { error: string }>> {
  try {
    const { id } = await context.params;
    const feedback = await getInteriorFeedbackById(id);
    if (!feedback) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(feedback);
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: AsyncRouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const patch = await req.json();
    const updated = await updateInteriorFeedback(id, patch);
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
    await deleteInteriorFeedback(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to delete" }, { status: 400 });
  }
}
