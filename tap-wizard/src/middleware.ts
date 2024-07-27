import { TOKENS } from "@/constants/cookies";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { LOGIN_ROUTE } from "./constants/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Allow the login page to be accessed without authentication
  if (pathname === "/my_account/login") {
    return NextResponse.next();
  }
  const accessToken = request.cookies.get(TOKENS.ACCESS);

  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_ROUTE;
    return NextResponse.redirect(url);
  }
  // additional checks or refresh token logic here if needed
  return NextResponse.next();
}

export const config = {
  matcher: ["/my_account/:path*"],
};
