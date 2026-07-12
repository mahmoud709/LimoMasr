import type { Booking, Locale, PriceUnit, ServiceType, SiteSettings } from "./types";

export function formatCurrency(value?: number, currency = "EGP", locale: Locale = "ar") {
  if (!value) return locale === "en" ? "Price on request" : "السعر حسب الطلب";
  if (locale === "en") {
    const formattedNum = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);
    return currency === "EGP" ? `${formattedNum} EGP` : `${currency} ${formattedNum}`;
  }
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function priceUnitLabel(unit: PriceUnit, locale: Locale = "ar") {
  const labels: Record<Locale, Record<PriceUnit, string>> = {
    ar: {
      per_hour: "لكل ساعة",
      per_trip: "للرحلة",
      per_person: "للفرد",
    },
    en: {
      per_hour: "per hour",
      per_trip: "per trip",
      per_person: "per person",
    },
  };
  return labels[locale][unit];
}

export function normalizeEgyptPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return `2${digits}`;
  return digits;
}

export function serviceWhatsappNumber(type: ServiceType, settings: SiteSettings) {
  return type === "car"
    ? settings.whatsappCarNumber
    : settings.whatsappServiceNumber;
}

export function buildWhatsappUrl(phone: string, message: string) {
  return `https://wa.me/${normalizeEgyptPhone(phone)}?text=${encodeURIComponent(message)}`;
}

export function bookingMessage(booking: Partial<Booking>, locale: Locale = "ar") {
  if (locale === "en") {
    return [
      "Hello Limo Masr, I want to confirm a booking:",
      `Service: ${booking.serviceName ?? ""}`,
      `Name: ${booking.customerName ?? ""}`,
      `Phone: ${booking.phone ?? ""}`,
      booking.passengers ? `Passengers: ${booking.passengers}` : "",
      booking.notes ? `Notes: ${booking.notes}` : "",
    ].filter(Boolean).join("\n");
  }

  return [
    "مرحبًا ليمو مصر، أريد تأكيد حجز:",
    `الخدمة: ${booking.serviceName ?? ""}`,
    `الاسم: ${booking.customerName ?? ""}`,
    `الهاتف: ${booking.phone ?? ""}`,
    booking.passengers ? `عدد الأفراد: ${booking.passengers}` : "",
    booking.notes ? `ملاحظات: ${booking.notes}` : "",
  ].filter(Boolean).join("\n");
}
