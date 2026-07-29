import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  // Extract hostname without port (e.g. "187.127.187.184:3000" -> "187.127.187.184")
  const hostname = rawHost.split(":")[0].toLowerCase().trim();

  // Check if request is originating directly from IP address or localhost
  const isIPOrLocalhost =
    /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|localhost)$/.test(hostname) ||
    hostname === "127.0.0.1" ||
    hostname === "187.127.187.184";

  // Allow static assets, images, API routes, and the /coming-soon page itself
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/media") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/logo-files") ||
    pathname === "/favicon.ico" ||
    pathname === "/coming-soon"
  ) {
    return NextResponse.next();
  }

  // If request comes from ANY domain name (e.g. pinkpapayastays.com, pinkpapaya.in), serve "Coming Soon"
  if (!isIPOrLocalhost) {
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
