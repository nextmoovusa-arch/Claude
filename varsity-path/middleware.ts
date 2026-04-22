import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  // Allow admin routes without authentication for testing
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Allow other public routes
  if (
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/sign-up") ||
    req.nextUrl.pathname.startsWith("/api/webhooks/clerk")
  ) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
