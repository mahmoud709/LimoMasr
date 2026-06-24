"use client";

import { useState } from "react";
import { BookingForm } from "@/components/BookingForm";
import { formatCurrency } from "@/lib/utils";
import type { FastTrackPackage } from "@/lib/types";

export function FastTrackClient({ 
  packages, 
  whatsappNumber 
}: { 
  packages: FastTrackPackage[];
  whatsappNumber: string;
}) {
  const [selectedPackage, setSelectedPackage] = useState<FastTrackPackage | null>(packages[0] || null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] animate-reveal-2">
      <section className="grid gap-6 md:grid-cols-2">
        {packages.map((item) => (
          <article 
            key={item.id} 
            onClick={() => setSelectedPackage(item)}
            className={`luxury-panel p-8 cursor-pointer transition-all duration-300 ${selectedPackage?.id === item.id ? 'ring-2 ring-[#d0a755] bg-[#d0a755]/5 scale-[1.02] shadow-[0_10px_30px_rgba(208,167,85,0.15)]' : 'hover:-translate-y-1 hover:border-[#d0a755]/50'}`}
          >
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold tracking-widest text-[#d0a755] uppercase">مطار {item.airport}</p>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPackage?.id === item.id ? 'border-[#d0a755] bg-[#d0a755]' : 'border-black/20'}`}>
                {selectedPackage?.id === item.id && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
            </div>
            <h2 className="text-2xl font-black text-[#1a2b3c]">{item.name}</h2>
            <p className="mt-4 leading-relaxed text-[#1a2b3c]/60 font-light">{item.description}</p>
            <div className="mt-6 pt-6 border-t border-black/5 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#d0a755]">{formatCurrency(item.price, item.currency)}</span>
              <span className="text-sm font-bold text-[#1a2b3c]/40">/ للفرد</span>
            </div>
          </article>
        ))}
      </section>
      <div className="luxury-panel p-8 h-fit sticky top-32 transition-all duration-500">
        <BookingForm 
          type="fast_track" 
          serviceRefId={selectedPackage?.id ?? "fast-track"} 
          serviceName={selectedPackage ? `المسار السريع: ${selectedPackage.name} - مطار ${selectedPackage.airport}` : "حجز المسار السريع"} 
          whatsappNumber={whatsappNumber} 
          price={selectedPackage?.price} 
        />
      </div>
    </div>
  );
}
