import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { PublicLayout } from "@/components/PublicLayout";
import { getCars, getSiteSettings } from "@/lib/data";
import { formatCurrency, priceUnitLabel } from "@/lib/utils";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";
import { localizeCar } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function CarDetailsPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ __locale?: string }>;
}) {
  const [{ slug: rawSlug }, searchParamsResolved, settings, cars] = await Promise.all([
    params,
    searchParams ?? Promise.resolve<{ __locale?: string }>({}),
    getSiteSettings(),
    getCars()
  ]);

  // Decode percent-encoded Arabic slugs from the URL
  const slug = decodeURIComponent(rawSlug);
  const rawCar = cars.find((item) => item.slug === slug || item.slug === rawSlug);
  if (!rawCar) notFound();

  const cookieStore = await cookies();
  const locale = ((searchParamsResolved?.__locale || cookieStore.get('NEXT_LOCALE')?.value || 'ar') as Locale);
  const currency = cookieStore.get('NEXT_CURRENCY')?.value || "EGP";
  const exchangeRate = currency === "USD" ? (settings.usdRate || 50) : currency === "EUR" ? (settings.eurRate || 55) : currency === "SAR" ? (settings.sarRate || 13) : currency === "QAR" ? (settings.qarRate || 13) : currency === "KWD" ? (settings.kwdRate || 160) : currency === "BHD" ? (settings.bhdRate || 130) : 1;

  const car = localizeCar(rawCar, locale);

  return (
    <PublicLayout settings={settings} whatsappType="car" locale={locale}>
      <main className="mx-auto max-w-[1400px] px-6 md:px-8 pt-32 pb-24 relative z-10" dir={locale === "en" ? "ltr" : "rtl"}>
        
        {/* Header Section */}
        <div className="mb-10 animate-reveal-1">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-[1px] bg-[#d0a755]"></span>
            <span className="text-[#d0a755] font-bold tracking-widest text-sm uppercase">
              {locale === "en" ? "Car Details" : "تفاصيل السيارة"}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a2b3c] tracking-tight">
                {car.categoryName}
              </h1>
              {car.subtitle && (
                <p className="mt-3 text-[#1a2b3c]/60 text-lg font-light">{car.subtitle}</p>
              )}
            </div>
            <div className="bg-[#1a2b3c] text-white px-8 py-4 rounded-2xl shadow-lg border border-[#d0a755]/20 flex flex-col items-start md:items-end shrink-0">
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                {locale === "en" ? "Booking Price" : "سعر الحجز"}
              </span>
              <p className="text-3xl font-black text-[#d0a755]" dir={locale === "ar" ? "rtl" : "ltr"}>
                {formatCurrency(car.price, "EGP", locale, currency, exchangeRate)}{" "}
                <span className="text-sm font-light text-white/60">
                  / {priceUnitLabel(car.priceUnit, locale)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-10">
          {/* Left Column: Details */}
          <div className="space-y-10 animate-reveal-2">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2rem] luxury-panel p-2 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={car.images[0]} 
                  alt={car.categoryName} 
                  className="h-full w-full object-cover rounded-2xl" 
                />
                {car.tag && (
                  <div className="absolute top-6 right-6 bg-[#d0a755] text-[#1a2b3c] text-sm font-black px-4 py-2 rounded-full shadow-lg z-10">
                    {car.tag}
                  </div>
                )}
              </div>
              
              {/* Thumbnails if multiple images */}
              {car.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                  {car.images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden luxury-panel p-1 bg-white cursor-pointer group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${car.categoryName} - ${idx + 2}`} className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Car Features Grid */}
            <div className="luxury-panel p-8 md:p-10 bg-white space-y-8">
              <h2 className="text-2xl font-black text-[#1a2b3c] flex items-center gap-3">
                <span className="text-[#d0a755]">|</span> {locale === "en" ? "Car Specifications" : "مواصفات السيارة"}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-[#F9F8F6] rounded-2xl p-6 border border-black/5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#d0a755] shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#1a2b3c]/50 font-bold uppercase tracking-widest mb-1">
                      {locale === "en" ? "Max Capacity" : "السعة القصوى"}
                    </p>
                    <p className="font-black text-[#1a2b3c]">
                      {locale === "en" ? `${car.seats} Passengers` : `${car.seats} ركاب`}
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#F9F8F6] rounded-2xl p-6 border border-black/5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#d0a755] shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#1a2b3c]/50 font-bold uppercase tracking-widest mb-1">
                      {locale === "en" ? "Manufacturing Year" : "سنة الصنع"}
                    </p>
                    <p className="font-black text-[#1a2b3c]">
                      {locale === "en" ? `${car.year} or newer` : `${car.year} أو أحدث`}
                    </p>
                  </div>
                </div>
                
                <div className="bg-[#F9F8F6] rounded-2xl p-6 border border-black/5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#d0a755] shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#1a2b3c]/50 font-bold uppercase tracking-widest mb-1">
                      {locale === "en" ? "Status" : "الحالة"}
                    </p>
                    <p className="font-black text-[#1a2b3c]">
                      {car.status === "available" 
                        ? (locale === "en" ? "Available for booking" : "متاحة للحجز") 
                        : (locale === "en" ? "Unavailable" : "غير متاحة")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-black/5">
                <h3 className="text-lg font-black text-[#1a2b3c] mb-3">
                  {locale === "en" ? "Available Models in this Category" : "الموديلات المتوفرة في هذه الفئة"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {car.models.map(model => (
                    <span key={model} className="bg-[#1a2b3c]/5 text-[#1a2b3c] font-bold text-sm px-4 py-2 rounded-lg border border-black/5">
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {car.notes && (
                <div className="pt-6 border-t border-black/5">
                  <h3 className="text-lg font-black text-[#1a2b3c] mb-3">
                    {locale === "en" ? "Additional Notes" : "ملاحظات إضافية"}
                  </h3>
                  <p className="text-[#1a2b3c]/70 font-light leading-relaxed">{car.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Booking Form or Unavailable Notice */}
          <div className="relative z-20">
            <div className="sticky top-32">
              {car.status === "unavailable" ? (
                <div className="bg-white rounded-3xl border border-rose-100 shadow-lg p-8 flex flex-col items-center text-center gap-5">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1a2b3c] mb-2">
                      {locale === "en" ? "Currently Unavailable for Booking" : "غير متاحة للحجز حالياً"}
                    </h3>
                    <p className="text-sm text-[#1a2b3c]/60 font-medium leading-relaxed">
                      {locale === "en" ? (
                        <>This vehicle is currently unavailable.<br />Please contact us or choose another vehicle from our fleet.</>
                      ) : (
                        <>هذه السيارة غير متاحة في الوقت الحالي.<br />يرجى التواصل معنا أو اختيار سيارة أخرى من أسطولنا.</>
                      )}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${settings.whatsappCarNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-black py-3.5 rounded-xl hover:bg-[#1ebe5d] transition-colors shadow-md"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.849L.057 23.5l5.773-1.515A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.371l-.359-.214-3.727.978.995-3.638-.233-.374A9.818 9.818 0 1112 21.818z"/>
                    </svg>
                    {locale === "en" ? "Contact us via WhatsApp" : "تواصل معنا عبر واتساب"}
                  </a>
                  <a href={locale === "ar" ? "/ar/cars" : "/en/cars"} className="text-sm font-bold text-[#d0a755] hover:underline">
                    {locale === "en" ? "← Browse other cars" : "← تصفح سيارات أخرى"}
                  </a>
                </div>
              ) : (
                <BookingForm
                  type="car"
                  serviceRefId={car.id}
                  serviceName={car.categoryName}
                  whatsappNumber={settings.whatsappCarNumber}
                  price={car.price}
                  locale={locale}
                  baseCurrency="EGP"
                  currency={currency}
                  exchangeRate={exchangeRate}
                />
              )}
            </div>
          </div>

          
        </div>
      </main>
    </PublicLayout>
  );
}
