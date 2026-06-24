import { CarCarousel } from "@/components/CarCarousel";
import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getCars, getSiteSettings } from "@/lib/data";

export default async function CarsPage() {
  const [settings, cars] = await Promise.all([getSiteSettings(), getCars()]);
  return (
    <PublicLayout settings={settings} whatsappType="car">
      <main className="mx-auto max-w-[1400px] px-8 py-32 relative z-10 overflow-hidden">
        <div className="animate-reveal-1 mb-8">
          <SectionHeader eyebrow="حجز ليموزين" title="اختر السيارة المناسبة" text="كل فئة تعرض السعة والسعر بوضوح، ثم تنقلك لنموذج حجز سريع عبر واتساب." />
        </div>
        
        <div className="animate-reveal-2">
          <CarCarousel cars={cars} title="جميع فئات السيارات" />
        </div>
      </main>
    </PublicLayout>
  );
}
