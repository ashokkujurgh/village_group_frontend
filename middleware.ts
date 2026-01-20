import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://159.65.153.154:4014';
    try {
      const response = await fetch(`${apiUrl}/checklogin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(token)

console.log('Token validation response status:', (await response.json()))
      // If token is invalid, redirect to login
      if (!response.ok) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error('Error validating token:', error);
      // On error, redirect to login for security
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
