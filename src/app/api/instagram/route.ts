import { NextResponse } from "next/server";
import { getInstagramFeed, getInstagramProfile, DEFAULT_INSTAGRAM_POSTS, INSTAGRAM_USERNAME } from "@/lib/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let items = await getInstagramFeed(12);
  let profile = await getInstagramProfile();

  if (!items || items.length === 0) {
    items = DEFAULT_INSTAGRAM_POSTS;
  }

  if (!profile) {
    profile = { username: INSTAGRAM_USERNAME, followersCount: 12500, mediaCount: 150 };
  }

  return NextResponse.json({ items, profile });
}
