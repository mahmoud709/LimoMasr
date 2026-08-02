import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { CarsClient } from "./CarsClient";
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
  const exchangeRate = cookieCurrency === "USD" ? (settings.usdRate || 50) : cookieCurrency === "EUR" ? (settings.eurRate || 55) : cookieCurrency === "SAR" ? (settings.sarRate || 13) : cookieCurrency === "QAR" ? (settings.qarRate || 13) : cookieCurrency === "KWD" ? (settings.kwdRate || 160) : cookieCurrency === "BHD" ? (settings.bhdRate || 130) : 1;
  
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
          
          <CarsClient cars={cars} locale={locale} currency={cookieCurrency} exchangeRate={exchangeRate} />
          
        </div>
      </div>
    </PublicLayout>
  );
}
