"use client";

import { FormEvent, useMemo, useState, useEffect, useRef } from "react";
import type { ServiceType } from "@/lib/types";
import { bookingMessage, buildWhatsappUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { 
  FiCheckCircle, 
  FiCalendar, 
  FiUsers, 
  FiMapPin, 
  FiBriefcase, 
  FiGlobe, 
  FiUser, 
  FiRepeat, 
  FiArrowRight, 
  FiClock, 
  FiNavigation, 
  FiPhone,
  FiImage,
  FiX
} from "react-icons/fi";
import { LocationSearchModal } from "./LocationSearchModal";
import { NationalitySearchModal } from "./NationalitySearchModal";

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
  // Common Contact Info
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [passengers, setPassengers] = useState<any>(1);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookingSource, setBookingSource] = useState<"web" | "whatsapp">("web");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // 1. Limousine (car) specific state
  const [carDate, setCarDate] = useState("");
  const [carTime, setCarTime] = useState("");
  const [carLuggage, setCarLuggage] = useState<any>(0);
  const [carServiceType, setCarServiceType] = useState<"trip" | "daily">("trip");
  const [carFrom, setCarFrom] = useState("");
  const [carTo, setCarTo] = useState("");
  const [carResidence, setCarResidence] = useState("");

  // 2. Fast Track specific state
  const [nationality, setNationality] = useState("");
  const [nationalityModalOpen, setNationalityModalOpen] = useState(false);
  const [isCustomNationality, setIsCustomNationality] = useState(false);
  const [fastTrackDate, setFastTrackDate] = useState("");
  const [fastTrackTime, setFastTrackTime] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const [passengerNames, setPassengerNames] = useState<string[]>([""]);

  // 3. Hotels & Hotel Apartments specific state
  const [accommodationType, setAccommodationType] = useState<"hotel" | "apartment">(type === "apartment" ? "apartment" : "hotel");
  const [hotelDetails, setHotelDetails] = useState("");
  const [apartmentArea, setApartmentArea] = useState("");
  const [hotelDateFrom, setHotelDateFrom] = useState("");
  const [hotelDateTo, setHotelDateTo] = useState("");
  const [budget, setBudget] = useState(5000);

  // Sync accommodationType if the parent type prop changes
  useEffect(() => {
    if (type === "apartment" || type === "hotel") {
      setAccommodationType(type);
    }
  }, [type]);

  // 4. Flights specific state
  const [flightTripType, setFlightTripType] = useState<"round_trip" | "one_way">("round_trip");
  const [flightFrom, setFlightFrom] = useState("");
  const [flightTo, setFlightTo] = useState("");
  const [flightDateFrom, setFlightDateFrom] = useState("");
  const [flightDateTo, setFlightDateTo] = useState("");

  // Modal selector state
  const [activeModal, setActiveModal] = useState<"hotel" | "flightFrom" | "flightTo" | "carFrom" | "carTo" | "carResidence" | null>(null);

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
      if (!customerName) setCustomerName(user.name);
      if (!phone) setPhone(user.phone);
      setPassengerNames((prev) => {
        const next = [...prev];
        if (!next[0]) next[0] = user.name;
        return next;
      });
    }
  }, [user]);

  // Adjust passengerNames array length dynamically when passengers count changes
  useEffect(() => {
    setPassengerNames((prev) => {
      const updated = Array.from({ length: passengers }, (_, i) => prev[i] || (i === 0 && customerName ? customerName : ""));
      return updated;
    });
  }, [passengers]);

  // Calculate dynamic display price (especially for Fast Track per-person pricing)
  const calculatedPrice = useMemo(() => {
    if (!price) return undefined;
    if (type === "fast_track") {
      return price * passengers;
    }
    return price;
  }, [price, type, passengers]);

  // Determine the effective date string for the booking record
  const bookingEffectiveDate = useMemo(() => {
    if (type === "car") return carTime ? `${carDate} (${carTime})` : carDate;
    if (type === "fast_track") return fastTrackTime ? `${fastTrackDate} (${fastTrackTime})` : fastTrackDate;
    if (["hotel", "apartment"].includes(type)) {
      if (hotelDateFrom && hotelDateTo) return `${hotelDateFrom} ${isEn ? "to" : "إلى"} ${hotelDateTo}`;
      return hotelDateFrom || hotelDateTo || "";
    }
    if (type === "flight") {
      if (flightTripType === "round_trip" && flightDateTo) {
        return `${flightDateFrom} ${isEn ? "to" : "إلى"} ${flightDateTo}`;
      }
      return flightDateFrom || "";
    }
    return "";
  }, [type, carDate, carTime, fastTrackDate, fastTrackTime, hotelDateFrom, hotelDateTo, flightTripType, flightDateFrom, flightDateTo, isEn]);

  // Dynamic effective type & service name calculation based on actual user selection
  const effectiveType = useMemo(() => {
    if (["hotel", "apartment"].includes(type)) {
      return accommodationType;
    }
    return type;
  }, [type, accommodationType]);

  const effectiveServiceName = useMemo(() => {
    if (["hotel", "apartment"].includes(type)) {
      if (accommodationType === "hotel") {
        if (hotelDetails && hotelDetails.trim() && hotelDetails.trim() !== "غير محدد") {
          return hotelDetails.trim();
        }
        return isEn ? "Hotel Booking Request" : "طلب حجز فندق";
      } else {
        if (apartmentArea && apartmentArea.trim() && apartmentArea.trim() !== "غير محدد") {
          return isEn ? `Hotel Apartment (${apartmentArea.trim()})` : `شقة فندقية (${apartmentArea.trim()})`;
        }
        return isEn ? "Hotel Apartments Request" : "طلب حجز شقق فندقية";
      }
    }
    if (type === "flight") {
      if (flightFrom && flightTo) {
        return isEn ? `Flight: ${flightFrom} to ${flightTo}` : `طيران: من ${flightFrom} إلى ${flightTo}`;
      }
    }
    return serviceName;
  }, [type, accommodationType, hotelDetails, apartmentArea, flightFrom, flightTo, serviceName, isEn]);

  const message = useMemo(() => {
    let detailsList: string[] = [];

    if (type === "car") {
      const serviceTypeStr = carServiceType === "trip"
        ? (isEn ? "Transfer (Trip)" : "توصيلة")
        : (isEn ? "Daily Rental Service" : "خدمة يومية");
      
      detailsList.push(isEn ? `• Service Type: ${serviceTypeStr}` : `• نوع الخدمة: ${serviceTypeStr}`);
      if (carDate) detailsList.push(isEn ? `• Date: ${carDate}` : `• تاريخ الرحلة: ${carDate}`);
      if (carTime) detailsList.push(isEn ? `• Time: ${carTime}` : `• وقت الرحلة: ${carTime}`);
      
      if (carServiceType === "trip") {
        if (carFrom) detailsList.push(isEn ? `• Pickup From: ${carFrom}` : `• الانطلاق من: ${carFrom}`);
        if (carTo) detailsList.push(isEn ? `• Destination To: ${carTo}` : `• الوصول إلى: ${carTo}`);
      } else {
        if (carResidence) detailsList.push(isEn ? `• Residence / Accommodation: ${carResidence}` : `• مكان السكن / الإقامة: ${carResidence}`);
      }
      
      detailsList.push(isEn ? `• Luggage Count: ${carLuggage}` : `• عدد الحقائب: ${carLuggage}`);
      detailsList.push(isEn ? `• Passengers: ${passengers}` : `• عدد الركاب: ${passengers}`);
    } else if (type === "fast_track") {
      if (nationality) detailsList.push(isEn ? `• Nationality: ${nationality}` : `• الجنسية: ${nationality}`);
      if (fastTrackDate) detailsList.push(isEn ? `• Date: ${fastTrackDate}` : `• تاريخ الخدمة: ${fastTrackDate}`);
      if (fastTrackTime) detailsList.push(isEn ? `• Time: ${fastTrackTime}` : `• وقت الخدمة: ${fastTrackTime}`);
      detailsList.push(isEn ? `• Number of Travelers: ${passengers}` : `• عدد الأفراد: ${passengers}`);
      
      const filledNames = passengerNames.filter((n) => n.trim().length > 0);
      if (filledNames.length > 0) {
        const namesFormatted = filledNames.map((n, i) => `  ${i + 1}. ${n}`).join("\n");
        detailsList.push(isEn ? `• Passenger Names:\n${namesFormatted}` : `• أسماء المسافرين:\n${namesFormatted}`);
      }
    } else if (["hotel", "apartment"].includes(type)) {
      const formattedBudget = currency !== "EGP" ? (budget / exchangeRate).toFixed(2) + ` ${currency}` : budget + " EGP";
      const accDetails = accommodationType === "hotel" 
        ? (isEn ? `Accommodation: Hotel\nGovernorate/Hotel: ${hotelDetails || (isEn ? "Not specified" : "غير محدد")}` : `الإقامة: فنادق\nالمحافظة أو اسم الفندق: ${hotelDetails || "غير محدد"}`)
        : (isEn ? `Accommodation: Hotel Apartment\nArea: ${apartmentArea || (isEn ? "Not specified" : "غير محدد")}` : `الإقامة: شقق فندقية\nالمنطقة: ${apartmentArea || "غير محدد"}`);
      
      detailsList.push(accDetails);
      if (nationality) detailsList.push(isEn ? `• Nationality: ${nationality}` : `• الجنسية: ${nationality}`);
      if (hotelDateFrom) detailsList.push(isEn ? `• Check-in Date: ${hotelDateFrom}` : `• تاريخ الوصول: ${hotelDateFrom}`);
      if (hotelDateTo) detailsList.push(isEn ? `• Check-out Date: ${hotelDateTo}` : `• تاريخ المغادرة: ${hotelDateTo}`);
      detailsList.push(isEn ? `• Number of Guests: ${passengers}` : `• عدد الأفراد: ${passengers}`);
      detailsList.push(isEn ? `• Budget per night: ${formattedBudget}` : `• الميزانية المتوقعة لليلة: ${formattedBudget}`);
    } else if (type === "flight") {
      const tripTypeStr = flightTripType === "round_trip"
        ? (isEn ? "Round Trip" : "ذهاب وعودة")
        : (isEn ? "One Way" : "رحلة واحدة (ذهاب فقط)");
      
      detailsList.push(isEn ? `• Flight Type: ${tripTypeStr}` : `• نوع الرحلة: ${tripTypeStr}`);
      if (flightFrom) detailsList.push(isEn ? `• From: ${flightFrom}` : `• من: ${flightFrom}`);
      if (flightTo) detailsList.push(isEn ? `• To: ${flightTo}` : `• إلى: ${flightTo}`);
      if (flightDateFrom) detailsList.push(isEn ? `• Departure Date: ${flightDateFrom}` : `• تاريخ الذهاب: ${flightDateFrom}`);
      if (flightTripType === "round_trip" && flightDateTo) {
        detailsList.push(isEn ? `• Return Date: ${flightDateTo}` : `• تاريخ العودة: ${flightDateTo}`);
      }
      detailsList.push(isEn ? `• Number of Passengers: ${passengers}` : `• عدد المسافرين: ${passengers}`);
    }

    let finalNotes = detailsList.join("\n");
    if (notes.trim()) {
      finalNotes += isEn ? `\n\nAdditional Notes:\n${notes}` : `\n\nملاحظات إضافية:\n${notes}`;
    }

    return bookingMessage({
      serviceName: effectiveServiceName,
      customerName: type === "fast_track" && passengerNames[0] ? passengerNames[0] : customerName,
      phone,
      passengers,
      date: bookingEffectiveDate,
      notes: finalNotes,
    }, isEn ? "en" : "ar");
  }, [
    type,
    serviceName,
    effectiveServiceName,
    customerName,
    phone,
    passengers,
    notes,
    budget,
    isEn,
    currency,
    exchangeRate,
    carDate,
    carLuggage,
    carServiceType,
    carFrom,
    carTo,
    carResidence,
    nationality,
    fastTrackDate,
    passengerNames,
    accommodationType,
    hotelDetails,
    apartmentArea,
    hotelDateFrom,
    hotelDateTo,
    flightTripType,
    flightFrom,
    flightTo,
    flightDateFrom,
    flightDateTo,
    bookingEffectiveDate
  ]);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      let uploadedAttachmentUrl = "";
      if (attachmentFile) {
        try {
          const formData = new FormData();
          formData.append("file", attachmentFile);
          const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
          if (uploadRes.ok) {
            const data = await uploadRes.json();
            uploadedAttachmentUrl = data.url;
          }
        } catch (err) {
          console.error("Upload failed", err);
        }
      }
      const formattedBudget = currency !== "EGP" ? (budget / exchangeRate).toFixed(2) + ` ${currency}` : budget + " EGP";
      
      // Build structured notes for admin and internal records
      let structuredNotes = "";
      if (type === "car") {
        structuredNotes = `[نوع الخدمة: ${carServiceType === "trip" ? "توصيلة" : "يومية"}] [تاريخ الرحلة: ${carDate}] [عدد الحقائب: ${carLuggage}] ${
          carServiceType === "trip" ? `[من: ${carFrom}] [إلى: ${carTo}]` : `[مكان السكن: ${carResidence}]`
        } ${notes ? `[ملاحظات: ${notes}]` : ""}`;
      } else if (type === "fast_track") {
        const namesStr = passengerNames.filter((n) => n.trim().length > 0).join(" | ");
        structuredNotes = `[الجنسية: ${nationality}] [تاريخ الخدمة: ${fastTrackDate}] ${fastTrackTime ? `[الوقت: ${fastTrackTime}]` : ""} [أسماء المسافرين: ${namesStr}] ${notes ? `[ملاحظات: ${notes}]` : ""} ${uploadedAttachmentUrl ? `[المرفقات: ${uploadedAttachmentUrl}]` : ""}`;
      } else if (["hotel", "apartment"].includes(type)) {
        structuredNotes = `[النوع: ${accommodationType === "hotel" ? "فندق" : "شقة فندقية"}] [المكان: ${
          accommodationType === "hotel" ? (hotelDetails || "غير محدد") : (apartmentArea || "غير محدد")
        }] [الجنسية: ${nationality || "غير محدد"}] [تاريخ الوصول: ${hotelDateFrom}] [تاريخ المغادرة: ${hotelDateTo}] [الميزانية: ${formattedBudget}] ${notes ? `[ملاحظات: ${notes}]` : ""}`;
      } else if (type === "flight") {
        structuredNotes = `[نوع الرحلة: ${flightTripType === "round_trip" ? "ذهاب وعودة" : "ذهاب فقط"}] [من: ${flightFrom}] [إلى: ${flightTo}] [تاريخ الذهاب: ${flightDateFrom}] ${
          flightTripType === "round_trip" ? `[تاريخ العودة: ${flightDateTo}] ` : ""
        }${notes ? `[ملاحظات: ${notes}]` : ""}`;
      } else {
        structuredNotes = notes;
      }

      const effectiveCustomerName = (type === "fast_track" && passengerNames[0]?.trim()) ? passengerNames[0].trim() : customerName;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: effectiveType,
          customerName: effectiveCustomerName,
          phone,
          serviceRefId,
          serviceName: effectiveServiceName,
          date: bookingEffectiveDate,
          notes: structuredNotes.trim(),
          passengers,
          price: calculatedPrice,
          source: bookingSource,
        }),
      });

      if (res.ok) {
        if (bookingSource === "whatsapp") {
          window.open(buildWhatsappUrl(whatsappNumber, message), "_blank", "noopener,noreferrer");
        }
        setBookingSuccess(true);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setSaving(false);
    }
  }

  const resetForm = () => {
    setBookingSuccess(false);
    setNotes("");
    setPassengers(1);
    setCarDate("");
    setCarLuggage(0);
    setCarServiceType("trip");
    setCarFrom("");
    setCarTo("");
    setCarResidence("");
    setNationality("");
    setFastTrackDate("");
    setFastTrackTime("");
    setAttachmentFile(null);
    setAccommodationType(type === "apartment" ? "apartment" : "hotel");
    setHotelDetails("");
    setApartmentArea("");
    setHotelDateFrom("");
    setHotelDateTo("");
    setBudget(5000);
    setFlightTripType("round_trip");
    setFlightFrom("");
    setFlightTo("");
    setFlightDateFrom("");
    setFlightDateTo("");
    if (user) {
      setCustomerName(user.name);
      setPhone(user.phone);
      setPassengerNames([user.name]);
    } else {
      setCustomerName("");
      setPhone("");
      setPassengerNames([""]);
    }
  };

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
            onClick={resetForm}
            className="text-xs font-bold text-[#1a2b3c]/50 hover:text-[#1a2b3c] transition-colors mt-2 cursor-pointer"
          >
            {isEn ? "Make another booking" : "إجراء حجز آخر"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={submitBooking} className="luxury-panel bg-white p-6 md:p-8 space-y-6" dir={isEn ? "ltr" : "rtl"}>
      <div className="flex flex-col gap-1 border-b border-black/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-[1px] bg-[#d0a755]"></span>
          <h2 className="text-2xl font-black text-[#1a2b3c]">{isEn ? "Confirm Booking" : "تأكيد الحجز"}</h2>
        </div>
        <p className="text-sm font-bold text-[#d0a755] mt-1 pr-11 rtl:pr-11 ltr:pl-11">
          {isEn ? "Service:" : "الخدمة:"} {effectiveServiceName}
        </p>
      </div>
      
      <div className="space-y-4">
        {/* ========================================================================= */}
        {/* 1. LIMOUSINE CAR FIELDS */}
        {/* ========================================================================= */}
        {type === "car" && (
          <div className="space-y-4">
            {/* Service Type Selection: Transfer vs Daily */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1a2b3c]/70">
                {isEn ? "Service Type" : "نوع الخدمة المطلوبة"}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F4F3EF] rounded-2xl border border-black/5">
                <button
                  type="button"
                  onClick={() => setCarServiceType("trip")}
                  className={`py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    carServiceType === "trip"
                      ? "bg-[#1a2b3c] text-[#d0a755] shadow-md border border-[#d0a755]/20"
                      : "bg-white/60 text-[#1a2b3c]/70 hover:bg-white hover:text-[#1a2b3c]"
                  }`}
                >
                  <FiNavigation className={`w-4 h-4 shrink-0 ${carServiceType === "trip" ? "text-[#d0a755]" : "text-[#1a2b3c]/50"}`} />
                  <span>{isEn ? "Transfer (Trip)" : "توصيلة"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCarServiceType("daily")}
                  className={`py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    carServiceType === "daily"
                      ? "bg-[#1a2b3c] text-[#d0a755] shadow-md border border-[#d0a755]/20"
                      : "bg-white/60 text-[#1a2b3c]/70 hover:bg-white hover:text-[#1a2b3c]"
                  }`}
                >
                  <FiClock className={`w-4 h-4 shrink-0 ${carServiceType === "daily" ? "text-[#d0a755]" : "text-[#1a2b3c]/50"}`} />
                  <span>{isEn ? "Daily Rental" : "خدمة يومية"}</span>
                </button>
              </div>
            </div>

            {/* If Transfer: From & To */}
            {carServiceType === "trip" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                    {isEn ? "Pickup Location (From)" : "مكان الانطلاق (من)"}
                  </label>
                  <div 
                    onClick={() => setActiveModal("carFrom")}
                    className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 cursor-pointer hover:border-[#d0a755] hover:bg-white transition-all"
                  >
                    <FiMapPin className="w-4 h-4 text-[#d0a755] shrink-0" />
                    <span className={`text-sm font-medium truncate ${carFrom ? "text-[#1a2b3c]" : "text-[#1a2b3c]/40"}`}>
                      {carFrom || (isEn ? "Select pickup location..." : "حدد مكان الانطلاق...")}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                    {isEn ? "Destination (To)" : "مكان الوصول (إلى)"}
                  </label>
                  <div 
                    onClick={() => setActiveModal("carTo")}
                    className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 cursor-pointer hover:border-[#d0a755] hover:bg-white transition-all"
                  >
                    <FiMapPin className="w-4 h-4 text-[#d0a755] shrink-0" />
                    <span className={`text-sm font-medium truncate ${carTo ? "text-[#1a2b3c]" : "text-[#1a2b3c]/40"}`}>
                      {carTo || (isEn ? "Select destination..." : "حدد مكان الوصول...")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* If Daily: Residence Location */
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Accommodation / Residence Location" : "مكان السكن / الإقامة"}
                </label>
                <div 
                  onClick={() => setActiveModal("carResidence")}
                  className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 cursor-pointer hover:border-[#d0a755] hover:bg-white transition-all"
                >
                  <FiMapPin className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <span className={`text-sm font-medium truncate ${carResidence ? "text-[#1a2b3c]" : "text-[#1a2b3c]/40"}`}>
                    {carResidence || (isEn ? "Select hotel or residence location..." : "حدد مكان السكن أو الفندق...")}
                  </span>
                </div>
              </div>
            )}

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Trip Date" : "تاريخ الرحلة"}
                </label>
                <div className="relative flex items-center gap-2 rounded-xl border border-black/10 bg-[#F9F8F6] px-3 py-2.5 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiCalendar className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    required
                    type="date"
                    value={carDate}
                    onChange={(e) => setCarDate(e.target.value)}
                    dir="ltr"
                    className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] outline-none text-right rtl:text-right [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Trip Time" : "وقت الرحلة"}
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-[#F9F8F6] px-3 py-2.5 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiClock className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    required
                    type="time"
                    value={carTime}
                    onChange={(e) => setCarTime(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Passengers & Luggage Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Passengers" : "عدد الركاب"}
                </label>
                <div className="flex items-center rounded-xl border border-black/10 bg-[#F9F8F6] px-3 py-2.5 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiUsers className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    required
                    type="number"
                    min={1}
                    value={passengers}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPassengers(val === "" ? "" : parseInt(val, 10));
                    }}
                    onBlur={() => {
                      if (passengers === "" || passengers < 1) setPassengers(1);
                    }}
                    className="w-full bg-transparent px-2 text-sm font-black text-[#1a2b3c] outline-none text-left rtl:text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Luggage / Bags" : "عدد الحقائب"}
                </label>
                <div className="flex items-center rounded-xl border border-black/10 bg-[#F9F8F6] px-3 py-2.5 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiBriefcase className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    required
                    type="number"
                    min={0}
                    value={carLuggage}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCarLuggage(val === "" ? "" : parseInt(val, 10));
                    }}
                    onBlur={() => {
                      if (carLuggage === "" || carLuggage < 0) setCarLuggage(0);
                    }}
                    className="w-full bg-transparent px-2 text-sm font-black text-[#1a2b3c] outline-none text-left rtl:text-right"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. FAST TRACK VIP FIELDS */}
        {/* ========================================================================= */}
        {type === "fast_track" && (
          <div className="space-y-4">
            {/* Service Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Service Date" : "تاريخ الخدمة"}
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiCalendar className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    required
                    type="date"
                    value={fastTrackDate}
                    onChange={(e) => setFastTrackDate(e.target.value)}
                    dir="ltr"
                    className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] outline-none text-right rtl:text-right [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Service Time (Optional)" : "وقت الخدمة (اختياري)"}
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiClock className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    type="time"
                    value={fastTrackTime}
                    onChange={(e) => setFastTrackTime(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                {isEn ? "Passport / Ticket (Optional)" : "صورة الجواز / التذكرة (اختياري)"}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-2.5 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiImage className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                    className="w-full bg-transparent text-xs font-medium text-[#1a2b3c] outline-none file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-[#d0a755]/10 file:text-[#d0a755] hover:file:bg-[#d0a755]/20 cursor-pointer ltr:file:mr-2 rtl:file:ml-2"
                  />
                  {attachmentFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setAttachmentFile(null);
                        if (attachmentInputRef.current) {
                          attachmentInputRef.current.value = "";
                        }
                      }}
                      className="shrink-0 p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title={isEn ? "Remove file" : "إزالة الملف"}
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>


            {/* Number of Passengers */}
            <div className="relative flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3 transition-all focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
              <span className="text-sm font-bold text-[#1a2b3c]/70 whitespace-nowrap shrink-0 flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-[#d0a755]" />
                {isEn ? "Number of travelers" : "عدد الأفراد / المسافرين"}
              </span>
              <input
                required
                type="number"
                min={1}
                max={25}
                value={passengers}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassengers(val === "" ? "" : parseInt(val, 10));
                }}
                onBlur={() => {
                  if (passengers === "" || passengers < 1) setPassengers(1);
                }}
                className="w-24 bg-transparent text-left ltr:text-right rtl:text-left text-base font-black text-[#1a2b3c] outline-none"
                dir="ltr"
              />
            </div>

            {/* Dynamic Names for Passengers */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-[#1a2b3c] uppercase tracking-wider">
                  {isEn ? `Traveler Names (${passengers} persons)` : `أسماء المسافرين (${passengers} أفراد)`}
                </label>
                <span className="text-[11px] font-bold text-[#d0a755]">
                  {isEn ? "Required for airport permits" : "مطلوبة لتصاريح المطار"}
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {Array.from({ length: passengers }).map((_, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-2.5 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755] transition-all">
                      <span className="w-6 h-6 rounded-full bg-[#1a2b3c] text-[#d0a755] text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
                        {index + 1}
                      </span>
                      <input
                        required
                        type="text"
                        value={passengerNames[index] || ""}
                        onChange={(e) => {
                          const updated = [...passengerNames];
                          updated[index] = e.target.value;
                          setPassengerNames(updated);
                          if (index === 0) {
                            setCustomerName(e.target.value);
                          }
                        }}
                        placeholder={
                          isEn
                            ? (index === 0 ? "Traveler 1 (Primary contact full name)" : `Traveler ${index + 1} full name`)
                            : (index === 0 ? "المسافر 1 (الاسم الأساسي للتواصل)" : `اسم المسافر ${index + 1} بالكامل`)
                        }
                        className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. HOTELS & HOTEL APARTMENTS FIELDS */}
        {/* ========================================================================= */}
        {["hotel", "apartment"].includes(type) && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                {isEn ? "Accommodation Type" : "نوع الإقامة"}
              </label>
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value as "hotel" | "apartment")}
                className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3 text-sm font-medium text-[#1a2b3c] outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755] cursor-pointer"
              >
                <option value="hotel">{isEn ? "Hotels" : "فنادق"}</option>
                <option value="apartment">{isEn ? "Hotel Apartments" : "شقق فندقية"}</option>
              </select>
            </div>

            {accommodationType === "hotel" ? (
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Hotel or Governorate" : "المحافظة أو اسم الفندق المطلوب"}
                </label>
                <div 
                  onClick={() => setActiveModal("hotel")}
                  className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 cursor-pointer hover:border-[#d0a755] hover:bg-white transition-all"
                >
                  <FiMapPin className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <span className={`text-sm font-medium truncate ${hotelDetails ? "text-[#1a2b3c]" : "text-[#1a2b3c]/40"}`}>
                    {hotelDetails || (isEn ? "Select hotel or city (Optional)" : "اختر الفندق أو المحافظة (اختياري)")}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Preferred Area" : "المنطقة المفضلة"}
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 transition-all focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiMapPin className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    value={apartmentArea}
                    onChange={(event) => setApartmentArea(event.target.value)}
                    placeholder={isEn ? "e.g. New Cairo, Dokki, Zamalek..." : "مثال: التجمع الخامس، الدقي، الزمالك..."}
                    className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Check-in Date & Check-out Date (التاريخ من وإلى) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Check-in Date (From)" : "تاريخ الوصول (من)"}
                </label>
                <div className="relative flex items-center gap-2 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiCalendar className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    required
                    type="date"
                    value={hotelDateFrom}
                    onChange={(e) => setHotelDateFrom(e.target.value)}
                    dir="ltr"
                    className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] outline-none text-right rtl:text-right [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Check-out Date (To)" : "تاريخ المغادرة (إلى)"}
                </label>
                <div className="relative flex items-center gap-2 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiCalendar className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    required
                    type="date"
                    value={hotelDateTo}
                    onChange={(e) => setHotelDateTo(e.target.value)}
                    dir="ltr"
                    className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] outline-none text-right rtl:text-right [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Guests Count */}
            <div className="relative flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3 transition-all focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
              <span className="text-sm font-bold text-[#1a2b3c]/70 whitespace-nowrap shrink-0 flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-[#d0a755]" />
                {isEn ? "Number of guests" : "عدد النزلاء / الأفراد"}
              </span>
              <input
                required
                type="number"
                min={1}
                value={passengers}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassengers(val === "" ? "" : parseInt(val, 10));
                }}
                onBlur={() => {
                  if (passengers === "" || passengers < 1) setPassengers(1);
                }}
                className="w-24 bg-transparent text-left ltr:text-right rtl:text-left text-base font-black text-[#1a2b3c] outline-none"
                dir="ltr"
              />
            </div>

            {/* Budget Range */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs font-bold text-[#1a2b3c]/70">
                  {isEn ? "Budget per night" : "الميزانية المتوقعة لليلة الواحدة"}
                </p>
                <p className="text-[#d0a755] font-black text-sm dir-ltr">
                  {currency !== "EGP" ? (budget / exchangeRate).toFixed(2) + ` ${currency}` : budget + " EGP"}
                </p>
              </div>
              <input 
                type="range" 
                min={500} 
                max={250000} 
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#d0a755] h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. FLIGHTS FIELDS */}
        {/* ========================================================================= */}
        {type === "flight" && (
          <div className="space-y-4">
            {/* Flight Type: One-way vs Round-trip */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1a2b3c]/70">
                {isEn ? "Flight Type" : "نوع الرحلة"}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F4F3EF] rounded-2xl border border-black/5">
                <button
                  type="button"
                  onClick={() => setFlightTripType("round_trip")}
                  className={`py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    flightTripType === "round_trip"
                      ? "bg-[#1a2b3c] text-[#d0a755] shadow-md border border-[#d0a755]/20"
                      : "bg-white/60 text-[#1a2b3c]/70 hover:bg-white hover:text-[#1a2b3c]"
                  }`}
                >
                  <FiRepeat className={`w-4 h-4 shrink-0 ${flightTripType === "round_trip" ? "text-[#d0a755]" : "text-[#1a2b3c]/50"}`} />
                  <span>{isEn ? "Round Trip" : "ذهاب وعودة"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFlightTripType("one_way")}
                  className={`py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    flightTripType === "one_way"
                      ? "bg-[#1a2b3c] text-[#d0a755] shadow-md border border-[#d0a755]/20"
                      : "bg-white/60 text-[#1a2b3c]/70 hover:bg-white hover:text-[#1a2b3c]"
                  }`}
                >
                  <FiArrowRight className={`w-4 h-4 shrink-0 ${isEn ? "" : "rotate-180"} ${flightTripType === "one_way" ? "text-[#d0a755]" : "text-[#1a2b3c]/50"}`} />
                  <span>{isEn ? "One Way" : "رحلة واحدة (ذهاب فقط)"}</span>
                </button>
              </div>
            </div>

            {/* Departure & Destination Airports */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Departure (From)" : "الواجهة من"}
                </label>
                <div 
                  onClick={() => setActiveModal("flightFrom")}
                  className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 cursor-pointer hover:border-[#d0a755] hover:bg-white transition-all"
                >
                  <FiNavigation className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <span className={`text-sm font-medium truncate ${flightFrom ? "text-[#1a2b3c]" : "text-[#1a2b3c]/40"}`}>
                    {flightFrom || (isEn ? "Select departure airport..." : "مدينة/مطار المغادرة...")}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Destination (To)" : "الواجهة إلي"}
                </label>
                <div 
                  onClick={() => setActiveModal("flightTo")}
                  className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 cursor-pointer hover:border-[#d0a755] hover:bg-white transition-all"
                >
                  <FiMapPin className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <span className={`text-sm font-medium truncate ${flightTo ? "text-[#1a2b3c]" : "text-[#1a2b3c]/40"}`}>
                    {flightTo || (isEn ? "Select destination airport..." : "مدينة/مطار الوصول...")}
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Dates */}
            {flightTripType === "round_trip" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                    {isEn ? "Departure Date" : "تاريخ الذهاب"}
                  </label>
                  <div className="relative flex items-center gap-2 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                    <FiCalendar className="w-4 h-4 text-[#d0a755] shrink-0" />
                    <input
                      required
                      type="date"
                      value={flightDateFrom}
                      onChange={(event) => setFlightDateFrom(event.target.value)}
                      dir="ltr"
                      className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] outline-none text-right rtl:text-right [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                    {isEn ? "Return Date" : "تاريخ العودة"}
                  </label>
                  <div className="relative flex items-center gap-2 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                    <FiCalendar className="w-4 h-4 text-[#d0a755] shrink-0" />
                    <input
                      required
                      type="date"
                      value={flightDateTo}
                      onChange={(event) => setFlightDateTo(event.target.value)}
                      dir="ltr"
                      className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] outline-none text-right rtl:text-right [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                  {isEn ? "Flight Date" : "تاريخ السفر"}
                </label>
                <div className="relative flex items-center gap-2 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                  <FiCalendar className="w-4 h-4 text-[#d0a755] shrink-0" />
                  <input
                    required
                    type="date"
                    value={flightDateFrom}
                    onChange={(event) => setFlightDateFrom(event.target.value)}
                    dir="ltr"
                    className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] outline-none text-right rtl:text-right [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Passengers Count for Flights */}
            <div className="relative flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3 transition-all focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
              <span className="text-sm font-bold text-[#1a2b3c]/70 whitespace-nowrap shrink-0 flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-[#d0a755]" />
                {isEn ? "Number of passengers" : "عدد المسافرين"}
              </span>
              <input
                required
                type="number"
                min={1}
                value={passengers}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassengers(val === "" ? "" : parseInt(val, 10));
                }}
                onBlur={() => {
                  if (passengers === "" || passengers < 1) setPassengers(1);
                }}
                className="w-24 bg-transparent text-left ltr:text-right rtl:text-left text-base font-black text-[#1a2b3c] outline-none"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* COMMON FIELDS: FULL NAME & PHONE NUMBER (For Non-FastTrack Or Primary Info) */}
        {/* ========================================================================= */}
        {type !== "fast_track" && (
          <div className="space-y-4 pt-2 border-t border-black/5">
            <div>
              <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
                {isEn ? "Full Name" : "الاسم كاملًا"}
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 transition-all focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
                <FiUser className="w-4 h-4 text-[#d0a755] shrink-0" />
                <input
                  required
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder={isEn ? "Enter your full name" : "أدخل الاسم كاملًا"}
                  className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Nationality & Phone Number (Required for all services) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
              {isEn ? "Nationality" : "الجنسية"}
            </label>
            <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 transition-all focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
              <FiGlobe className="w-4 h-4 text-[#d0a755] shrink-0" />
              <button
                type="button"
                onClick={() => setNationalityModalOpen(true)}
                className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] outline-none text-start flex items-center justify-between"
              >
                <span className={nationality ? "" : "text-[#1a2b3c]/40"}>
                  {nationality || (isEn ? "Select Nationality..." : "اختر الجنسية...")}
                </span>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
              {isEn ? "Phone / WhatsApp Number" : "رقم الهاتف / الواتساب للتواصل"}
            </label>
            <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#F9F8F6] px-3.5 py-3 transition-all focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
              <FiPhone className="w-4 h-4 text-[#d0a755] shrink-0" />
              <input
                required
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder={isEn ? "e.g. +201000000000" : "مثال: 01000000000"}
                className="w-full bg-transparent text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>
        
        {/* Additional Notes */}
        <div className="relative">
          <label className="block text-xs font-bold text-[#1a2b3c]/70 mb-1">
            {isEn ? "Additional Notes / Special Requests" : "ملاحظات إضافية أو طلبات خاصة"}
          </label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={
              isEn ? (
                type === 'hotel' 
                  ? "Additional notes (preferred rooms, floor, special requests...)" 
                  : type === 'flight'
                  ? "Additional notes (preferred airline, flight class, special assistance...)"
                  : type === 'apartment'
                  ? "Additional notes (number of rooms, amenities...)"
                  : "Additional notes (flight number, pickup timing, special requests...)"
              ) : (
                type === 'hotel' 
                  ? "ملاحظات إضافية (الغرف المطلوبة، إطلالة مفضلة، طلبات خاصة...)" 
                  : type === 'flight'
                  ? "ملاحظات إضافية (خطوط الطيران المفضلة، درجة السفر، طلبات خاصة...)"
                  : type === 'apartment'
                  ? "ملاحظات إضافية (عدد الغرف، تجهيزات خاصة...)"
                  : "ملاحظات إضافية (رقم الرحلة، توقيت الاستقبال، طلبات خاصة...)"
              )
            }
            rows={2}
            className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755] resize-none"
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

      {/* Render the Location Search Modal */}
      <LocationSearchModal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        onSelect={(location) => {
          if (activeModal === "hotel") {
            setHotelDetails(location);
          } else if (activeModal === "flightFrom") {
            setFlightFrom(location);
          } else if (activeModal === "flightTo") {
            setFlightTo(location);
          } else if (activeModal === "carFrom") {
            setCarFrom(location);
          } else if (activeModal === "carTo") {
            setCarTo(location);
          } else if (activeModal === "carResidence") {
            setCarResidence(location);
          }
        }}
        title={
          activeModal === "hotel"
            ? (isEn ? "Select Hotel / City" : "اختر الفندق أو المحافظة")
            : activeModal === "flightFrom"
            ? (isEn ? "Select Departure Airport" : "اختر مطار المغادرة")
            : activeModal === "flightTo"
            ? (isEn ? "Select Destination Airport" : "اختر مطار الوصول")
            : activeModal === "carFrom"
            ? (isEn ? "Select Pickup Location" : "اختر مكان الانطلاق")
            : activeModal === "carTo"
            ? (isEn ? "Select Destination Location" : "اختر مكان الوصول")
            : activeModal === "carResidence"
            ? (isEn ? "Select Residence Location" : "اختر مكان السكن أو الإقامة")
            : (isEn ? "Select Location" : "اختر الموقع")
        }
        placeholder={
          activeModal === "hotel"
            ? (isEn ? "Search for a hotel or city..." : "ابحث عن فندق أو مدينة...")
            : ["flightFrom", "flightTo"].includes(activeModal || "")
            ? (isEn ? "Search for an airport or city..." : "ابحث عن مطار أو مدينة...")
            : (isEn ? "Search for a location or address..." : "ابحث عن عنوان أو مكان...")
        }
        isEn={isEn}
      />
      </form>
      <NationalitySearchModal
        isOpen={nationalityModalOpen}
        onClose={() => setNationalityModalOpen(false)}
        onSelect={(nat, code) => {
          setNationality(nat);
          if (code) setPhone(code + " ");
        }}
        title={isEn ? "Nationality" : "الجنسية"}
        placeholder={isEn ? "Search countries..." : "ابحث عن دولة..."}
        isEn={isEn}
      />
    </>
  );
}
