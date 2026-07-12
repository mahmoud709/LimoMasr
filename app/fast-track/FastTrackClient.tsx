"use client";

import { useState } from "react";
import { BookingForm } from "@/components/BookingForm";
import { formatCurrency } from "@/lib/utils";
import type { FastTrackPackage, Locale } from "@/lib/types";

export function FastTrackClient({ 
  packages, 
  whatsappNumber,
  locale = "ar"
}: { 
  packages: FastTrackPackage[];
  whatsappNumber: string;
  locale?: Locale;
}) {
  const [selectedPackage, setSelectedPackage] = useState<FastTrackPackage | null>(packages[0] || null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] animate-reveal-2">
      <section className="grid gap-6 md:grid-cols-2">
        {packages.map((item) => {
          const name = item.translations?.[locale]?.name || item.name;
          const airport = item.translations?.[locale]?.airport || item.airport;
          const description = item.translations?.[locale]?.description || item.description;
          const tagLeft = item.translations?.[locale]?.tagLeft || item.tagLeft;
          const tagRight = item.translations?.[locale]?.tagRight || item.tagRight;

          return (
            <article 
              key={item.id} 
              onClick={() => setSelectedPackage(item)}
              className={`luxury-panel cursor-pointer transition-all duration-500 overflow-hidden flex flex-col relative ${selectedPackage?.id === item.id ? 'ring-2 ring-[#d0a755] bg-[#d0a755]/5 scale-[1.01] shadow-[0_15px_40px_rgba(208,167,85,0.15)]' : 'hover:-translate-y-1 hover:border-[#d0a755]/30'}`}
            >
              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
                {tagLeft && (
                  <span className="px-3 py-1 rounded-full bg-[#d0a755] text-white text-xs font-black shadow-md uppercase">
                    {tagLeft}
                  </span>
                )}
                {tagRight && (
                  <span className="px-3 py-1 rounded-full bg-[#1a2b3c] text-[#d0a755] text-xs font-black border border-[#d0a755]/30 shadow-md uppercase">
                    {tagRight}
                  </span>
                )}
              </div>

              {/* Package Image */}
              {item.image && (
                <div className="w-full h-52 relative overflow-hidden bg-gray-100 animate-fade-in">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              )}

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-bold tracking-widest text-[#d0a755] uppercase">
                      {locale === 'ar' ? 'مطار ' : 'Airport '}{airport}
                    </p>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPackage?.id === item.id ? 'border-[#d0a755] bg-[#d0a755]' : 'border-black/10'}`}>
                      {selectedPackage?.id === item.id && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-black text-[#1a2b3c] mb-4 text-right rtl:text-right ltr:text-left">
                    {name}
                  </h3>

                  {/* Features List with custom gold checkmarks */}
                  <ul className="space-y-3 mt-4 mb-6 text-right rtl:text-right ltr:text-left">
                    {description.split('\n').map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[#1a2b3c]/85 font-medium justify-start rtl:flex-row ltr:flex-row">
                        <svg className="w-4 h-4 text-[#d0a755] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Row */}
                <div className="pt-4 border-t border-[#1a2b3c]/5 flex items-baseline justify-between">
                  <span className="text-3xl font-black text-[#d0a755]">
                    {formatCurrency(item.price, item.currency, locale)}
                  </span>
                  <span className="text-xs font-bold text-[#1a2b3c]/40">
                    {locale === 'ar' ? '/ للفرد' : '/ person'}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </section>
      <div className="luxury-panel p-8 h-fit sticky top-32 transition-all duration-500">
        <BookingForm 
          type="fast_track" 
          serviceRefId={selectedPackage?.id ?? "fast-track"} 
          serviceName={selectedPackage ? (
            locale === "en"
              ? `Fast Track: ${selectedPackage.translations?.en?.name || selectedPackage.name} - ${selectedPackage.translations?.en?.airport || selectedPackage.airport} Airport`
              : `المسار السريع: ${selectedPackage.translations?.ar?.name || selectedPackage.name} - مطار ${selectedPackage.translations?.ar?.airport || selectedPackage.airport}`
          ) : (locale === "en" ? "Fast Track Booking" : "حجز المسار السريع")} 
          whatsappNumber={whatsappNumber} 
          price={selectedPackage?.price} 
          locale={locale}
        />
      </div>
    </div>
  );
}
