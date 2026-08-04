"use client";

import { useRef } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { ApartmentItem, Locale } from "@/lib/types";
import { localizeApartment } from "@/lib/i18n";
import { FiMapPin, FiCheck, FiArrowLeft, FiArrowRight, FiHome } from "react-icons/fi";
import { FaBuilding, FaUsers } from "react-icons/fa";

const FALLBACK_APARTMENTS: ApartmentItem[] = [
  {
    id: "apt-tagamoa",
    name: "أجنحة وشقق فندقية بالتجمع الخامس",
    location: "القاهرة الجديدة",
    rooms: "2 إلى 4 غرف نوم",
    capacity: "مناسب للعائلات الكبيرة",
    price: 3200,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    tag: "تشطيب فندقي فاخر",
    features: ["فرش فندقي الترا مودرن ومكيف بالكامل", "مطبخ مجهز بجميع الأجهزة الكهربائية", "موقع حيوي قريب من المولات والجامعات", "خدمة تنظيف دورية وأمن وحراسة 24/7"],
    status: "available",
    sortOrder: 1,
    translations: {
      ar: {
        name: "أجنحة وشقق فندقية بالتجمع الخامس",
        location: "القاهرة الجديدة",
        rooms: "2 إلى 4 غرف نوم",
        capacity: "مناسب للعائلات الكبيرة",
        tag: "تشطيب فندقي فاخر",
        features: ["فرش فندقي الترا مودرن ومكيف بالكامل", "مطبخ مجهز بجميع الأجهزة الكهربائية", "موقع حيوي قريب من المولات والجامعات", "خدمة تنظيف دورية وأمن وحراسة 24/7"]
      },
      en: {
        name: "Luxury Suites in 5th Settlement",
        location: "New Cairo",
        rooms: "2 to 4 Bedrooms",
        capacity: "Ideal for Large Families",
        tag: "Ultra Luxury Finish",
        features: ["Ultra-modern luxury furnishings & AC", "Fully equipped modern kitchen", "Prime location near malls & clubs", "Regular housekeeping & 24/7 security"]
      }
    }
  },
  {
    id: "apt-zamalek-nile",
    name: "شقق فندقية بإطلالة نيلية بالزمالك",
    location: "الزمالك - النيل",
    rooms: "2 و 3 غرف نوم",
    capacity: "عائلات ودبلوماسيين",
    price: 4500,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    tag: "إطلالة بانورامية على النيل",
    features: ["شرفة واسعة بفيو مفتوح على نهر النيل", "تصميم كلاسيكي راقي وأثاث فخم", "أعلى درجات الخصوصية والأمان", "خدمة صف السيارات ومساعد خاص"],
    status: "available",
    sortOrder: 2,
    translations: {
      ar: {
        name: "شقق فندقية بإطلالة نيلية بالزمالك",
        location: "الزمالك - النيل",
        rooms: "2 و 3 غرف نوم",
        capacity: "عائلات ودبلوماسيين",
        tag: "إطلالة بانورامية على النيل",
        features: ["شرفة واسعة بفيو مفتوح على نهر النيل", "تصميم كلاسيكي راقي وأثاث فخم", "أعلى درجات الخصوصية والأمان", "خدمة صف السيارات ومساعد خاص"]
      },
      en: {
        name: "Nile View Hotel Apartments in Zamalek",
        location: "Zamalek - Nile View",
        rooms: "2 & 3 Bedrooms",
        capacity: "Diplomats & Families",
        tag: "Panoramic Nile View",
        features: ["Spacious open Nile-facing terrace", "Classic upscale interior design", "Maximum privacy & top security", "Valet parking & dedicated assistance"]
      }
    }
  },
  {
    id: "apt-sheikh-zayed",
    name: "شقق فندقية بكمبوندات الشيخ زايد",
    location: "الشيخ زايد - 6 أكتوبر",
    rooms: "1 إلى 3 غرف نوم",
    capacity: "أفراد وعائلات",
    price: 2800,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    tag: "كمبوند هادئ وراقي",
    features: ["إطلالة على مساحات خضراء وبحيرات", "نوادي رياضية وحمامات سباحة مشتركة", "واي فاي فائق السرعة وشاشات ذكية", "قريب من مول مصر ومول العرب"],
    status: "available",
    sortOrder: 3,
    translations: {
      ar: {
        name: "شقق فندقية بكمبوندات الشيخ زايد",
        location: "الشيخ زايد - 6 أكتوبر",
        rooms: "1 إلى 3 غرف نوم",
        capacity: "أفراد وعائلات",
        tag: "كمبوند هادئ وراقي",
        features: ["إطلالة على مساحات خضراء وبحيرات", "نوادي رياضية وحمامات سباحة مشتركة", "واي فاي فائق السرعة وشاشات ذكية", "قريب من مول مصر ومول العرب"]
      },
      en: {
        name: "Hotel Apartments in Sheikh Zayed",
        location: "Sheikh Zayed - 6th October",
        rooms: "1 to 3 Bedrooms",
        capacity: "Solo & Families",
        tag: "Gated Community",
        features: ["Overlooking gardens & water bodies", "Shared fitness center & pool access", "High-speed WiFi & Smart TVs", "Close to Mall of Arabia & Egypt"]
      }
    }
  },
  {
    id: "apt-nasr-city",
    name: "شقق وأجنحة فندقية بمدينة نصر ومصر الجديدة",
    location: "مصر الجديدة ومدينة نصر",
    rooms: "1 إلى 3 غرف نوم",
    capacity: "قريب من المطار",
    price: 2400,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    tag: "موقع استراتيجي",
    features: ["10 دقائق فقط من مطار القاهرة الدولي", "قريب من سيتي ستارز ومراكز التسوق", "مناسب للإقامات الطويلة والقصيرة", "تجهيزات فندقية كاملة تشمل الغسيل"],
    status: "available",
    sortOrder: 4,
    translations: {
      ar: {
        name: "شقق وأجنحة فندقية بمدينة نصر ومصر الجديدة",
        location: "مصر الجديدة ومدينة نصر",
        rooms: "1 إلى 3 غرف نوم",
        capacity: "قريب من المطار",
        tag: "موقع استراتيجي",
        features: ["10 دقائق فقط من مطار القاهرة الدولي", "قريب من سيتي ستارز ومراكز التسوق", "مناسب للإقامات الطويلة والقصيرة", "تجهيزات فندقية كاملة تشمل الغسيل"]
      },
      en: {
        name: "Hotel Suites in Nasr City & Heliopolis",
        location: "Heliopolis & Nasr City",
        rooms: "1 to 3 Bedrooms",
        capacity: "Close to Airport",
        tag: "Strategic Hub",
        features: ["Only 10 mins from Cairo Airport", "Close to Citystars & shopping centers", "Ideal for short & extended stays", "Full laundry & hotel amenities"]
      }
    }
  }
];

export function ApartmentsCarousel({
  apartments,
  title,
  viewAllText,
  locale = "ar",
  currency = "EGP",
  exchangeRate = 1
}: {
  apartments?: ApartmentItem[];
  title?: string;
  viewAllText?: string;
  locale?: Locale;
  currency?: string;
  exchangeRate?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEn = locale === "en";

  const displayApartments = (apartments && apartments.length > 0 ? apartments : FALLBACK_APARTMENTS)
    .filter(a => a.status !== "unavailable");

  const scroll = (dir: "next" | "prev") => {
    if (scrollRef.current) {
      const scrollStep = typeof window !== "undefined" && window.innerWidth < 768 ? scrollRef.current.clientWidth : 360;
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
          <span className="text-[#f0a500] text-2xl md:text-3xl leading-none">|</span>{" "}
          {title || (isEn ? "Hotel Apartments & Luxury Suites" : "الشقق والأجنحة الفندقية")}
        </h2>

        <div className="flex items-center gap-5">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("prev")}
              className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 hover:border-black/20 transition-all text-[#1a2b3c]"
              aria-label="Previous"
            >
              {isEn ? <FiArrowLeft className="w-4 h-4" /> : <FiArrowRight className="w-4 h-4" />}
            </button>
            <button
              onClick={() => scroll("next")}
              className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 hover:border-black/20 transition-all text-[#1a2b3c]"
              aria-label="Next"
            >
              {isEn ? <FiArrowRight className="w-4 h-4" /> : <FiArrowLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* View All Text Link */}
          <Link
            href={isEn ? "/en/hotel-apartments" : "/hotel-apartments"}
            className="text-sm font-bold text-[#1a2b3c] hover:text-[#f0a500] transition-colors hidden sm:block shrink-0"
          >
            {viewAllText || (isEn ? "View All Apartments" : "عرض الشقق")}
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayApartments.map((rawItem) => {
          const item = localizeApartment(rawItem, locale);
          const name = item.name;
          const location = item.location;
          const rooms = item.rooms;
          const capacity = item.capacity;
          const tag = item.tag || (isEn ? "Luxury Suite" : "شقة فاخرة");
          const features = item.features || [];

          return (
            <div key={item.id} className="snap-start shrink-0 w-[280px] md:w-[340px]">
              <article className="luxury-panel p-6 md:p-8 flex flex-col h-full bg-white relative overflow-hidden group hover:border-[#d0a755] transition-all duration-300">
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d0a755] text-white text-[10px] font-black shadow-md uppercase flex items-center gap-1">
                    <FiHome className="w-3 h-3" />
                    {rooms}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1a2b3c] text-[#d0a755] text-[10px] font-black border border-[#d0a755]/20 shadow-md uppercase">
                    {tag}
                  </span>
                </div>

                {/* Apartment Image */}
                <div className="w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] h-56 -mt-6 md:-mt-8 -mx-6 md:-mx-8 mb-6 relative overflow-hidden rounded-t-2xl bg-gray-50 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  {/* Capacity Bar */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 flex items-center justify-between text-white text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <FaBuilding className="w-3 h-3 text-[#d0a755]" />
                      {location}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-white/90">
                      <FaUsers className="w-3 h-3 text-[#d0a755]" />
                      {capacity}
                    </span>
                  </div>
                </div>

                {/* Location Subtitle */}
                <p className="text-xs font-bold tracking-widest text-[#d0a755] uppercase relative z-10 flex items-center gap-1.5">
                  <FiMapPin className="w-3.5 h-3.5" />
                  {location}
                </p>

                {/* Title */}
                <h3 className="mt-2 text-xl font-black text-[#1a2b3c] relative z-10 line-clamp-1">
                  {name}
                </h3>

                {/* Features List */}
                <ul className="mt-4 space-y-1.5 flex-grow relative z-10">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs text-[#1a2b3c]/75 font-medium">
                      <FiCheck className="w-3.5 h-3.5 text-[#d0a755] shrink-0" />
                      <span className="truncate">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price and CTA */}
                <div className="mt-6 pt-4 border-t border-black/5 flex flex-wrap items-center justify-between gap-2 relative z-10">
                  <div className="flex items-baseline gap-1" dir="rtl">
                    <span className="text-xs font-bold text-[#1a2b3c]/50">{isEn ? "From" : "يبدأ من"}</span>
                    <span className="text-xl font-black text-[#d0a755]">
                      {formatCurrency(item.price, "EGP", locale, currency, exchangeRate)}
                    </span>
                    <span className="text-[10px] font-bold text-[#1a2b3c]/40">
                      {isEn ? "/ night" : "/ ليلة"}
                    </span>
                  </div>
                  <Link
                    href={isEn ? "/en/hotel-apartments" : "/hotel-apartments"}
                    className="inline-flex items-center justify-center bg-[#1a2b3c] text-white hover:bg-[#d0a755] hover:text-[#1a2b3c] px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    {isEn ? "Book Apartment" : "احجز شقتك"}
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
