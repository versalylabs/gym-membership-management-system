import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("gym_auth_token")?.value;

  // 1. If trying to visit login page while already logged in, redirect to dashboard
  if (pathname === "/login") {
    if (authToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protected admin routes
  const protectedRoutes = [
    "/dashboard",
    "/members",
    "/memberships",
    "/classes",
    "/attendance",
    "/trainers",
    "/pos",
    "/leads",
    "/reports",
    "/settings",
  ];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Allow kiosk check-in screen to be accessed independently without staff authentication
  const isKioskMode = pathname === "/attendance/kiosk";

  if (isProtectedRoute && !isKioskMode && !authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/members/:path*",
    "/memberships/:path*",
    "/classes/:path*",
    "/attendance/:path*",
    "/trainers/:path*",
    "/pos/:path*",
    "/leads/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
