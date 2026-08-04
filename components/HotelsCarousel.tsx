"use client";

import { useRef } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { HotelItem, Locale } from "@/lib/types";
import { localizeHotel } from "@/lib/i18n";
import { FiMapPin, FiStar, FiCheck, FiArrowLeft, FiArrowRight } from "react-icons/fi";

const FALLBACK_HOTELS: HotelItem[] = [
  {
    id: "hotel-cairo-nile",
    name: "فنادق القاهرة والنيل 5 نجوم",
    city: "القاهرة الكبرى",
    rating: 5,
    price: 3500,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    tag: "إطلالة نيلية ساحرة",
    features: ["إطلالة مباشرة على النيل", "إفطار بوفيه فاخر مفتوح", "سبا ونادي صحي متكامل", "خدمة كونسيرج 24/7"],
    status: "available",
    sortOrder: 1,
    translations: {
      ar: {
        name: "فنادق القاهرة والنيل 5 نجوم",
        city: "القاهرة الكبرى",
        tag: "إطلالة نيلية ساحرة",
        features: ["إطلالة مباشرة على النيل", "إفطار بوفيه فاخر مفتوح", "سبا ونادي صحي متكامل", "خدمة كونسيرج 24/7"]
      },
      en: {
        name: "Cairo & Nile 5-Star Hotels",
        city: "Greater Cairo",
        tag: "Stunning Nile View",
        features: ["Direct Nile view", "Luxury open buffet breakfast", "Full wellness spa & club", "24/7 concierge service"]
      }
    }
  },
  {
    id: "hotel-sharm-resort",
    name: "منتجعات شرم الشيخ الفاخرة",
    city: "شرم الشيخ",
    rating: 5,
    price: 4200,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    tag: "شامل كلياً (All-Inclusive)",
    features: ["شاطئ رملي خاص ومسابح متعددة", "أكوا بارك وأنشطة ترفيهية", "مطاعم عالمية متخصصة", "خدمات VIP لكبار الزوار"],
    status: "available",
    sortOrder: 2,
    translations: {
      ar: {
        name: "منتجعات شرم الشيخ الفاخرة",
        city: "شرم الشيخ",
        tag: "شامل كلياً (All-Inclusive)",
        features: ["شاطئ رملي خاص ومسابح متعددة", "أكوا بارك وأنشطة ترفيهية", "مطاعم عالمية متخصصة", "خدمات VIP لكبار الزوار"]
      },
      en: {
        name: "Sharm El Sheikh Luxury Resorts",
        city: "Sharm El Sheikh",
        tag: "Ultra All-Inclusive",
        features: ["Private beach & multiple pools", "Aqua park & entertainment", "World-class dining cuisines", "VIP guest treatment"]
      }
    }
  },
  {
    id: "hotel-gouna-hurghada",
    name: "فنادق الجونة والغردقة",
    city: "البحر الأحمر",
    rating: 5,
    price: 3900,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    tag: "وجهة الاستجمام الأولى",
    features: ["إطلالة بانورامية على اللاجون", "أجنحة خاصة مع مسبح خاص", "رحلات يخوت وغوص حصرية", "أجواء راقية وهدوء تام"],
    status: "available",
    sortOrder: 3,
    translations: {
      ar: {
        name: "فنادق الجونة والغردقة",
        city: "البحر الأحمر",
        tag: "وجهة الاستجمام الأولى",
        features: ["إطلالة بانورامية على اللاجون", "أجنحة خاصة مع مسبح خاص", "رحلات يخوت وغوص حصرية", "أجواء راقية وهدوء تام"]
      },
      en: {
        name: "El Gouna & Hurghada Hotels",
        city: "Red Sea",
        tag: "Premier Seaside Escape",
        features: ["Panoramic lagoon views", "Private pool suites available", "Exclusive yacht & diving trips", "Serene luxury ambiance"]
      }
    }
  },
  {
    id: "hotel-alex-coast",
    name: "فنادق الإسكندرية والساحل",
    city: "الإسكندرية",
    rating: 5,
    price: 3100,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    tag: "عروس البحر المتوسط",
    features: ["موقع مميز على كورنيش البحر", "قريب من معالم المدينة والمطاعم", "شرفات بإطلالة بحرية كاملة", "أعلى معايير الضيافة"],
    status: "available",
    sortOrder: 4,
    translations: {
      ar: {
        name: "فنادق الإسكندرية والساحل",
        city: "الإسكندرية",
        tag: "عروس البحر المتوسط",
        features: ["موقع مميز على كورنيش البحر", "قريب من معالم المدينة والمطاعم", "شرفات بإطلالة بحرية كاملة", "أعلى معايير الضيافة"]
      },
      en: {
        name: "Alexandria & Coast Hotels",
        city: "Alexandria",
        tag: "Mediterranean Pearl",
        features: ["Prime seaside Corniche location", "Close to landmarks & restaurants", "Full sea-view balconies", "Premium hospitality"]
      }
    }
  },
  {
    id: "hotel-luxor-aswan",
    name: "فنادق الأقصر وأسوان التاريخية",
    city: "صعيد مصر",
    rating: 5,
    price: 4800,
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    tag: "عراقة وضيافة ملكية",
    features: ["طابع تاريخي ومعماري ملكي", "إطلالة ساحرة على جزر النيل", "برامج جولات سياحية خاصة", "هدوء وتجربة استثنائية"],
    status: "available",
    sortOrder: 5,
    translations: {
      ar: {
        name: "فنادق الأقصر وأسوان التاريخية",
        city: "صعيد مصر",
        tag: "عراقة وضيافة ملكية",
        features: ["طابع تاريخي ومعماري ملكي", "إطلالة ساحرة على جزر النيل", "برامج جولات سياحية خاصة", "هدوء وتجربة استثنائية"]
      },
      en: {
        name: "Historic Luxor & Aswan Hotels",
        city: "Upper Egypt",
        tag: "Royal Heritage",
        features: ["Historic royal architecture", "Mesmerizing Nile island views", "Custom private guided tours", "Exceptional peaceful stay"]
      }
    }
  }
];

export function HotelsCarousel({
  hotels,
  title,
  viewAllText,
  locale = "ar",
  currency = "EGP",
  exchangeRate = 1
}: {
  hotels?: HotelItem[];
  title?: string;
  viewAllText?: string;
  locale?: Locale;
  currency?: string;
  exchangeRate?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEn = locale === "en";

  const displayHotels = (hotels && hotels.length > 0 ? hotels : FALLBACK_HOTELS)
    .filter(h => h.status !== "unavailable");

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
          {title || (isEn ? "Hotels & Luxury Resorts" : "الفنادق والمنتجعات الفاخرة")}
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
            href={isEn ? "/en/hotels" : "/hotels"}
            className="text-sm font-bold text-[#1a2b3c] hover:text-[#f0a500] transition-colors hidden sm:block shrink-0"
          >
            {viewAllText || (isEn ? "View All Hotels" : "عرض الفنادق")}
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayHotels.map((rawItem) => {
          const item = localizeHotel(rawItem, locale);
          const name = item.name;
          const city = item.city;
          const tag = item.tag || (isEn ? "Luxury Stay" : "إقامة فاخرة");
          const features = item.features || [];

          return (
            <div key={item.id} className="snap-start shrink-0 w-[280px] md:w-[340px]">
              <article className="luxury-panel p-6 md:p-8 flex flex-col h-full bg-white relative overflow-hidden group hover:border-[#d0a755] transition-all duration-300">
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d0a755] text-white text-[10px] font-black shadow-md uppercase flex items-center gap-1">
                    <FiStar className="w-3 h-3 fill-current" />
                    {item.rating || 5} {isEn ? "Stars" : "نجوم"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1a2b3c] text-[#d0a755] text-[10px] font-black border border-[#d0a755]/20 shadow-md uppercase">
                    {tag}
                  </span>
                </div>

                {/* Hotel Image */}
                <div className="w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] h-56 -mt-6 md:-mt-8 -mx-6 md:-mx-8 mb-6 relative overflow-hidden rounded-t-2xl bg-gray-50 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                </div>

                {/* Location */}
                <p className="text-xs font-bold tracking-widest text-[#d0a755] uppercase relative z-10 flex items-center gap-1.5">
                  <FiMapPin className="w-3.5 h-3.5" />
                  {city}
                </p>

                {/* Hotel Name */}
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
                    href={isEn ? "/en/hotels" : "/hotels"}
                    className="inline-flex items-center justify-center bg-[#1a2b3c] text-white hover:bg-[#d0a755] hover:text-[#1a2b3c] px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    {isEn ? "Book Stay" : "احجز إقامتك"}
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
