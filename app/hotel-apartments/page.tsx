import { BookingForm } from "@/components/BookingForm";
import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getSiteSettings } from "@/lib/data";
import { CinematicBackground } from "@/components/CinematicBackground";

export default async function HotelApartmentsPage() {
  const settings = await getSiteSettings();
  return (
    <PublicLayout settings={settings} whatsappType="hotel">
      <main className="mx-auto w-full relative z-10 flex flex-col pt-32 pb-24">
        <div className="animate-reveal-1 px-8 max-w-7xl mx-auto w-full">
          <SectionHeader 
            eyebrow="شقق فندقية" 
            title="إقامة فاخرة تمنحك شعور المنزل" 
            text="احجز شقتك الفندقية الراقية بأفضل المواقع، مساحات واسعة وخصوصية تامة لراحتك." 
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] animate-reveal-2 px-8 max-w-7xl mx-auto w-full">
          <section className="flex flex-col gap-8 h-full">
            <div className="luxury-panel p-10 flex flex-col justify-center h-full relative overflow-hidden group border-white/20">
              
              <CinematicBackground />
              
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#d0a755]/10 backdrop-blur-md text-[#d0a755] mb-8 border border-[#d0a755]/20 shadow-[0_0_30px_rgba(208,167,85,0.2)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" />
                  </svg>
                </span>
                
                <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.3] mb-6 drop-shadow-lg">
                  شقق فندقية متميزة في <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#d0a755] to-[#f4d58d]">أرقى الأماكن</span>
                </h2>
                
                <div className="space-y-6 text-white/90 font-medium leading-relaxed text-lg">
                  <p className="drop-shadow-md">
                    نوفر للعائلات ورجال الأعمال مجموعة حصرية من الشقق الفندقية التي تتميز بالمساحات الواسعة والتجهيزات الفاخرة لتجربة إقامة تجمع بين الراحة والرفاهية العالية.
                  </p>
                  <ul className="grid grid-cols-2 gap-4 mt-6 text-white/80">
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      مواقع استراتيجية حيوية
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      مساحات تناسب العائلات
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      خصوصية تامة واستقلالية
                    </li>
                    <li className="flex items-center gap-3 drop-shadow-md">
                      <span className="w-2 h-2 rounded-full bg-[#d0a755] shadow-[0_0_10px_rgba(208,167,85,0.8)]"></span>
                      تجهيزات وخدمات راقية
                    </li>
                  </ul>
                  <p className="pt-4 border-t border-white/20 mt-6 font-bold text-white drop-shadow-md">
                    أخبرنا بوجهتك وعدد الأفراد، وسنقوم بتوفير الشقة الفندقية الأنسب لراحتك.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <div className="luxury-panel p-8 h-fit sticky top-32">
            <BookingForm 
              type="apartment" 
              serviceRefId="hotel-apartments-request" 
              serviceName="طلب حجز شقق فندقية" 
              whatsappNumber={settings.whatsappServiceNumber} 
            />
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
