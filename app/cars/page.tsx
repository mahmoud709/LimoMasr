import { ServiceBookingGuide } from "@/components/ServiceBookingGuide";
import { serviceMetadata } from "@/lib/seo";
export const generateMetadata = serviceMetadata("/cars");

import { PublicLayout } from "@/components/PublicLayout";
import { CarsClient } from "./CarsClient";
import { getCars, getSiteSettings } from "@/lib/data";

import type { Locale } from "@/lib/types";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function CarsPage({ searchParams }: { searchParams?: Promise<{ __locale?: string }> }) {
  const [searchParamsResolved, settings, cars] = await Promise.all([
    searchParams ?? Promise.resolve<{ __locale?: string }>({}),
    getSiteSettings(),
    getCars()
  ]);
  
  const cookieStore = await cookies();
  const locale = ((searchParamsResolved?.__locale || cookieStore.get('NEXT_LOCALE')?.value || 'ar') as Locale);
  const cookieCurrency = cookieStore.get('NEXT_CURRENCY')?.value || "USD";
  // Always use usdRate for the exchange calc — formatCurrency needs USD→EGP rate regardless of display currency
  const exchangeRate = settings.usdRate || 50;
  


  return (
    <PublicLayout settings={settings} locale={locale}>
      <div className="pt-32 pb-24 min-h-screen bg-[#F9F8F6]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="animate-reveal-1">
              <span className="flex items-center gap-4 mb-4">
                <span className="w-8 h-[1px] bg-[#d0a755]"></span>
                <span className="text-[#d0a755] font-bold tracking-widest text-xs uppercase">{locale === "en" ? "Our Fleet" : "الأسطول"}</span>
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[#1a2b3c] tracking-tight">{locale === "en" ? "Car & Limousine Booking in Egypt" : "حجز سيارات وليموزين في مصر"}</h1>
            </div>
          </div>
          
          <CarsClient cars={cars} locale={locale} currency={cookieCurrency} exchangeRate={exchangeRate} />
<ServiceBookingGuide type="car" locale={locale} settings={settings} />
          
        </div>
      </div>
    </PublicLayout>
  );
}
