"use client";

import { useState, useEffect, useCallback } from "react";

// Transparent-background PNG car cutouts — no box, floats on dark hero background
const SLIDES = [
  {
    src: "https://www.freepnglogos.com/uploads/mercedes-benz-png/mercedes-benz-logo-png-transparent-svg-vector-bie-supply-2.png",
    alt: "Mercedes Benz",
  },
  {
    src: "https://cdn.freepnglogos.com/uploads/bmw-png/bmw-cars-png-brand-emblem-symbol-transparent-background-15.png",
    alt: "BMW Car",
  },
  {
    src: "https://cdn.freepnglogos.com/uploads/toyota-png/toyota-camry-2018-transparent-background-1.png",
    alt: "Toyota Camry",
  },
  {
    src: "https://www.freepnglogos.com/uploads/kia-png/kia-car-png-transparent-image-2.png",
    alt: "Kia Car",
  },
  {
    src: "https://www.freepnglogos.com/uploads/hyundai-png/hyundai-car-png-transparent-background-11.png",
    alt: "Hyundai Car",
  },
];

// Fallback: same original working image if any slide fails to load
const FALLBACK =
  "https://www.motortrend.com/uploads/2023/09/2024-mercedes-benz-e-class-front-three-quarters-1.png";

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  const goTo = useCallback(
    (index: number, dir: "left" | "right" = "right") => {
      if (animating) return;
      setAnimating(true);
      setDirection(dir);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 400);
    },
    [animating]
  );

  const prev = () => {
    const newIdx = (current - 1 + SLIDES.length) % SLIDES.length;
    goTo(newIdx, "left");
  };

  const next = useCallback(() => {
    const newIdx = (current + 1) % SLIDES.length;
    goTo(newIdx, "right");
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  const imgSrc = errors[current] ? FALLBACK : SLIDES[current].src;

  return (
    <div className="relative w-full max-w-[600px] xl:max-w-[800px] rtl:lg:-translate-x-10 ltr:lg:translate-x-10 select-none">
      {/* Floating car image — no background, no box */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current}
        src={imgSrc}
        alt={SLIDES[current].alt}
        onError={() => setErrors((prev) => ({ ...prev, [current]: true }))}
        className="w-full h-auto object-contain drop-shadow-2xl rtl:scale-x-[-1]"
        style={{
          transition: "opacity 0.4s ease, transform 0.4s ease",
          opacity: animating ? 0 : 1,
          transform: animating
            ? `translateX(${direction === "right" ? "32px" : "-32px"})`
            : "translateX(0)",
        }}
      />

      {/* Prev arrow */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute top-1/2 -translate-y-1/2 rtl:-right-4 ltr:-left-4 w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#d0a755] hover:border-[#d0a755] transition-all duration-300 shadow-lg z-20"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        aria-label="Next"
        className="absolute top-1/2 -translate-y-1/2 rtl:-left-4 ltr:-right-4 w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#d0a755] hover:border-[#d0a755] transition-all duration-300 shadow-lg z-20"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20" dir="ltr">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? "right" : "left")}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-6 h-2 bg-[#d0a755]"
                : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
