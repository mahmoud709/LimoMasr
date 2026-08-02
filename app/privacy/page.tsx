import { PublicLayout } from "@/components/PublicLayout";
import { getSiteSettings } from "@/lib/data";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

export default async function PrivacyPage({ searchParams }: { searchParams?: Promise<{ __locale?: string }> }) {
  const [settings, cookieStore, resolvedSearchParams] = await Promise.all([
    getSiteSettings(),
    cookies(),
    searchParams
  ]);
  
  const locale = (resolvedSearchParams?.__locale || cookieStore.get('NEXT_LOCALE')?.value || 'ar') as Locale;
  const isEn = locale === 'en';

  const defaultContentEn = [
    {
      title: "Data Collection & Purpose",
      content: "Limo Masr collects essential contact details (customer name, phone number, flight number, pickup/drop-off locations) strictly for booking execution, driver coordination, and customer support."
    },
    {
      title: "Absolute Confidentiality",
      content: "We maintain 100% confidentiality of all travel itineraries, VIP guest identities, and corporate bookings. Personal details are never sold, rented, or disclosed to third parties."
    },
    {
      title: "Direct Operations Communication",
      content: "Contact details are utilized solely for trip coordination, sending driver updates via WhatsApp/SMS, and issuing official digital booking confirmations."
    },
    {
      title: "Data Security Standards",
      content: "All booking information is protected using modern encryption standards and secure database storage to prevent unauthorized access."
    }
  ];

  const defaultContentAr = [
    {
      title: "جمع البيانات والغرض منها",
      content: "تجمع ليمو مصر البيانات الأساسية (اسم العملاء، رقم الهاتف، رقم الرحلة، ومواقع الانطلاق والوصول) حصرياً لتنفيذ الحجوزات، تنسيق حركة السائقين، وتقديم الدعم الفني."
    },
    {
      title: "السرية التامة وحماية الخصوصية",
      content: "نلتزم بالحفاظ على السرية المطلقة لجميع خطوط السير، هوية كبار الشخصيات، وحجوزات الشركات. لا يتم بيع أو تأجير أو مشاركة البيانات الشخصية مع أي طرف ثالث تحت أي ظرف."
    },
    {
      title: "التواصل التشغيلي المباشر",
      content: "تُستخدم بيانات التواصل فقط لإبلاغك بتفاصيل السائق عبر واتساب/الرسائل، وتأكيد موعد الوصول، وإرسال إيصالات الحجز الرسمية."
    },
    {
      title: "معايير أمان البيانات",
      content: "يتم حماية جميع معلومات الحجز باستخدام أعلى معايير التشفير وقواعد البيانات الآمنة لمنع أي وصول غير مصرح به."
    }
  ];

  const sections = isEn ? defaultContentEn : defaultContentAr;

  return (
    <PublicLayout settings={settings} locale={locale}>
      <main className="mx-auto max-w-5xl px-6 md:px-8 py-32 relative z-10 animate-reveal-1" dir={isEn ? "ltr" : "rtl"}>
        <article className="luxury-panel bg-white p-8 md:p-16 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] border border-black/5">
          <div className="border-b border-black/10 pb-8 mb-10">
            <span className="text-[#d0a755] font-bold tracking-widest text-xs uppercase block mb-3">
              {isEn ? "Customer Data Protection" : "حماية بيانات ومعلومات العملاء"}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-[#1a2b3c] tracking-tight">
              {isEn ? "Privacy Policy" : "سياسة الخصوصية"}
            </h1>
            <p className="text-gray-500 font-medium text-sm md:text-base mt-3 max-w-2xl">
              {isEn 
                ? "Our commitment to protecting your privacy and managing personal data securely at Limo Masr."
                : "التزامنا التام بحماية خصوصيتك وإدارة البيانات الشخصية بأعلى مستويات الأمان لدى ليمو مصر."}
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

          {settings.privacy && (
            <div className="mt-12 pt-8 border-t border-black/10 text-gray-500 text-sm font-medium leading-relaxed">
              <h3 className="font-bold text-[#1a2b3c] mb-2">{isEn ? "Additional Privacy Disclosures:" : "إفصاحات إضافية:"}</h3>
              <p className="whitespace-pre-wrap">{settings.privacy}</p>
            </div>
          )}
        </article>
      </main>
    </PublicLayout>
  );
}
