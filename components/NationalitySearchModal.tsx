"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX, FiSearch, FiGlobe } from "react-icons/fi";

type NationalitySearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (nationality: string, phoneCode: string) => void;
  title: string;
  placeholder: string;
  isEn?: boolean;
};

const COUNTRIES = [
  { code: "+20", ar: "مصر", en: "Egypt", flag: "🇪🇬" },
  { code: "+966", ar: "المملكة العربية السعودية", en: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", ar: "الإمارات العربية المتحدة", en: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+965", ar: "الكويت", en: "Kuwait", flag: "🇰🇼" },
  { code: "+974", ar: "قطر", en: "Qatar", flag: "🇶🇦" },
  { code: "+973", ar: "البحرين", en: "Bahrain", flag: "🇧🇭" },
  { code: "+968", ar: "عُمان", en: "Oman", flag: "🇴🇲" },
  { code: "+962", ar: "الأردن", en: "Jordan", flag: "🇯🇴" },
  { code: "+961", ar: "لبنان", en: "Lebanon", flag: "🇱🇧" },
  { code: "+963", ar: "سوريا", en: "Syria", flag: "🇸🇾" },
  { code: "+964", ar: "العراق", en: "Iraq", flag: "🇮🇶" },
  { code: "+970", ar: "فلسطين", en: "Palestine", flag: "🇵🇸" },
  { code: "+967", ar: "اليمن", en: "Yemen", flag: "🇾🇪" },
  { code: "+249", ar: "السودان", en: "Sudan", flag: "🇸🇩" },
  { code: "+218", ar: "ليبيا", en: "Libya", flag: "🇱🇾" },
  { code: "+216", ar: "تونس", en: "Tunisia", flag: "🇹🇳" },
  { code: "+213", ar: "الجزائر", en: "Algeria", flag: "🇩🇿" },
  { code: "+212", ar: "المغرب", en: "Morocco", flag: "🇲🇦" },
  { code: "+222", ar: "موريتانيا", en: "Mauritania", flag: "🇲🇷" },
  { code: "+1", ar: "الولايات المتحدة", en: "USA", flag: "🇺🇸" },
  { code: "+1", ar: "كندا", en: "Canada", flag: "🇨🇦" },
  { code: "+44", ar: "المملكة المتحدة", en: "UK", flag: "🇬🇧" },
  { code: "+49", ar: "ألمانيا", en: "Germany", flag: "🇩🇪" },
  { code: "+33", ar: "فرنسا", en: "France", flag: "🇫🇷" },
  { code: "+39", ar: "إيطاليا", en: "Italy", flag: "🇮🇹" },
  { code: "+34", ar: "إسبانيا", en: "Spain", flag: "🇪🇸" },
  { code: "+90", ar: "تركيا", en: "Turkey", flag: "🇹🇷" }
];

export function NationalitySearchModal({ isOpen, onClose, onSelect, title, placeholder, isEn = false }: NationalitySearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSelect = (nationality: string, code: string) => {
    onSelect(nationality, code);
    onClose();
  };

  const filteredCountries = COUNTRIES.filter(c => 
    c.ar.includes(query) || c.en.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 md:items-center md:p-4">
      <div 
        className="bg-white w-full md:w-[450px] h-[85vh] md:h-auto md:max-h-[85vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 shadow-2xl mt-auto md:mt-0"
        dir={isEn ? "ltr" : "rtl"}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-[#1a2b3c]">{title}</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 shrink-0 border-b border-slate-50 shadow-sm">
          <div className="relative">
            <FiSearch className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isEn ? 'left-4' : 'right-4'}`} />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 focus:outline-none focus:ring-2 focus:ring-[#d0a755] focus:border-transparent text-sm font-bold text-[#1a2b3c] ${isEn ? 'pl-12 pr-4' : 'pr-12 pl-4'}`}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pt-2">
          {query.trim().length > 0 && filteredCountries.length === 0 ? (
            <button
              onClick={() => handleSelect(query.trim(), "")}
              className="w-full text-start p-4 hover:bg-[#d0a755]/10 rounded-2xl flex items-center gap-4 transition-colors group border border-dashed border-[#d0a755]/50 bg-[#d0a755]/5"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#d0a755] shadow-sm">
                <FiGlobe className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-[#d0a755] truncate text-base">
                  {isEn ? `Use "${query.trim()}"` : `استخدام "${query.trim()}"`}
                </p>
                <p className="text-xs text-[#1a2b3c]/60 truncate mt-1">
                  {isEn ? "Enter this nationality manually" : "إدخال هذه الجنسية واعتمادها"}
                </p>
              </div>
            </button>
          ) : (
            <>
              {query.trim() === "" && (
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-3 mt-2">
                  {isEn ? "Popular" : "الأكثر اختياراً"}
                </h3>
              )}
              <div className="space-y-1">
                {filteredCountries.map((country, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(isEn ? country.en : country.ar, country.code)}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors group"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-black text-[#1a2b3c] text-base group-hover:text-[#d0a755] transition-colors">
                        {isEn ? country.en : country.ar}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {isEn ? country.ar : country.en}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md" dir="ltr">
                        {country.code}
                      </span>
                      <span className="text-3xl shadow-sm rounded-full leading-none">{country.flag}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
