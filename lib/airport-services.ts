import type { Locale } from "./types";
export const airportServices = {
  cairo: { path: "/cairo-airport-transfer", code: "CAI", names: { ar: "مطار القاهرة الدولي", en: "Cairo International Airport" } },
  sphinx: { path: "/sphinx-airport-transfer", code: "SPX", names: { ar: "مطار سفنكس الدولي", en: "Sphinx International Airport" } },
} as const;
export type AirportKey = keyof typeof airportServices;
export function airportCopy(key: AirportKey, locale: Locale) {
  const airport = airportServices[key];
  const name = airport.names[locale];
  const other = airportServices[key === "cairo" ? "sphinx" : "cairo"];
  return locale === "en" ? {
    title: name + " pickup and drop-off",
    intro: "Request a car transfer from " + name + " to your destination, or a transfer from your pickup location to the airport. Share the trip details so our team can review availability and provide a quote.",
    airportCheck: key === "cairo" ? "Check that your flight uses Cairo International Airport (CAI). If your itinerary uses Sphinx (SPX), use the Sphinx transfer page instead." : "Check that your flight uses Sphinx International Airport (SPX). A Cairo Airport (CAI) transfer request refers to a different airport.",
    otherPath: other.path, otherLabel: other.names.en + " transfers",
    faqs: [
      { question: "What should I clarify for a pickup at " + name + "?", answer: "Send the flight details and destination. Ask the team to confirm the meeting point, pickup time and any waiting terms; submitting this form does not guarantee these details." },
      { question: "Can I request a car to " + name + " for departure?", answer: "Yes. Include your pickup address, travel date and requested pickup time, and review the arrangements and quote with the team." },
      { question: "Does this request include Fast Track?", answer: "This page is for car transportation. Fast Track availability at this airport is not confirmed here and must be checked separately." },
    ],
    arrival: "Arrival: airport pickup", arrivalText: "Tell us your arrival date and time, destination, passenger count and luggage requirements.",
    departure: "Departure: airport drop-off", departureText: "Tell us your pickup address, travel date, requested pickup time, passenger count and luggage requirements.",
    details: ["Pickup and destination locations", "Date and requested pickup time", "Number of passengers and luggage", "Preferred vehicle and a complete contact phone number"],
    heading: "Details for your transfer request", note: "Submitting a request starts a booking enquiry. Confirm availability, the price and arrangements with the team before your trip.",
  } : {
    title: "استقبال وتوصيل " + name,
    intro: "اطلب سيارة للاستقبال من " + name + " إلى وجهتك، أو للتوصيل من مكان الانطلاق إلى المطار. أرسل تفاصيل الرحلة لمراجعة التوافر وطلب عرض سعر.",
    airportCheck: key === "cairo" ? "تأكد أن رحلتك تستخدم مطار القاهرة الدولي (CAI). إذا كان المطار في تذكرتك سفنكس (SPX)، استخدم صفحة نقل سفنكس." : "تأكد أن رحلتك تستخدم مطار سفنكس الدولي (SPX). طلب نقل مطار القاهرة (CAI) يخص مطارًا مختلفًا.",
    otherPath: other.path, otherLabel: "نقل " + other.names.ar,
    faqs: [
      { question: "ماذا أوضح لطلب استقبال من " + name + "؟", answer: "أرسل بيانات الرحلة والوجهة. اطلب تأكيد نقطة اللقاء وموعد الاستقبال وشروط الانتظار مع الفريق؛ إرسال النموذج لا يضمن هذه التفاصيل." },
      { question: "هل يمكن طلب توصيل إلى " + name + " للمغادرة؟", answer: "نعم. اذكر عنوان الانطلاق وتاريخ الرحلة ووقت الانطلاق المطلوب، وراجع الترتيبات وعرض السعر مع الفريق." },
      { question: "هل يشمل الطلب فاست تراك؟", answer: "هذه الصفحة للنقل بالسيارة. توافر فاست تراك في هذا المطار غير مؤكد هنا ويحتاج إلى مراجعة منفصلة." },
    ],
    arrival: "الوصول: استقبال من المطار", arrivalText: "حدد تاريخ ووقت الوصول ووجهتك وعدد الركاب واحتياجات الأمتعة.",
    departure: "المغادرة: توصيل إلى المطار", departureText: "حدد عنوان الانطلاق وتاريخ الرحلة ووقت الانطلاق المطلوب وعدد الركاب والأمتعة.",
    details: ["مكان الانطلاق والوجهة", "التاريخ ووقت الانطلاق المطلوب", "عدد الركاب والأمتعة", "السيارة المفضلة ورقم هاتف كامل للتواصل"],
    heading: "بيانات طلب النقل", note: "إرسال الطلب يبدأ الاستفسار عن الحجز. راجع التوافر والسعر وترتيبات الخدمة مع الفريق قبل رحلتك.",
  };
}
