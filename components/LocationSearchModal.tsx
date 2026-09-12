"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX, FiSearch, FiMapPin, FiClock, FiNavigation, FiUsers, FiCheckCircle, FiCompass } from "react-icons/fi";

type LocationSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  title: string;
  placeholder: string;
  isEn?: boolean;
};

const LOCAL_AIRPORTS = [
  { nameAr: "مطار القاهرة الدولي", nameEn: "Cairo International Airport", cityAr: "القاهرة", cityEn: "Cairo" },
  { nameAr: "مطار برج العرب الدولي", nameEn: "Borg El Arab International Airport", cityAr: "الإسكندرية", cityEn: "Alexandria" },
  { nameAr: "مطار شرم الشيخ الدولي", nameEn: "Sharm El Sheikh International Airport", cityAr: "شرم الشيخ", cityEn: "Sharm El Sheikh" },
  { nameAr: "مطار الغردقة الدولي", nameEn: "Hurghada International Airport", cityAr: "الغردقة", cityEn: "Hurghada" },
  { nameAr: "مطار الأقصر الدولي", nameEn: "Luxor International Airport", cityAr: "الأقصر", cityEn: "Luxor" },
  { nameAr: "مطار أسوان الدولي", nameEn: "Aswan International Airport", cityAr: "أسوان", cityEn: "Aswan" },
  { nameAr: "مطار سفنكس الدولي", nameEn: "Sphinx International Airport", cityAr: "الجيزة", cityEn: "Giza" },
  { nameAr: "مطار العاصمة الدولي", nameEn: "Capital International Airport", cityAr: "العاصمة الإدارية", cityEn: "New Capital" },
  { nameAr: "مطار العلمين الدولي", nameEn: "Alamein International Airport", cityAr: "العلمين", cityEn: "Alamein" },
];

const LOCAL_HOTELS = [
  { nameAr: "فندق فور سيزونز نايل بلازا", nameEn: "Four Seasons Hotel Cairo at Nile Plaza", cityAr: "القاهرة", cityEn: "Cairo" },
  { nameAr: "فندق فور سيزونز الفيرست ريزيدنس", nameEn: "Four Seasons Hotel Cairo at The First Residence", cityAr: "الجيزة", cityEn: "Giza" },
  { nameAr: "فندق النيل ريتز كارلتون", nameEn: "The Nile Ritz-Carlton", cityAr: "القاهرة", cityEn: "Cairo" },
  { nameAr: "فندق ماريوت القاهرة وكازينو عمر الخيام", nameEn: "Cairo Marriott Hotel & Omar Khayyam Casino", cityAr: "القاهرة", cityEn: "Cairo" },
  { nameAr: "فندق سانت ريجيس القاهرة", nameEn: "The St. Regis Cairo", cityAr: "القاهرة", cityEn: "Cairo" },
  { nameAr: "فندق كمبينسكي النيل", nameEn: "Kempinski Nile Hotel", cityAr: "القاهرة", cityEn: "Cairo" },
  { nameAr: "فندق فيرمونت نايل سيتي", nameEn: "Fairmont Nile City", cityAr: "القاهرة", cityEn: "Cairo" },
  { nameAr: "فندق كونراد القاهرة", nameEn: "Conrad Cairo", cityAr: "القاهرة", cityEn: "Cairo" },
  { nameAr: "فندق سوفيتيل الجزيرة", nameEn: "Sofitel Cairo Nile El Gezirah", cityAr: "القاهرة", cityEn: "Cairo" },
  { nameAr: "فندق ماريوت مينا هاوس", nameEn: "Marriott Mena House", cityAr: "الجيزة", cityEn: "Giza" },
  { nameAr: "فندق رينيسانس كايرو", nameEn: "Renaissance Cairo Mirage City Hotel", cityAr: "القاهرة الجديدة", cityEn: "New Cairo" },
  { nameAr: "فندق دوسيت تاني", nameEn: "Dusit Thani LakeView Cairo", cityAr: "القاهرة الجديدة", cityEn: "New Cairo" },
  { nameAr: "فندق تريومف لاكشري", nameEn: "Triumph Luxury Hotel", cityAr: "القاهرة الجديدة", cityEn: "New Cairo" },
];

const POPULAR_DESTINATIONS = [
  { nameAr: "القاهرة", nameEn: "Cairo" },
  { nameAr: "الجيزة", nameEn: "Giza" },
  { nameAr: "الإسكندرية", nameEn: "Alexandria" },
  { nameAr: "الجونة", nameEn: "El Gouna" },
  { nameAr: "مرسى مطروح", nameEn: "Marsa Matruh" },
  { nameAr: "الضبعة", nameEn: "El Dabaa" },
];

export function LocationSearchModal({ isOpen, onClose, onSelect, title, placeholder, isEn = false }: LocationSearchModalProps) {
  const [viewMode, setViewMode] = useState<"search" | "map">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Interactive Map & Proxy Booking state
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 30.0444, lng: 31.2357 }); // Cairo default
  const [pinnedLocationName, setPinnedLocationName] = useState<string>("");
  const [isGeocodingPin, setIsGeocodingPin] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [mapSearchResults, setMapSearchResults] = useState<any[]>([]);
  const [isMapSearching, setIsMapSearching] = useState(false);

  const [isForOther, setIsForOther] = useState(false);
  const [otherPersonName, setOtherPersonName] = useState("");
  const [otherPersonPhone, setOtherPersonPhone] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<any>(null);
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
      setViewMode("search");
      setIsForOther(false);
      setOtherPersonName("");
      setOtherPersonPhone("");
    }
  }, [isOpen]);

  // Leaflet map initialization when switching to map mode
  useEffect(() => {
    if (viewMode !== "map" || !mapRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const loadLeafletScript = () => {
      return new Promise<void>((resolve) => {
        if ((window as any).L) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    let isCancelled = false;

    loadLeafletScript().then(() => {
      if (isCancelled || !mapRef.current || !(window as any).L) return;

      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }

      const L = (window as any).L;
      const map = L.map(mapRef.current, {
        center: [mapCenter.lat, mapCenter.lng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      leafletInstanceRef.current = map;

      const geocodeCenter = async () => {
        const center = map.getCenter();
        setIsGeocodingPin(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${center.lat}&lon=${center.lng}&format=json&accept-language=${isEn ? "en" : "ar"}`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const mainName = addr.road || addr.suburb || addr.neighbourhood || addr.city_district || addr.town || addr.city || data.name || data.display_name?.split(",")[0];
            const city = addr.city || addr.state || addr.governorate;

            let locationStr = mainName;
            if (city && mainName && !mainName.includes(city)) {
              locationStr = isEn ? `${mainName}, ${city}` : `${mainName}، ${city}`;
            }
            setPinnedLocationName(locationStr ? locationStr.trim() : (isEn ? "Selected Location on Map" : "موقع محدد على الخريطة"));
          }
        } catch (err) {
          setPinnedLocationName(isEn ? "Selected Location on Map" : "موقع محدد على الخريطة");
        } finally {
          setIsGeocodingPin(false);
        }
      };

      geocodeCenter();

      map.on("moveend", () => {
        const center = map.getCenter();
        setMapCenter({ lat: center.lat, lng: center.lng });
        geocodeCenter();
      });
    });

    return () => {
      isCancelled = true;
      if (leafletInstanceRef.current) {
        leafletInstanceRef.current.remove();
        leafletInstanceRef.current = null;
      }
    };
  }, [viewMode, isEn]);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);

      const q = query.toLowerCase().trim();
      const localMatches = [...LOCAL_AIRPORTS, ...LOCAL_HOTELS].filter(a => 
        a.nameAr.includes(q) || a.nameEn.toLowerCase().includes(q) ||
        a.cityAr.includes(q) || a.cityEn.toLowerCase().includes(q)
      ).map(a => ({
        place_id: `local-${a.nameEn}`,
        name: isEn ? a.nameEn : a.nameAr,
        display_name: isEn ? `${a.nameEn}, ${a.cityEn}, Egypt` : `${a.nameAr}، ${a.cityAr}، مصر`
      }));

      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&countrycodes=eg&accept-language=${isEn ? 'en' : 'ar'}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          const apiFormatted = data.map((d: any) => ({
            place_id: d.place_id,
            name: d.name,
            display_name: d.display_name
          }));
          
          const combined = [...localMatches, ...apiFormatted];
          const unique = combined.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);
          setResults(unique);
        }
      } catch (err) {
        console.error("Failed to fetch locations", err);
        setResults(localMatches);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, isEn]);

  // Debounced search for Map Mode input
  useEffect(() => {
    if (viewMode !== "map" || mapSearchQuery.trim().length < 3) {
      setMapSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsMapSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(mapSearchQuery)}&format=json&limit=5&addressdetails=1&countrycodes=eg&accept-language=${isEn ? 'en' : 'ar'}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setMapSearchResults(data.map((d: any) => ({
            place_id: d.place_id,
            name: d.name,
            display_name: d.display_name,
            lat: d.lat,
            lon: d.lon
          })));
        }
      } catch (err) {
        console.error("Map search error", err);
      } finally {
        setIsMapSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [mapSearchQuery, viewMode, isEn]);

  const handleSelect = (location: string) => {
    let finalLocation = location;

    if (isForOther) {
      const details = [];
      if (otherPersonName.trim()) details.push(`[اسم المستفيد: ${otherPersonName.trim()}]`);
      if (otherPersonPhone.trim()) details.push(`[رقم هاتف المستفيد: ${otherPersonPhone.trim()}]`);
      
      finalLocation = `${location} [حجز للغير: نعم] ${details.join(" ")} [موقع المستفيد: ${location}]`;
    }

    // Save to recents
    const recents = [location, ...recentSearches.filter(l => l !== location)].slice(0, 5);
    setRecentSearches(recents);
    localStorage.setItem("recent_locations", JSON.stringify(recents));
    
    onSelect(finalLocation);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      handleSelect(isEn ? "Current Location" : "موقعي الحالي");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=${isEn ? "en" : "ar"}`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const mainName = addr.suburb || addr.neighbourhood || addr.city_district || addr.town || addr.city || data.name || data.display_name?.split(",")[0];
            const city = addr.city || addr.state || addr.governorate;

            let locationStr = mainName;
            if (city && mainName && !mainName.includes(city)) {
              locationStr = isEn ? `${mainName}, ${city}` : `${mainName}، ${city}`;
            }
            if (!locationStr) {
              locationStr = isEn ? "Current Location" : "موقعي الحالي";
            }
            handleSelect(locationStr.trim());
          } else {
            handleSelect(isEn ? "Current Location" : "موقعي الحالي");
          }
        } catch (err) {
          handleSelect(isEn ? "Current Location" : "موقعي الحالي");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setIsLocating(false);
        handleSelect(isEn ? "Current Location" : "موقعي الحالي");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
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
        className="bg-white w-full md:w-[540px] max-h-[92vh] md:max-h-[85vh] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300 shadow-2xl mt-auto md:mt-0"
        dir={isEn ? "ltr" : "rtl"}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-[#1a2b3c]">{title}</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              {isEn ? "Search address or select pin on interactive map" : "ابحث عن موقع أو حدد بالدبوس على الخريطة مباشرة"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-500 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Search List vs Map Pin) */}
        <div className="p-3 border-b border-slate-100 bg-white shrink-0">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setViewMode("search")}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                viewMode === "search"
                  ? "bg-[#1a2b3c] text-[#d0a755] shadow-sm"
                  : "text-slate-600 hover:text-[#1a2b3c]"
              }`}
            >
              <FiSearch className="w-4 h-4" />
              <span>{isEn ? "Search by Name" : "البحث بالاسم والواجهات"}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                viewMode === "map"
                  ? "bg-[#1a2b3c] text-[#d0a755] shadow-sm"
                  : "text-slate-600 hover:text-[#1a2b3c]"
              }`}
            >
              <FiMapPin className="w-4 h-4 text-[#d0a755]" />
              <span>{isEn ? "Pick Pin on Map" : "تحديد بالدبوس على الخريطة"}</span>
            </button>
          </div>
        </div>

        {/* Proxy Booking Option (حجز لشخص آخر) Inside Modal */}
        <div className="px-4 pt-3 shrink-0">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-2">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#1a2b3c] text-[#d0a755] flex items-center justify-center font-black text-xs">
                  <FiUsers className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black text-[#1a2b3c]">
                  {isEn ? "Is this location for someone else?" : "هل هذا المكان لشخص آخر؟ (أقارب / ضيوف / عملاء)"}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isForOther}
                onChange={(e) => setIsForOther(e.target.checked)}
                className="w-4 h-4 accent-[#d0a755] rounded cursor-pointer"
              />
            </label>

            {isForOther && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-200/60 animate-in fade-in">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                    {isEn ? "Beneficiary Name" : "اسم المستفيد/الضيف"}
                  </label>
                  <input
                    type="text"
                    value={otherPersonName}
                    onChange={(e) => setOtherPersonName(e.target.value)}
                    placeholder={isEn ? "Passenger Name" : "اسم المستفيد (الراكب)"}
                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1a2b3c] outline-none focus:border-[#d0a755]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                    {isEn ? "Beneficiary Phone" : "رقم هاتف المستفيد"}
                  </label>
                  <input
                    type="tel"
                    value={otherPersonPhone}
                    onChange={(e) => setOtherPersonPhone(e.target.value)}
                    placeholder={isEn ? "e.g. 01000000000" : "مثال: 01000000000"}
                    className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1a2b3c] outline-none focus:border-[#d0a755] text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Body Content according to viewMode */}
        {viewMode === "search" ? (
          <div className="flex-1 overflow-y-auto p-4 pt-3 space-y-3">
            {/* Search Input */}
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
            
            <button 
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="w-full py-3 rounded-2xl border border-slate-200 hover:border-[#d0a755] hover:bg-[#d0a755]/5 flex items-center justify-center gap-2.5 text-[#1a2b3c] font-black text-xs sm:text-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              <FiNavigation className={`w-4 h-4 text-[#d0a755] ${isLocating ? "animate-spin" : ""}`} />
              <span>
                {isLocating 
                  ? (isEn ? "Detecting your location..." : "جاري تحديد موقعك...")
                  : (isEn ? "Use My Current Location" : "استخدام موقعي الحالي")
                }
              </span>
            </button>

            {/* Search Results */}
            {query.trim().length >= 3 ? (
              <div className="space-y-1 pt-1">
                {isSearching ? (
                  <div className="py-8 text-center text-slate-400 text-sm font-bold">
                    {isEn ? "Searching..." : "جاري البحث..."}
                  </div>
                ) : results.length > 0 ? (
                  <>
                    {results.map((res, i) => (
                      <button
                        key={res.place_id || i}
                        onClick={() => handleSelect(res.name)}
                        className="w-full text-start p-3.5 hover:bg-slate-50 rounded-2xl flex items-start gap-3.5 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#d0a755]/10 group-hover:text-[#d0a755] text-slate-400 transition-colors">
                          <FiMapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[#1a2b3c] truncate text-xs sm:text-sm">
                            {res.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {res.display_name}
                          </p>
                        </div>
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handleSelect(query.trim())}
                      className="w-full text-start p-3.5 hover:bg-[#d0a755]/10 rounded-2xl flex items-start gap-3.5 transition-colors group border border-dashed border-[#d0a755]/50 mt-2 bg-[#d0a755]/5"
                    >
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 text-[#d0a755] shadow-sm">
                        <FiMapPin className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[#d0a755] truncate text-xs sm:text-sm">
                          {isEn ? `Use "${query.trim()}"` : `استخدام "${query.trim()}"`}
                        </p>
                        <p className="text-xs text-[#1a2b3c]/60 truncate mt-0.5">
                          {isEn ? "Enter this exact location manually" : "إدخال هذا المكان واعتماده مباشرة"}
                        </p>
                      </div>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleSelect(query.trim())}
                    className="w-full text-start p-3.5 hover:bg-[#d0a755]/10 rounded-2xl flex items-start gap-3.5 transition-colors group border border-dashed border-[#d0a755]/50 bg-[#d0a755]/5"
                  >
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 text-[#d0a755] shadow-sm">
                      <FiMapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[#d0a755] truncate text-xs sm:text-sm">
                        {isEn ? `Use "${query.trim()}"` : `استخدام "${query.trim()}"`}
                      </p>
                      <p className="text-xs text-[#1a2b3c]/60 truncate mt-0.5">
                        {isEn ? "Location not found on map, but you can use it manually." : "لم يتم العثور عليه في الخريطة، لكن يمكنك اعتماده كعنوان مباشر."}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        {isEn ? "Recent Searches" : "عمليات البحث الأخيرة"}
                      </h3>
                      <button onClick={clearRecents} className="text-[11px] font-bold text-[#d0a755] hover:underline">
                        {isEn ? "Clear" : "مسح"}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((loc, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl group cursor-pointer" onClick={() => handleSelect(loc)}>
                          <div className="flex items-center gap-2.5">
                            <FiClock className="text-slate-400 w-3.5 h-3.5" />
                            <span className="text-xs font-bold text-[#1a2b3c]">{loc}</span>
                          </div>
                          <button onClick={(e) => removeRecent(e, loc)} className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                            <FiX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Destinations */}
                <div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">
                    {isEn ? "Popular Destinations" : "وجهات رائجة"}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {POPULAR_DESTINATIONS.map((dest, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(isEn ? dest.nameEn : dest.nameAr)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors group border border-slate-100 bg-white"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#d0a755]/10 group-hover:text-[#d0a755] text-slate-400 transition-colors border border-slate-100">
                          <FiMapPin className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-start min-w-0">
                          <p className="font-black text-[#1a2b3c] text-xs truncate group-hover:text-[#d0a755] transition-colors">
                            {isEn ? dest.nameEn : dest.nameAr}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium truncate">
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
        ) : (
          /* Interactive Map Pin Picker Mode */
          <div className="flex-1 p-4 pt-3 flex flex-col space-y-3 overflow-hidden">
            {/* Search input floating over map mode */}
            <div className="relative z-[1000]">
              <div className="relative flex items-center">
                <FiSearch className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isEn ? 'left-3.5' : 'right-3.5'}`} />
                <input 
                  type="text"
                  value={mapSearchQuery}
                  onChange={(e) => setMapSearchQuery(e.target.value)}
                  placeholder={isEn ? "Search for an address or area to jump map..." : "ابحث عن منطقة أو عنوان لتحريك الدبوس وإيجاده..."}
                  className={`w-full bg-white border border-slate-200 shadow-sm rounded-xl py-2.5 focus:outline-none focus:ring-2 focus:ring-[#d0a755] text-xs font-bold text-[#1a2b3c] ${isEn ? 'pl-10 pr-8' : 'pr-10 pl-8'}`}
                />
                {mapSearchQuery && (
                  <button 
                    type="button" 
                    onClick={() => { setMapSearchQuery(""); setMapSearchResults([]); }}
                    className={`absolute top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 ${isEn ? 'right-2.5' : 'left-2.5'}`}
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown overlaying map */}
              {mapSearchResults.length > 0 && (
                <div className="absolute top-full mt-1 inset-x-0 bg-white rounded-xl shadow-xl border border-slate-200 divide-y divide-slate-100 max-h-48 overflow-y-auto z-[1010]">
                  {mapSearchResults.map((res, i) => (
                    <button
                      key={res.place_id || i}
                      type="button"
                      onClick={() => {
                        const lat = parseFloat(res.lat);
                        const lon = parseFloat(res.lon);
                        if (!isNaN(lat) && !isNaN(lon)) {
                          setMapCenter({ lat, lng: lon });
                          if (leafletInstanceRef.current) {
                            leafletInstanceRef.current.flyTo([lat, lon], 16);
                          }
                          setPinnedLocationName(res.name || res.display_name?.split(",")[0]);
                        }
                        setMapSearchQuery("");
                        setMapSearchResults([]);
                      }}
                      className="w-full text-start p-2.5 hover:bg-[#d0a755]/10 flex items-start gap-2.5 transition-colors cursor-pointer"
                    >
                      <FiMapPin className="w-4 h-4 text-[#d0a755] shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-[#1a2b3c] truncate">{res.name || res.display_name?.split(",")[0]}</p>
                        <p className="text-[10px] text-slate-400 truncate">{res.display_name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full h-[280px] sm:h-[300px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              {/* Map Container */}
              <div ref={mapRef} className="w-full h-full z-0" />

              {/* Fixed Pin Marker centered over the map */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[1000] pointer-events-none flex flex-col items-center drop-shadow-md">
                <div className="w-9 h-9 rounded-full bg-[#1a2b3c] text-[#d0a755] border-2 border-[#d0a755] flex items-center justify-center font-black shadow-lg animate-bounce">
                  <FiMapPin className="w-5 h-5 text-[#d0a755]" />
                </div>
                <div className="w-2.5 h-2.5 bg-[#1a2b3c] rotate-45 -mt-1.5 border-r border-b border-[#d0a755]" />
              </div>

              {/* Top Banner showing resolved location address */}
              <div className="absolute top-3 inset-x-3 z-[1000] bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-black/10 shadow-md flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FiCompass className="w-4 h-4 text-[#d0a755] shrink-0 animate-spin" style={{ animationDuration: "6s" }} />
                  <span className="text-xs font-black text-[#1a2b3c] truncate">
                    {isGeocodingPin ? (isEn ? "Locating position on map..." : "جاري تحديد العنوان من الخريطة...") : pinnedLocationName}
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Pin Location Button */}
            <button
              type="button"
              onClick={() => handleSelect(pinnedLocationName || (isEn ? "Selected Location on Map" : "موقع محدد من الخريطة"))}
              disabled={isGeocodingPin}
              className="w-full py-3 rounded-2xl bg-[#1a2b3c] text-[#d0a755] hover:bg-[#d0a755] hover:text-[#1a2b3c] font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <FiCheckCircle className="w-4 h-4" />
              <span>{isEn ? "Confirm Pinned Location" : "تأكيد هذا الموقع المحدد بالدبوس"}</span>
            </button>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}

