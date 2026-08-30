import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (request.cookies.has("emora_session")) return NextResponse.next();

  const isAdmin = request.nextUrl.pathname.startsWith("/admin");
  const loginUrl = new URL(isAdmin ? "/admin/login" : "/login", request.url);
  if (!isAdmin) loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/app/:path*", "/admin/((?!login).*)"],
};
