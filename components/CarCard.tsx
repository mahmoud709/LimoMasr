"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import type { Car, Locale } from "@/lib/types";
import { ui, withLang } from "@/lib/i18n";
import { formatCurrency, priceUnitLabel } from "@/lib/utils";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

export function CarCard({ car, locale = "ar", currency = "EGP", exchangeRate = 50 }: { car: Car; locale?: Locale; currency?: string; exchangeRate?: number; }) {
  const t = ui[locale];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const categoryName = car.translations?.[locale]?.categoryName || car.categoryName;
  const tag = car.translations?.[locale]?.tag || car.tag;
  const models = car.translations?.[locale]?.models || car.models;

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const index = Math.round(Math.abs(scrollLeft) / width);
      setCurrentImageIndex(index);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (scrollRef.current && currentImageIndex < car.images.length - 1) {
      scrollRef.current.scrollBy({ left: locale === 'ar' ? -scrollRef.current.clientWidth : scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (scrollRef.current && currentImageIndex > 0) {
      scrollRef.current.scrollBy({ left: locale === 'ar' ? scrollRef.current.clientWidth : -scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };
  
  return (
    <article className="flex flex-col w-full h-full luxury-panel p-4 md:p-5 group transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-6 w-full bg-[#1a2b3c]/5">
        
        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {car.images.map((img, idx) => (
            <img 
              key={idx}
              src={img} 
              alt={`${car.categoryName} - ${idx + 1}`} 
              className="w-full h-full object-cover shrink-0 snap-start transition-transform duration-700 group-hover:scale-105" 
              loading="lazy" 
            />
          ))}
        </div>

        {/* Carousel Arrows (only show if multiple images) */}
        {car.images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/50">
              <FaChevronRight className="w-3 h-3" />
            </button>
            <button onClick={nextImage} className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/50">
              <FaChevronLeft className="w-3 h-3" />
            </button>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
              {car.images.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-[#d0a755]' : 'w-1.5 bg-white/60'}`} />
              ))}
            </div>
          </>
        )}
        
        {/* Top Right Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-10 pointer-events-none">
          <span className="bg-[#d0a755] text-[#1a2b3c] text-[10px] font-black px-3 py-1 rounded-full shadow-md">
            {locale === "en" ? "Most Booked" : "الأكثر حجزاً"}
          </span>
          {tag && (
             <span className="bg-white text-[#1a2b3c] text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
               {tag}
             </span>
          )}
        </div>

        {/* Models Overlay (Shows on Hover over image) */}
        {models && models.length > 0 && (
          <div className="absolute inset-0 bg-[#1a2b3c]/90 backdrop-blur-sm z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <h4 className="text-[#d0a755] text-xs font-black tracking-widest uppercase mb-3 border-b border-[#d0a755]/30 pb-2 w-full">
              {locale === "en" ? "Available Models" : "الموديلات المتاحة"}
            </h4>
            <ul className="text-white text-sm font-medium space-y-1.5 w-full max-h-[80%] overflow-y-auto scrollbar-hide">
              {models.map((model, idx) => (
                <li key={idx} className="bg-white/5 rounded-md py-1 px-2">{model}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow rtl:text-right ltr:text-left mb-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-black text-[#1a2b3c] text-lg md:text-xl tracking-tight truncate max-w-[200px]">
             {categoryName}
          </h3>
          <div className="bg-[#F9F8F6] text-[#1a2b3c] text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 border border-black/5">
            <svg className="w-3 h-3 text-[#d0a755]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{car.seats} {locale === "en" ? "seats" : "مقاعد"}</span>
          </div>
        </div>


      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
        <p className="text-[12px] text-[#1a2b3c]/60 font-medium" dir="rtl">
          <span className="font-black text-[#d0a755] text-lg">{formatCurrency(car.price, "EGP", locale, currency, exchangeRate)}</span> / {priceUnitLabel(car.priceUnit, locale)} 
        </p>
        <Link href={withLang(`/cars/${car.slug}`, locale)} className="inline-flex items-center justify-center bg-[#1a2b3c] text-white hover:bg-[#d0a755] hover:text-[#1a2b3c] px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg w-auto">
          {locale === "en" ? "Book Now" : "احجز الآن"}
        </Link>
      </div>
    </article>
  );
}
