import type { Booking, Locale, PriceUnit, ServiceType, SiteSettings } from "./types";

export interface ExchangeRates {
  usdRate?: number;
  eurRate?: number;
  sarRate?: number;
  qarRate?: number;
  kwdRate?: number;
  bhdRate?: number;
}

export function formatCurrency(
  value: number | undefined, 
  baseCurrency = "USD", 
  locale: Locale = "ar", 
  targetCurrency = "USD", 
  exchangeRates: ExchangeRates | number = 50
) {
  if (!value) return locale === "en" ? "Price on request" : "السعر حسب الطلب";
  
  let rates: ExchangeRates = {};
  if (typeof exchangeRates === "number") {
    rates = { usdRate: exchangeRates, eurRate: 55, sarRate: 13.3, qarRate: 13.7, kwdRate: 160, bhdRate: 130 };
  } else {
    rates = exchangeRates;
  }

  const usdRate = rates.usdRate || 50;
  const eurRate = rates.eurRate || 55;
  const sarRate = rates.sarRate || 13.3;
  const qarRate = rates.qarRate || 13.7;
  const kwdRate = rates.kwdRate || 160;
  const bhdRate = rates.bhdRate || 130;

  // 1. Convert value from baseCurrency to USD first
  let usdValue = value;
  if (baseCurrency === "USD") {
    usdValue = value;
  } else if (baseCurrency === "EGP") {
    usdValue = value / usdRate;
  } else if (baseCurrency === "SAR") {
    usdValue = (value * sarRate) / usdRate;
  } else if (baseCurrency === "EUR") {
    usdValue = (value * eurRate) / usdRate;
  }

  // 2. Convert from USD to targetCurrency
  let displayValue = usdValue;
  if (targetCurrency === "USD") {
    displayValue = usdValue;
  } else if (targetCurrency === "EGP") {
    displayValue = usdValue * usdRate;
  } else if (targetCurrency === "SAR") {
    displayValue = (usdValue * usdRate) / sarRate;
  } else if (targetCurrency === "EUR") {
    displayValue = (usdValue * usdRate) / eurRate;
  } else if (targetCurrency === "QAR") {
    displayValue = (usdValue * usdRate) / qarRate;
  } else if (targetCurrency === "KWD") {
    displayValue = (usdValue * usdRate) / kwdRate;
  } else if (targetCurrency === "BHD") {
    displayValue = (usdValue * usdRate) / bhdRate;
  }

  const finalVal = Math.round(displayValue);

  if (targetCurrency === "USD") {
    return locale === "en" ? `$${finalVal}` : `${finalVal} $`;
  }

  if (targetCurrency === "EGP") {
    const formattedNum = new Intl.NumberFormat("en-US").format(finalVal);
    return locale === "en" ? `${formattedNum} EGP` : `${formattedNum} ج.م`;
  }

  if (locale === "en") {
    const formattedNum = new Intl.NumberFormat("en-US").format(finalVal);
    return `${targetCurrency} ${formattedNum}`;
  }

  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: targetCurrency,
    maximumFractionDigits: 0,
  }).format(finalVal);
}

export function priceUnitLabel(unit: PriceUnit, locale: Locale = "ar") {
  const labels: Record<Locale, Record<PriceUnit, string>> = {
    ar: {
      per_hour: "لكل ساعة",
      per_trip: "للرحلة",
      per_person: "للفرد",
      per_day: "لليوم",
    },
    en: {
      per_hour: "per hour",
      per_trip: "per trip",
      per_person: "per person",
      per_day: "per day",
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
