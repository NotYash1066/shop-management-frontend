import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = (
  process.env.BACKEND_PROXY_URL || "http://13.232.109.22/shop-api"
).replace(/\/$/, "");

export function middleware(request: NextRequest) {
  const destination = `${BACKEND_BASE}${request.nextUrl.pathname}${request.nextUrl.search}`;
  return NextResponse.rewrite(new URL(destination));
}

export const config = {
  matcher: "/api/:path*"
};