import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is admin
  if (pathname.startsWith("/admin")) {
    // Get auth token from cookies
    const token = request.cookies.get("authToken")?.value;

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Optional: Validate token (simple check for demo)
    if (token !== "demo-admin-token") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
