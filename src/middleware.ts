import { NextRequest, NextResponse } from "next/server";

/**
 * Protected admin routes – any path under /admin (excluding /admin-login).
 * Auth is confirmed via the `admin_authenticated` cookie set by auth.service.ts
 * on successful login, and cleared on logout.
 */
const ADMIN_LOGIN_PATH = "/admin-login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin-login");

  const isAuthenticated = request.cookies.has("admin_authenticated");

  // Redirect unauthenticated users away from admin pages
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    // Preserve the original destination so we can redirect back after login
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-authenticated users away from the login page
  if (pathname === ADMIN_LOGIN_PATH && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/tours", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all admin routes and the admin-login page.
     * Skip static files and Next.js internals.
     */
    "/admin/:path*",
    "/admin-login",
  ],
};
