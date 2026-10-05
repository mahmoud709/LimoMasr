import Link from "next/link";
import { serviceContent } from "@/lib/service-content";
import { withLang } from "@/lib/i18n";
import { buildWhatsappUrl, serviceWhatsappNumber } from "@/lib/utils";
import type { Locale, ServiceType, SiteSettings } from "@/lib/types";

const services: { type: ServiceType; path: string; ar: string; en: string }[] = [
  { type: "car", path: "/cars", ar: "حجز سيارات وليموزين", en: "Cars and limousines" },
  { type: "hotel", path: "/hotels", ar: "حجز فنادق", en: "Hotel booking" },
  { type: "apartment", path: "/hotel-apartments", ar: "شقق فندقية", en: "Serviced apartments" },
  { type: "fast_track", path: "/fast-track", ar: "فاست تراك المطارات", en: "Airport fast track" },
  { type: "flight", path: "/flights", ar: "حجز طيران", en: "Flight booking" },
];

export function ServiceBookingGuide({ type, locale, settings }: { type: ServiceType; locale: Locale; settings: SiteSettings }) {
  const content = serviceContent[type][locale];
  const en = locale === "en";
  const phone = serviceWhatsappNumber(type, settings);
  const service = services.find(item => item.type === type)!;
  return (
    <section aria-labelledby={`guide-${type}`} className="mx-auto w-full max-w-7xl px-6 md:px-8 py-16 text-[#1a2b3c]">
      <h2 id={`guide-${type}`} className="text-2xl md:text-3xl font-black mb-5">{content.title}</h2>
      <p className="max-w-3xl leading-8 text-[#1a2b3c]/80">{content.intro}</p>
      <div className="grid gap-10 md:grid-cols-2 mt-10">
        <div>
          <h3 className="text-xl font-bold mb-4">{en ? "Details to prepare for your request" : "بيانات جهّزها قبل إرسال الطلب"}</h3>
          <ul className="list-disc ps-6 space-y-3 leading-7">
            {content.checklist.map(item => <li key={item}>{item}</li>)}
          </ul>
          {phone && <a className="inline-flex mt-6 rounded-xl bg-[#1a2b3c] text-white px-6 py-3 font-bold focus-visible:outline-2 focus-visible:outline-offset-4" href={buildWhatsappUrl(phone, en ? `Hello Limo Egypt, I would like to ask about ${service.en}.` : `مرحبًا ليمو مصر، أريد الاستفسار عن ${service.ar}.`)} target="_blank" rel="noreferrer">{en ? "Ask about this service on WhatsApp" : "استفسر عن الخدمة عبر واتساب"}</a>}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">{en ? "Booking questions" : "أسئلة مهمة قبل الحجز"}</h3>
          {content.faqs.map(faq => <details key={faq.question} className="border-b border-[#1a2b3c]/15 py-4">
            <summary className="cursor-pointer font-bold leading-7 focus-visible:outline-2">{faq.question}</summary>
            <p className="pt-3 leading-7 text-[#1a2b3c]/80">{faq.answer}</p>
          </details>)}
        </div>
      </div>
      <nav aria-label={en ? "Related travel services" : "خدمات سفر مرتبطة"} className="mt-12 border-t border-[#1a2b3c]/15 pt-6">
        <h3 className="font-bold mb-4">{en ? "Plan the rest of your trip" : "كمّل ترتيبات رحلتك"}</h3>
        <div className="flex flex-wrap gap-3">{services.filter(item => item.type !== type).map(item => <Link key={item.type} href={withLang(item.path, locale)} className="rounded-full border border-[#1a2b3c]/20 px-4 py-2 hover:bg-[#1a2b3c] hover:text-white transition-colors">{en ? item.en : item.ar}</Link>)}</div>
      </nav>
    </section>
  );
}
