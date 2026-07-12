import { proxy } from "./proxy";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  return proxy(req);
}

export const config = {
  matcher: [
    // Apply middleware to all pages except api, _next/static, _next/image, and favicon.ico
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
