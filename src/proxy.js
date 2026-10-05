import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "./lib/config";

// First line of defence for protected pages: logged-out visitors are sent
// to /login before anything renders. The AuthGate component then verifies
// the session is actually valid.
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isProtected =
    pathname === "/onboarding" ||
    pathname === "/app" ||
    pathname.startsWith("/app/");

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding", "/app", "/app/:path*"],
};
