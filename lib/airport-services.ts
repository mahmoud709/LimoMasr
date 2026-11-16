import type { Locale } from "./types";
export const airportServices = {
  cairo: { path: "/cairo-airport-transfer", code: "CAI", names: { ar: "مطار القاهرة الدولي", en: "Cairo International Airport" } },
  sphinx: { path: "/sphinx-airport-transfer", code: "SPX", names: { ar: "مطار سفنكس الدولي", en: "Sphinx International Airport" } },
  hurghada: { path: "/hurghada-airport-transfer", code: "HRG", names: { ar: "مطار الغردقة الدولي", en: "Hurghada International Airport" } },
  sharm: { path: "/sharm-airport-transfer", code: "SSH", names: { ar: "مطار شرم الشيخ الدولي", en: "Sharm El Sheikh International Airport" } },
  borg: { path: "/borg-el-arab-airport-transfer", code: "HBE", names: { ar: "مطار برج العرب الدولي", en: "Borg El Arab International Airport" } },
} as const;
export type AirportKey = keyof typeof airportServices;
export function airportCopy(key: AirportKey, locale: Locale) {
  const airport = airportServices[key];
  const name = airport.names[locale];
  const other = airportServices[key === "cairo" ? "sphinx" : "cairo"];
  return locale === "en" ? {
    title: name + " pickup and drop-off",
    intro: "Request a car transfer from " + name + " to your destination, or a transfer from your pickup location to the airport. Share the trip details so our team can review availability and provide a quote.",
    airportCheck: `Check your flight itinerary and make sure the airport is ${name} (${airport.code}). You can also review another airport transfer:`,
    otherPath: other.path, otherLabel: other.names.en + " transfers",
    faqs: [
      { question: "What should I clarify for a pickup at " + name + "?", answer: "Send the flight details and destination. The driver waits until the customer exits without an additional waiting fee; confirm the meeting point and pickup time with the team." },
      { question: "Can I request a car to " + name + " for departure?", answer: "Yes. Include your pickup address, travel date and requested pickup time, and review the arrangements and quote with the team." },
      { question: "Does this request include Fast Track?", answer: "This form requests car transport. Fast Track is available only at Cairo International Airport and must be requested separately." },
    ],
    arrival: "Arrival: airport pickup", arrivalText: "Tell us your arrival date and time, destination, passenger count and luggage requirements.",
    departure: "Departure: airport drop-off", departureText: "Tell us your pickup address, travel date, requested pickup time, passenger count and luggage requirements.",
    details: ["Pickup and destination locations", "Date and requested pickup time", "Number of passengers and luggage", "Preferred vehicle and a complete contact phone number"],
    heading: "Details for your transfer request", note: "Submitting a request starts a booking enquiry. Confirm availability, the price and arrangements with the team before your trip.",
  } : {
    title: "استقبال وتوصيل " + name,
    intro: "اطلب سيارة للاستقبال من " + name + " إلى وجهتك، أو للتوصيل من مكان الانطلاق إلى المطار. أرسل تفاصيل الرحلة لمراجعة التوافر وطلب عرض سعر.",
    airportCheck: `راجع تذكرة رحلتك وتأكد أن المطار هو ${name} (${airport.code}). يمكنك أيضًا مراجعة نقل مطار آخر:`,
    otherPath: other.path, otherLabel: "نقل " + other.names.ar,
    faqs: [
      { question: "ماذا أوضح لطلب استقبال من " + name + "؟", answer: "أرسل بيانات الرحلة والوجهة. ينتظر السائق حتى خروج العميل دون رسوم انتظار إضافية؛ راجع نقطة اللقاء والموعد مع الفريق." },
      { question: "هل يمكن طلب توصيل إلى " + name + " للمغادرة؟", answer: "نعم. اذكر عنوان الانطلاق وتاريخ الرحلة ووقت الانطلاق المطلوب، وراجع الترتيبات وعرض السعر مع الفريق." },
      { question: "هل يشمل الطلب فاست تراك؟", answer: "هذا النموذج لطلب النقل بالسيارة. فاست تراك متاحة حصريًا في مطار القاهرة الدولي ويُطلب حجزها بشكل منفصل." },
    ],
    arrival: "الوصول: استقبال من المطار", arrivalText: "حدد تاريخ ووقت الوصول ووجهتك وعدد الركاب واحتياجات الأمتعة.",
    departure: "المغادرة: توصيل إلى المطار", departureText: "حدد عنوان الانطلاق وتاريخ الرحلة ووقت الانطلاق المطلوب وعدد الركاب والأمتعة.",
    details: ["مكان الانطلاق والوجهة", "التاريخ ووقت الانطلاق المطلوب", "عدد الركاب والأمتعة", "السيارة المفضلة ورقم هاتف كامل للتواصل"],
    heading: "بيانات طلب النقل", note: "إرسال الطلب يبدأ الاستفسار عن الحجز. راجع التوافر والسعر وترتيبات الخدمة مع الفريق قبل رحلتك.",
  };
}
