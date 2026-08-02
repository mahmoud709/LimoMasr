"use client";

import type { Locale } from "@/lib/types";
import { FaBuilding, FaMicrophoneAlt } from "react-icons/fa";
import { useRef } from "react";

export function CorporateSection({ locale }: { locale: Locale }) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
          : "We offer flexible, long-term transportation contracts for companies, ensuring safe and comfortable mobility for employees and executives with a fleet tailored to your corporate image."
      },
      {
        icon: <FaMicrophoneAlt className="w-10 h-10" />,
        title: locale === "ar" ? "تنظيم وإدارة المؤتمرات" : "Conference Management",
        text: locale === "ar" 
          ? "فريق متخصص في تخطيط وتنفيذ الخدمات اللوجستية للمؤتمرات والفعاليات الكبرى، بما يشمل استقبال الوفود من المطارات وتوفير سيارات فاخرة تليق بضيوفك."
          : "A specialized team dedicated to planning and executing logistics for major conferences and events, including VIP airport meet-and-greets and luxury transportation for your guests."
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
          className="flex md:grid md:grid-cols-2 gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide w-full animate-reveal-2 pb-4 -mx-8 px-8 md:mx-0 md:px-0 md:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {t.cards.map((card, idx) => (
            <div key={idx} className="snap-center shrink-0 w-[calc(100vw-4rem)] md:w-auto group bg-white border border-black/5 p-10 rounded-[2rem] hover:border-[#d0a755]/30 hover:shadow-[0_20px_40px_-10px_rgba(208,167,85,0.15)] transition-all duration-300">
              <div className="w-20 h-20 rounded-2xl bg-[#F9F8F6] shadow-sm text-[#d0a755] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#1a2b3c] transition-all duration-300">
                {card.icon}
              </div>
              <h3 className="text-2xl font-black text-[#1a2b3c] mb-4">{card.title}</h3>
              <p className="text-[#1a2b3c]/70 leading-relaxed font-light text-[15px]">
                {card.text}
              </p>
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
    </section>
  );
}
