"use client";

import { useEffect, useState } from "react";

interface CinematicBackgroundProps {
  images?: string[];
}

const DEFAULT_IMAGES = [
  "/images/hero/carhero1avif.avif",
  "/team.png",
  "/images/hero/g6.jpg",
];

export function CinematicBackground({ images = DEFAULT_IMAGES }: CinematicBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[2rem]">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt="Luxury Hotel"
            className="w-full h-full object-cover object-center transform scale-105"
            style={{
              animation: index === currentIndex ? "slowZoom 10s linear forwards" : "none"
            }}
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
      `}} />
    </div>
  );
}
