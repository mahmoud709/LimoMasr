"use client";

import { useRef } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { FastTrackPackage, Locale } from "@/lib/types";

export function FastTrackCarousel({ packages, title, viewAllText, locale = "ar" }: { packages: FastTrackPackage[]; title: string; viewAllText?: string; locale?: Locale }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full relative z-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-[#1a2b3c] flex items-center gap-3">
          <span className="text-[#f0a500] text-2xl md:text-3xl leading-none">|</span> {title}
        </h2>
        
        <div className="flex items-center gap-5">
          {viewAllText && (
            <Link href="/fast-track" className="text-sm font-bold text-[#1a2b3c] hover:text-[#f0a500] transition-colors hidden sm:block">
              {viewAllText}
            </Link>
          )}
          <div className="flex items-center gap-2" dir="ltr">
            <button onClick={() => scroll("left")} className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 hover:border-black/20 transition-all text-[#1a2b3c]">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll("right")} className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 hover:border-black/20 transition-all text-[#1a2b3c]">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {packages.map((item) => (
          <div key={item.id} className="snap-start shrink-0 w-[280px] md:w-[340px]">
            <article className="luxury-panel p-6 md:p-8 flex flex-col h-full bg-white relative overflow-hidden group hover:border-[#d0a755] transition-colors">
              {/* Subtle accent icon */}
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <svg className="w-16 h-16 text-[#1a2b3c]" fill="currentColor" viewBox="0 0 24 24"><path d="M21.9 10.4c-.2-.7-.8-1.2-1.5-1.4l-7.7-2.3-3.6-5.8c-.3-.5-.8-.7-1.4-.7-.3 0-.6.1-.8.2-.2.1-.3.3-.4.5-.1.2-.1.5 0 .8l2.6 6.5-4.8-1.5-1.9-2.9c-.2-.3-.5-.5-.8-.5H1c-.3 0-.5.2-.6.4-.1.3 0 .5.2.7l3.6 3.6-2.5 1.5c-.3.2-.5.5-.6.9-.1.4 0 .8.2 1.1l1.5 2.5c.2.3.5.5.9.6h.4l8.3-5 5.5 1.6c.7.2 1.5-.1 1.9-.7l.9-1.5c.3-.6.2-1.4-.3-1.9z"/></svg>
              </div>

              <p className="text-xs font-bold tracking-widest text-[#d0a755] uppercase relative z-10">{locale === "en" ? item.translations?.en?.airport || item.airport : `مطار ${item.airport}`}</p>
              <h3 className="mt-3 text-xl md:text-2xl font-black text-[#1a2b3c] relative z-10 line-clamp-2">{locale === "en" ? item.translations?.en?.name || item.name : item.name}</h3>
              <p className="mt-4 leading-relaxed text-[#1a2b3c]/60 font-light flex-grow relative z-10 line-clamp-3">{locale === "en" ? item.translations?.en?.description || item.description : item.description}</p>
              
              <div className="mt-6 pt-6 border-t border-black/5 flex flex-wrap items-center justify-between gap-2 relative z-10">
                <div className="flex items-baseline gap-1" dir="rtl">
                  <span className="text-xl md:text-2xl font-black text-[#d0a755]">{formatCurrency(item.price, item.currency, locale)}</span>
                  <span className="text-xs font-bold text-[#1a2b3c]/40">{locale === "en" ? "/ person" : "/ للفرد"}</span>
                </div>
                <Link href="/fast-track" className="inline-flex items-center justify-center bg-[#1a2b3c] text-white hover:bg-[#d0a755] hover:text-[#1a2b3c] px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap">
                  {locale === "en" ? "Book Now" : "احجز الآن"}
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
