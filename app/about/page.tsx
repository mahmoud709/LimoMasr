import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getSiteSettings } from "@/lib/data";
import { FaCar, FaPlaneDeparture, FaHotel, FaRegClock, FaShieldAlt, FaHeadset } from "react-icons/fa";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'ar';

  return (
    <PublicLayout settings={settings} locale={locale}>
      <main className="mx-auto max-w-6xl px-8 py-32 relative z-10">
        <div className="animate-reveal-1">
          <SectionHeader 
            eyebrow={locale === "en" ? "About Us" : "من نحن"} 
            title={locale === "en" ? "Limo Masr Company" : "شركة ليمو مصر"} 
            text={locale === "en" ? "A transport and travel services company in Egypt focused on price transparency, fast booking confirmation, and a comfortable experience for visitors and tourists." : "شركة نقل وخدمات سفر في مصر تركز على وضوح السعر وسرعة تأكيد الحجز وتجربة مريحة للزوار والسياح."} 
          />
        </div>
        
        {/* Main Intro */}
        <div className="luxury-panel p-10 md:p-16 text-lg md:text-xl text-[#1a2b3c]/80 leading-loose animate-reveal-2 mb-16 text-center">
          <p className="max-w-4xl mx-auto">
            {locale === "en"
              ? "We serve individual, family, and delegation clients through a diverse fleet, VIP airport fast-track assistance, and hotel bookings. Our goal is to help clients make booking decisions in the shortest time, with competitive prices and the highest standards of luxury and safety."
              : "نخدم عملاء الأفراد والعائلات والوفود من خلال أسطول متنوع وخدمات مسار سريع بالمطارات وحجز فنادق. هدفنا أن يصل العميل لقرار الحجز في أقل وقت، بأسعار تنافسية، وبأعلى معايير الرفاهية والأمان."}
          </p>
        </div>

        {/* Services Section */}
        <div className="mb-24 animate-reveal-3">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a2b3c] mb-4">
              {locale === "en" ? "Our Integrated Services" : "خدماتنا المتكاملة"}
            </h2>
            <div className="h-1 w-20 bg-[#d0a755] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="luxury-panel p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#1a2b3c] rounded-2xl flex items-center justify-center text-[#d0a755] mb-6 shadow-lg rotate-3 hover:rotate-0 transition-transform">
                <FaCar className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[#1a2b3c] mb-4">
                {locale === "en" ? "Limousine Services" : "خدمات الليموزين"}
              </h3>
              <p className="text-[#1a2b3c]/70 leading-relaxed font-light text-base">
                {locale === "en"
                  ? "A wide fleet of the latest luxury and family models. Fully sanitized and equipped cars to provide a quiet and comfortable transport experience across Egypt."
                  : "أسطول واسع من أحدث الموديلات الفاخرة والعائلية. سيارات معقمة ومجهزة بالكامل لتوفير تجربة تنقل هادئة ومريحة في جميع أنحاء مصر."}
              </p>
            </div>
            
            <div className="luxury-panel p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#1a2b3c] rounded-2xl flex items-center justify-center text-[#d0a755] mb-6 shadow-lg -rotate-3 hover:rotate-0 transition-transform">
                <FaPlaneDeparture className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[#1a2b3c] mb-4">
                {locale === "en" ? "Airport Fast Track" : "مسار سريع (Fast Track)"}
              </h3>
              <p className="text-[#1a2b3c]/70 leading-relaxed font-light text-base">
                {locale === "en"
                  ? "Skip the waiting lines at airports. The fast track service ensures that all arrival or departure procedures are completed smoothly and quickly."
                  : "تخلص من عناء الانتظار في المطارات. خدمة المسار السريع تضمن لك إنهاء كافة الإجراءات بسلاسة وسرعة فائقة لحظة وصولك أو مغادرتك."}
              </p>
            </div>

            <div className="luxury-panel p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#1a2b3c] rounded-2xl flex items-center justify-center text-[#d0a755] mb-6 shadow-lg rotate-3 hover:rotate-0 transition-transform">
                <FaHotel className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[#1a2b3c] mb-4">
                {locale === "en" ? "Hotel Bookings" : "حجوزات الفنادق"}
              </h3>
              <p className="text-[#1a2b3c]/70 leading-relaxed font-light text-base">
                {locale === "en"
                  ? "Strategic partnerships with the finest hotels in Egypt to secure your stay at the best available prices, with options suitable for individuals, families, and leisure trips."
                  : "شراكات استراتيجية مع أرقى فنادق مصر لتأمين إقامتك بأفضل الأسعار المتاحة، مع خيارات تناسب الأفراد، العائلات، والرحلات الترفيهية."}
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="animate-reveal-3">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a2b3c] mb-4">
              {locale === "en" ? "Why Choose Limo Masr?" : "لماذا تختار ليمو مصر؟"}
            </h2>
            <div className="h-1 w-20 bg-[#d0a755] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-black/5 shadow-sm rtl:text-right ltr:text-left">
              <div className="mt-1 p-3 bg-[#F9F8F6] rounded-xl text-[#d0a755]">
                <FaRegClock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-[#1a2b3c] mb-2">
                  {locale === "en" ? "Fast Booking & Confirmation" : "سرعة الحجز والتأكيد"}
                </h4>
                <p className="text-sm text-[#1a2b3c]/60 leading-loose">
                  {locale === "en"
                    ? "A simplified booking system ensuring confirmation of your request in minutes via WhatsApp."
                    : "نظام حجز مبسط يضمن لك تأكيد طلبك في دقائق معدودة عبر الواتساب."}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-black/5 shadow-sm rtl:text-right ltr:text-left">
              <div className="mt-1 p-3 bg-[#F9F8F6] rounded-xl text-[#d0a755]">
                <FaShieldAlt className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-[#1a2b3c] mb-2">
                  {locale === "en" ? "Price Transparency" : "شفافية الأسعار"}
                </h4>
                <p className="text-sm text-[#1a2b3c]/60 leading-loose">
                  {locale === "en"
                    ? "Complete clarity in displaying the cost upfront, with no hidden fees or surprises."
                    : "وضوح تام في عرض التكلفة مسبقاً، بدون أي رسوم خفية أو مفاجآت."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-black/5 shadow-sm rtl:text-right ltr:text-left">
              <div className="mt-1 p-3 bg-[#F9F8F6] rounded-xl text-[#d0a755]">
                <FaHeadset className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-[#1a2b3c] mb-2">
                  {locale === "en" ? "Continuous Technical Support" : "دعم فني متواصل"}
                </h4>
                <p className="text-sm text-[#1a2b3c]/60 leading-loose">
                  {locale === "en"
                    ? "A dedicated customer service team working around the clock to ensure your comfort."
                    : "فريق خدمة عملاء متخصص يعمل على مدار الساعة لضمان راحتك."}
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </PublicLayout>
  );
}
