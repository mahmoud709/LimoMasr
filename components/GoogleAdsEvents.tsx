"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/gtag";

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
        trackEvent("whatsapp_click", {
          event_category: "lead",
          event_label: "whatsapp",
        });
        return;
      }

      if (href.toLowerCase().startsWith("tel:")) {
        trackEvent("phone_click", {
          event_category: "lead",
          event_label: "phone",
        });
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
