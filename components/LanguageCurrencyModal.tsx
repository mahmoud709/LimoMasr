"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { FiX } from "react-icons/fi";

export function LanguageCurrencyModal({ 
  currentLocale, 
  currentCurrency 
}: { 
  currentLocale: string;
  currentCurrency: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [selectedLang, setSelectedLang] = useState(currentLocale);
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);

  const t = currentLocale === "ar" ? {
    title: "اللغة والعملة",
    lang: "اللغة",
    currency: "العملة",
    save: "حفظ",
    cancel: "إلغاء"
  } : {
    title: "Language and Currency",
    lang: "Language",
    currency: "Currency",
    save: "Save",
    cancel: "Cancel"
  };

  const languages = [
    { code: "ar", label: "العربية", flag: "sa" },
    { code: "en", label: "English", sub: "الإنجليزية", flag: "gb" },
  ];

  const currencies = [
    { code: "EGP", label: "EGP", sub: "جنيه مصري", flag: "eg" },
    { code: "USD", label: "USD", sub: "دولار أمريكي", flag: "us" },
  ];

  const handleSave = () => {
    document.cookie = `NEXT_LOCALE=${selectedLang}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `NEXT_CURRENCY=${selectedCurrency}; path=/; max-age=31536000; SameSite=Lax`;

    let newPath = pathname;
    if (pathname.startsWith("/en") || pathname.startsWith("/ar")) {
      newPath = pathname.replace(/^\/(en|ar)/, `/${selectedLang}`);
    } else {
      newPath = `/${selectedLang}${pathname === "/" ? "" : pathname}`;
    }
    
    setIsOpen(false);
    router.push(newPath);
    router.refresh();
  };

  // Set mounted
  useEffect(() => setMounted(true), []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (
        modalRef.current && 
        !modalRef.current.contains(target) &&
        !target.closest('#lang-modal-content')
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const modalInner = (
    <div id="lang-modal-content" className="bg-[#FCFAEE] rounded-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative text-[#1a2b3c] border border-black/5 pointer-events-auto">
      {/* Arrow pointing up - Desktop Only */}
      <div className="hidden sm:block absolute -top-2 ltr:right-10 rtl:left-10 w-4 h-4 bg-[#FCFAEE] rotate-45 border-l border-t border-black/5"></div>
      
      <div className="flex-shrink-0 bg-[#FCFAEE] z-10 flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-[#1a2b3c]/10 relative">
        <h2 className="text-xl font-black">{t.title}</h2>
        <button onClick={() => setIsOpen(false)} className="text-[#1a2b3c]/50 hover:text-[#1a2b3c] transition-colors p-1">
          <FiX className="w-6 h-6" />
        </button>
      </div>
      
      <div className="p-5 sm:p-6 overflow-y-auto space-y-6 sm:space-y-8 flex-1">
        <div>
          <h3 className="text-sm font-bold text-[#b89040] mb-4 px-1">{t.lang}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
                  selectedLang === lang.code 
                    ? 'border-[#d0a755] bg-[#d0a755]/10 shadow-[0_0_0_1px_#d0a755]' 
                    : 'border-[#1a2b3c]/10 bg-white hover:border-[#d0a755]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={`https://flagcdn.com/w40/${lang.flag}.png`} alt={lang.code} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                  <div className="text-right flex flex-col items-start leading-tight">
                    <span className="font-bold text-[#1a2b3c]">{lang.label}</span>
                    {lang.sub && <span className="text-[11px] font-medium text-[#1a2b3c]/60 mt-0.5">{lang.sub}</span>}
                  </div>
                </div>
                {selectedLang === lang.code && (
                  <div className="w-5 h-5 rounded-full bg-[#d0a755] text-white flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#b89040] mb-4 px-1">{t.currency}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currencies.map(curr => (
              <button
                key={curr.code}
                onClick={() => setSelectedCurrency(curr.code)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
                  selectedCurrency === curr.code 
                    ? 'border-[#d0a755] bg-[#d0a755]/10 shadow-[0_0_0_1px_#d0a755]' 
                    : 'border-[#1a2b3c]/10 bg-white hover:border-[#d0a755]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={`https://flagcdn.com/w40/${curr.flag}.png`} alt={curr.code} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                  <div className="text-right flex flex-col items-start leading-tight">
                    <span className="font-bold text-[#1a2b3c]">{curr.label}</span>
                    {curr.sub && <span className="text-[11px] font-medium text-[#1a2b3c]/60 mt-0.5">{curr.sub}</span>}
                  </div>
                </div>
                {selectedCurrency === curr.code && (
                  <div className="w-5 h-5 rounded-full bg-[#d0a755] text-white flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-[#FCFAEE] p-4 sm:p-5 border-t border-[#1a2b3c]/10 flex gap-4 mt-auto relative z-10">
        <button 
          onClick={handleSave}
          className="flex-1 bg-[#d0a755] hover:bg-[#b89040] text-[#1a2b3c] font-black py-3 sm:py-3.5 rounded-xl transition-all shadow-sm"
        >
          {t.save}
        </button>
        <button 
          onClick={() => setIsOpen(false)}
          className="flex-1 bg-white border border-[#1a2b3c]/10 hover:bg-gray-50 text-[#1a2b3c] font-bold py-3 sm:py-3.5 rounded-xl transition-all"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={modalRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-full transition-colors font-bold text-sm h-10"
        dir="ltr"
      >
        <span>{currentLocale.toUpperCase()} · {currentCurrency}</span>
        <div className="w-5 h-5 bg-[#407B37] rounded-full flex items-center justify-center text-[8px] text-white overflow-hidden ml-1">
           {currentLocale === "ar" ? "العربية" : "EN"}
        </div>
      </button>

      {isOpen && (
        <>
          {/* Mobile View (Portaled) */}
          {mounted && createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center sm:hidden" dir={currentLocale === "ar" ? "rtl" : "ltr"}>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}></div>
              <div className="relative w-[95vw] max-w-[400px]">
                {modalInner}
              </div>
            </div>,
            document.body
          )}

          {/* Desktop View (Inline Dropdown) */}
          <div className="hidden sm:block absolute top-full mt-4 ltr:right-0 rtl:left-0 w-[600px] z-[100] drop-shadow-2xl" dir={currentLocale === "ar" ? "rtl" : "ltr"}>
            {modalInner}
          </div>
        </>
      )}
    </div>
  );
}
