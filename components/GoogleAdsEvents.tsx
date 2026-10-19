"use client";
import { useEffect } from "react";
import { trackPhoneClick, trackWhatsappClick } from "@/lib/gtag";
import { contactLinkType, isAdminTrackingPath } from "@/lib/tracking-links";
export function GoogleAdsEvents() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Check every click, including after navigation into or out of the admin area.
      if (isAdminTrackingPath(window.location.pathname)) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const kind = contactLinkType(link.href);
      if (kind === "whatsapp") trackWhatsappClick();
      else if (kind === "phone") trackPhoneClick();
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);
  return null;
}
