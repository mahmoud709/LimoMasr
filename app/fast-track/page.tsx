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
          currency={cookieStore.get('NEXT_CURRENCY')?.value || "EGP"}
          usdRate={settings.usdRate}
        />

      </main>
    </PublicLayout>
  );
}
