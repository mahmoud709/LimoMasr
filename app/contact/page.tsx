import { PublicLayout } from "@/components/PublicLayout";
import { ContactForm } from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/data";
import { FaMapMarkerAlt, FaCar, FaPlane, FaWhatsapp, FaEnvelope, FaUser, FaPhone, FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { buildWhatsappUrl } from "@/lib/utils";
import { siteText, getLocale, ui } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const settings = await getSiteSettings();
  const locale = getLocale(searchParams?.lang) as Locale;
  const content = siteText(settings, locale);
  const t = ui[locale];
  
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(content.address)}&output=embed`;
  
  return (
    <PublicLayout settings={settings} locale={locale}>
      <main className="w-full relative z-10 bg-[#F9F8F6]">
        
        {/* Hero Banner */}
        <section className="relative w-full h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" 
              alt="Limo Masr Contact" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-[800px] mx-auto px-6 animate-reveal-1">
            <div className="bg-[#1a2b3c]/90 backdrop-blur-md rounded-[2rem] p-8 md:p-12 text-center border border-white/10 shadow-2xl">
              <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                {t.contactPage.title}
              </h1>
              <p className="text-base md:text-lg text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
                {t.contactPage.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-6 md:px-8 py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 animate-reveal-2">
            
            {/* Contact Form */}
            <ContactForm t={t.contactPage} />

            {/* Luxury Contact Card */}
            <div className="bg-[#1a2b3c] rounded-[2rem] p-8 md:p-10 text-white flex flex-col justify-center gap-8 shadow-2xl relative overflow-hidden border border-[#d0a755]/20 h-full text-start">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, #d0a755 0%, transparent 50%)' }}></div>
              
              <div className="relative z-10 flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                  <FaMapMarkerAlt className="w-6 h-6 text-[#d0a755]" />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-black tracking-[0.2em] text-[#d0a755] uppercase">{t.contactPage.hq}</span>
                  <p className="font-medium text-lg text-white/90 leading-relaxed">{content.address}</p>
                </div>
              </div>

              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              {/* Email Address */}
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#d0a755]/10 transition-colors shadow-inner">
                    <FaEnvelope className="w-6 h-6 text-[#d0a755]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black tracking-[0.2em] text-[#d0a755] uppercase">{t.contactPage.emailLabel}</span>
                    <a href="mailto:info@limo-egypt.com" dir="ltr" className="font-bold text-left text-2xl font-outfit text-white tracking-widest hover:text-[#d0a755] transition-colors">info@limo-egypt.com</a>
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#d0a755]/10 transition-colors shadow-inner">
                    <FaCar className="w-6 h-6 text-[#d0a755]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black tracking-[0.2em] text-[#d0a755] uppercase">{t.carNumber}</span>
                    <p dir="ltr" className="font-bold text-left text-2xl font-outfit text-white tracking-widest">{settings.whatsappCarNumber}</p>
                  </div>
                </div>
                <a href={buildWhatsappUrl(settings.whatsappCarNumber, "")} target="_blank" rel="noreferrer" className="w-full md:w-auto flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#d0a755] hover:text-[#1a2b3c] hover:border-[#d0a755] hover:shadow-[0_10px_20px_rgba(208,167,85,0.2)] hover:-translate-y-1 transition-all">
                  <FaWhatsapp className="w-5 h-5" />
                  {t.whatsapp}
                </a>
              </div>

              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#d0a755]/10 transition-colors shadow-inner">
                    <FaPlane className="w-6 h-6 text-[#d0a755]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black tracking-[0.2em] text-[#d0a755] uppercase">{t.serviceNumber}</span>
                    <p dir="ltr" className="font-bold text-left text-2xl font-outfit text-white tracking-widest">{settings.whatsappServiceNumber}</p>
                  </div>
                </div>
                <a href={buildWhatsappUrl(settings.whatsappServiceNumber, "")} target="_blank" rel="noreferrer" className="w-full md:w-auto flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#d0a755] hover:text-[#1a2b3c] hover:border-[#d0a755] hover:shadow-[0_10px_20px_rgba(208,167,85,0.2)] hover:-translate-y-1 transition-all">
                  <FaWhatsapp className="w-5 h-5" />
                  {t.whatsapp}
                </a>
              </div>

              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

              {/* Social Links */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                <span className="text-xs font-black tracking-[0.2em] text-[#d0a755] uppercase">{t.contactPage.followUs}</span>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  {[
                    { icon: <FaYoutube className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />, url: settings.socialLinks?.youtube || '#' },
                    { icon: <FaLinkedinIn className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />, url: settings.socialLinks?.linkedin || '#' },
                    { icon: <FaTiktok className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />, url: settings.socialLinks?.tiktok || '#' },
                    { icon: <FaInstagram className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />, url: settings.socialLinks?.instagram || '#' },
                    { icon: <FaFacebookF className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />, url: settings.socialLinks?.facebook || '#' },
                    { icon: <FaWhatsapp className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />, url: settings.socialLinks?.whatsapp || '#' },
                  ].map((social, idx) => (
                    <a key={idx} href={social.url} target="_blank" rel="noreferrer" className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#d0a755] hover:border-[#d0a755] hover:text-[#1a2b3c] hover:-translate-y-1 transition-all shadow-inner group">
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            

          </div>

          {/* Map */}
          <div className="mt-12 bg-white rounded-[2.5rem] p-3 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-black/5 animate-reveal-3">
            <iframe 
              title="موقع ليمو مصر" 
              src={mapUrl} 
              className="w-full h-[450px] rounded-[2rem] border-0" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </section>
      </main>
    </PublicLayout>
  );
}
