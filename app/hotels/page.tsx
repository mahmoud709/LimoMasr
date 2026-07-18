import { BookingForm } from "@/components/BookingForm";
import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getSiteSettings } from "@/lib/data";
import { CinematicBackground } from "@/components/CinematicBackground";
import { HotelMarquee } from "@/components/HotelMarquee";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

export default async function HotelsPage() {
  const settings = await getSiteSettings();
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'ar';

  return (
    <PublicLayout settings={settings} whatsappType="hotel" locale={locale}>
      <main className="mx-auto w-full relative z-10 flex flex-col pt-32">
        <div className="animate-reveal-1 px-8 max-w-7xl mx-auto w-full">
          <SectionHeader 
            eyebrow={locale === "en" ? "Hotel Booking" : "حجز فنادق"} 
            title={locale === "en" ? "Request a Stay Offer by City" : "اطلب عرض إقامة حسب المدينة"} 
            text={locale === "en" ? "Send arrival, departure dates, and guest count, and details will be confirmed via WhatsApp." : "أرسل تاريخ الوصول والمغادرة وعدد الأفراد، وسيتم تأكيد التفاصيل عبر واتساب."} 
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] animate-reveal-2 px-8 max-w-7xl mx-auto w-full pb-16">
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
                    <>Hotel Bookings <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#d0a755] to-[#f4d58d]">Across Egypt</span></>
                  ) : (
                    <>حجوزات فندقية في <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#d0a755] to-[#f4d58d]">جميع أنحاء مصر</span></>
                  )}
                </h2>
                
                <div className="space-y-6 text-white/90 font-medium leading-relaxed text-lg rtl:text-right ltr:text-left">
                  <p className="drop-shadow-md">
                    {locale === "en"
                      ? "We are not limited to one city! We provide you with the best hotel accommodation offers in all governorates and cities of the Arab Republic of Egypt at competitive prices."
                      : "نحن لا نقتصر على مدينة واحدة! نوفر لك أفضل عروض الإقامة الفندقية في كافة محافظات ومدن جمهورية مصر العربية بأسعار تنافسية."}
                  </p>
                  <ul className="grid grid-cols-2 gap-4 mt-6 text-white/80">
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      {locale === "en" ? "Greater Cairo" : "القاهرة الكبرى"}
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      {locale === "en" ? "Alexandria & Coast" : "الإسكندرية والساحل"}
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      {locale === "en" ? "Sharm & Dahab" : "شرم الشيخ ودهب"}
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      {locale === "en" ? "Hurghada & Gouna" : "الغردقة والجونة"}
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      {locale === "en" ? "Luxor & Aswan" : "الأقصر وأسوان"}
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      {locale === "en" ? "And more..." : "والمزيد..."}
                    </li>
                  </ul>
                  <p className="pt-4 border-t border-white/20 mt-6 font-bold text-white drop-shadow-md">
                    {locale === "en"
                      ? "Just choose your destination and budget, and we will prepare the best options for you immediately."
                      : "فقط اختر وجهتك والميزانية، وسنقوم بتجهيز أفضل الخيارات لك فوراً."}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <div className="luxury-panel p-8 h-fit sticky top-32">
            <BookingForm 
              type="hotel" 
              serviceRefId="hotel-request" 
              serviceName={locale === "en" ? "Hotel Booking Request" : "طلب حجز فندق"} 
              whatsappNumber={settings.whatsappServiceNumber} 
              locale={locale}
              currency={cookieStore.get('NEXT_CURRENCY')?.value || "EGP"}
              usdRate={settings.usdRate}
            />
          </div>
        </div>
        
        <div className="mb-24">
          <HotelMarquee />
        </div>
        
      </main>
    </PublicLayout>
  );
}
