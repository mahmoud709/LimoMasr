"use client";

import { useRef } from "react";
import Link from "next/link";
import { CarCard } from "./CarCard";
import type { Car, Locale } from "@/lib/types";

export function CarCarousel({ cars, title, viewAllText, locale = "ar", currency = "EGP", exchangeRate = 50 }: { cars: Car[]; title: string; viewAllText?: string; locale?: Locale; currency?: string; exchangeRate?: number; }) {
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
            <Link href="/cars" className="text-sm font-bold text-[#1a2b3c] hover:text-[#f0a500] transition-colors hidden sm:block">
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
        {cars.map((car, index) => (
          <div key={`${car.id}-${index}`} className="snap-start shrink-0 w-[280px] md:w-[360px]">
             <CarCard car={car} locale={locale} currency={currency} exchangeRate={exchangeRate} />
          </div>
        ))}
      </div>
    </div>
  );
}
