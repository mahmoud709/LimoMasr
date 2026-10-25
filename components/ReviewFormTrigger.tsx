"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Locale } from "@/lib/types";

const ReviewFormDialog = dynamic(() => import("./ReviewFormDialog"), { ssr: false });

export function ReviewFormTrigger({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="shrink-0 px-6 py-3 bg-[#1a2b3c] text-white text-sm font-bold rounded-xl hover:bg-[#d0a755] hover:text-[#1a2b3c] transition-colors shadow-sm"
      >
        {locale === "ar" ? "أضف تقييمك" : "Write a review"}
      </button>
      {isOpen && <ReviewFormDialog locale={locale} onClose={() => setIsOpen(false)} />}
    </>
  );
}