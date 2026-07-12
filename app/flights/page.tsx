import { BookingForm } from "@/components/BookingForm";
import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getSiteSettings } from "@/lib/data";
import { CinematicBackground } from "@/components/CinematicBackground";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

export default async function FlightsPage() {
  const settings = await getSiteSettings();
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'ar';

  return (
    <PublicLayout settings={settings} whatsappType="hotel" locale={locale}>
      <main className="mx-auto w-full relative z-10 flex flex-col pt-32 pb-24">
        <div className="animate-reveal-1 px-8 max-w-7xl mx-auto w-full">
          <SectionHeader 
            eyebrow={locale === "en" ? "Flight Booking" : "حجز طيران"} 
            title={locale === "en" ? "Flights to all Global & Domestic Destinations" : "رحلات طيران إلى كافة الوجهات العالمية والمحلية"} 
            text={locale === "en" ? "We provide you with the best flight ticket offers to travel in comfort to your favorite destinations at the best prices." : "نوفر لك أفضل عروض تذاكر الطيران، لتسافر براحة تامة إلى وجهتك المفضلة بأفضل الأسعار."} 
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] animate-reveal-2 px-8 max-w-7xl mx-auto w-full">
          <section className="flex flex-col gap-8 h-full">
            <div className="luxury-panel p-10 flex flex-col justify-center h-full relative overflow-hidden group border-white/20">
              
              <CinematicBackground />
              
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#d0a755]/10 backdrop-blur-md text-[#d0a755] mb-8 border border-[#d0a755]/20 shadow-[0_0_30px_rgba(208,167,85,0.2)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                
                <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.3] mb-6 drop-shadow-lg rtl:text-right ltr:text-left">
                  {locale === "en" ? (
                    <>Book Your Next Journey with <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#d0a755] to-[#f4d58d]">Limo Masr</span></>
                  ) : (
                    <>احجز رحلتك القادمة مع <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#d0a755] to-[#f4d58d]">ليمو مصر</span></>
                  )}
                </h2>
                
                <div className="space-y-6 text-white/90 font-medium leading-relaxed text-lg rtl:text-right ltr:text-left">
                  <p className="drop-shadow-md">
                    {locale === "en" 
                      ? "We care about the finest details of your journey. Whether you are traveling for business or leisure, we provide you with a professional and fast flight booking experience that fits all budgets."
                      : "نحن نهتم بأدق تفاصيل رحلتك، سواء كنت تسافر للعمل أو السياحة، نقدم لك تجربة حجز طيران احترافية وسريعة تناسب جميع ميزانياتك."}
                  </p>
                  <ul className="grid grid-cols-2 gap-4 mt-6 text-white/80">
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      {locale === "en" ? "International & Domestic" : "رحلات دولية ومحلية"}
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      {locale === "en" ? "Best Airlines" : "أفضل الخطوط الجوية"}
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      {locale === "en" ? "Competitive Prices" : "أسعار تنافسية وحصرية"}
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      {locale === "en" ? "Continuous Support" : "دعم متواصل حتى الوصول"}
                    </li>
                  </ul>
                  <p className="pt-4 border-t border-white/20 mt-6 font-bold text-white drop-shadow-md">
                    {locale === "en"
                      ? "Share your destination details with us, and an exclusive price quote will be prepared in record time."
                      : "شارك معنا تفاصيل وجهتك، وسيتم إعداد عرض أسعار حصري في وقت قياسي."}
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <div className="luxury-panel p-8 h-fit sticky top-32">
            <BookingForm 
              type="flight" 
              serviceRefId="flight-request" 
              serviceName={locale === "en" ? "Flight Booking Request" : "طلب حجز طيران"} 
              whatsappNumber={settings.whatsappServiceNumber} 
              locale={locale}
            />
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
