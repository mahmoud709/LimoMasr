import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getFastTrackPackages, getSiteSettings } from "@/lib/data";
import { cookies } from "next/headers";
import { FastTrackClient } from "./FastTrackClient";
import type { Locale } from "@/lib/types";

export default async function FastTrackPage() {
  const [settings, packages] = await Promise.all([getSiteSettings(), getFastTrackPackages()]);
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'ar') as Locale;
  const currency = cookieStore.get('NEXT_CURRENCY')?.value || "EGP";
  const exchangeRate = currency === "USD" ? (settings.usdRate || 50) : currency === "EUR" ? (settings.eurRate || 55) : currency === "SAR" ? (settings.sarRate || 13) : currency === "QAR" ? (settings.qarRate || 13) : currency === "KWD" ? (settings.kwdRate || 160) : currency === "BHD" ? (settings.bhdRate || 130) : 1;
  
  return (
    <PublicLayout settings={settings} whatsappType="fast_track" locale={locale}>
      <main className="mx-auto max-w-7xl px-8 py-32 relative z-10">
        <div className="animate-reveal-1">
          <SectionHeader 
            eyebrow={locale === 'ar' ? "المسار السريع" : "Fast Track"} 
            title={locale === 'ar' ? "خدمات المساعدة بالمطار" : "Airport Meet & Assist Services"} 
            text={locale === 'ar' ? "وفر وقتك واعبر أسرع" : "Save your time and pass faster"} 
          />
        </div>
        
        <FastTrackClient 
          packages={packages} 
          whatsappNumber={settings.whatsappServiceNumber} 
          locale={locale} 
          currency={currency}
          exchangeRate={exchangeRate}
        />

      </main>
    </PublicLayout>
  );
}
