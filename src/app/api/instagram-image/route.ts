import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Image proxy for Instagram CDN URLs.
 * Instagram CDN (scontent.cdninstagram.com) returns 403 when browsers load images
 * directly due to CORS/referrer restrictions. Fetching server-side bypasses this.
 *
 * Usage: /api/instagram-image?url=<encoded_instagram_cdn_url>
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Only allow Instagram CDN domains for security
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  const allowedHosts = [
    "scontent.cdninstagram.com",
    "scontent-bom1-1.cdninstagram.com",
    "scontent-bom1-2.cdninstagram.com",
    "scontent-bom2-1.cdninstagram.com",
    "scontent-del1-1.cdninstagram.com",
    "instagram.com",
  ];

  const isAllowed = allowedHosts.some(
    (h) => parsedUrl.hostname === h || parsedUrl.hostname.endsWith(".cdninstagram.com")
  );

  if (!isAllowed) {
    return new NextResponse("Domain not allowed", { status: 403 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        // Mimic a browser request to avoid Instagram's server-side blocks
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.instagram.com/",
        "sec-fetch-dest": "image",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "cross-site",
      },
      // No cache on server — Instagram URLs expire quickly
      cache: "no-store",
    });

    if (!response.ok) {
      return new NextResponse(`Upstream error: ${response.status}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache for 30 minutes on the browser side
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("[instagram-image proxy] fetch error:", err);
    return new NextResponse("Proxy fetch failed", { status: 502 });
  }
}
