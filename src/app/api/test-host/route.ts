import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host");
  const xForwardedHost = request.headers.get("x-forwarded-host");
  const xRealIp = request.headers.get("x-real-ip");
  
  return NextResponse.json({
    host,
    xForwardedHost,
    xRealIp,
    url: request.url,
    nextUrlHost: request.nextUrl.hostname
  });
}
