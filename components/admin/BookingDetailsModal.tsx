"use client";

import { useMemo } from "react";
import type { Booking, BookingStatus } from "@/lib/types";
import { 
  FiX, FiUser, FiPhone, FiCalendar, FiClock, FiMapPin, 
  FiUsers, FiBriefcase, FiGlobe, FiDollarSign, FiMessageCircle, 
  FiCheckCircle, FiAlertCircle, FiXCircle, FiTruck, FiSend, FiPaperclip
} from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/admin/ToastProvider";
import { ServiceBadge } from "@/components/admin/ServiceBadge";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: "جديد",    color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  confirmed: { label: "مؤكد",   color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  completed: { label: "مكتمل",  color: "text-slate-600",   bg: "bg-slate-100",   border: "border-slate-200" },
  cancelled: { label: "ملغي",   color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200" },
};

const typeLabels: Record<string, string> = {
  car: "سيارة ليموزين",
  fast_track: "مسار سريع VIP",
  hotel: "فندق",
  flight: "طيران",
  apartment: "شقة فندقية",
};

export interface ParsedBookingInfo {
  passengersList: string[];
  nationality?: string;
  serviceType?: string;
  from?: string;
  to?: string;
  residence?: string;
  luggage?: string;
  checkIn?: string;
  checkOut?: string;
  budget?: string;
  flightType?: string;
  departureDate?: string;
  returnDate?: string;
  hotelOrPlace?: string;
  additionalNotes?: string;
  attachmentUrl?: string;
  // خدمة يومية
  startDate?: string;
  endDate?: string;
  totalDays?: string;
}

export function parseBookingNotes(notes?: string, primaryName?: string): ParsedBookingInfo {
  const info: ParsedBookingInfo = {
    passengersList: [],
  };

  if (!notes) {
    if (primaryName) info.passengersList.push(primaryName);
    return info;
  }

  // Extract [أسماء المسافرين: ...]
  const namesMatch = notes.match(/\[أسماء المسافرين:\s*([^\]]+)\]/);
  if (namesMatch && namesMatch[1]) {
    const rawNames = namesMatch[1]
      .split(/\||\n/)
      .map(n => n.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
    if (rawNames.length > 0) {
      info.passengersList = rawNames;
    }
  }

  if (info.passengersList.length === 0 && primaryName) {
    info.passengersList.push(primaryName);
  }

  // Extract Nationality
  const natMatch = notes.match(/\[الجنسية:\s*([^\]]+)\]/);
  if (natMatch && natMatch[1]) info.nationality = natMatch[1].trim();

  // Extract Service Type (توصيلة / يومية)
  const stMatch = notes.match(/\[نوع الخدمة:\s*([^\]]+)\]/);
  if (stMatch && stMatch[1]) info.serviceType = stMatch[1].trim();

  // Extract Locations
  const fromMatch = notes.match(/\[من:\s*([^\]]+)\]/);
  if (fromMatch && fromMatch[1]) info.from = fromMatch[1].trim();

  const toMatch = notes.match(/\[إلى:\s*([^\]]+)\]/);
  if (toMatch && toMatch[1]) info.to = toMatch[1].trim();

  const resMatch = notes.match(/\[مكان السكن:\s*([^\]]+)\]/);
  if (resMatch && resMatch[1]) info.residence = resMatch[1].trim();

  // Extract Luggage
  const lugMatch = notes.match(/\[عدد الحقائب:\s*([^\]]+)\]/);
  if (lugMatch && lugMatch[1]) info.luggage = lugMatch[1].trim();

  // Extract Hotel / Apartment Place
  const placeMatch = notes.match(/\[المكان:\s*([^\]]+)\]/);
  if (placeMatch && placeMatch[1]) info.hotelOrPlace = placeMatch[1].trim();

  // Extract Dates
  const inMatch = notes.match(/\[تاريخ الوصول:\s*([^\]]+)\]/);
  if (inMatch && inMatch[1]) info.checkIn = inMatch[1].trim();

  const outMatch = notes.match(/\[تاريخ المغادرة:\s*([^\]]+)\]/);
  if (outMatch && outMatch[1]) info.checkOut = outMatch[1].trim();

  const depMatch = notes.match(/\[تاريخ الذهاب:\s*([^\]]+)\]/);
  if (depMatch && depMatch[1]) info.departureDate = depMatch[1].trim();

  const retMatch = notes.match(/\[تاريخ العودة:\s*([^\]]+)\]/);
  if (retMatch && retMatch[1]) info.returnDate = retMatch[1].trim();

  const flTypeMatch = notes.match(/\[نوع الرحلة:\s*([^\]]+)\]/);
  if (flTypeMatch && flTypeMatch[1]) info.flightType = flTypeMatch[1].trim();

  const budMatch = notes.match(/\[الميزانية:\s*([^\]]+)\]/);
  if (budMatch && budMatch[1]) info.budget = budMatch[1].trim();

  // Extract daily service dates
  const startDateMatch = notes.match(/\[تاريخ البداية:\s*([^\]]+)\]/);
  if (startDateMatch && startDateMatch[1]) info.startDate = startDateMatch[1].trim();

  const endDateMatch = notes.match(/\[تاريخ النهاية:\s*([^\]]+)\]/);
  if (endDateMatch && endDateMatch[1]) info.endDate = endDateMatch[1].trim();

  const totalDaysMatch = notes.match(/\[عدد الأيام:\s*([^\]]+)\]/);
  if (totalDaysMatch && totalDaysMatch[1]) info.totalDays = totalDaysMatch[1].trim();

  // Extract Attachment
  const attachMatch = notes.match(/\[المرفقات:\s*([^\]]+)\]/);
  if (attachMatch && attachMatch[1]) info.attachmentUrl = attachMatch[1].trim();

  // Extract extra free-text notes
  const notesMatch = notes.match(/\[ملاحظات:\s*([^\]]+)\]/);
  if (notesMatch && notesMatch[1]) {
    info.additionalNotes = notesMatch[1].trim();
  } else {
    // If there is text outside brackets
    const stripped = notes.replace(/\[[^\]]+\]/g, "").trim();
    if (stripped) info.additionalNotes = stripped;
  }

  return info;
}

export function BookingDetailsModal({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const parsed = useMemo(() => {
    if (!booking) return null;
    return parseBookingNotes(booking.notes, booking.customerName);
  }, [booking]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("فشل في تحديث الحالة");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("تم تحديث حالة الحجز بنجاح");
    },
    onError: (err: any) => {
      toast.error(err.message || "حدث خطأ");
    },
  });

  if (!booking || !parsed) return null;

  const s = statusConfig[booking.status] || statusConfig.new;
  const cleanPhone = booking.phone ? booking.phone.replace(/\D/g, "") : "";
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-md animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a2b3c] via-[#0F1115] to-[#1a2b3c] p-6 text-white relative flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <ServiceBadge type={booking.type} />
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${s.bg} ${s.color} ${s.border}`}>
                {s.label}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white leading-snug">
              {booking.serviceName}
            </h2>
            <p className="text-xs text-white/50 font-mono dir-ltr flex items-center gap-1.5">
              <span>رقم الحجز:</span> <span className="text-[#d0a755] font-bold">{booking.id}</span>
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-[#1a2b3c] transition-all shrink-0 cursor-pointer shadow-md"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#1a2b3c]">
          
          {/* Customer Main Info Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#1a2b3c] text-[#d0a755] font-black text-lg flex items-center justify-center shadow-md">
                {booking.customerName ? booking.customerName.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h3 className="font-black text-base text-[#1a2b3c]">{booking.customerName}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5 dir-ltr text-right">{booking.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a 
                href={`tel:${booking.phone}`}
                className="px-3.5 py-2 rounded-xl bg-white text-slate-700 text-xs font-black border border-slate-200 hover:bg-[#1a2b3c] hover:text-white transition-all flex items-center gap-1.5 shadow-xs"
              >
                <FiPhone className="w-3.5 h-3.5 text-[#d0a755]" /> اتصال
              </a>
              {waLink && (
                <a 
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <FiMessageCircle className="w-3.5 h-3.5" /> واتساب
                </a>
              )}
            </div>
          </div>

          {/* Core Booking Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#F9F8F6] p-4 rounded-xl border border-black/5">
              <span className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <FiCalendar className="w-3.5 h-3.5 text-[#d0a755]" /> تاريخ الحجز / التنفيذ
              </span>
              <span className="text-xs md:text-sm font-black text-[#1a2b3c]">{booking.date || "غير محدد"}</span>
            </div>

            <div className="bg-[#F9F8F6] p-4 rounded-xl border border-black/5">
              <span className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <FiUsers className="w-3.5 h-3.5 text-[#d0a755]" /> عدد الأفراد
              </span>
              <span className="text-xs md:text-sm font-black text-[#1a2b3c]">
                {booking.passengers || (parsed?.passengersList?.length ?? 1)} أفراد
              </span>
            </div>

            {parsed.nationality && (
              <div className="bg-[#F9F8F6] p-4 rounded-xl border border-black/5">
                <span className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                  <FiGlobe className="w-3.5 h-3.5 text-[#d0a755]" /> الجنسية
                </span>
                <span className="text-xs md:text-sm font-black text-[#1a2b3c]">{parsed.nationality}</span>
              </div>
            )}

            {/* Daily car service: show date range + total days */}
            {(parsed.startDate || booking.dateFrom) && (
              <div className="col-span-2 sm:col-span-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <span className="text-[11px] font-bold text-amber-700 block mb-2 flex items-center gap-1">
                  <FiCalendar className="w-3.5 h-3.5" /> مدة الخدمة اليومية
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400">من</span>
                    <span className="text-sm font-black text-[#1a2b3c]">{parsed.startDate || booking.dateFrom}</span>
                  </div>
                  <span className="text-[#d0a755] font-black">←</span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400">إلى</span>
                    <span className="text-sm font-black text-[#1a2b3c]">{parsed.endDate || booking.dateTo}</span>
                  </div>
                  {(parsed.totalDays) && (
                    <span className="mr-auto bg-[#1a2b3c] text-[#d0a755] text-xs font-black px-3 py-1.5 rounded-lg">
                      {parsed.totalDays} يوم
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Total price (daily service) — shown prominently */}
            {booking.totalPrice !== undefined && (
              <div className="col-span-2 sm:col-span-1 bg-[#1a2b3c] p-4 rounded-xl border border-[#d0a755]/20">
                <span className="text-[11px] font-bold text-white/60 block mb-1 flex items-center gap-1">
                  <FiDollarSign className="w-3.5 h-3.5 text-[#d0a755]" /> السعر الإجمالي
                </span>
                <span className="text-base md:text-lg font-black text-[#d0a755]">
                  {new Intl.NumberFormat("ar-EG").format(booking.totalPrice)} ج.م
                </span>
                {booking.price !== undefined && (
                  <span className="text-[10px] text-white/40 block mt-0.5">
                    ({new Intl.NumberFormat("ar-EG").format(booking.price)} ج.م / يوم)
                  </span>
                )}
              </div>
            )}

            {/* Regular price (non-daily) */}
            {booking.price !== undefined && booking.totalPrice === undefined && (
              <div className="bg-[#F9F8F6] p-4 rounded-xl border border-black/5">
                <span className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                  <FiDollarSign className="w-3.5 h-3.5 text-[#d0a755]" /> القيمة المقدرة
                </span>
                <span className="text-xs md:text-sm font-black text-[#1a2b3c]">
                  {new Intl.NumberFormat("ar-EG").format(booking.price)} ج.م
                </span>
              </div>
            )}

            {parsed.serviceType && (
              <div className="bg-[#F9F8F6] p-4 rounded-xl border border-black/5">
                <span className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                  <FiTruck className="w-3.5 h-3.5 text-[#d0a755]" /> نوع الخدمة
                </span>
                <span className="text-xs md:text-sm font-black text-[#1a2b3c]">{parsed.serviceType}</span>
              </div>
            )}

            {parsed.luggage !== undefined && (
              <div className="bg-[#F9F8F6] p-4 rounded-xl border border-black/5">
                <span className="text-[11px] font-bold text-slate-400 block mb-1 flex items-center gap-1">
                  <FiBriefcase className="w-3.5 h-3.5 text-[#d0a755]" /> عدد الحقائب
                </span>
                <span className="text-xs md:text-sm font-black text-[#1a2b3c]">{parsed.luggage}</span>
              </div>
            )}
          </div>

          {/* Passenger Names List Section (Very prominent for Fast Track & Multi-person bookings) */}
          {parsed.passengersList.length > 0 && (
            <div className="space-y-3 bg-amber-50/40 p-5 rounded-2xl border border-amber-100">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-[#1a2b3c] flex items-center gap-2">
                  <FiUsers className="w-4 h-4 text-[#d0a755]" />
                  قائمة أسماء المسافرين ({parsed.passengersList.length} أفراد)
                </h4>
                <span className="text-[11px] font-bold text-[#d0a755]">بيانات التصاريح والاستقبال</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {parsed.passengersList.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-200/60 shadow-xs">
                    <span className="w-7 h-7 rounded-full bg-[#1a2b3c] text-[#d0a755] text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-black text-[#1a2b3c] truncate">{name}</p>
                      {idx === 0 && (
                        <span className="text-[10px] font-bold text-slate-400 block">المسافر الرئيسي / صاحب الطلب</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Route or Location Details */}
          {(parsed.from || parsed.to || parsed.residence || parsed.hotelOrPlace) && (
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-medium">
              <h4 className="font-black text-xs text-[#1a2b3c] mb-2 flex items-center gap-1.5">
                <FiMapPin className="w-3.5 h-3.5 text-[#d0a755]" /> تفاصيل الوجهات والموقع
              </h4>
              <div className="space-y-1.5">
                {parsed.hotelOrPlace && (
                  <p><span className="font-bold text-slate-500">اسم الفندق / الإقامة:</span> <span className="font-black text-[#1a2b3c]">{parsed.hotelOrPlace}</span></p>
                )}
                {parsed.from && (
                  <p><span className="font-bold text-slate-500">نقطة الانطلاق (من):</span> <span className="font-black text-[#1a2b3c]">{parsed.from}</span></p>
                )}
                {parsed.to && (
                  <p><span className="font-bold text-slate-500">الوجهة المقصودة (إلى):</span> <span className="font-black text-[#1a2b3c]">{parsed.to}</span></p>
                )}
                {parsed.residence && (
                  <p><span className="font-bold text-slate-500">مكان السكن / الإقامة:</span> <span className="font-black text-[#1a2b3c]">{parsed.residence}</span></p>
                )}
              </div>
            </div>
          )}

          {/* Additional Notes Box */}
          {parsed.additionalNotes && (
            <div className="space-y-1.5 bg-blue-50/40 p-4 rounded-2xl border border-blue-100">
              <h4 className="font-black text-xs text-blue-900 flex items-center gap-1.5">
                <FiAlertCircle className="w-3.5 h-3.5 text-blue-600" /> ملاحظات وطلبات خاصة من العميل
              </h4>
              <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                {parsed.additionalNotes}
              </p>
            </div>
          )}

          {/* Attachment Box */}
          {parsed.attachmentUrl && (
            <div className="space-y-2 bg-purple-50/40 p-4 rounded-2xl border border-purple-100">
              <h4 className="font-black text-xs text-purple-900 flex items-center gap-1.5 mb-2">
                <FiPaperclip className="w-3.5 h-3.5 text-purple-600" /> المرفقات (صورة الجواز / التذكرة)
              </h4>
              <a 
                href={parsed.attachmentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-black rounded-xl transition-colors w-fit"
              >
                عرض الملف المرفق
              </a>
            </div>
          )}

          {/* Update Status Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-500">تعديل حالة الحجز:</span>
              <select
                value={booking.status}
                onChange={e => updateStatusMutation.mutate({ id: booking.id, status: e.target.value as BookingStatus })}
                disabled={updateStatusMutation.isPending}
                className="text-xs font-bold rounded-xl border border-slate-200 bg-white px-3 py-2 text-[#1a2b3c] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d0a755]/50 disabled:opacity-50"
              >
                <option value="new">جديد</option>
                <option value="confirmed">مؤكد</option>
                <option value="completed">منتهي</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#1a2b3c] text-white text-xs font-black hover:bg-[#2a3d52] transition-colors"
            >
              إغلاق
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
