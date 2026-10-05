import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Locale } from "./types";

export const SITE_URL = "https://www.limo-egypt.com";
export type SeoProps = { searchParams?: Promise<{ __locale?: string }> };

export async function seoLocale(props: SeoProps): Promise<Locale> {
  const params = await props.searchParams;
  const stored = (await cookies()).get("NEXT_LOCALE")?.value;
  return (params?.__locale || stored) === "en" ? "en" : "ar";
}

export function localizedUrl(path: string, locale: Locale) {
  return `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
}

export function pageMetadata(path: string, locale: Locale, title: string, description: string, images: string[] = []): Metadata {
  const url = localizedUrl(path, locale);
  return {
    title, description,
    alternates: {
      canonical: url,
      languages: { "ar-EG": localizedUrl(path, "ar"), en: localizedUrl(path, "en"), "x-default": localizedUrl(path, "ar") },
    },
    openGraph: { title, description, url, siteName: "Limo Egypt", locale: locale === "ar" ? "ar_EG" : "en_US", type: "website", ...(images.length ? { images } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(images.length ? { images } : {}) },
  };
}

export const serviceSeo = {
  "/": {
    ar: ["ليمو مصر | حجز فنادق وليموزين وخدمات المطارات", "احجز خدمات رحلتك في مصر مع ليمو مصر: سيارات وليموزين، فنادق وشقق فندقية، فاست تراك وحجز طيران. أرسل تفاصيل رحلتك لطلب عرض سعر."],
    en: ["Limo Egypt | Hotels, Limousine & Airport Services", "Plan your Egypt trip with Limo Egypt: limousine and car booking, hotels, serviced apartments, airport fast track and flights. Request a tailored quote."],
  },
  "/cars": {
    ar: ["حجز سيارات وليموزين في مصر | ليمو مصر", "استعرض سيارات ليمو مصر وقارن الموديلات وعدد المقاعد وأسعار الحجز. اختر السيارة المناسبة لرحلتك واطلب الحجز عبر الموقع أو واتساب."],
    en: ["Car & Limousine Booking in Egypt | Limo Egypt", "Explore the Limo Egypt fleet, compare models, seating and booking prices, and choose a car for your trip. Request your booking online or via WhatsApp."],
  },
  "/hotels": {
    ar: ["حجز فنادق في مصر وطلب عروض إقامة | ليمو مصر", "اطلب عرض حجز فندق في مصر حسب المدينة والميزانية. أرسل تواريخ الوصول والمغادرة وعدد الضيوف لمراجعة خيارات الإقامة وتأكيد التفاصيل عبر واتساب."],
    en: ["Hotel Booking in Egypt & Stay Quotes | Limo Egypt", "Request an Egypt hotel quote by city and budget. Share your arrival and departure dates and guest count to review accommodation options via WhatsApp."],
  },
  "/hotel-apartments": {
    ar: ["حجز شقق فندقية في مصر | ليمو مصر", "استعرض خيارات الشقق الفندقية في مصر واطلب عرض إقامة حسب الموقع وعدد الضيوف ومدة الرحلة. تواصل مع ليمو مصر لتأكيد التوافر وتفاصيل الحجز."],
    en: ["Serviced Apartment Booking in Egypt | Limo Egypt", "Explore serviced apartments in Egypt and request a stay quote by location, guest count and trip duration. Contact Limo Egypt to confirm availability."],
  },
  "/fast-track": {
    ar: ["فاست تراك وخدمات المطارات في مصر | ليمو مصر", "استعرض باقات فاست تراك وخدمات المطارات لدى ليمو مصر. أرسل المطار وموعد الرحلة وعدد المسافرين لتأكيد الخدمة والتوافر والسعر قبل الحجز."],
    en: ["Airport Fast Track Services in Egypt | Limo Egypt", "Explore airport fast track packages from Limo Egypt. Share your airport, flight time and passenger count to confirm service details, availability and price."],
  },
  "/flights": {
    ar: ["حجز طيران وطلب عروض رحلات | ليمو مصر", "اطلب عرض حجز طيران مع ليمو مصر. حدد وجهة السفر والتواريخ وعدد المسافرين لمراجعة الخيارات المتاحة وتأكيد السعر وتفاصيل الرحلة قبل الحجز."],
    en: ["Flight Booking & Travel Quotes | Limo Egypt", "Request a flight quote with Limo Egypt. Share your destination, travel dates and passenger count to review available options and confirm booking details."],
  },
  "/about": {
    ar: ["من نحن وخدمات السفر في مصر | ليمو مصر", "تعرف على ليمو مصر وخدمات حجز السيارات والليموزين والفنادق والشقق الفندقية والطيران وخدمات المطارات، وكيفية التواصل لتنظيم رحلتك."],
    en: ["About Our Egypt Travel Services | Limo Egypt", "Learn about Limo Egypt and our car, limousine, hotel, serviced apartment, flight and airport services. Contact our team to arrange your trip."],
  },
  "/contact": {
    ar: ["تواصل لحجز فنادق وسيارات وخدمات سفر | ليمو مصر", "تواصل مع ليمو مصر للاستفسار عن حجز السيارات والفنادق والشقق الفندقية والطيران وخدمات المطارات. أرسل تفاصيل رحلتك لطلب عرض سعر."],
    en: ["Contact Us for Bookings & Travel Quotes | Limo Egypt", "Contact Limo Egypt about cars, hotels, serviced apartments, flights and airport services. Send your trip details to request a booking quote."],
  },
  "/blog": {
    ar: ["دليل السفر والإقامة والتنقل في مصر | مدونة ليمو مصر", "اقرأ أدلة ليمو مصر عن السفر والإقامة والتنقل وخدمات المطارات، واستكشف الخدمات المناسبة للتخطيط لرحلتك إلى مصر."],
    en: ["Egypt Travel, Stay & Transport Guides | Limo Egypt", "Read Limo Egypt guides on travel, accommodation, transport and airport services, and explore the services available for planning your Egypt trip."],
  },
} as const;

export function serviceMetadata(path: keyof typeof serviceSeo) {
  return async (props: SeoProps): Promise<Metadata> => {
    const locale = await seoLocale(props);
    const [title, description] = serviceSeo[path][locale];
    return pageMetadata(path, locale, title, description);
  };
}
