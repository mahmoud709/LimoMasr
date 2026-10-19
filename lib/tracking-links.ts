export function isAdminTrackingPath(path: string) {
  return /^\/(?:(?:ar|en)\/)?admin(?:\/|$)/.test(path);
}
export function contactLinkType(href: string): "whatsapp" | "phone" | null {
  try {
    const url = new URL(href);
    if (url.protocol === "tel:") return url.pathname.trim() ? "phone" : null;
    if (url.protocol === "whatsapp:") return "whatsapp";
    if (["https:", "http:"].includes(url.protocol) && ["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname)) return "whatsapp";
  } catch { /* Ordinary relative links do not represent contact events. */ }
  return null;
}
