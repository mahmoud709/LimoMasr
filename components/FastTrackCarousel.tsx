"use client";

import { useRef } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { FastTrackPackage, Locale } from "@/lib/types";

export function FastTrackCarousel({ packages, title, viewAllText, locale = "ar", currency = "EGP", exchangeRate = 50 }: { packages: FastTrackPackage[]; title: string; viewAllText?: string; locale?: Locale; currency?: string; exchangeRate?: number; }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEn = locale === "en";

  const scroll = (dir: "next" | "prev") => {
    if (scrollRef.current) {
      const scrollStep = typeof window !== 'undefined' && window.innerWidth < 768 ? scrollRef.current.clientWidth : 360;
      const sign = isEn ? 1 : -1;
      const direction = dir === "next" ? 1 : -1;
      scrollRef.current.scrollBy({
        left: sign * direction * scrollStep,
        behavior: "smooth"
      });
    }
  };

  return (
    <div dir={isEn ? "ltr" : "rtl"} className="w-full relative z-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-[#1a2b3c] flex items-center gap-3">
          <span className="text-[#f0a500] text-2xl md:text-3xl leading-none">|</span> {title}
        </h2>
        
        <div className="flex items-center gap-5">
          {/* Navigation Arrows first */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll("prev")} 
              className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 hover:border-black/20 transition-all text-[#1a2b3c]"
              aria-label="Previous"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEn ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
            <button 
              onClick={() => scroll("next")} 
              className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 hover:border-black/20 transition-all text-[#1a2b3c]"
              aria-label="Next"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEn ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>

          {/* View All Text Link after arrows */}
          {viewAllText && (
            <Link href={isEn ? "/en/fast-track" : "/fast-track"} className="text-sm font-bold text-[#1a2b3c] hover:text-[#f0a500] transition-colors hidden sm:block shrink-0">
              {viewAllText}
            </Link>
          )}
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {packages.map((item) => {
          const name = locale === "en" ? item.translations?.en?.name || item.name : item.name;
          const airport = locale === "en" ? item.translations?.en?.airport || item.airport : item.airport;
          const description = locale === "en" ? item.translations?.en?.description || item.description : item.description;
          const tagLeft = locale === "en" ? item.translations?.en?.tagLeft || item.tagLeft : item.tagLeft;
          const tagRight = locale === "en" ? item.translations?.en?.tagRight || item.tagRight : item.tagRight;

          return (
            <div key={item.id} className="snap-start shrink-0 w-[280px] md:w-[340px]">
              <article className="luxury-panel p-6 md:p-8 flex flex-col h-full bg-white relative overflow-hidden group hover:border-[#d0a755] transition-all duration-300">
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
                  {tagLeft && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d0a755] text-white text-[10px] font-black shadow-md uppercase">
                      {tagLeft}
                    </span>
                  )}
                  {tagRight && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1a2b3c] text-[#d0a755] text-[10px] font-black border border-[#d0a755]/20 shadow-md uppercase">
                      {tagRight}
                    </span>
                  )}
                </div>

                {item.image && (
                  <div className="w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] h-56 -mt-6 md:-mt-8 -mx-6 md:-mx-8 mb-6 relative overflow-hidden rounded-t-2xl bg-gray-50 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image} 
                      alt={name} 
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80";
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>
                )}
                
                {/* Subtle accent icon */}
                <div className="absolute top-2 right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <svg className="w-12 h-12 text-[#1a2b3c]" fill="currentColor" viewBox="0 0 24 24"><path d="M21.9 10.4c-.2-.7-.8-1.2-1.5-1.4l-7.7-2.3-3.6-5.8c-.3-.5-.8-.7-1.4-.7-.3 0-.6.1-.8.2-.2.1-.3.3-.4.5-.1.2-.1.5 0 .8l2.6 6.5-4.8-1.5-1.9-2.9c-.2-.3-.5-.5-.8-.5H1c-.3 0-.5.2-.6.4-.1.3 0 .5.2.7l3.6 3.6-2.5 1.5c-.3.2-.5.5-.6.9-.1.4 0 .8.2 1.1l1.5 2.5c.2.3.5.5.9.6h.4l8.3-5 5.5 1.6c.7.2 1.5-.1 1.9-.7l.9-1.5c.3-.6.2-1.4-.3-1.9z"/></svg>
                </div>

                <p className="text-xs font-bold tracking-widest text-[#d0a755] uppercase relative z-10">{locale === "en" ? airport : `مطار ${airport}`}</p>
                <h3 className="mt-3 text-xl font-black text-[#1a2b3c] relative z-10 line-clamp-1">{name}</h3>
                
                {/* Bulleted checkmark feature list for clean look */}
                <ul className="mt-4 space-y-1.5 flex-grow relative z-10">
                  {description.split('\n').slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs text-[#1a2b3c]/75 font-medium">
                      <svg className="w-3.5 h-3.5 text-[#d0a755] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="truncate">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-4 border-t border-black/5 flex flex-wrap items-center justify-between gap-2 relative z-10">
                  <div className="flex items-baseline gap-1" dir="rtl">
                    <span className="text-xl font-black text-[#d0a755]">{formatCurrency(item.price, item.currency, locale, currency, exchangeRate)}</span>
                    <span className="text-[10px] font-bold text-[#1a2b3c]/40">{locale === "en" ? "/ person" : "/ للفرد"}</span>
                  </div>
                  <Link href="/fast-track" className="inline-flex items-center justify-center bg-[#1a2b3c] text-white hover:bg-[#d0a755] hover:text-[#1a2b3c] px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap">
                    {locale === "en" ? "Book Now" : "احجز الآن"}
                  </Link>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
