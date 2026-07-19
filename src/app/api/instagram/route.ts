import { NextResponse } from "next/server";
import { getInstagramFeed, getInstagramProfile } from "@/lib/instagram";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const [items, profile] = await Promise.all([
    getInstagramFeed(12),
    getInstagramProfile(),
  ]);
  return NextResponse.json({ items, profile });
}
