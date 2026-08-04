"use client";

import React from "react";
import { FaCar, FaPlane, FaHotel, FaBuilding, FaBolt } from "react-icons/fa";
import { FiLayers } from "react-icons/fi";

export interface ServiceBadgeProps {
  type: string;
  lang?: "ar" | "en";
  className?: string;
}

const serviceBadgeConfig: Record<
  string,
  {
    ar: string;
    en: string;
    icon: React.ComponentType<{ className?: string }>;
    bg: string;
    text: string;
    border: string;
    iconColor: string;
  }
> = {
  car: {
    ar: "سيارة ليموزين",
    en: "Limousine",
    icon: FaCar,
    bg: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-200/90",
    iconColor: "text-[#d0a755]",
  },
  fast_track: {
    ar: "مسار سريع VIP",
    en: "VIP Fast Track",
    icon: FaBolt,
    bg: "bg-purple-50",
    text: "text-purple-900",
    border: "border-purple-200/90",
    iconColor: "text-purple-600",
  },
  hotel: {
    ar: "حجز فندق",
    en: "Hotel Booking",
    icon: FaHotel,
    bg: "bg-blue-50",
    text: "text-blue-900",
    border: "border-blue-200/90",
    iconColor: "text-blue-600",
  },
  apartment: {
    ar: "شقة فندقية",
    en: "Hotel Apartment",
    icon: FaBuilding,
    bg: "bg-emerald-50",
    text: "text-emerald-900",
    border: "border-emerald-200/90",
    iconColor: "text-emerald-600",
  },
  flight: {
    ar: "حجز طيران",
    en: "Flight Ticket",
    icon: FaPlane,
    bg: "bg-sky-50",
    text: "text-sky-900",
    border: "border-sky-200/90",
    iconColor: "text-sky-600",
  },
};

export function ServiceBadge({ type, lang = "ar", className = "" }: ServiceBadgeProps) {
  const config = serviceBadgeConfig[type] || {
    ar: type || "خدمة عامة",
    en: type || "General Service",
    icon: FiLayers,
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    iconColor: "text-slate-500",
  };

  const Icon = config.icon;
  const label = lang === "en" ? config.en : config.ar;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black border whitespace-nowrap select-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-xs ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${config.iconColor}`} />
      <span className="leading-none">{label}</span>
    </span>
  );
}

