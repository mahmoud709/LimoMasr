import Link from "next/link";
import type { ReactNode } from "react";
import type { SiteSettings, ServiceType, Locale } from "@/lib/types";
import { siteText, ui, withLang } from "@/lib/i18n";
import { buildWhatsappUrl, serviceWhatsappNumber } from "@/lib/utils";
import { FaWhatsapp, FaFacebookF, FaTiktok, FaInstagram, FaLinkedinIn, FaYoutube, FaMapMarkerAlt, FaCar, FaPlane, FaSnapchatGhost, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileMenu } from "@/components/MobileMenu";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

const socialIconsMap: Record<string, ReactNode> = {
  whatsapp: <FaWhatsapp className="w-5 h-5" />,
  facebook: <FaFacebookF className="w-4 h-4" />,
  tiktok: <FaTiktok className="w-4 h-4" />,
  instagram: <FaInstagram className="w-5 h-5" />,
  linkedin: <FaLinkedinIn className="w-4 h-4" />,
  youtube: <FaYoutube className="w-5 h-5" />,
  snapchat: <FaSnapchatGhost className="w-5 h-5" />,
  telegram: <FaTelegramPlane className="w-5 h-5" />,
  x: <FaXTwitter className="w-4 h-4" />,
};

const navItems = [
  ["home", "/"],
  ["flights", "/flights"],
  ["hotels", "/hotels"],
  ["hotelApartments", "/hotel-apartments"],
  ["fastTrack", "/fast-track"],
  ["cars", "/cars"],
  ["about", "/about"],
  ["contact", "/contact"],
] as const;

import { cookies } from "next/headers";

export async function PublicLayout({
  children,
  settings,
  whatsappType = "car",
  locale: propLocale,
}: {
  children: ReactNode;
  settings: SiteSettings;
  whatsappType?: ServiceType;
  locale?: Locale;
}) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale;
  const locale = propLocale || cookieLocale || "ar";

  const customerToken = cookieStore.get("customer-token")?.value;
  const portalLink = customerToken ? "/my-bookings" : "/login";
  const portalText = locale === "en"
    ? (customerToken ? "My Bookings" : "Login")
    : (customerToken ? "حجوزاتي" : "دخول");

  const t = ui[locale];
  const content = siteText(settings, locale);
  const phone = serviceWhatsappNumber(whatsappType, settings);
  const whatsappUrl = buildWhatsappUrl(
    phone,
    locale === "en"
      ? "Hello Limo Masr, I want to ask about booking."
      : "مرحبًا ليمو مصر، أريد الاستفسار عن الحجز.",
  );
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <div className="min-h-screen flex flex-col relative z-10 bg-[#F9F8F6] text-[#111111]" dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* Header updated to match the dark blue hero */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 bg-[#1a2b3c]/95 backdrop-blur-2xl border-b border-[#d0a755]/30 shadow-sm">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8 flex items-center justify-between h-20 md:h-24">
          <Link href={withLang("/", locale)} className="text-2xl font-black tracking-tighter text-white hover:text-[#d0a755] transition-colors duration-500">
            {content.brand}
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold tracking-wider">
            {navItems.map(([key, href]) => (
              <Link key={href} href={withLang(href, locale)} className="text-white/70 hover:text-white transition-colors duration-300 relative group py-2">
                {t[key]}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d0a755] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            <Link href={withLang(portalLink, locale)} className="text-[#d0a755] hover:text-white transition-colors duration-300 relative group py-2 font-black">
              {portalText}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d0a755] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
          
          <div className="flex items-center gap-3 md:gap-5">
            <LanguageSwitcher currentLocale={locale} targetLocale={otherLocale} />
            <Link href={whatsappUrl} target="_blank" className="bg-[#d0a755] hover:bg-[#b89040] text-[#1a2b3c] font-black rounded-md py-2 px-4 md:py-2.5 md:px-6 text-xs md:text-sm transition-colors duration-300 shadow-sm">
              {t.whatsapp}
            </Link>
            {/* Mobile Nav Toggle */}
            <MobileMenu navItems={navItems} translations={t as any} locale={locale} portalLink={portalLink} portalText={portalText} />
          </div>
        </div>
      </header>
      
      <div className="flex-1">
        {children}
      </div>

      {/* Massive Call To Action Banner (Floating above footer) */}
      <div className="relative z-20 -mb-12 px-6 md:px-8 max-w-[1400px] mx-auto w-full">
        <div className="bg-linear-to-l from-[#d0a755] to-[#e6c175] rounded-4xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden border border-white/40">
          <div className="absolute -left-10 -bottom-10 opacity-20 w-64 h-64 bg-white rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 rtl:text-right ltr:text-left md:w-2/3">
            <h3 className="text-2xl md:text-3xl font-black text-[#1a2b3c] mb-2 tracking-tight leading-tight">
              {locale === "en" ? "Ready for a Luxury Experience?" : "هل أنت مستعد لتجربة فاخرة؟"}
            </h3>
            <p className="text-[#1a2b3c]/80 text-base md:text-lg font-medium max-w-xl">
              {locale === "en"
                ? "Book your car now or contact us to arrange your airport welcome with the highest standards of comfort and safety."
                : "احجز سيارتك الآن أو تواصل معنا لترتيب استقبالك من المطار بأعلى معايير الراحة والأمان."}
            </p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <a href={buildWhatsappUrl(settings.whatsappCarNumber, "")} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#1a2b3c] text-white px-6 py-3.5 rounded-xl font-black text-base tracking-wide hover:bg-white hover:text-[#1a2b3c] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <FaWhatsapp className="w-5 h-5 text-[#25D366]" />
              {locale === "en" ? "Connect via WhatsApp" : "تواصل عبر واتساب"}
            </a>
          </div>
        </div>
      </div>

      <footer className="relative mt-auto bg-[#1a2b3c] pt-32 pb-8 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, #d0a755 0%, transparent 20%), radial-gradient(circle at 90% 80%, #d0a755 0%, transparent 20%)' }}></div>
        
        <div className="mx-auto max-w-[1400px] px-6 md:px-8 relative z-10">

          <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-12">
            
            {/* Brand & Description */}
            <div className="lg:col-span-4 flex flex-col">
              <Link href={withLang("/", locale)} className="text-4xl font-black tracking-tighter text-white mb-6 flex items-center gap-3 w-fit">
                <span className="text-[#d0a755]">|</span> {content.brand}
              </Link>
              <div className="text-sm leading-[2] text-white/60 font-light mb-8 max-w-sm space-y-4">
                <p>{content.footerText}</p>
                <p>
                  {locale === "en"
                    ? "Limo Masr is your premier choice for luxury limousine and tourist transportation services. We provide a modern fleet of vehicles with professional drivers to ensure your comfort and safety on every journey, whether for city transits or airport transfers."
                    : "ليمو مصر هي خيارك الأول لخدمات الليموزين الفاخرة والنقل السياحي. نقدم أسطولاً حديثاً من السيارات مع سائقين محترفين لضمان راحتك وأمانك في كل رحلة، سواء كانت تنقلات داخل المدينة أو استقبال من المطار."}
                </p>
              </div>
              
              {/* Social Icons - forcing defaults if empty */}
              <div className="flex flex-wrap gap-3 mt-auto">
                {[
                  { name: 'youtube', url: settings.socialLinks?.youtube || '#' },
                  { name: 'linkedin', url: settings.socialLinks?.linkedin || '#' },
                  { name: 'tiktok', url: settings.socialLinks?.tiktok || '#' },
                  { name: 'instagram', url: settings.socialLinks?.instagram || '#' },
                  { name: 'facebook', url: settings.socialLinks?.facebook || '#' },
                  { name: 'whatsapp', url: settings.socialLinks?.whatsapp || '#' },
                  { name: 'snapchat', url: settings.socialLinks?.snapchat || '#' },
                  { name: 'telegram', url: settings.socialLinks?.telegram || '#' },
                  { name: 'x', url: settings.socialLinks?.x || '#' },
                ].filter(s => s.url && s.url !== '#').map(({ name, url }) => (
                  <Link key={name} href={url} target="_blank" className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#d0a755] hover:border-[#d0a755] hover:text-[#1a2b3c] hover:-translate-y-1 transition-all duration-300 shadow-sm">
                    {socialIconsMap[name]}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-black tracking-[0.1em] text-white mb-8 flex items-center gap-3">
                <span className="w-6 h-1 rounded-full bg-[#d0a755]"></span>
                {locale === "en" ? "Quick Links" : "الروابط السريعة"}
              </h3>
              <div className="flex flex-col gap-5">
                {navItems.map(([key, href]) => (
                  <Link key={href} href={withLang(href, locale)} className="text-white/60 hover:text-[#d0a755] hover:translate-x-[-8px] transition-all duration-300 text-base font-medium flex items-center gap-3 w-fit group">
                    <span className="text-[#d0a755] opacity-0 group-hover:opacity-100 transition-opacity duration-300">←</span> 
                    {t[key]}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-black tracking-widest text-white mb-8 flex items-center gap-3">
                <span className="w-6 h-1 rounded-full bg-[#d0a755]"></span>
                {locale === "en" ? "Contact Us" : "التواصل"}
              </h3>
              <div className="space-y-6 text-sm text-white/80 font-light">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#d0a755]/30 transition-colors">
                  <FaMapMarkerAlt className="w-5 h-5 text-[#d0a755] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{content.address}</span>
                </div>
                
                <a href={buildWhatsappUrl(settings.whatsappCarNumber, "")} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#d0a755]/30 hover:bg-white/10 transition-all group w-full">
                  <FaCar className="w-5 h-5 text-[#d0a755] shrink-0" />
                  <span dir="ltr" className="text-white font-bold tracking-widest text-base group-hover:text-[#d0a755] transition-colors">{settings.whatsappCarNumber}</span> 
                </a>
                
                <a href={buildWhatsappUrl(settings.whatsappServiceNumber, "")} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#d0a755]/30 hover:bg-white/10 transition-all group w-full">
                  <FaPlane className="w-5 h-5 text-[#d0a755] shrink-0" />
                  <span dir="ltr" className="text-white font-bold tracking-widest text-base group-hover:text-[#d0a755] transition-colors">{settings.whatsappServiceNumber}</span>
                </a>
              </div>
            </div>
            
            {/* Legal Info */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-black tracking-widest text-white mb-8 flex items-center gap-3">
                <span className="w-6 h-1 rounded-full bg-[#d0a755]"></span>
                {locale === "en" ? "Information" : "معلومات"}
              </h3>
              <div className="flex flex-col gap-5 font-light">
                <Link href={withLang("/policies", locale)} className="text-white/60 hover:text-[#d0a755] transition-colors text-base flex items-center gap-3 w-fit group">
                  <span className="w-2 h-2 rounded-full bg-[#d0a755]/50 group-hover:bg-[#d0a755] transition-colors"></span> 
                  {t.policies}
                </Link>
                <Link href={withLang("/privacy", locale)} className="text-white/60 hover:text-[#d0a755] transition-colors text-base flex items-center gap-3 w-fit group">
                  <span className="w-2 h-2 rounded-full bg-[#d0a755]/50 group-hover:bg-[#d0a755] transition-colors"></span> 
                  {t.privacy}
                </Link>
              </div>
            </div>
            
          </div>
          
          <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/40 font-light">
            <p>© {new Date().getFullYear()} {content.brand}. {locale === "en" ? "All rights reserved." : "جميع الحقوق محفوظة."}</p>
            <p className="mt-4 md:mt-0 uppercase tracking-[0.2em] text-[11px] font-bold">Designed for Excellence</p>
          </div>
        </div>
      </footer>
      <FloatingWhatsApp phone={settings.whatsappCarNumber} socialLinks={settings.socialLinks} locale={locale} />
    </div>
  );
}
