import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getFastTrackPackages, getSiteSettings } from "@/lib/data";
import { FastTrackClient } from "./FastTrackClient";

export default async function FastTrackPage() {
  const [settings, packages] = await Promise.all([getSiteSettings(), getFastTrackPackages()]);
  
  return (
    <PublicLayout settings={settings} whatsappType="fast_track">
      <main className="mx-auto max-w-7xl px-8 py-32 relative z-10">
        <div className="animate-reveal-1">
          <SectionHeader eyebrow="Fast Track" title="مسار سريع في المطارات" text="اختر الباقة المناسبة ثم أكد الطلب مباشرة عبر رقم خدمات المسار السريع والفنادق." />
        </div>
        
        <FastTrackClient packages={packages} whatsappNumber={settings.whatsappServiceNumber} />

      </main>
    </PublicLayout>
  );
}
