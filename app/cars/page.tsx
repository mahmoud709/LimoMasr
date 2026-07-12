import { CarCarousel } from "@/components/CarCarousel";
import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getCars, getSiteSettings } from "@/lib/data";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

export default async function CarsPage() {
  const [settings, cars] = await Promise.all([getSiteSettings(), getCars()]);
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'ar';

  return (
    <PublicLayout settings={settings} whatsappType="car" locale={locale}>
      <main className="mx-auto max-w-[1400px] px-8 py-32 relative z-10 overflow-hidden">
        <div className="animate-reveal-1 mb-8">
          <SectionHeader 
            eyebrow={locale === "en" ? "Limousine Booking" : "حجز ليموزين"} 
            title={locale === "en" ? "Choose the Right Car" : "اختر السيارة المناسبة"} 
            text={locale === "en" ? "Each category displays capacity and price clearly, then forwards you to a quick WhatsApp booking form." : "كل فئة تعرض السعة والسعر بوضوح، ثم تنقلك لنموذج حجز سريع عبر واتساب."} 
          />
        </div>
        
        <div className="animate-reveal-2">
          <CarCarousel 
            cars={cars} 
            title={locale === "en" ? "All Car Categories" : "جميع فئات السيارات"} 
            locale={locale} 
          />
        </div>
      </main>
    </PublicLayout>
  );
}
