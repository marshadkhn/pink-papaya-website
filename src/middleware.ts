import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract host header sent by client / Nginx
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  const hostname = rawHost.split(":")[0].toLowerCase().trim();

  // Allow static assets & essential routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/media") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/logo-files") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Check if request is directly to IP address or localhost
  const isIP = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/.test(hostname);
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

  // If accessed via ANY domain name (e.g. pinkpapayastays.com, pinkpapaya.in, etc.)
  if (!isIP && !isLocalhost) {
    if (pathname !== "/coming-soon") {
      return NextResponse.rewrite(new URL("/coming-soon", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
