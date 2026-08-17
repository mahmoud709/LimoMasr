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
      content: "Limo Egypt delivers premier luxury transportation across Egypt, specializing in airport transfers (Cairo, Sharm El Sheikh, Hurghada, Borg El Arab), intercity chauffeur services, VIP Fast Track airport assistance, and corporate fleet management."
    },
    {
      title: "Booking & Instant Confirmation",
      content: "Reservations placed on our portal or official channels are reviewed by our 24/7 dispatch center. Final trip confirmation and driver contact details are communicated promptly via WhatsApp or phone."
    },
    {
      title: "Pricing, Tolls & Multi-Currency",
      content: "All quoted rates include the luxury vehicle, professional multilingual chauffeur, fuel, and highway toll fees unless explicitly stated otherwise. Rates are displayed in EGP, USD, EUR, SAR, QAR, KWD, and BHD for customer convenience."
    },
    {
      title: "Flight Tracking & Complimentary Waiting",
      content: "Our operational team actively tracks incoming flight status in real-time. International arrivals include up to 60 minutes of complimentary waiting time post-landing, and 30 minutes for domestic arrivals."
    },
    {
      title: "Cancellation & Refund Policy",
      content: "We understand travel plans can change. Cancellations or schedule modifications made at least 24 hours prior to the scheduled pickup time are processed free of charge and eligible for a full refund. Late cancellations may be subject to partial fees."
    },
    {
      title: "Delivery & Service Fulfillment Policy",
      content: "As a transportation and travel service provider, our 'delivery' occurs when our chauffeur meets you at the designated pickup location and time. Booking confirmations are delivered digitally via email or WhatsApp immediately upon successful payment."
    },
    {
      title: "Vehicle Integrity & Safety Standards",
      content: "To maintain maximum comfort and hygiene for all distinguished guests, smoking is strictly prohibited inside all Limo Egypt vehicles. Luggage volume must align with the booked vehicle category capacity."
    }
  ];

  const defaultContentAr = [
    {
      title: "نطاق الخدمات ونظرة عامة",
      content: "تقدم ليمو مصر خدمات النقل الفاخر والليموزين في جميع أنحاء جمهورية مصر العربية، مع التخصص في تنقلات المطارات (مطار القاهرة، شرم الشيخ، الغردقة، برج العرب)، التنقلات بين المحافظات، خدمات المسار السريع VIP، وتعاقدات الشركات."
    },
    {
      title: "حجز وتأكيد الرحلات",
      content: "يتم مراجعة الطلبات المقدمة عبر الموقع أو وسائل التواصل الرسمية بواسطة مركز العمليات على مدار 24 ساعة. يتم إرسال تأكيد الحجز النهائي وتفاصيل السائق عبر واتساب أو الاتصال المباشر."
    },
    {
      title: "الأسعار والرسوم وتعدد العملات",
      content: "تشمل الأسعار المعروضة السيارة الفاخرة، السائق المحترف، الوقود، ورسوم الطرق السريعة ما لم يذكر خلاف ذلك. ندعم التصفح والتحويل المتعدد للعملات (الجنيه المصري، الدولار، اليورو، الريال، الدينار) لراحة العملاء."
    },
    {
      title: "تتبع الرحلات الجوية ووقت الانتظار",
      content: "يقوم فريق التشغيل بمتابعة حركة الطيران حياً عبر رقم الرحلة المزود. تتضمن الرحلات الدولية فترة انتظار مجانية تصل إلى 60 دقيقة بعد الهبوط، و30 دقيقة للرحلات الداخلية."
    },
    {
      title: "سياسة الإلغاء والاسترجاع",
      content: "ندرك إمكانية تغيير خطط السفر. يمكن تعديل الموعد أو إلغاء الحجز واسترجاع المبلغ بالكامل مجاناً وبدون أي رسوم قبل 24 ساعة من موعد الانطلاق المحدد. الإلغاء المتأخر قد يخضع لرسوم جزئية."
    },
    {
      title: "سياسة التوصيل وتنفيذ الخدمة",
      content: "بصفتنا مزود خدمات نقل، يتم 'توصيل' الخدمة بمجرد وصول السائق في الوقت والمكان المحددين مسبقاً. يتم تسليم تأكيدات الحجز والفواتير بشكل رقمي وفوري عبر البريد الإلكتروني أو واتساب بعد الدفع."
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
