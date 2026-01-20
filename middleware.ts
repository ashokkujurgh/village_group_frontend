import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://159.65.153.154:4014';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login")) {
    // Get auth token from cookies

    const token = request.cookies.get("authToken")?.value;



    const response = await fetch(`${apiUrl}/checklogin`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const adminUrl = new URL("/admin", request.url);
      adminUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(adminUrl);

    }
  }
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

    try {
      const response = await fetch(`${apiUrl}/checklogin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

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
  matcher: ["/admin/:path*", "/login/:path*"],

};
