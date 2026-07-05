import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { CarCarousel } from "@/components/CarCarousel";
import { FastTrackCarousel } from "@/components/FastTrackCarousel";
import { PublicLayout } from "@/components/PublicLayout";
import { SectionHeader } from "@/components/SectionHeader";
import { getCars, getFastTrackPackages, getSiteSettings } from "@/lib/data";
import { FaWhatsapp, FaFacebookF, FaTiktok, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { ui } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export default async function Home() {
  const [settings, cars, packages] = await Promise.all([getSiteSettings(), getCars(), getFastTrackPackages()]);
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || 'ar') as Locale;
  const t = ui[locale];

  return (
    <PublicLayout settings={settings}>
      <main className="flex flex-col w-full overflow-hidden">
        {/* Exact Layout Hero Section */}
        <section className="relative min-h-[85vh] w-full flex items-center pt-24 bg-[#1a2b3c] overflow-hidden">
          {/* Decorative Dashed Curved Line */}
          <svg className="absolute rtl:left-[-5%] ltr:right-[-5%] top-[10%] w-[600px] h-[800px] opacity-20 pointer-events-none rtl:scale-x-100 ltr:-scale-x-100" viewBox="0 0 600 800" fill="none">
            <path d="M 100 800 C 100 500, 300 300, 600 100" stroke="#ffffff" strokeWidth="4" strokeDasharray="16 24" strokeLinecap="round" />
          </svg>

          <div className="relative z-10 mx-auto max-w-[1400px] px-8 w-full grid lg:grid-cols-2 gap-10 items-center">
            {/* Text Content */}
            <div className="flex flex-col items-start text-start z-20 pb-12 lg:pb-0">
              <p className="text-[#d0a755] font-bold text-base md:text-lg mb-4 animate-reveal-1">
                {t.hero.eyebrow}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.3] mb-6 animate-reveal-2">
                {t.hero.title1} {t.hero.title2}.
              </h1>
              <p className="text-white/80 text-base md:text-lg leading-[1.8] mb-10 max-w-xl animate-reveal-3 font-light">
                {t.hero.text}
              </p>
              <div className="animate-reveal-3">
                <Link href="/cars" className="inline-block bg-[#d0a755] hover:bg-[#b89040] text-[#1a2b3c] font-black py-3.5 px-10 rounded-md transition-all duration-300 text-base shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1">
                  {t.hero.cta}
                </Link>
              </div>
            </div>

            {/* Image Content */}
            <div className="relative z-10 animate-scale-in flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative w-full max-w-[600px] xl:max-w-[800px] rtl:lg:-translate-x-10 ltr:lg:translate-x-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://freepngimg.com/thumb/car/4-2-car-png-hd.png"
                  alt="Luxury Car"
                  className="w-full h-auto object-contain drop-shadow-2xl rtl:scale-x-[-1]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Carousel Fleet Showcase Section */}
        <section className="relative py-24 border-y border-black/[0.05] bg-white">
          <div className="mx-auto max-w-[1400px] pl-0 pr-8 md:px-8 relative z-10 flex flex-col gap-16">
            {/* Cars Carousel */}
            <CarCarousel
              cars={cars}
              title="أسطول ليمو مصر"
              viewAllText="عرض الكل"
              locale={locale}
            />
            {/* Fast Track Carousel */}
            <FastTrackCarousel
              packages={packages}
              title={locale === "en" ? "Fast Track Services" : "المسار السريع"}
              viewAllText={locale === "en" ? "View All" : "عرض الباقات"}
              locale={locale}
            />
          </div>
        </section>

        {/* Why Choose Us - Interconnected Grid */}
        <section className="relative mx-auto max-w-[1200px] px-8 py-24 w-full bg-[#F9F8F6] overflow-hidden">
          <div className="text-center mb-20 animate-reveal-1 relative z-20">
            <p className="text-[#d0a755] font-bold tracking-[0.2em] text-xs md:text-sm mb-3 uppercase">{t.whyChooseUs.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1a2b3c]">{t.whyChooseUs.title}</h2>
          </div>

          <div className="relative w-full mx-auto">
            {/* The Dashed Connecting Rectangle (Desktop only) */}
            <div className="hidden md:block absolute top-[25%] bottom-[25%] left-[15%] right-[15%] border-2 border-dashed border-[#1a2b3c]/10 z-0 rounded-[2.5rem]" />

            <div className="relative z-10 grid md:grid-cols-2 gap-6 md:gap-x-16 lg:gap-x-20 gap-y-10 lg:gap-y-12">
              {[
                {
                  title: t.whyChooseUs.f1Title,
                  text: t.whyChooseUs.f1Text,
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  ),
                  highlight: true,
                },
                {
                  title: t.whyChooseUs.f2Title,
                  text: t.whyChooseUs.f2Text,
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  highlight: false,
                },
                {
                  title: t.whyChooseUs.f3Title,
                  text: t.whyChooseUs.f3Text,
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  highlight: false,
                },
                {
                  title: t.whyChooseUs.f4Title,
                  text: t.whyChooseUs.f4Text,
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                  ),
                  highlight: false,
                }
              ].map((feature, i) => (
                <div key={i} className={`flex flex-col sm:flex-row items-start gap-5 p-6 md:p-8 rounded-4xl transition-all duration-500 hover:-translate-y-1.5 animate-reveal-2 ${feature.highlight ? 'bg-[#1a2b3c] text-white shadow-[0_15px_40px_rgba(26,43,60,0.15)]' : 'bg-white text-[#1a2b3c] shadow-lg border border-black/3 hover:border-black/5'}`}>
                  <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center shadow-inner ${feature.highlight ? 'bg-[#d0a755] text-white shadow-black/20' : 'bg-[#F9F8F6] text-[#d0a755] border border-black/5 shadow-white/50'}`}>
                    {feature.icon}
                  </div>
                  <div className="flex flex-col mt-1">
                    <h3 className={`text-xl font-black mb-3 ${feature.highlight ? 'text-white' : 'text-[#1a2b3c]'}`}>{feature.title}</h3>
                    <p className={`leading-[1.7] text-sm md:text-[15px] font-light ${feature.highlight ? 'text-white/80' : 'text-[#1a2b3c]/70'}`}>{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Professional Drivers Section */}
        <section className="relative w-full bg-[#1a2b3c] py-24 overflow-hidden text-white border-b border-white/5">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-[#d0a755]" fill="currentColor">
              <polygon points="0,0 100,0 100,100 0,100" />
            </svg>
          </div>
          
          <div className="mx-auto max-w-[1200px] px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="animate-reveal-1">
              <span className="flex items-center gap-4 mb-4">
                <span className="w-8 h-[1px] bg-[#d0a755]"></span>
                <span className="text-[#d0a755] font-bold tracking-widest text-xs uppercase">{t.drivers.eyebrow}</span>
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                {t.drivers.title1} <br/><span className="text-[#d0a755]">{t.drivers.title2}</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-10 font-light max-w-lg">
                {t.drivers.text}
              </p>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#d0a755] border border-white/10 shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t.drivers.f1Title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{t.drivers.f1Sub}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#d0a755] border border-white/10 shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t.drivers.f2Title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{t.drivers.f2Sub}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#d0a755] border border-white/10 shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t.drivers.f3Title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{t.drivers.f3Sub}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#d0a755] border border-white/10 shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{t.drivers.f4Title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed">{t.drivers.f4Sub}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image Content */}
            <div className="relative animate-reveal-2 h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
              <Image 
                src="/team.png" 
                alt="سائق محترف" 
                fill
                className="object-cover object-top md:object-center transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b3c]/80 via-transparent to-transparent"></div>
              
              <div className="absolute z-10 bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 text-center p-4 md:p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                <p className="text-white opacity-100 text-sm md:text-base font-bold leading-relaxed drop-shadow-md">
                  &quot;{t.drivers.quote}&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Car Brands Marquee Section */}
        <section className="relative w-full bg-white py-32 overflow-hidden">
          {/* Subtle top divider */}
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#d0a755]/20 to-transparent"></div>

          <div className="mx-auto max-w-[1200px] px-8 relative z-10 flex flex-col items-center mb-16">
            {/* Artistic Header */}
            <div className="text-center animate-reveal-1">
              <span className="flex items-center justify-center gap-4 mb-6">
                <span className="w-12 h-[1px] bg-[#d0a755]/50"></span>
                <span className="text-[#d0a755] font-bold tracking-[0.2em] text-xs uppercase">{t.brands.eyebrow}</span>
                <span className="w-12 h-[1px] bg-[#d0a755]/50"></span>
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1a2b3c] mb-6 tracking-tight">
                {t.brands.title}
              </h2>
              <p className="text-[#1a2b3c]/60 text-base md:text-lg max-w-2xl mx-auto font-light leading-[1.8]">
                {t.brands.text}
              </p>
            </div>
          </div>

          {/* Infinite Marquee Container */}
          <div className="relative flex w-full overflow-hidden" dir="ltr">
            {/* Gradient masks for smooth fading edges */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling Track */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {/* Combine two identical sets of brands into one continuous flex row */}
              <div className="flex items-center justify-center gap-16 md:gap-24 px-8 md:px-12">
                {[
                  ...[
                    "BMW", "KIA", "GEELY", "MERCEDES", "TOYOTA",
                    "HYUNDAI", "NISSAN", "CHEVROLET", "AUDI", "CHERY",
                    "MG", "LEXUS", "VOLKSWAGEN",
                    "HONDA", "SUZUKI", "PEUGEOT", "RENAULT", "SKODA",
                    "JEEP", "BYD", "HAVAL"
                  ],
                  ...[
                    "BMW", "KIA", "GEELY", "MERCEDES", "TOYOTA",
                    "HYUNDAI", "NISSAN", "CHEVROLET", "AUDI", "CHERY",
                    "MG", "LEXUS", "LAND ROVER", "VOLKSWAGEN",
                    "HONDA", "SUZUKI", "PEUGEOT", "RENAULT", "SKODA",
                    "JEEP", "BYD", "HAVAL"
                  ]
                ].map((brand, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center cursor-default transition-transform duration-300 hover:scale-110"
                  >
                    <span className="text-3xl md:text-5xl font-black font-outfit text-[#1a2b3c]/30 hover:text-[#d0a755] transition-colors duration-300 tracking-widest uppercase">
                      {brand}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="relative w-full bg-white py-24 overflow-hidden border-t border-black/5">
          <div className="mx-auto max-w-[1200px] px-8 relative z-10 flex flex-col items-center">
            <div className="text-center animate-reveal-1 mb-16">
              <span className="flex items-center justify-center gap-4 mb-4">
                <span className="w-10 h-[1px] bg-[#d0a755]/50"></span>
                <span className="text-[#d0a755] font-bold tracking-[0.2em] text-xs uppercase">{t.contact}</span>
                <span className="w-10 h-[1px] bg-[#d0a755]/50"></span>
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#1a2b3c] mb-5 tracking-tight">
                {t.social.title}
              </h2>
              <p className="text-[#1a2b3c]/60 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                {t.social.text}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 animate-reveal-2">
              {[
                { icon: <FaWhatsapp className="w-8 h-8" />, color: "hover:bg-[#25D366] hover:text-white", href: settings.socialLinks?.whatsapp || "#" },
                { icon: <FaFacebookF className="w-7 h-7" />, color: "hover:bg-[#1877F2] hover:text-white", href: settings.socialLinks?.facebook || "#" },
                { icon: <FaTiktok className="w-7 h-7" />, color: "hover:bg-black hover:text-white", href: settings.socialLinks?.tiktok || "#" },
                { icon: <FaInstagram className="w-8 h-8" />, color: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white border-transparent", href: settings.socialLinks?.instagram || "#" },
                { icon: <FaLinkedinIn className="w-7 h-7" />, color: "hover:bg-[#0A66C2] hover:text-white", href: settings.socialLinks?.linkedin || "#" },
                { icon: <FaYoutube className="w-8 h-8" />, color: "hover:bg-[#FF0000] hover:text-white", href: settings.socialLinks?.youtube || "#" },
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  target="_blank"
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] bg-[#F9F8F6] text-[#1a2b3c]/60 flex items-center justify-center transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 border border-black/5 ${social.color}`}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
