import { BookingForm } from "@/components/BookingForm";
import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getSiteSettings, getHotels, getHotelApartments } from "@/lib/data";
import { CinematicBackground } from "@/components/CinematicBackground";
import { HotelMarquee } from "@/components/HotelMarquee";
import { HotelsCarousel } from "@/components/HotelsCarousel";
import { ApartmentsCarousel } from "@/components/ApartmentsCarousel";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";
import Link from "next/link";
import { withLang } from "@/lib/i18n";

export default async function StaysPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [settings, hotels, apartments, resolvedSearchParams] = await Promise.all([getSiteSettings(), getHotels(), getHotelApartments(), searchParams]);
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'ar';
  const currency = cookieStore.get('NEXT_CURRENCY')?.value || "EGP";
  const exchangeRate = currency === "USD" ? (settings.usdRate || 50) : currency === "EUR" ? (settings.eurRate || 55) : currency === "SAR" ? (settings.sarRate || 13) : currency === "QAR" ? (settings.qarRate || 13) : currency === "KWD" ? (settings.kwdRate || 160) : currency === "BHD" ? (settings.bhdRate || 130) : 1;

  const currentType = resolvedSearchParams.type === 'apartments' ? 'apartments' : 'hotels';

  return (
    <PublicLayout settings={settings} whatsappType="hotel" locale={locale}>
      <main className="mx-auto w-full relative z-10 flex flex-col pt-32 pb-8">
        <div className="animate-reveal-1 px-8 max-w-7xl mx-auto w-full mb-8">
          <SectionHeader 
            eyebrow={locale === "en" ? "Accommodations" : "الإقامات"} 
            title={locale === "en" ? "Choose Your Perfect Stay" : "اختر إقامتك المثالية"} 
            text={locale === "en" ? "We provide you with the best hotel options and luxury apartments to suit all your needs." : "نوفر لك أفضل خيارات الفنادق والشقق الفندقية الفاخرة لتناسب جميع احتياجاتك."} 
          />
          
          {/* Tabs */}
          <div className="flex justify-center mt-10">
            <div className="bg-[#1a2b3c]/5 border border-black/5 p-1.5 rounded-2xl inline-flex relative shadow-inner">
              <Link 
                href={withLang("/stays?type=hotels", locale)}
                className={`px-8 py-3 rounded-xl text-sm md:text-base font-bold transition-all duration-300 relative z-10 flex items-center gap-2 ${currentType === 'hotels' ? 'text-white bg-[#1a2b3c] shadow-lg scale-100' : 'text-[#1a2b3c]/60 hover:text-[#1a2b3c] hover:bg-black/5 scale-95'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                </svg>
                {locale === 'en' ? 'Hotels' : 'الفنادق'}
              </Link>
              <Link 
                href={withLang("/stays?type=apartments", locale)}
                className={`px-8 py-3 rounded-xl text-sm md:text-base font-bold transition-all duration-300 relative z-10 flex items-center gap-2 ${currentType === 'apartments' ? 'text-white bg-[#1a2b3c] shadow-lg scale-100' : 'text-[#1a2b3c]/60 hover:text-[#1a2b3c] hover:bg-black/5 scale-95'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {locale === 'en' ? 'Hotel Apartments' : 'شقق فندقية'}
              </Link>
            </div>
          </div>
        </div>

        {currentType === 'hotels' ? (
          <>
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
              <div className="h-fit sticky top-32">
                <BookingForm 
                  type="hotel" 
                  serviceRefId="hotel-request" 
                  serviceName={locale === "en" ? "Hotel Booking Request" : "طلب حجز فندق"} 
                  whatsappNumber={settings.whatsappServiceNumber} 
                  locale={locale}
                  currency={currency}
                  exchangeRate={exchangeRate}
                />
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto w-full px-8 mb-16">
              <HotelsCarousel
                hotels={hotels}
                locale={locale}
                currency={currency}
                exchangeRate={exchangeRate}
              />
            </div>

            <div className="mb-12">
              <HotelMarquee />
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] animate-reveal-2 px-8 max-w-7xl mx-auto w-full">
              <section className="flex flex-col gap-8 h-full">
                <div className="luxury-panel p-10 flex flex-col justify-center h-full relative overflow-hidden group border-white/20">
                  <CinematicBackground />
                  <div className="relative z-10">
                    <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#d0a755]/10 backdrop-blur-md text-[#d0a755] mb-8 border border-[#d0a755]/20 shadow-[0_0_30px_rgba(208,167,85,0.2)]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <div className="space-y-6 text-white/90 font-medium leading-relaxed text-lg rtl:text-right ltr:text-left">
                      <p className="drop-shadow-md">
                        {locale === "en"
                          ? "We provide families and businessmen with an exclusive collection of hotel apartments characterized by spacious areas and luxury fittings for a stay experience combining comfort and high luxury."
                          : "نوفر للعائلات ورجال الأعمال مجموعة حصرية من الشقق الفندقية التي تتميز بالمساحات الواسعة والتجهيزات الفاخرة لتجربة إقامة تجمع بين الراحة والرفاهية العالية."}
                      </p>
                      <ul className="grid grid-cols-2 gap-4 mt-6 text-white/80">
                        <li className="flex items-center gap-3 drop-shadow-md">
                          <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                          {locale === "en" ? "Vital Strategic Locations" : "مواقع استراتيجية حيوية"}
                        </li>
                        <li className="flex items-center gap-3 drop-shadow-md">
                          <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                          {locale === "en" ? "Sizes Suitable for Families" : "مساحات تناسب العائلات"}
                        </li>
                        <li className="flex items-center gap-3 drop-shadow-md">
                          <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                          {locale === "en" ? "Complete Privacy & Independence" : "خصوصية تامة واستقلالية"}
                        </li>
                        <li className="flex items-center gap-3 drop-shadow-md">
                          <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                          {locale === "en" ? "Luxury Fittings & Services" : "تجهيزات وخدمات راقية"}
                        </li>
                      </ul>
                      <p className="pt-4 border-t border-white/20 mt-6 font-bold text-white drop-shadow-md">
                        {locale === "en"
                          ? "Tell us your destination and number of guests, and we will provide the most suitable hotel apartment for your comfort."
                          : "أخبرنا بوجهتك وعدد الأفراد، وسنقوم بتوفير الشقة الفندقية الأنسب لراحتك."}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <div className="h-fit sticky top-32">
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

            <div className="max-w-7xl mx-auto w-full px-8 mt-16 mb-8">
              <ApartmentsCarousel
                apartments={apartments}
                locale={locale}
                currency={currency}
                exchangeRate={exchangeRate}
              />
            </div>
          </>
        )}
      </main>
    </PublicLayout>
  );
}
