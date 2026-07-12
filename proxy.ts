import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1. Let internal, API, and static files pass through directly
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    req.headers.has("x-locale-rewritten") ||
    req.nextUrl.searchParams.has("__locale")
  ) {
    return NextResponse.next();
  }

  // 2. Protect Admin dashboard
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const token = req.cookies.get("admin-token")?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. Detect and handle path-prefixed locale routing (/en/... or /ar/...)
  const hasEnPrefix = pathname.startsWith("/en");
  const hasArPrefix = pathname.startsWith("/ar");

  if (hasEnPrefix || hasArPrefix) {
    const locale = hasEnPrefix ? "en" : "ar";
    
    // Extract pathname after language prefix
    let restOfPath = pathname.substring(3);
    if (restOfPath === "") {
      restOfPath = "/";
    }

    // Rewrite internally to the page without language prefix
    const rewriteUrl = new URL(`${restOfPath}${search}`, req.url);
    rewriteUrl.searchParams.set("__locale", locale);

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-locale-rewritten", "true");

    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });

    // Persist language cookie
    response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
    return response;
  }

  // 4. Default: No prefix. Redirect to the stored locale, or default to Arabic
  const storedLocale = req.cookies.get("NEXT_LOCALE")?.value || "ar";
  const locale = storedLocale === "en" ? "en" : "ar";

  // Redirect client to /locale/pathname
  const redirectUrl = new URL(`/${locale}${pathname === "/" ? "" : pathname}${search}`, req.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    // Apply middleware to all pages except api, _next/static, _next/image, favicon.ico and specific asset file types
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
