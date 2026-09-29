"use client";

import { useEffect } from "react";
import { trackPhoneClick, trackWhatsappClick } from "@/lib/gtag";

function isWhatsappHref(href: string) {
  const normalized = href.toLowerCase();
  return (
    normalized.startsWith("whatsapp:") ||
    normalized.includes("wa.me/") ||
    normalized.includes("api.whatsapp.com/") ||
    normalized.includes("web.whatsapp.com/")
  );
}

export function GoogleAdsEvents() {
  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.href || link.getAttribute("href") || "";

      if (isWhatsappHref(href)) {
        trackWhatsappClick();
        return;
      }

      if (href.toLowerCase().startsWith("tel:")) {
        trackPhoneClick();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
