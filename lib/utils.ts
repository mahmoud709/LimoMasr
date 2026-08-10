import type { Booking, Locale, PriceUnit, ServiceType, SiteSettings } from "./types";

export function formatCurrency(
  value: number | undefined, 
  baseCurrency = "EGP", 
  locale: Locale = "ar", 
  targetCurrency = "EGP", 
  exchangeRate = 50
) {
  if (!value) return locale === "en" ? "Price on request" : "السعر حسب الطلب";
  
  // Convert from base currency to target currency if needed
  let displayValue = value;
  
  if (baseCurrency === "EGP" && targetCurrency !== "EGP") {
    displayValue = value / exchangeRate;
  } else if (baseCurrency !== "EGP" && targetCurrency === "EGP") {
    displayValue = value * exchangeRate;
  }

  // Cap fast track original USD prices if they're shown as EGP (or whatever)
  
  if (locale === "en") {
    const formattedNum = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: targetCurrency === "USD" ? 2 : 0,
    }).format(displayValue);
    return targetCurrency === "EGP" ? `${formattedNum} EGP` : `${targetCurrency} ${formattedNum}`;
  }
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: targetCurrency,
    maximumFractionDigits: targetCurrency === "USD" ? 2 : 0,
  }).format(displayValue);
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
      "Hello Limo Egypt, I want to confirm a booking:",
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

export function toWesternNumerals(str: string): string {
  if (!str) return "";
  const arNums = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let res = str;
  for (let i = 0; i < 10; i++) {
    res = res.replace(new RegExp(arNums[i], "g"), i.toString());
  }
  return res;
}

export function formatArticleDate(dateStr: string, isEn: boolean): string {
  if (!dateStr) return "";
  if (!isEn) return dateStr;

  let clean = toWesternNumerals(dateStr);

  const monthMap: Record<string, string> = {
    "يناير": "January",
    "فبراير": "February",
    "مارس": "March",
    "أبريل": "April",
    "ابريل": "April",
    "مايو": "May",
    "يونيو": "June",
    "يوليو": "July",
    "أغسطس": "August",
    "اغسطس": "August",
    "سبتمبر": "September",
    "أكتوبر": "October",
    "اكتوبر": "October",
    "نوفمبر": "November",
    "ديسمبر": "December"
  };

  for (const [arMonth, enMonth] of Object.entries(monthMap)) {
    if (clean.includes(arMonth)) {
      const parts = clean.split(/\s+/).filter(Boolean);
      const day = parts.find(p => /^\d{1,2}$/.test(p)) || "";
      const year = parts.find(p => /^\d{4}$/.test(p)) || "";
      if (day && year) {
        return `${enMonth} ${day}, ${year}`;
      } else if (day) {
        return `${enMonth} ${day}`;
      }
      return clean.replace(arMonth, enMonth);
    }
  }

  return clean;
}

export function formatArticleReadTime(readTimeStr: string, isEn: boolean): string {
  if (!readTimeStr) return "";
  if (!isEn) return readTimeStr;

  const clean = toWesternNumerals(readTimeStr);
  const match = clean.match(/(\d+)/);
  if (match) {
    const mins = match[1];
    return `${mins} min read`;
  }

  return readTimeStr;
}
