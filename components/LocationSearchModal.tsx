"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX, FiSearch, FiMapPin, FiClock } from "react-icons/fi";
import { FaGlobeAmericas } from "react-icons/fa";

type LocationSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  title: string;
  placeholder: string;
  isEn?: boolean;
};

const POPULAR_DESTINATIONS = [
  { nameAr: "القاهرة", nameEn: "Cairo" },
  { nameAr: "الجيزة", nameEn: "Giza" },
  { nameAr: "الإسكندرية", nameEn: "Alexandria" },
  { nameAr: "الجونة", nameEn: "El Gouna" },
  { nameAr: "مرسى مطروح", nameEn: "Marsa Matruh" },
  { nameAr: "الضبعة", nameEn: "El Dabaa" },
];

export function LocationSearchModal({ isOpen, onClose, onSelect, title, placeholder, isEn = false }: LocationSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const saved = localStorage.getItem("recent_locations");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved).slice(0, 3));
        } catch {}
      }
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&accept-language=${isEn ? 'en' : 'ar'}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Failed to fetch locations", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, isEn]);

  const handleSelect = (location: string) => {
    // Save to recents
    const recents = [location, ...recentSearches.filter(l => l !== location)].slice(0, 5);
    setRecentSearches(recents);
    localStorage.setItem("recent_locations", JSON.stringify(recents));
    
    onSelect(location);
    onClose();
  };

  const removeRecent = (e: React.MouseEvent, loc: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(l => l !== loc);
    setRecentSearches(updated);
    localStorage.setItem("recent_locations", JSON.stringify(updated));
  };

  const clearRecents = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent_locations");
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 md:items-center md:p-4">
      <div 
        className="bg-white w-full md:w-[500px] h-[95vh] md:h-auto md:max-h-[85vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 shadow-2xl mt-auto md:mt-0"
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
        <div className="p-4 shrink-0">
          <div className="relative">
            <FiSearch className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 ${isEn ? 'left-4' : 'right-4'}`} />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 focus:outline-none focus:ring-2 focus:ring-[#d0a755] focus:border-transparent text-sm font-bold text-[#1a2b3c] ${isEn ? 'pl-12 pr-4' : 'pr-12 pl-4'}`}
            />
          </div>
          
          <button 
            onClick={() => handleSelect(isEn ? "Any Location" : "أي مكان")}
            className="w-full mt-3 py-4 rounded-2xl border border-slate-200 hover:border-[#d0a755] hover:bg-[#d0a755]/5 flex items-center justify-center gap-2 text-[#1a2b3c] font-black text-sm transition-all"
          >
            <FaGlobeAmericas className="w-4 h-4 text-[#d0a755]" />
            {isEn ? "Any Location" : "أي مكان"}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pt-0">
          
          {/* Search Results */}
          {query.trim().length >= 3 ? (
            <div className="space-y-1">
              {isSearching ? (
                <div className="py-8 text-center text-slate-400 text-sm font-bold">
                  {isEn ? "Searching..." : "جاري البحث..."}
                </div>
              ) : results.length > 0 ? (
                results.map((res, i) => (
                  <button
                    key={res.place_id || i}
                    onClick={() => handleSelect(res.display_name.split(',')[0])}
                    className="w-full text-start p-4 hover:bg-slate-50 rounded-2xl flex items-start gap-4 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#d0a755]/10 group-hover:text-[#d0a755] text-slate-400 transition-colors">
                      <FiMapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[#1a2b3c] truncate text-sm">
                        {res.name || res.display_name.split(',')[0]}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-1">
                        {res.display_name}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm font-bold">
                  {isEn ? "No results found" : "لم يتم العثور على نتائج"}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between px-2 mb-3">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {isEn ? "Recent Searches" : "عمليات البحث الأخيرة"}
                    </h3>
                    <button onClick={clearRecents} className="text-xs font-bold text-[#d0a755] hover:underline">
                      {isEn ? "Clear" : "مسح"}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((loc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl group cursor-pointer" onClick={() => handleSelect(loc)}>
                        <div className="flex items-center gap-3">
                          <FiClock className="text-slate-400 w-4 h-4" />
                          <span className="text-sm font-bold text-[#1a2b3c]">{loc}</span>
                        </div>
                        <button onClick={(e) => removeRecent(e, loc)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Destinations */}
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-3">
                  {isEn ? "Popular Destinations" : "وجهات رائجة"}
                </h3>
                <div className="space-y-1">
                  {POPULAR_DESTINATIONS.map((dest, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(isEn ? dest.nameEn : dest.nameAr)}
                      className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#d0a755]/10 group-hover:text-[#d0a755] text-slate-400 transition-colors border border-slate-100">
                        <FiMapPin className="w-4 h-4" />
                      </div>
                      <div className="text-start">
                        <p className="font-black text-[#1a2b3c] text-sm group-hover:text-[#d0a755] transition-colors">
                          {isEn ? dest.nameEn : dest.nameAr}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {isEn ? dest.nameAr : dest.nameEn}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}
