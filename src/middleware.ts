import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // Extract hostname without port (e.g. "187.127.187.184:3000" -> "187.127.187.184")
  const hostname = host.split(":")[0].toLowerCase();

  // Check if request is originating directly from IP address or localhost
  const isIPOrLocalhost =
    /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|localhost)$/.test(hostname) ||
    hostname === "127.0.0.1";

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

  // If request comes from a domain name (e.g. pinkpapaya.in, www.pinkpapaya.in), serve "Coming Soon"
  if (!isIPOrLocalhost) {
    return NextResponse.rewrite(new URL("/coming-soon", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
