import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getSiteSettings } from "@/lib/data";
import { FaCar, FaPlaneDeparture, FaHotel, FaRegClock, FaShieldAlt, FaHeadset } from "react-icons/fa";

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <PublicLayout settings={settings}>
      <main className="mx-auto max-w-6xl px-8 py-32 relative z-10">
        <div className="animate-reveal-1">
          <SectionHeader eyebrow="من نحن" title="شركة ليمو مصر" text="شركة نقل وخدمات سفر في مصر تركز على وضوح السعر وسرعة تأكيد الحجز وتجربة مريحة للزوار والسياح." />
        </div>
        
        {/* Main Intro */}
        <div className="luxury-panel p-10 md:p-16 text-lg md:text-xl text-[#1a2b3c]/80 leading-loose animate-reveal-2 mb-16 text-center">
          <p className="max-w-4xl mx-auto">
            نخدم عملاء الأفراد والعائلات والوفود من خلال أسطول متنوع وخدمات مسار سريع بالمطارات وحجز فنادق. هدفنا أن يصل العميل لقرار الحجز في أقل وقت، بأسعار تنافسية، وبأعلى معايير الرفاهية والأمان.
          </p>
        </div>

        {/* Services Section */}
        <div className="mb-24 animate-reveal-3">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a2b3c] mb-4">خدماتنا المتكاملة</h2>
            <div className="h-1 w-20 bg-[#d0a755] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="luxury-panel p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#1a2b3c] rounded-2xl flex items-center justify-center text-[#d0a755] mb-6 shadow-lg rotate-3 hover:rotate-0 transition-transform">
                <FaCar className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[#1a2b3c] mb-4">خدمات الليموزين</h3>
              <p className="text-[#1a2b3c]/70 leading-relaxed font-light text-base">
                أسطول واسع من أحدث الموديلات الفاخرة والعائلية. سيارات معقمة ومجهزة بالكامل لتوفير تجربة تنقل هادئة ومريحة في جميع أنحاء مصر.
              </p>
            </div>
            
            <div className="luxury-panel p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#1a2b3c] rounded-2xl flex items-center justify-center text-[#d0a755] mb-6 shadow-lg -rotate-3 hover:rotate-0 transition-transform">
                <FaPlaneDeparture className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[#1a2b3c] mb-4">مسار سريع (Fast Track)</h3>
              <p className="text-[#1a2b3c]/70 leading-relaxed font-light text-base">
                تخلص من عناء الانتظار في المطارات. خدمة المسار السريع تضمن لك إنهاء كافة الإجراءات بسلاسة وسرعة فائقة لحظة وصولك أو مغادرتك.
              </p>
            </div>

            <div className="luxury-panel p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#1a2b3c] rounded-2xl flex items-center justify-center text-[#d0a755] mb-6 shadow-lg rotate-3 hover:rotate-0 transition-transform">
                <FaHotel className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[#1a2b3c] mb-4">حجوزات الفنادق</h3>
              <p className="text-[#1a2b3c]/70 leading-relaxed font-light text-base">
                شراكات استراتيجية مع أرقى فنادق مصر لتأمين إقامتك بأفضل الأسعار المتاحة، مع خيارات تناسب الأفراد، العائلات، والرحلات الترفيهية.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="animate-reveal-3">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a2b3c] mb-4">لماذا تختار ليمو مصر؟</h2>
            <div className="h-1 w-20 bg-[#d0a755] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-black/5 shadow-sm">
              <div className="mt-1 p-3 bg-[#F9F8F6] rounded-xl text-[#d0a755]">
                <FaRegClock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-[#1a2b3c] mb-2">سرعة الحجز والتأكيد</h4>
                <p className="text-sm text-[#1a2b3c]/60 leading-loose">نظام حجز مبسط يضمن لك تأكيد طلبك في دقائق معدودة عبر الواتساب.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-black/5 shadow-sm">
              <div className="mt-1 p-3 bg-[#F9F8F6] rounded-xl text-[#d0a755]">
                <FaShieldAlt className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-[#1a2b3c] mb-2">شفافية الأسعار</h4>
                <p className="text-sm text-[#1a2b3c]/60 leading-loose">وضوح تام في عرض التكلفة مسبقاً، بدون أي رسوم خفية أو مفاجآت.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-black/5 shadow-sm">
              <div className="mt-1 p-3 bg-[#F9F8F6] rounded-xl text-[#d0a755]">
                <FaHeadset className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-[#1a2b3c] mb-2">دعم فني متواصل</h4>
                <p className="text-sm text-[#1a2b3c]/60 leading-loose">فريق خدمة عملاء متخصص يعمل على مدار الساعة لضمان راحتك.</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </PublicLayout>
  );
}
