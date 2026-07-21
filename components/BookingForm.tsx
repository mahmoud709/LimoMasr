"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import type { ServiceType } from "@/lib/types";
import { bookingMessage, buildWhatsappUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

type BookingFormProps = {
  type: ServiceType;
  serviceRefId: string;
  serviceName: string;
  whatsappNumber: string;
  price?: number;
  locale?: string;
  baseCurrency?: string;
  currency?: string;
  exchangeRate?: number;
};

export function BookingForm({
  type,
  serviceRefId,
  serviceName,
  whatsappNumber,
  price,
  locale,
  baseCurrency = "EGP",
  currency = "EGP",
  exchangeRate = 1,
}: BookingFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [budget, setBudget] = useState(5000);
  const [bookingSource, setBookingSource] = useState<"web" | "whatsapp">("web");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const [accommodationType, setAccommodationType] = useState<"hotel" | "apartment">(type === "apartment" ? "apartment" : "hotel");
  const [hotelDetails, setHotelDetails] = useState("");
  const [apartmentArea, setApartmentArea] = useState("");

  const [flightFrom, setFlightFrom] = useState("");
  const [flightTo, setFlightTo] = useState("");
  const [flightDateFrom, setFlightDateFrom] = useState("");
  const [flightDateTo, setFlightDateTo] = useState("");

  const [hotelSuggestions, setHotelSuggestions] = useState<any[]>([]);
  const [isSearchingHotels, setIsSearchingHotels] = useState(false);
  const [showHotelSuggestions, setShowHotelSuggestions] = useState(false);
  const [selectedHotelIndex, setSelectedHotelIndex] = useState(-1);

  // Detect locale based on props, pathname prefix, or cookie
  const isEn = locale ? locale === "en" : (typeof window !== "undefined" && (
    window.location.pathname.startsWith("/en") ||
    window.location.search.includes("lang=en") ||
    document.cookie.includes("NEXT_LOCALE=en")
  ));

  // Fetch logged in customer if available to pre-fill details
  const { data: authData } = useQuery({
    queryKey: ["customerMe"],
    queryFn: async () => {
      const res = await fetch("/api/customer/me");
      if (!res.ok) return { user: null };
      return res.json();
    },
  });

  const user = authData?.user;

  useEffect(() => {
    if (user) {
      setCustomerName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (accommodationType !== "hotel" || hotelDetails.length < 3 || !showHotelSuggestions) {
      setHotelSuggestions([]);
      return;
    }
    
    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingHotels(true);
      try {
        const query = encodeURIComponent(`${hotelDetails} hotel egypt`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5&addressdetails=1&accept-language=${isEn ? 'en' : 'ar'}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setHotelSuggestions(data);
      } catch (err) {
        console.error("Error fetching hotel suggestions", err);
      } finally {
        setIsSearchingHotels(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [hotelDetails, accommodationType, showHotelSuggestions, isEn]);

  const message = useMemo(() => {
    let finalNotes = notes;
    if (['hotel', 'apartment'].includes(type)) {
      const formattedBudget = currency !== "EGP" ? (budget / exchangeRate).toFixed(2) + ` ${currency}` : budget + " EGP";
      const accDetails = accommodationType === "hotel" 
        ? (isEn ? `Accommodation: Hotel\nGovernorate/Hotel Name: ${hotelDetails}` : `الإقامة: فنادق\nالمحافظة أو اسم الفندق: ${hotelDetails}`)
        : (isEn ? `Accommodation: Hotel Apartment\nArea: ${apartmentArea}` : `الإقامة: شقق فندقية\nالمنطقة: ${apartmentArea}`);
      
      finalNotes = isEn
        ? `${accDetails}\nExpected budget per night: ${formattedBudget}\n\nNotes:\n${notes}`
        : `${accDetails}\nالميزانية المتوقعة لليلة: ${formattedBudget}\n\nالملاحظات:\n${notes}`;
    } else if (type === 'flight') {
      const flightDetails = isEn
        ? `From: ${flightFrom}\nTo: ${flightTo}\nDate From: ${flightDateFrom}\nDate To: ${flightDateTo}`
        : `من: ${flightFrom}\nإلى: ${flightTo}\nالتاريخ من: ${flightDateFrom}\nالتاريخ إلى: ${flightDateTo}`;
      finalNotes = `${flightDetails}\n\n${isEn ? 'Notes' : 'الملاحظات'}:\n${notes}`;
    }
    return bookingMessage({
      serviceName,
      customerName,
      phone,
      passengers,
      notes: finalNotes,
    }, isEn ? "en" : "ar");
  }, [type, serviceName, customerName, phone, passengers, notes, budget, isEn, currency, exchangeRate, accommodationType, hotelDetails, apartmentArea, flightFrom, flightTo, flightDateFrom, flightDateTo]);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const formattedBudget = currency !== "EGP" ? (budget / exchangeRate).toFixed(2) + ` ${currency}` : budget + " EGP";
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          customerName,
          phone,
          serviceRefId,
          serviceName,
          notes: ['hotel', 'apartment'].includes(type) 
            ? `[Type: ${accommodationType === 'hotel' ? 'Hotel' : 'Apartment'}] [Details: ${accommodationType === 'hotel' ? hotelDetails : apartmentArea}] [Budget: ${formattedBudget}] ${notes}` 
            : type === 'flight'
            ? `[From: ${flightFrom}] [To: ${flightTo}] [DateFrom: ${flightDateFrom}] [DateTo: ${flightDateTo}] ${notes}`
            : notes,
          passengers,
          price,
          source: bookingSource,
        }),
      });

      if (res.ok) {
        if (bookingSource === "whatsapp") {
          window.open(buildWhatsappUrl(whatsappNumber, message), "_blank", "noopener,noreferrer");
        }
        setBookingSuccess(true);
      }
    } catch {
      // fail silently or handle error
    } finally {
      setSaving(false);
    }
  }

  if (bookingSuccess) {
    return (
      <div className="luxury-panel bg-white p-8 space-y-6 text-center" dir={isEn ? "ltr" : "rtl"}>
        <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4 border border-green-200">
          <FiCheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-[#1a2b3c]">
          {isEn ? "Booking Confirmed!" : "تم تأكيد الحجز!"}
        </h2>
        <p className="text-sm font-bold text-[#1a2b3c]/70 leading-relaxed max-w-sm mx-auto">
          {isEn 
            ? "Your booking has been saved. Our team will contact you shortly to confirm details."
            : "تم تسجيل طلبك بنجاح في النظام. سيقوم فريق خدمة العملاء بالتواصل معك قريباً عبر رقم الهاتف المدخل لتأكيد التفاصيل."}
        </p>
        
        <div className="pt-4 border-t border-black/5 flex flex-col gap-2">
          {user ? (
            <Link 
              href={isEn ? "/my-bookings?lang=en" : "/my-bookings"}
              className="inline-block bg-[#1a2b3c] text-white px-6 py-3.5 rounded-xl text-xs font-black hover:bg-[#1a2b3c]/90 transition-colors"
            >
              {isEn ? "View My Bookings" : "عرض حجوزاتي في الموقع"}
            </Link>
          ) : (
            <Link 
              href={isEn ? "/login?lang=en" : "/login"}
              className="inline-block bg-[#d0a755] text-[#1a2b3c] px-6 py-3.5 rounded-xl text-xs font-black hover:bg-[#b89040] transition-colors"
            >
              {isEn ? "Log In to Track Booking" : "سجل دخولك لمتابعة الحجز"}
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              setBookingSuccess(false);
              setNotes("");
            }}
            className="text-xs font-bold text-[#1a2b3c]/50 hover:text-[#1a2b3c] transition-colors mt-2"
          >
            {isEn ? "Make another booking" : "إجراء حجز آخر"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submitBooking} className="luxury-panel bg-white p-6 md:p-8 space-y-6">
      <div className="flex flex-col gap-1 border-b border-black/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-[1px] bg-[#d0a755]"></span>
          <h2 className="text-2xl font-black text-[#1a2b3c]">{isEn ? "Confirm Booking" : "تأكيد الحجز"}</h2>
        </div>
        <p className="text-sm font-bold text-[#d0a755] mt-1 pr-11 rtl:pr-11 ltr:pl-11">
          {isEn ? "Service:" : "الخدمة:"} {serviceName}
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            required
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder={isEn ? "Full Name" : "الاسم كاملًا"}
            className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
          />
        </div>
        
        <div className="relative">
          <input
            required
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={isEn ? "Phone Number" : "رقم الهاتف للتواصل"}
            className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
          />
        </div>
        
        <div className="relative flex items-center justify-between rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-2 transition-all focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
          <span className="text-sm font-bold text-[#1a2b3c]/70 w-1/3">
            {isEn 
              ? (['hotel', 'apartment'].includes(type) ? 'Number of guests' : 'Number of passengers')
              : (['hotel', 'apartment'].includes(type) ? 'عدد الأفراد' : 'عدد الركاب')}
          </span>
          <input
            required
            type="number"
            min={1}
            value={passengers}
            onChange={(event) => setPassengers(Number(event.target.value))}
            className="w-2/3 bg-transparent py-1.5 text-left text-lg font-black text-[#1a2b3c] outline-none"
            dir="ltr"
          />
        </div>

        {['hotel', 'apartment'].includes(type) && (
          <div className="space-y-4 py-2">
            <div className="relative">
              <label className="block text-sm font-bold text-[#1a2b3c] mb-2">
                {isEn ? "Accommodation Type" : "نوع الإقامة"}
              </label>
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value as "hotel" | "apartment")}
                className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
              >
                <option value="hotel">{isEn ? "Hotels" : "فنادق"}</option>
                <option value="apartment">{isEn ? "Hotel Apartments" : "شقق فندقية"}</option>
              </select>
            </div>

            {accommodationType === "hotel" ? (
              <div className="relative">
                <input
                  value={hotelDetails}
                  onChange={(event) => {
                    setHotelDetails(event.target.value);
                    setShowHotelSuggestions(true);
                    setSelectedHotelIndex(-1);
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowHotelSuggestions(false), 200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setSelectedHotelIndex(prev => prev < hotelSuggestions.length - 1 ? prev + 1 : prev);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setSelectedHotelIndex(prev => prev > 0 ? prev - 1 : -1);
                    } else if (e.key === "Enter" && selectedHotelIndex >= 0) {
                      e.preventDefault();
                      const selected = hotelSuggestions[selectedHotelIndex];
                      setHotelDetails(selected.display_name);
                      setShowHotelSuggestions(false);
                    }
                  }}
                  placeholder={isEn ? "Governorate or Hotel Name (Optional)" : "المحافظة أو اسم الفندق (اختياري)"}
                  className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
                  autoComplete="off"
                />
                
                {showHotelSuggestions && (hotelSuggestions.length > 0 || isSearchingHotels) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                    {isSearchingHotels ? (
                      <div className="p-4 text-center text-sm text-[#1a2b3c]/50">
                        {isEn ? "Searching..." : "جاري البحث..."}
                      </div>
                    ) : (
                      <ul className="py-1">
                        {hotelSuggestions.map((suggestion, index) => (
                          <li 
                            key={suggestion.place_id}
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors ${selectedHotelIndex === index ? 'bg-[#d0a755]/10 text-[#d0a755]' : 'hover:bg-[#F9F8F6] text-[#1a2b3c]'}`}
                            onClick={() => {
                              setHotelDetails(suggestion.display_name);
                              setShowHotelSuggestions(false);
                            }}
                          >
                            <span className="font-bold block text-right rtl:text-right ltr:text-left">{suggestion.name || suggestion.display_name.split(',')[0]}</span>
                            <span className="text-xs opacity-70 truncate block text-right rtl:text-right ltr:text-left">{suggestion.display_name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <input
                  value={apartmentArea}
                  onChange={(event) => setApartmentArea(event.target.value)}
                  placeholder={isEn ? "Area (Optional)" : "المنطقة (اختياري)"}
                  className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
                />
              </div>
            )}

            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-bold text-[#1a2b3c]">
                  {isEn ? "Budget per night" : "الميزانية لليلة الواحدة"}
                </p>
                <p className="text-[#d0a755] font-black text-sm dir-ltr">
                  {currency !== "EGP" ? (budget / exchangeRate).toFixed(2) + ` ${currency}` : budget + " EGP"}
                </p>
              </div>
              <input 
                type="range" 
                min={500} 
                max={20000} 
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#d0a755] h-1 bg-black/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {type === 'flight' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-bold text-[#1a2b3c]/70 mb-1">
                {isEn ? "From" : "الواجهة من"}
              </label>
              <input
                required
                value={flightFrom}
                onChange={(event) => setFlightFrom(event.target.value)}
                placeholder={isEn ? "Departure City/Airport" : "مدينة/مطار المغادرة"}
                className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-bold text-[#1a2b3c]/70 mb-1">
                {isEn ? "To" : "الواجهة إلي"}
              </label>
              <input
                required
                value={flightTo}
                onChange={(event) => setFlightTo(event.target.value)}
                placeholder={isEn ? "Destination City/Airport" : "مدينة/مطار الوصول"}
                className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-bold text-[#1a2b3c]/70 mb-1">
                {isEn ? "Date From" : "التاريخ من"}
              </label>
              <input
                required
                type="date"
                value={flightDateFrom}
                onChange={(event) => setFlightDateFrom(event.target.value)}
                className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-bold text-[#1a2b3c]/70 mb-1">
                {isEn ? "Date To" : "التاريخ إلي"}
              </label>
              <input
                required
                type="date"
                value={flightDateTo}
                onChange={(event) => setFlightDateTo(event.target.value)}
                className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
              />
            </div>
          </div>
        )}
        
        <div className="relative">
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={
              isEn ? (
                type === 'hotel' 
                  ? "Additional notes (destination city, preferred hotels...)" 
                  : type === 'flight'
                  ? "Additional notes (round trip destination, flight class, special requests...)"
                  : type === 'apartment'
                  ? "Additional notes (destination city, number of rooms...)"
                  : "Additional notes (stops, special requests...)"
              ) : (
                type === 'hotel' 
                  ? "ملاحظات إضافية (المدينة المطلوبة، فنادق مفضلة...)" 
                  : type === 'flight'
                  ? "ملاحظات إضافية (الوجهة ذهاب وعودة، درجة الطيران، طلبات خاصة...)"
                  : type === 'apartment'
                  ? "ملاحظات إضافية (المدينة المطلوبة، عدد الغرف...)"
                  : "ملاحظات إضافية (أماكن التوقف، طلبات خاصة...)"
              )
            }
            rows={3}
            className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755] resize-none"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mt-6">
        {/* Book via Web */}
        <button
          type="submit"
          onClick={() => setBookingSource("web")}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a2b3c] px-6 py-4 text-sm font-black tracking-wide text-[#d0a755] shadow-[0_10px_20px_rgba(26,43,60,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a2b3c]/90 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {saving && bookingSource === "web" ? (isEn ? "Submitting..." : "جاري الإرسال...") : (isEn ? "Book Directly on Website" : "تأكيد الحجز عبر الموقع")}
        </button>

        {/* Book via WhatsApp */}
        <button
          type="submit"
          onClick={() => setBookingSource("whatsapp")}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#25d366]/40 hover:border-[#25d366] bg-[#25d366]/5 hover:bg-[#25d366] text-[#25d366] hover:text-white px-6 py-3.5 text-sm font-black tracking-wide transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          <FaWhatsapp className="w-4 h-4 shrink-0" />
          {saving && bookingSource === "whatsapp" ? (isEn ? "Redirecting..." : "جاري التوجيه...") : (isEn ? "Confirm via WhatsApp" : "تأكيد ومتابعة عبر واتساب")}
        </button>
      </div>

      {!user && (
        <div className="text-center mt-4 pt-4 border-t border-black/5">
          <p className="text-xs font-bold text-[#1a2b3c]/50">
            {isEn ? (
              <>
                💡 Tip:{" "}
                <Link href="/login?lang=en" className="text-[#d0a755] underline hover:text-[#b89040]">
                  Log in
                </Link>{" "}
                or{" "}
                <Link href="/register?lang=en" className="text-[#d0a755] underline hover:text-[#b89040]">
                  register
                </Link>{" "}
                to track and cancel your bookings.
              </>
            ) : (
              <>
                💡 نصيحة:{" "}
                <Link href="/login" className="text-[#d0a755] underline hover:text-[#b89040]">
                  سجل دخولك
                </Link>{" "}
                أو{" "}
                <Link href="/register" className="text-[#d0a755] underline hover:text-[#b89040]">
                  أنشئ حساباً جديداً
                </Link>{" "}
                لتتمكن من تتبع حالة حجوزاتك وإلغائها لاحقاً.
              </>
            )}
          </p>
        </div>
      )}
    </form>
  );
}
