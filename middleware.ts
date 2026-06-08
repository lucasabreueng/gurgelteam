import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/server/auth/constants";
import { isRouteGuardEnabled } from "@/lib/server/env";

const LOGIN_PATH = "/login";

export function middleware(request: NextRequest) {
  if (!isRouteGuardEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/piloto/:path*", "/termos-pendentes"],
};
