import { BookingForm } from "@/components/BookingForm";
import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getSiteSettings, getHotelApartments } from "@/lib/data";
import { CinematicBackground } from "@/components/CinematicBackground";
import { ApartmentsCarousel } from "@/components/ApartmentsCarousel";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

export default async function HotelApartmentsPage({ searchParams }: { searchParams?: Promise<{ __locale?: string }> }) {
  const [searchParamsResolved, settings, apartments] = await Promise.all([
    searchParams ?? Promise.resolve<{ __locale?: string }>({}),
    getSiteSettings(),
    getHotelApartments()
  ]);
  const cookieStore = await cookies();
  const locale = ((searchParamsResolved?.__locale || cookieStore.get('NEXT_LOCALE')?.value || 'ar') as Locale);
  const currency = cookieStore.get('NEXT_CURRENCY')?.value || "EGP";
  // Always use usdRate for the exchange calc — formatCurrency needs USD→EGP rate regardless of display currency
  const exchangeRate = settings.usdRate || 50;

  return (
    <PublicLayout settings={settings} whatsappType="hotel" locale={locale}>
      <main className="mx-auto w-full relative z-10 flex flex-col pt-32 pb-24 overflow-x-hidden">
        <div className="animate-reveal-1 px-6 md:px-8 max-w-7xl mx-auto w-full">
          <SectionHeader 
            eyebrow={locale === "en" ? "Hotel Apartments" : "شقق فندقية"} 
            title={locale === "en" ? "Luxury Stay Giving You a Hotel Feeling" : "إقامة فاخرة تمنحك شعور الفندق"} 
            text={locale === "en" ? "Book your luxury hotel apartment in the best locations, spacious areas and complete privacy for your comfort." : "احجز شقتك الفندقية الراقية بأفضل المواقع، مساحات واسعة وخصوصية تامة لراحتك."} 
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] animate-reveal-2 px-6 md:px-8 max-w-7xl mx-auto w-full">
          <section className="flex flex-col gap-8 h-full">
            <div className="luxury-panel p-6 md:p-10 flex flex-col justify-center h-full relative overflow-hidden group border-white/20">
              
              <CinematicBackground images={[
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1502672260266-1c1534220b33?q=80&w=2000&auto=format&fit=crop"
              ]} />
              
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#d0a755]/10 backdrop-blur-md text-[#d0a755] mb-6 md:mb-8 border border-[#d0a755]/20 shadow-[0_0_30px_rgba(208,167,85,0.2)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                  </svg>
                </span>
                
                <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.3] mb-6 drop-shadow-lg rtl:text-right ltr:text-left">
                  {locale === "en" ? (
                    <>Premium Hotel Apartments in <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#d0a755] to-[#f4d58d]">Prestigious Areas</span></>
                  ) : (
                    <>شقق فندقية متميزة في <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#d0a755] to-[#f4d58d]">أرقى الأماكن</span></>
                  )}
                </h2>
                
                <div className="space-y-6 text-white/90 font-medium leading-relaxed text-lg text-center md:text-right md:rtl:text-right md:ltr:text-left">
                  <p className="drop-shadow-md">
                    {locale === "en"
                      ? "We provide families and businessmen with an exclusive collection of hotel apartments characterized by spacious areas and luxury fittings for a stay experience combining comfort and high luxury."
                      : "نوفر للعائلات ورجال الأعمال مجموعة حصرية من الشقق الفندقية التي تتميز بالمساحات الواسعة والتجهيزات الفاخرة لتجربة إقامة تجمع بين الراحة والرفاهية العالية."}
                  </p>
                  <div className="flex justify-center md:justify-start">
                    <ul className="flex flex-col items-start md:grid md:grid-cols-2 gap-4 mt-6 text-white/80 text-right rtl:text-right ltr:text-left">
                      <li className="flex items-center gap-3 drop-shadow-md">
                        <span className="w-2 h-2 shrink-0 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                        {locale === "en" ? "Vital Strategic Locations" : "مواقع استراتيجية حيوية"}
                      </li>
                      <li className="flex items-center gap-3 drop-shadow-md">
                        <span className="w-2 h-2 shrink-0 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                        {locale === "en" ? "Sizes Suitable for Families" : "مساحات تناسب العائلات"}
                      </li>
                      <li className="flex items-center gap-3 drop-shadow-md">
                        <span className="w-2 h-2 shrink-0 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                        {locale === "en" ? "Complete Privacy & Independence" : "خصوصية تامة واستقلالية"}
                      </li>
                      <li className="flex items-center gap-3 drop-shadow-md">
                        <span className="w-2 h-2 shrink-0 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                        {locale === "en" ? "Luxury Fittings & Services" : "تجهيزات وخدمات راقية"}
                      </li>
                    </ul>
                  </div>
                  <p className="pt-4 border-t border-white/20 mt-6 font-bold text-white drop-shadow-md">
                    {locale === "en"
                      ? "Tell us your destination and number of guests, and we will provide the most suitable hotel apartment for your comfort."
                      : "أخبرنا بوجهتك وعدد الأفراد، وسنقوم بتوفير الشقة الفندقية الأنسب لراحتك."}
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <div id="booking-form" className="scroll-mt-32 h-full relative">
            <div className="luxury-panel p-8 h-fit sticky top-32">
              <BookingForm 
                type="apartment" 
                serviceRefId="hotel-apartments-request" 
                serviceName={locale === "en" ? "Hotel Apartments Booking Request" : "طلب حجز شقق فندقية"} 
                whatsappNumber={settings.whatsappServiceNumber} 
                locale={locale}
                currency={currency}
                exchangeRate={exchangeRate}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 mt-16">
          <ApartmentsCarousel
            apartments={apartments}
            locale={locale}
            currency={currency}
            exchangeRate={exchangeRate}
          />
        </div>
      </main>
    </PublicLayout>
  );
}
