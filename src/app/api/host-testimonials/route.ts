import { NextResponse } from "next/server";
import { addHostTestimonial, readHostTestimonials, type HostTestimonial } from "@/lib/hostTestimonialsStore";

export const revalidate = 300;

export async function GET() {
  const list = await readHostTestimonials();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as HostTestimonial;
    if (!body?.id || !body?.name || !body?.quote) {
      return NextResponse.json({ error: "Missing required fields (id, name, quote)" }, { status: 400 });
    }
    const created = await addHostTestimonial(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to create" }, { status: 400 });
  }
}
