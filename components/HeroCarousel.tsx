"use client";

import { useState, useEffect, useCallback } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Image from "next/image";

function canOptimize(src: string) {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && ["res.cloudinary.com", "images.unsplash.com"].includes(url.hostname);
  } catch {
    return false;
  }
}

export function HeroCarousel({ images }: { images?: string[] }) {
  const slides = images && images.length > 0 ? images : [];

  const [current, setCurrent] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));

  const goTo = useCallback((index: number) => {
    setVisited(previous => new Set(previous).add(index));
    setCurrent(index);
  }, []);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);
  
  const next = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden group bg-[#1a2b3c]">
      {slides.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${idx === current ? "opacity-100 scale-100 z-[2]" : "opacity-0 scale-105 z-[1]"}`}
        >
          {visited.has(idx) && <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            preload={idx === 0}
            unoptimized={!canOptimize(src)}
            className="w-full h-full object-cover"
          />}
        </div>
      ))}

      {/* Dark Overlay for Text Readability - gradient towards the start (right for RTL, left for LTR) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 z-10 pointer-events-none ltr:bg-gradient-to-l rtl:bg-gradient-to-r"></div>
      {/* Base shadow to guarantee readability globally */}
      <div className="absolute inset-0 bg-[#1a2b3c]/40 z-10 pointer-events-none"></div>

      {/* Only show controls if there are multiple slides */}
      {slides.length > 1 && (
        <>
          {/* Desktop Prev arrow */}
          <button
            onClick={prev}
            aria-label="Previous"
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 rtl:right-8 ltr:left-8 w-14 h-14 rounded-full bg-white/20 border border-white/30 backdrop-blur-md items-center justify-center text-white hover:bg-[#d0a755] hover:border-[#d0a755] transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-20 hover:scale-110 cursor-pointer pointer-events-auto"
          >
            <FiChevronRight className="w-8 h-8 rtl:rotate-0 ltr:rotate-180 pointer-events-none" />
          </button>

          {/* Desktop Next arrow */}
          <button
            onClick={next}
            aria-label="Next"
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 rtl:left-8 ltr:right-8 w-14 h-14 rounded-full bg-white/20 border border-white/30 backdrop-blur-md items-center justify-center text-white hover:bg-[#d0a755] hover:border-[#d0a755] transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-20 hover:scale-110 cursor-pointer pointer-events-auto"
          >
            <FiChevronLeft className="w-8 h-8 rtl:rotate-0 ltr:rotate-180 pointer-events-none" />
          </button>

          {/* Mobile Controls (grouped bottom-left, above floating WhatsApp) */}
          <div className="absolute bottom-32 left-4 flex gap-3 z-30 md:hidden pointer-events-auto">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-12 h-12 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#d0a755] hover:border-[#d0a755] transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:scale-110 cursor-pointer"
            >
              <FiChevronRight className="w-6 h-6 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="w-12 h-12 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#d0a755] hover:border-[#d0a755] transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:scale-110 cursor-pointer"
            >
              <FiChevronLeft className="w-6 h-6 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30 pointer-events-auto" dir="ltr">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer pointer-events-auto ${
                  i === current
                    ? "w-10 h-3 bg-[#d0a755] shadow-[0_0_15px_rgba(208,167,85,0.8)]"
                    : "w-3 h-3 bg-white/40 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
