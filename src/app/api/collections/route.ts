import { NextResponse } from "next/server";
import { addCollection, readCollections, type Collection } from "@/lib/collectionsStore";

export const revalidate = 300;

export async function GET() {
  const list = await readCollections();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Collection;
    if (!body?.id || !body?.name) {
      return NextResponse.json({ error: "Missing required fields (id, name)" }, { status: 400 });
    }
    const created = await addCollection(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to create" }, { status: 400 });
  }
}
