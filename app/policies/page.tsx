import { serviceMetadata } from "@/lib/seo";
export const generateMetadata = serviceMetadata("/policies");
import { PublicLayout } from "@/components/PublicLayout";
import { getSiteSettings } from "@/lib/data";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

export default async function PoliciesPage({ searchParams }: { searchParams?: Promise<{ __locale?: string }> }) {
  const [settings, cookieStore, resolvedSearchParams] = await Promise.all([
    getSiteSettings(),
    cookies(),
    searchParams
  ]);
  
  const locale = (resolvedSearchParams?.__locale || cookieStore.get('NEXT_LOCALE')?.value || 'ar') as Locale;
  const isEn = locale === 'en';

  const defaultContentEn = [
    {
      title: "Service Scope & Overview",
      content: "Limo Egypt offers chauffeur-driven car requests across Egypt and airport transfers including Cairo, Sphinx, Hurghada, Sharm El Sheikh and Borg El Arab. Fast Track is available exclusively at Cairo International Airport. Check package availability and inclusions with the team."
    },
    {
      title: "Booking & Instant Confirmation",
      content: "Requests submitted through the website or official channels are reviewed by the team. Contact the team to confirm availability and booking details; a submitted request is not itself a confirmed reservation."
    },
    {
      title: "Pricing, Tolls & Multi-Currency",
      content: "According to the company, the displayed car price includes trip costs, including the driver, fuel, luggage, road and bridge fees, parking, unlimited waiting until the customer exits, and additional stops, with no additional charge. Share the complete itinerary with the team. Hotel and apartment prices not listed on the site are communicated directly; the company states it adds no booking fee for these stays."
    },
    {
      title: "Flight Tracking & Complimentary Waiting",
      content: "The driver waits until the customer exits; waiting and parking are included in the displayed car price without an additional charge. Confirm the meeting point and flight-monitoring arrangements with the team."
    },
    {
      title: "Cancellation & Refund Policy",
      content: "Car and limousine bookings and Fast Track bookings can be cancelled with a refund free of charge at least 48 hours before the service. Hotel cancellations and refunds follow the individual hotel's policy; flight tickets follow the airline's policy. For serviced apartments, an advance deposit of at least one day's rent is non-refundable under the owners' policy. Without a deposit, customers can only choose from apartments available during their stay. For car or Fast Track cancellations within 48 hours, ask the team about the applicable conditions. Contact customer service to request cancellation; customer self-service cancellation is temporarily unavailable."
    },
    {
      title: "Delivery & Service Fulfillment Policy",
      content: "Payment is arranged directly with the company through WhatsApp; the website does not currently have an online payment gateway. Confirm payment, service arrangements and proof of booking with the team."
    },
    {
      title: "Vehicle Integrity & Safety Standards",
      content: "To maintain maximum comfort and hygiene for all distinguished guests, smoking is strictly prohibited inside all Limo Egypt vehicles. Luggage volume must align with the booked vehicle category capacity."
    }
  ];

  const defaultContentAr = [
    {
      title: "نطاق الخدمات ونظرة عامة",
      content: "توفر ليمو مصر طلب سيارات بسائق في أنحاء الجمهورية وخدمات نقل المطارات، ومنها القاهرة وسفنكس والغردقة وشرم الشيخ وبرج العرب. فاست تراك متاحة حصريًا في مطار القاهرة الدولي. راجع مع الفريق توافر الباقات ومحتواها."
    },
    {
      title: "حجز وتأكيد الرحلات",
      content: "يراجع الفريق الطلبات المقدمة عبر الموقع أو قنوات التواصل الرسمية. تواصل مع الفريق لتأكيد التوافر وتفاصيل الحجز؛ إرسال الطلب وحده لا يعني تأكيد الحجز."
    },
    {
      title: "الأسعار والرسوم وتعدد العملات",
      content: "بحسب الشركة، يشمل سعر السيارة المعروض تكاليف الرحلة بما فيها السائق والبنزين والحقائب ورسوم الطرق والكباري والمواقف والانتظار المفتوح حتى خروج العميل والتوقفات الإضافية دون أي مبلغ إضافي. وضّح خط السير كاملًا للفريق. أسعار الفنادق والشقق غير المعروضة تُحدد بالتواصل المباشر، وتؤكد الشركة عدم إضافة رسوم حجز لهذه الإقامات."
    },
    {
      title: "تتبع الرحلات الجوية ووقت الانتظار",
      content: "ينتظر السائق حتى خروج العميل؛ الانتظار والمواقف مشمولان في سعر السيارة المعروض دون رسوم إضافية. راجع نقطة اللقاء وترتيبات متابعة الرحلة مع الفريق."
    },
    {
      title: "سياسة الإلغاء والاسترجاع",
      content: "يمكن إلغاء حجوزات السيارات والليموزين والفاست تراك مع استرداد المبلغ دون رسوم قبل موعد الخدمة بـ48 ساعة على الأقل. تخضع حجوزات الفنادق لسياسة كل فندق، وتذاكر الطيران لسياسة شركة الطيران. للشقق الفندقية عربون مقدم لا يقل عن إيجار يوم واحد وهو غير مسترد وفق سياسة المؤجرين؛ وبدون عربون يتاح الاختيار فقط من الشقق المتاحة خلال فترة الإقامة. للإلغاء خلال أقل من 48 ساعة للسيارات أو فاست تراك، اسأل الفريق عن الشروط المطبقة. تواصل مع خدمة العملاء لطلب الإلغاء؛ إلغاء الحجز عبر حساب العميل غير متاح مؤقتًا."
    },
    {
      title: "سياسة التوصيل وتنفيذ الخدمة",
      content: "يتم ترتيب الدفع مباشرة مع الشركة عبر واتساب؛ لا توجد حاليًا بوابة دفع إلكتروني على الموقع. راجع مع الفريق تفاصيل الدفع وتنفيذ الخدمة وإثبات الحجز."
    },
    {
      title: "قواعد السلامة والحفاظ على أسطول السيارات",
      content: "لضمان أعلى مستويات الراحة والنظافة لجميع ضيوفنا، يمنع التدخين تماماً داخل جميع سيارات ليمو مصر. كما يرجى الالتزام بسعة الحقائب المحددة لكل فئة من السيارات."
    }
  ];

  const sections = isEn ? defaultContentEn : defaultContentAr;

  return (
    <PublicLayout settings={settings} locale={locale}>
      <main className="mx-auto max-w-5xl px-6 md:px-8 py-32 relative z-10 animate-reveal-1" dir={isEn ? "ltr" : "rtl"}>
        <article className="luxury-panel bg-white p-8 md:p-16 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] border border-black/5">
          <div className="border-b border-black/10 pb-8 mb-10">
            <span className="text-[#d0a755] font-bold tracking-widest text-xs uppercase block mb-3">
              {isEn ? "Legal & Operational Agreement" : "اتفاقية التشغيل والشروط القانونية"}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-[#1a2b3c] tracking-tight">
              {isEn ? "Terms & Conditions" : "الشروط والأحكام"}
            </h1>
            <p className="text-gray-500 font-medium text-sm md:text-base mt-3 max-w-2xl">
              {isEn 
                ? "Guidelines and operational policies governing luxury limousine, airport transfers, and VIP services at Limo Egypt."
                : "القواعد والسياسات المنظمة لخدمات الليموزين الفاخرة، تنقلات المطارات، والمسار السريع لدى ليمو مصر."}
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((sec, idx) => (
              <div key={idx} className="bg-[#F9F8F6] p-6 md:p-8 rounded-2xl border border-black/5 hover:border-[#d0a755]/30 transition-colors">
                <h2 className="text-xl font-black text-[#1a2b3c] mb-3 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#d0a755] shrink-0"></span>
                  {sec.title}
                </h2>
                <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {settings.policies && (
            <div className="mt-12 pt-8 border-t border-black/10 text-gray-500 text-sm font-medium leading-relaxed">
              <h3 className="font-bold text-[#1a2b3c] mb-2">{isEn ? "Additional Notes:" : "ملاحظات إضافية:"}</h3>
              <p className="whitespace-pre-wrap">{settings.policies}</p>
            </div>
          )}
        </article>
      </main>
    </PublicLayout>
  );
}
