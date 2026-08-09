"use client";

import type { Locale } from "@/lib/types";
import { FaBuilding, FaMicrophoneAlt, FaMapMarkedAlt } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

export function CorporateSection({ locale }: { locale: Locale }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scroll = (dir: "next" | "prev") => {
    if (scrollRef.current) {
      const scrollStep = scrollRef.current.clientWidth;
      const sign = locale === "en" ? 1 : -1;
      const direction = dir === "next" ? 1 : -1;
      scrollRef.current.scrollBy({
        left: sign * direction * scrollStep,
        behavior: "smooth"
      });
    }
  };
  const t = {
    eyebrow: locale === "ar" ? "خدمات مخصصة" : "Specialized Services",
    title: locale === "ar" ? "خدمات الشركات والمؤتمرات" : "Corporate & Events",
    desc: locale === "ar" 
      ? "نقدم حلولاً متكاملة تلبي تطلعات الشركات وتضمن نجاح الفعاليات والمؤتمرات الكبرى بفضل أسطولنا المميز وفريقنا المحترف." 
      : "We provide integrated solutions that meet corporate expectations and ensure the success of major events and conferences.",
    cards: [
      {
        icon: <FaBuilding className="w-10 h-10" />,
        title: locale === "ar" ? "خدمات تعاقد الشركات" : "Corporate Contracting",
        text: locale === "ar" 
          ? "نوفر عقوداً مرنة وطويلة الأمد لخدمات النقل للشركات، لتأمين تنقلات الموظفين والمديرين بأعلى مستويات الراحة والأمان، مع تخصيص أسطول سيارات يتناسب مع مكانة شركتك."
          : "We offer flexible, long-term transportation contracts for companies, ensuring safe and comfortable mobility for employees and executives with a fleet tailored to your corporate image.",
        action: locale === "ar" ? "عرض التفاصيل" : "View Details",
        modalContent: (
          <div className="space-y-4">
            <p className="text-sm text-[#1a2b3c]/80 leading-relaxed font-medium">
              {locale === "ar" ? "نقدم لك في ليمو مصر حلولاً متكاملة لتنقلات شركتك عبر عقود مرنة تضمن لك:" : "At Limo Masr, we provide integrated solutions for your corporate mobility through flexible contracts ensuring:"}
            </p>
            <ul className="list-disc list-inside text-sm pr-2 pl-2 space-y-2 text-[#1a2b3c]/80 marker:text-[#d0a755]">
              <li>{locale === "ar" ? "تأمين تنقلات الموظفين والمديرين بأعلى مستويات الراحة والأمان." : "Securing mobility for employees and executives with utmost comfort and safety."}</li>
              <li>{locale === "ar" ? "تخصيص أسطول سيارات يتناسب مع مكانة شركتك واحتياجاتها." : "Allocating a fleet of vehicles that matches your company's prestige and needs."}</li>
              <li>{locale === "ar" ? "مرونة في التعاقد (يومي، شهري، سنوي) بأسعار تنافسية." : "Flexibility in contracting (daily, monthly, yearly) at competitive rates."}</li>
              <li>{locale === "ar" ? "سائقين محترفين وموثوقين ومدربين على أعلى مستوى." : "Professional, reliable, and highly trained drivers."}</li>
              <li>{locale === "ar" ? "خدمة عملاء ودعم فني مخصص للشركات على مدار الساعة." : "Dedicated 24/7 customer service and technical support for corporates."}</li>
            </ul>
          </div>
        )
      },
      {
        icon: <FaMicrophoneAlt className="w-10 h-10" />,
        title: locale === "ar" ? "تنظيم وإدارة المؤتمرات" : "Conference Management",
        text: locale === "ar" 
          ? "فريق متخصص في تخطيط وتنفيذ الخدمات اللوجستية للمؤتمرات والفعاليات الكبرى، بما يشمل استقبال الوفود من المطارات وتوفير سيارات فاخرة تليق بضيوفك."
          : "A specialized team dedicated to planning and executing logistics for major conferences and events, including VIP airport meet-and-greets and luxury transportation for your guests.",
        action: locale === "ar" ? "عرض التفاصيل" : "View Details",
        modalContent: (
          <div className="space-y-4">
            <p className="text-sm text-[#1a2b3c]/80 leading-relaxed font-medium">
              {locale === "ar" ? "نضمن لك نجاح فعالياتك ومؤتمراتك من خلال فريق متخصص يقدم:" : "We ensure the success of your events and conferences through a specialized team offering:"}
            </p>
            <ul className="list-disc list-inside text-sm pr-2 pl-2 space-y-2 text-[#1a2b3c]/80 marker:text-[#d0a755]">
              <li>{locale === "ar" ? "تخطيط وتنفيذ الخدمات اللوجستية للمؤتمرات والفعاليات الكبرى." : "Planning and executing logistics for major conferences and events."}</li>
              <li>{locale === "ar" ? "استقبال الوفود وكبار الشخصيات (VIP) من المطارات باحترافية." : "Professional meet-and-greet for VIPs and delegations at airports."}</li>
              <li>{locale === "ar" ? "توفير سيارات فاخرة ومجهزة تليق بضيوفك وواجهة شركتك." : "Providing equipped luxury vehicles befitting your guests and corporate image."}</li>
              <li>{locale === "ar" ? "إدارة حركة السيارات وتنقلات الضيوف بشكل منظم ودقيق." : "Precise and organized management of vehicle movements and guest transfers."}</li>
            </ul>
          </div>
        )
      },
      {
        icon: <FaMapMarkedAlt className="w-10 h-10" />,
        title: locale === "ar" ? "تنظيم الرحلات ورحلات اليوم الواحد" : "Trips & Day Tours",
        text: locale === "ar" 
          ? "نقدم برامج سياحية متكاملة ورحلات يوم واحد لأجمل الوجهات داخل مصر بأسطول سيارات حديث لضمان راحتك."
          : "We offer comprehensive tourist programs and one-day trips to the most beautiful destinations in Egypt with a modern fleet for your comfort.",
        action: locale === "ar" ? "عرض الوجهات والتفاصيل" : "View Destinations",
        modalContent: locale === "ar" ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-[#d0a755] font-black text-lg mb-3 pb-2 border-b border-black/5">1- وجهات الرحلات السياحية:</h3>
              <ul className="grid grid-cols-2 gap-3 text-sm font-medium text-[#1a2b3c]/80 px-2">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>القاهرة والجيزة</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>الإسكندرية</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>شرم الشيخ</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>الغردقة</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>الأقصر</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>أسوان</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#d0a755] font-black text-lg mb-3 pb-2 border-b border-black/5">2- رحلات اليوم الواحد:</h3>
              <ul className="grid grid-cols-2 gap-3 text-sm font-medium text-[#1a2b3c]/80 px-2">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>رحلة الفيوم</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>رحلة العين السخنة</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>رحلة الساحل الشمالي</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-[#d0a755] font-black text-lg mb-3 pb-2 border-b border-black/5">1- Tourist Destinations:</h3>
              <ul className="grid grid-cols-2 gap-3 text-sm font-medium text-[#1a2b3c]/80 px-2">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>Cairo & Giza</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>Alexandria</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>Sharm El Sheikh</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>Hurghada</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>Luxor</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>Aswan</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#d0a755] font-black text-lg mb-3 pb-2 border-b border-black/5">2- One-Day Tours:</h3>
              <ul className="grid grid-cols-2 gap-3 text-sm font-medium text-[#1a2b3c]/80 px-2">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>Fayoum Trip</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>El Sokhna Trip</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#d0a755]"></span>North Coast Trip</li>
              </ul>
            </div>
          </div>
        )
      }
    ]
  };

  return (
    <section className="relative w-full bg-[#F9F8F6] py-24 overflow-hidden border-b border-black/5">
      <div className="mx-auto max-w-[1200px] px-8 relative z-10 flex flex-col items-center">
        <div className="text-center animate-reveal-1 mb-16">
          <span className="flex items-center justify-center gap-4 mb-4">
            <span className="w-10 h-[1px] bg-[#d0a755]"></span>
            <span className="text-[#d0a755] font-bold tracking-[0.2em] text-xs uppercase">{t.eyebrow}</span>
            <span className="w-10 h-[1px] bg-[#d0a755]"></span>
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#1a2b3c] mb-5 tracking-tight">
            {t.title}
          </h2>
          <p className="text-[#1a2b3c]/70 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {t.desc}
          </p>
        </div>

        <div 
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-3 md:grid md:grid-cols-2 gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide w-full animate-reveal-2 pb-4 -mx-8 px-8 md:mx-0 md:px-0 md:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {t.cards.map((card, idx) => (
            <div key={idx} className="snap-center shrink-0 w-[calc(100vw-4rem)] md:w-auto flex flex-col group bg-white border border-black/5 p-10 rounded-[2rem] hover:border-[#d0a755]/30 hover:shadow-[0_20px_40px_-10px_rgba(208,167,85,0.15)] transition-all duration-300">
              <div className="w-20 h-20 rounded-2xl bg-[#F9F8F6] shadow-sm text-[#d0a755] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#1a2b3c] transition-all duration-300">
                {card.icon}
              </div>
              <h3 className="text-2xl font-black text-[#1a2b3c] mb-4">{card.title}</h3>
              <div className="text-[#1a2b3c]/70 leading-relaxed font-light text-[15px] flex-1">
                {card.text}
              </div>
              {card.action && (
                <button
                  onClick={() => setActiveModalIndex(idx)}
                  className="mt-6 w-full py-3 rounded-xl border border-[#d0a755] text-[#d0a755] font-bold hover:bg-[#d0a755] hover:text-white transition-all"
                >
                  {card.action}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="flex md:hidden items-center justify-center gap-4 mt-6 animate-reveal-2">
          <button onClick={() => scroll("prev")} aria-label="Previous" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#1a2b3c] hover:border-[#1a2b3c] hover:text-[#d0a755] transition-all text-[#1a2b3c]">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === "en" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} /></svg>
          </button>
          <button onClick={() => scroll("next")} aria-label="Next" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#1a2b3c] hover:border-[#1a2b3c] hover:text-[#d0a755] transition-all text-[#1a2b3c]">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === "en" ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} /></svg>
          </button>
        </div>
      </div>

      {/* Generic Dynamic Modal */}
      {mounted && activeModalIndex !== null && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" dir={locale === "ar" ? "rtl" : "ltr"}>
          <div className="bg-white w-full max-w-xl rounded-3xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl relative">
            <button 
              onClick={() => setActiveModalIndex(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors z-10"
            >
              <FiX className="w-6 h-6" />
            </button>
            <div className="p-8 pt-10">
              <div className="w-16 h-16 rounded-2xl bg-[#F9F8F6] shadow-sm text-[#d0a755] flex items-center justify-center mb-6">
                {t.cards[activeModalIndex].icon}
              </div>
              <h2 className="text-2xl font-black text-[#1a2b3c] mb-6 pr-8 rtl:pr-0 rtl:pl-8">
                {t.cards[activeModalIndex].title}
              </h2>

              <div className="max-h-[80vh] overflow-y-auto pr-2 rtl:pr-0 rtl:pl-2 custom-scrollbar">
                {t.cards[activeModalIndex].modalContent}
              </div>

              <div className="mt-8 pt-6 border-t border-black/5">
                <button
                  onClick={() => setActiveModalIndex(null)}
                  className="w-full bg-[#1a2b3c] text-white py-3.5 rounded-xl font-bold hover:bg-[#1a2b3c]/90 transition-colors"
                >
                  {locale === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
