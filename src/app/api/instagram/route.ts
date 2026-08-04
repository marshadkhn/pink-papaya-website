import { NextRequest, NextResponse } from "next/server";
import { getInstagramFeed, getInstagramProfile, DEFAULT_INSTAGRAM_POSTS, INSTAGRAM_USERNAME } from "@/lib/instagram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Converts an Instagram CDN URL to a proxied URL served by our own API.
 * This avoids the 403 that Instagram CDN returns when browsers load images directly.
 */
function proxyImageUrl(cdnUrl: string): string {
  if (!cdnUrl || !cdnUrl.includes("cdninstagram.com")) return cdnUrl;
  return `/api/instagram-image?url=${encodeURIComponent(cdnUrl)}`;
}

export async function GET() {
  let items = await getInstagramFeed(12);
  let profile = await getInstagramProfile();

  if (!items || items.length === 0) {
    items = DEFAULT_INSTAGRAM_POSTS;
  } else {
    // Proxy all CDN image URLs so they load in the browser without 403
    items = items.map((item) => ({
      ...item,
      image: proxyImageUrl(item.image),
    }));
  }

  if (!profile) {
    profile = { username: INSTAGRAM_USERNAME, followersCount: 9840, mediaCount: 199 };
  }

  return NextResponse.json({ items, profile });
}
