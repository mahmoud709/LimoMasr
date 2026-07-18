import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { CarCard } from "@/components/CarCard";
import { getCars, getSiteSettings } from "@/lib/data";
import { ui } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { cookies } from "next/headers";

export default async function CarsPage() {
  const cars = await getCars();
  const settings = await getSiteSettings();
  
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'ar') as Locale;
  const cookieCurrency = cookieStore.get('NEXT_CURRENCY')?.value || "EGP";
  
  const t = ui[locale];

  return (
    <PublicLayout settings={settings} locale={locale}>
      <div className="pt-32 pb-24 min-h-screen bg-[#F9F8F6]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="animate-reveal-1">
              <span className="flex items-center gap-4 mb-4">
                <span className="w-8 h-[1px] bg-[#d0a755]"></span>
                <span className="text-[#d0a755] font-bold tracking-widest text-xs uppercase">{locale === "en" ? "Our Fleet" : "الأسطول"}</span>
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[#1a2b3c] tracking-tight">{locale === "en" ? "Limo Masr Fleet" : "أسطول ليمو مصر"}</h1>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-reveal-2">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} locale={locale} currency={cookieCurrency} usdRate={settings.usdRate} />
            ))}
          </div>
          
          {cars.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-black/5 shadow-sm">
              <div className="w-20 h-20 mx-auto bg-[#F9F8F6] rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#1a2b3c]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-[#1a2b3c] mb-2">{locale === "en" ? "No cars found" : "لم يتم العثور على سيارات"}</h3>
              <p className="text-[#1a2b3c]/50">{locale === "en" ? "There are currently no cars available." : "لا يوجد سيارات متاحة في الوقت الحالي."}</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
