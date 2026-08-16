"use client";

import { useRef } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { FlightRoute, Locale } from "@/lib/types";
import { localizeFlight } from "@/lib/i18n";
import { FiCheck, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FaPlane, FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";

const FALLBACK_FLIGHTS: FlightRoute[] = [
  {
    id: "cairo-riyadh",
    fromCity: "القاهرة (CAI)",
    toCity: "الرياض (RUH)",
    flightType: "رحلات يومية مباشرة",
    price: 4500,
    image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80",
    tag: "الأكثر طلباً",
    features: ["رحلات مباشرة يومياً بدون ترانزيت", "وزن أمتعة مجاني حتى 46 كجم", "إمكانية اختيار المقعد والوجبة", "تأكيد فوري ودعم حجز 24/7"],
    status: "available",
    sortOrder: 1,
    translations: {
      ar: {
        fromCity: "القاهرة (CAI)",
        toCity: "الرياض (RUH)",
        flightType: "رحلات يومية مباشرة",
        tag: "الأكثر طلباً",
        features: ["رحلات مباشرة يومياً بدون ترانزيت", "وزن أمتعة مجاني حتى 46 كجم", "إمكانية اختيار المقعد والوجبة", "تأكيد فوري ودعم حجز 24/7"]
      },
      en: {
        fromCity: "Cairo (CAI)",
        toCity: "Riyadh (RUH)",
        flightType: "Daily Direct Flights",
        tag: "Most Popular",
        features: ["Daily non-stop direct flights", "Free luggage allowance up to 46kg", "Free seat & meal selection", "Instant confirmation & 24/7 support"]
      }
    }
  },
  {
    id: "cairo-dubai",
    fromCity: "القاهرة (CAI)",
    toCity: "دبي (DXB)",
    flightType: "طيران الإمارات ومصر للطيران",
    price: 5200,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    tag: "عروض حصرية",
    features: ["أفضل مواعيد إقلاع ووصول", "خيارات درجة رجال الأعمال والدرجة الأولى", "مرونة عالية في تعديل المواعيد", "أفضل باقات السفر السياحي"],
    status: "available",
    sortOrder: 2,
    translations: {
      ar: {
        fromCity: "القاهرة (CAI)",
        toCity: "دبي (DXB)",
        flightType: "طيران الإمارات ومصر للطيران",
        tag: "عروض حصرية",
        features: ["أفضل مواعيد إقلاع ووصول", "خيارات درجة رجال الأعمال والدرجة الأولى", "مرونة عالية في تعديل المواعيد", "أفضل باقات السفر السياحي"]
      },
      en: {
        fromCity: "Cairo (CAI)",
        toCity: "Dubai (DXB)",
        flightType: "Emirates & EgyptAir",
        tag: "Special Offers",
        features: ["Optimal departure & arrival timings", "Business & First Class available", "Flexible date change policy", "Top tourism travel packages"]
      }
    }
  },
  {
    id: "cairo-jeddah",
    fromCity: "القاهرة (CAI)",
    toCity: "جدة (JED)",
    flightType: "رحلات العمرة وزيارات العمل",
    price: 3900,
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
    tag: "رحلات مستمرة",
    features: ["رحلات منتظمة طوال أيام الأسبوع", "تسهيل إجراءات نقل ماء زمزم", "أسعار خاصة للمجموعات والعائلات", "مساعدة شاملة حتى صالة السفر"],
    status: "available",
    sortOrder: 3,
    translations: {
      ar: {
        fromCity: "القاهرة (CAI)",
        toCity: "جدة (JED)",
        flightType: "رحلات العمرة وزيارات العمل",
        tag: "رحلات مستمرة",
        features: ["رحلات منتظمة طوال أيام الأسبوع", "تسهيل إجراءات نقل ماء زمزم", "أسعار خاصة للمجموعات والعائلات", "مساعدة شاملة حتى صالة السفر"]
      },
      en: {
        fromCity: "Cairo (CAI)",
        toCity: "Jeddah (JED)",
        flightType: "Umrah & Business Trips",
        tag: "Frequent Trips",
        features: ["Regular flights all week long", "Smooth Zamzam water transit", "Family & group special rates", "Assistance through boarding"]
      }
    }
  },
  {
    id: "cairo-istanbul",
    fromCity: "القاهرة (CAI)",
    toCity: "إسطنبول (IST)",
    flightType: "رحلات السياحة والتسوق",
    price: 6100,
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
    tag: "عطلات مميزة",
    features: ["رحلات مباشرة على أرقى الخطوط", "تنسيق عروض الإقامة والتنقلات", "إمكانية تقسيط تذاكر الطيران", "إرشاد كامل لمتطلبات التأشيرة"],
    status: "available",
    sortOrder: 4,
    translations: {
      ar: {
        fromCity: "القاهرة (CAI)",
        toCity: "إسطنبول (IST)",
        flightType: "رحلات السياحة والتسوق",
        tag: "عطلات مميزة",
        features: ["رحلات مباشرة على أرقى الخطوط", "تنسيق عروض الإقامة والتنقلات", "إمكانية تقسيط تذاكر الطيران", "إرشاد كامل لمتطلبات التأشيرة"]
      },
      en: {
        fromCity: "Cairo (CAI)",
        toCity: "Istanbul (IST)",
        flightType: "Tourism & Shopping Flights",
        tag: "Top Holiday",
        features: ["Direct flights on top carriers", "Flight + hotel combo support", "Flexible payment options", "Full visa requirement guidance"]
      }
    }
  },
  {
    id: "cairo-domestic",
    fromCity: "القاهرة (CAI)",
    toCity: "شرم الشيخ / الغردقة / أسوان",
    flightType: "رحلات طيران داخلي سريع",
    price: 1900,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    tag: "طيران داخلي",
    features: ["مدة الرحلة أقل من 60 دقيقة", "تنقل سريع بدون إجهاد السفر البري", "مواعيد متعددة على مدار اليوم", "تنسيق استقبال ليموزين بالمطار"],
    status: "available",
    sortOrder: 5,
    translations: {
      ar: {
        fromCity: "القاهرة (CAI)",
        toCity: "شرم الشيخ / الغردقة / أسوان",
        flightType: "رحلات طيران داخلي سريع",
        tag: "طيران داخلي",
        features: ["مدة الرحلة أقل من 60 دقيقة", "تنقل سريع بدون إجهاد السفر البري", "مواعيد متعددة على مدار اليوم", "تنسيق استقبال ليموزين بالمطار"]
      },
      en: {
        fromCity: "Cairo (CAI)",
        toCity: "Sharm / Hurghada / Aswan",
        flightType: "Fast Domestic Flights",
        tag: "Domestic",
        features: ["Flight duration under 60 mins", "Quick travel without road fatigue", "Multiple daily departures", "Airport limo pickup coordination"]
      }
    }
  }
];

export function FlightCarousel({
  flights,
  title,
  viewAllText,
  locale = "ar",
  currency = "EGP",
  exchangeRate = 1
}: {
  flights?: FlightRoute[];
  title?: string;
  viewAllText?: string;
  locale?: Locale;
  currency?: string;
  exchangeRate?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEn = locale === "en";

  const displayFlights = (flights && flights.length > 0 ? flights : FALLBACK_FLIGHTS)
    .filter(f => f.status !== "unavailable");

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
          {title || (isEn ? "Flight Bookings & Airline Tickets" : "حجز تذاكر الطيران")}
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
            href={isEn ? "/en/flights" : "/flights"}
            className="text-sm font-bold text-[#1a2b3c] hover:text-[#f0a500] transition-colors hidden sm:block shrink-0"
          >
            {viewAllText || (isEn ? "Book Flight" : "احجز رحلة طيران")}
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayFlights.map((rawItem) => {
          const item = localizeFlight(rawItem, locale);
          const from = item.fromCity;
          const to = item.toCity;
          const flightType = item.flightType;
          const tag = item.tag || (isEn ? "Best Offer" : "أفضل عرض");
          const features = item.features || [];

          return (
            <div key={item.id} className="snap-start shrink-0 w-[280px] md:w-[340px]">
              <article className="luxury-panel p-6 md:p-8 flex flex-col h-full bg-white relative overflow-hidden group hover:border-[#d0a755] transition-all duration-300">
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d0a755] text-white text-[10px] font-black shadow-md uppercase flex items-center gap-1">
                    <FaPlane className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1a2b3c] text-[#d0a755] text-[10px] font-black border border-[#d0a755]/20 shadow-md uppercase">
                    {isEn ? "Best Rate" : "أفضل سعر"}
                  </span>
                </div>

                {/* Destination Image */}
                <div className="w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] h-56 -mt-6 md:-mt-8 -mx-6 md:-mx-8 mb-6 relative overflow-hidden rounded-t-2xl bg-gray-50 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={`${from} to ${to}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  {/* Flight Route Banner */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 flex items-center justify-between text-white text-xs font-black">
                    <span className="flex items-center gap-1 truncate max-w-[45%]">
                      <FaPlaneDeparture className="w-3 h-3 text-[#d0a755] shrink-0" />
                      {from}
                    </span>
                    <span className="text-[#d0a755] font-bold">⇄</span>
                    <span className="flex items-center gap-1 truncate max-w-[45%]">
                      <FaPlaneArrival className="w-3 h-3 text-[#d0a755] shrink-0" />
                      {to}
                    </span>
                  </div>
                </div>

                {/* Flight Subtitle */}
                <p className="text-xs font-bold tracking-widest text-[#d0a755] uppercase relative z-10">
                  {flightType}
                </p>

                {/* Route Title */}
                <h3 className="mt-2 text-lg md:text-xl font-black text-[#1a2b3c] relative z-10 line-clamp-1">
                  {from} ⇄ {to}
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
                      {isEn ? "/ ticket" : "/ تذكرة"}
                    </span>
                  </div>
                  <Link
                    href={isEn ? "/en/flights" : "/flights"}
                    className="inline-flex items-center justify-center bg-[#1a2b3c] text-white hover:bg-[#d0a755] hover:text-[#1a2b3c] px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    {isEn ? "Book Ticket" : "احجز تذكرتك"}
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
