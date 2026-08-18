"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthRedirect({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not authenticated and we are NOT already on the login page, redirect to login
    if (!isAuthenticated && pathname && !pathname.includes("/admin/login")) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, pathname, router]);

  return null;
}
