import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { PublicLayout } from "@/components/PublicLayout";
import { getCars, getSiteSettings } from "@/lib/data";
import { formatCurrency, priceUnitLabel } from "@/lib/utils";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

export default async function CarDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, settings, cars] = await Promise.all([params, getSiteSettings(), getCars()]);
  const car = cars.find((item) => item.slug === slug);
  if (!car) notFound();

  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'ar') as Locale;
  const currency = cookieStore.get('NEXT_CURRENCY')?.value || "EGP";

  return (
    <PublicLayout settings={settings} whatsappType="car" locale={locale}>
      <main className="mx-auto max-w-[1400px] px-6 md:px-8 pt-32 pb-24 relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 animate-reveal-1">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-[1px] bg-[#d0a755]"></span>
            <span className="text-[#d0a755] font-bold tracking-widest text-sm uppercase">تفاصيل السيارة</span>
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
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">سعر الحجز</span>
              <p className="text-3xl font-black text-[#d0a755]" dir="rtl">
                {formatCurrency(car.price, "EGP", locale, currency, settings.usdRate)} <span className="text-sm font-light text-white/60">/ {priceUnitLabel(car.priceUnit)}</span>
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
                <span className="text-[#d0a755]">|</span> مواصفات السيارة
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-[#F9F8F6] rounded-2xl p-6 border border-black/5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#d0a755] shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#1a2b3c]/50 font-bold uppercase tracking-widest mb-1">السعة القصوى</p>
                    <p className="font-black text-[#1a2b3c]">{car.seats} ركاب</p>
                  </div>
                </div>
                
                <div className="bg-[#F9F8F6] rounded-2xl p-6 border border-black/5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#d0a755] shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#1a2b3c]/50 font-bold uppercase tracking-widest mb-1">سنة الصنع</p>
                    <p className="font-black text-[#1a2b3c]">{car.year} أو أحدث</p>
                  </div>
                </div>
                
                <div className="bg-[#F9F8F6] rounded-2xl p-6 border border-black/5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#d0a755] shadow-sm">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#1a2b3c]/50 font-bold uppercase tracking-widest mb-1">الحالة</p>
                    <p className="font-black text-[#1a2b3c]">{car.status === "available" ? "متاحة للحجز" : "غير متاحة"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-black/5">
                <h3 className="text-lg font-black text-[#1a2b3c] mb-3">الموديلات المتوفرة في هذه الفئة</h3>
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
                  <h3 className="text-lg font-black text-[#1a2b3c] mb-3">ملاحظات إضافية</h3>
                  <p className="text-[#1a2b3c]/70 font-light leading-relaxed">{car.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Booking Form (Sticky) */}
          <div className="relative z-20">
            <div className="sticky top-32">
              <BookingForm 
                type="car" 
                serviceRefId={car.id} 
                serviceName={car.categoryName} 
                whatsappNumber={settings.whatsappCarNumber} 
                price={car.price} 
                locale={locale}
                baseCurrency="EGP"
                currency={currency}
                usdRate={settings.usdRate}
              />
            </div>
          </div>
          
        </div>
      </main>
    </PublicLayout>
  );
}
