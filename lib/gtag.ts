export const GOOGLE_ADS_ID = "AW-18470016597";
export const BOOKING_SUCCESS_CONVERSION_LABEL = "IOV4CMdqqu4oDENWsmOAE";
export const BOOKING_SUCCESS_CONVERSION_SEND_TO = `${GOOGLE_ADS_ID}/${BOOKING_SUCCESS_CONVERSION_LABEL}`;
export const WHATSAPP_CLICK_CONVERSION_LABEL = "92vCCMPpvIodENWsmOdE";
export const WHATSAPP_CLICK_CONVERSION_SEND_TO = `${GOOGLE_ADS_ID}/${WHATSAPP_CLICK_CONVERSION_LABEL}`;
export const PHONE_CLICK_CONVERSION_LABEL = "sGzSCJugyYodENWsmOdE";
export const PHONE_CLICK_CONVERSION_SEND_TO = `${GOOGLE_ADS_ID}/${PHONE_CLICK_CONVERSION_LABEL}`;

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params: GtagParams = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }

  window.dataLayer.push(["event", eventName, params]);
}

export function trackWhatsappClick() {
  trackEvent("whatsapp_click", {
    event_category: "lead",
    event_label: "whatsapp",
  });
  trackEvent("conversion", {
    send_to: WHATSAPP_CLICK_CONVERSION_SEND_TO,
  });
}

export function trackPhoneClick() {
  trackEvent("phone_click", {
    event_category: "lead",
    event_label: "phone",
  });
  trackEvent("conversion", {
    send_to: PHONE_CLICK_CONVERSION_SEND_TO,
  });
}
