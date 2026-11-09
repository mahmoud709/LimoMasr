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
  "/hurghada-airport-transfer": { ar: ["نقل مطار الغردقة | ليمو مصر", "اطلب سيارة بسائق للاستقبال من مطار الغردقة أو التوصيل إليه، وراجع التوافر وتفاصيل الرحلة مع الفريق."], en: ["Hurghada Airport Transfers | Limo Egypt", "Request a chauffeured pickup from or drop-off at Hurghada Airport and review availability and trip details with the team."] },
  "/sharm-airport-transfer": { ar: ["نقل مطار شرم الشيخ | ليمو مصر", "اطلب سيارة بسائق للاستقبال من مطار شرم الشيخ أو التوصيل إليه، وراجع التوافر وتفاصيل الرحلة مع الفريق."], en: ["Sharm El Sheikh Airport Transfers | Limo Egypt", "Request a chauffeured pickup from or drop-off at Sharm El Sheikh Airport and review availability and trip details with the team."] },
  "/borg-el-arab-airport-transfer": { ar: ["نقل مطار برج العرب | ليمو مصر", "اطلب سيارة بسائق للاستقبال من مطار برج العرب أو التوصيل إليه، وراجع التوافر وتفاصيل الرحلة مع الفريق."], en: ["Borg El Arab Airport Transfers | Limo Egypt", "Request a chauffeured pickup from or drop-off at Borg El Arab Airport and review availability and trip details with the team."] },
  "/private-tours": { ar: ["رحلات سياحية خاصة في مصر | ليمو مصر", "اطلب رحلة سياحية خاصة في القاهرة والجيزة والإسكندرية وشرم الشيخ والغردقة والأقصر، وحدد مدتها مع فريق ليمو مصر."], en: ["Private Egypt Tour Enquiries | Limo Egypt", "Enquire about private trips in Cairo, Giza, Alexandria, Sharm El Sheikh, Hurghada and Luxor; discuss the itinerary and duration with our team."] },
  "/blog/booking-guides/airport-fast-track": {
    ar: ["دليل طلب فاست تراك في المطارات | ليمو مصر", "تعرف على المعلومات والأسئلة التي تجهزها عند الاستفسار عن فاست تراك ومساعدة المسافرين بالمطار."],
    en: ["Airport Fast Track Request Guide | Limo Egypt", "Prepare the details and questions for an airport Fast Track assistance enquiry."],
  },
  "/blog/booking-guides/flight-quote": {
    ar: ["كيف تطلب عرض حجز طيران؟ | ليمو مصر", "جهز الوجهة والتواريخ وبيانات المسافرين، وراجع شروط الأمتعة والتعديل قبل تأكيد عرض الطيران."],
    en: ["How to Request a Flight Quote | Limo Egypt", "Prepare your itinerary and passenger details and review baggage and change terms before confirming a flight quote."],
  },
  "/blog/booking-guides/serviced-apartment": {
    ar: ["دليل اختيار شقة فندقية في مصر | ليمو مصر", "حدد موقع الإقامة والسعة والمرافق والميزانية، وراجع شروط الشقة قبل تأكيد العرض."],
    en: ["Serviced Apartment Enquiry Guide for Egypt | Limo Egypt", "Plan your location, capacity, amenities and budget and review apartment terms before confirming an offer."],
  },
  "/blog/booking-guides/cairo-airport-transfer": {
    ar: ["دليل طلب استقبال مطار القاهرة | ليمو مصر", "جهز بيانات وصولك أو مغادرتك، والركاب والأمتعة، والأسئلة التي تساعدك في طلب سيارة لمطار القاهرة."],
    en: ["Cairo Airport Transfer Request Guide | Limo Egypt", "Prepare your arrival or departure, passenger and luggage details and questions before requesting a Cairo Airport transfer."],
  },
  "/blog/booking-guides/car-with-driver": {
    ar: ["كيف تطلب سيارة بسائق في مصر؟ | ليمو مصر", "دليل عملي لتحديد خط السير وعدد الركاب واختيار السيارة ومراجعة عرض السعر قبل طلب سيارة بسائق."],
    en: ["How to Request a Car with Driver in Egypt | Limo Egypt", "Plan your route, passenger needs and vehicle choice, and review your quote before requesting a car with a driver."],
  },
  "/blog/booking-guides/hotel-apartment-quotes": {
    ar: ["دليل طلب عروض الفنادق والشقق الفندقية | ليمو مصر", "جهز تفاصيل الإقامة وقارن الموقع والغرف والسعر والشروط قبل تأكيد عرض الفندق أو الشقة الفندقية."],
    en: ["Hotel and Serviced Apartment Quote Guide | Limo Egypt", "Prepare your stay details and compare location, rooms, price and terms before confirming a hotel or serviced apartment offer."],
  },
  "/car-with-driver": {
    ar: ["سيارة بسائق في مصر | ليمو مصر", "اطلب سيارة بسائق لرحلتك في مصر. اختر السيارة وأرسل خط السير والموعد وعدد الركاب لمراجعة التوافر وطلب عرض سعر."],
    en: ["Car with Driver in Egypt | Limo Egypt", "Request a car with a driver in Egypt. Choose a vehicle and share your itinerary, date and passenger count for an availability check and quote."],
  },
  "/airports": {
    ar: ["المطارات وخدمات الاستقبال والتوصيل | ليمو مصر", "اختر مطار القاهرة أو سفنكس أو الغردقة أو شرم الشيخ أو برج العرب لطلب استقبال أو توصيل بالسيارة."],
    en: ["Airport Pickup & Drop-off Services | Limo Egypt", "Request car pickup or drop-off at Cairo, Sphinx, Hurghada, Sharm El Sheikh or Borg El Arab Airport."],
  },
"/stays": {"ar":["حجز فنادق وشقق فندقية في مصر | ليمو مصر","اختر الفنادق والشقق الفندقية وأرسل تفاصيل الإقامة لطلب عرض حجز."],"en":["Hotels & Serviced Apartments in Egypt | Limo Egypt","Explore hotels and serviced apartments and request a stay quote."]},
"/privacy": {"ar":["سياسة الخصوصية وحماية البيانات | ليمو مصر","راجع سياسة الخصوصية والتعامل مع بيانات التواصل والحجز."],"en":["Privacy & Customer Data Policy | Limo Egypt","Read our policy covering contact information and booking data."]},
"/policies": {"ar":["الشروط والأحكام وسياسات الحجز | ليمو مصر","راجع شروط الخدمات وسياسات طلب الحجز قبل ترتيب رحلتك."],"en":["Terms, Conditions & Booking Policies | Limo Egypt","Review our service terms and booking policies before arranging your trip."]},
"/cairo-airport-transfer": {"ar":["ليموزين مطار القاهرة للاستقبال والتوصيل | ليمو مصر","اطلب سيارة للاستقبال من مطار القاهرة الدولي أو التوصيل إليه. أرسل تفاصيل الرحلة لطلب عرض سعر."],"en":["Cairo Airport Pickup & Drop-off Transfers | Limo Egypt","Request Cairo International Airport pickup or drop-off. Share your trip details for a transfer quote."]},
"/sphinx-airport-transfer": {"ar":["ليموزين مطار سفنكس للاستقبال والتوصيل | ليمو مصر","اطلب خدمة نقل من مطار سفنكس الدولي أو إليه وأرسل الموعد والركاب والأمتعة لطلب عرض سعر."],"en":["Sphinx Airport Pickup & Drop-off Transfers | Limo Egypt","Request transfers to or from Sphinx International Airport. Share your travel details for a quote."]},
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
  "/business-travel": {
    ar: ["نقل الشركات والمؤتمرات في مصر | ليمو مصر", "اطلب خدمات نقل الشركات والوفود والمؤتمرات في مصر، مع سيارات خاصة وتنظيم تنقلات الفعاليات والرحلات حسب احتياج شركتك."],
    en: ["Business Travel & Conference Transport in Egypt | Limo Egypt", "Request corporate transportation, delegation transfers and event travel services in Egypt, tailored to your company’s itinerary."],
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
