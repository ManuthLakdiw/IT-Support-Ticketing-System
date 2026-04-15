import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Unauthenticated → redirect to /login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only route protection
  if (pathname.startsWith("/dashboard/admin")) {
    const userInfoCookie = request.cookies.get("user_info")?.value;
    if (userInfoCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userInfoCookie));
        if (user.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // User-only route protection — admins cannot create tickets
  if (pathname.startsWith("/dashboard/tickets/new")) {
    const userInfoCookie = request.cookies.get("user_info")?.value;
    if (userInfoCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userInfoCookie));
        if (user.role !== "USER") {
          return NextResponse.redirect(new URL("/dashboard/tickets", request.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/dashboard/tickets", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/dashboard/tickets", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
