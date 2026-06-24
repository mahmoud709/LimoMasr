"use client";

import { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1542314831-c6a4d27ece50?q=80&w=2000&auto=format&fit=crop", // Luxury pool
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2000&auto=format&fit=crop", // Red Sea resort
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2000&auto=format&fit=crop", // Tropical luxury
];

export function CinematicBackground() {
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
