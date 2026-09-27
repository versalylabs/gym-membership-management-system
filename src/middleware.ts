import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("gym_auth_token")?.value;

  // Rate Limiting on Public Endpoints
  const rateLimitedEndpoints: Record<string, { limit: number; windowMs: number }> = {
    "/api/auth/login": { limit: 10, windowMs: 60_000 },          // 10 attempts/min (brute-force defense)
    "/api/leads": { limit: 15, windowMs: 60_000 },               // 15 inquiries/min (anti-spam)
    "/api/attendance/check-in": { limit: 30, windowMs: 60_000 },  // 30 check-ins/min (QR flood defense)
  };

  const matchedRateEndpoint = Object.keys(rateLimitedEndpoints).find(
    (ep) => pathname === ep || pathname.startsWith(`${ep}/`)
  );

  if (matchedRateEndpoint) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateConfig = rateLimitedEndpoints[matchedRateEndpoint];
    const rateCheck = await checkRateLimit(`${matchedRateEndpoint}:${ip}`, rateConfig);

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down and try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": rateCheck.limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }
  }

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
    "/api/auth/login",
    "/api/leads",
    "/api/attendance/check-in",
  ],
};
