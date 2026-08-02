"use client";

import { useState, useEffect } from "react";
import type { Booking, BookingStatus, Review } from "@/lib/types";
import Link from "next/link";
import { 
  FiArrowRight, FiPhone, FiMessageCircle, FiCalendar, FiCheckCircle, 
  FiXCircle, FiClock, FiStar, FiAward, FiDollarSign, FiEdit3, FiSave
} from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/admin/ToastProvider";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: "جديد",    color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  confirmed: { label: "مؤكد",   color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  completed: { label: "مكتمل",  color: "text-slate-600",   bg: "bg-slate-100",   border: "border-slate-200" },
  cancelled: { label: "ملغي",   color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200" },
};

const typeLabels: Record<string, string> = {
  car: "سيارة ليموزين",
  fast_track: "مسار سريع VIP",
  hotel: "حجز فندق",
  flight: "طيران",
  apartment: "شقة فندقية",
};

export function CustomerDetailClient({
  phone,
  customerName,
  bookings,
  reviews = []
}: {
  phone: string;
  customerName: string;
  bookings: Booking[];
  reviews?: Review[];
}) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const cleanPhone = phone.replace(/\D/g, "");

  const totalBookings = bookings.length;
  const completedCount = bookings.filter(b => b.status === "completed" || b.status === "confirmed").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const cancellationRate = totalBookings > 0 ? Math.round((cancelledCount / totalBookings) * 100) : 0;
  
  const totalSpent = bookings.reduce((sum, b) => sum + (b.price || 3500), 0);
  const formattedSpent = new Intl.NumberFormat("ar-EG").format(totalSpent);

  // VIP Status
  let vipTier = { label: "عميل جديد", color: "bg-slate-100 text-slate-700 border-slate-200" };
  if (cancellationRate > 50 && totalBookings >= 2) {
    vipTier = { label: "⚠️ إلغاء متكرر", color: "bg-rose-100 text-rose-800 border-rose-200" };
  } else if (totalBookings >= 4 || totalSpent >= 15000) {
    vipTier = { label: "👑 عميل ذهبي VIP", color: "bg-[#d0a755]/20 text-[#1a2b3c] border-[#d0a755]" };
  } else if (totalBookings >= 2) {
    vipTier = { label: "⭐️ عميل مميز", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }

  // Admin Memory Notes
  const [adminNote, setAdminNote] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`customer_note_${cleanPhone}`);
    if (saved) setAdminNote(saved);
  }, [cleanPhone]);

  function saveNote() {
    localStorage.setItem(`customer_note_${cleanPhone}`, adminNote);
    setIsEditingNote(false);
    toast.success("تم حفظ ملاحظات العميل بنجاح");
  }

  // Status mutation
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
    }
  });

  const customerReviews = reviews.filter(r => r.name === customerName);

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 animate-reveal-1 max-w-[1400px] mx-auto w-full">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/customers"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 text-xs font-black border border-slate-100 shadow-sm hover:bg-[#1a2b3c] hover:text-white transition-all"
        >
          <FiArrowRight className="w-4 h-4 text-[#d0a755]" /> العودة لدليل العملاء
        </Link>
      </div>

      {/* Customer Hero Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1a2b3c] via-[#0F1115] to-[#1a2b3c] p-8 md:p-12 text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#d0a755]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-[#d0a755] text-[#1a2b3c] font-black text-3xl flex items-center justify-center shadow-xl border-4 border-white/20 shrink-0">
              {customerName.charAt(0).toUpperCase()}
            </div>
            
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-white">{customerName}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${vipTier.color}`}>
                  {vipTier.label}
                </span>
              </div>
              <p className="text-white/60 text-sm font-mono dir-ltr flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-[#d0a755]" /> {phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a 
              href={`tel:${phone}`}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white hover:text-[#1a2b3c] text-white text-xs font-black transition-all flex items-center gap-2 border border-white/10"
            >
              <FiPhone className="w-4 h-4 text-[#d0a755]" /> اتصال تلفوني
            </a>
            {cleanPhone && (
              <a 
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <FiMessageCircle className="w-4 h-4" /> محادثة واتساب
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 block mb-1">إجمالي الحجوزات</span>
          <span className="text-4xl font-black text-[#1a2b3c]">{totalBookings}</span>
          <span className="text-xs font-medium text-slate-500 block mt-2">رحلات مسجلة بالنظام</span>
        </div>

        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 text-center">
          <span className="text-xs font-bold text-emerald-600 block mb-1">الرحلات المؤكدة والمكتملة</span>
          <span className="text-4xl font-black text-emerald-700">{completedCount}</span>
          <span className="text-xs font-bold text-emerald-600 block mt-2">رحلة منفذة بنجاح</span>
        </div>

        <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100 text-center">
          <span className="text-xs font-bold text-rose-600 block mb-1">الحجوزات الملغاة</span>
          <span className="text-4xl font-black text-rose-700">{cancelledCount}</span>
          <span className="text-xs font-bold text-rose-600 block mt-2">نسبة الإلغاء {cancellationRate}%</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <span className="text-xs font-bold text-[#d0a755] block mb-1">إجمالي قيمة إنفاق العميل</span>
          <span className="text-3xl font-black text-[#1a2b3c]">{formattedSpent}</span>
          <span className="text-xs font-bold text-slate-400 block mt-2">جنيه مصري</span>
        </div>
      </div>

      {/* Admin Private Notes & Memory Box */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-[#1a2b3c] text-base flex items-center gap-2">
            <FiEdit3 className="w-5 h-5 text-[#d0a755]" /> سجل ملاحظات الإدارة الخاصة بالعميل
          </h3>
          {!isEditingNote ? (
            <button 
              onClick={() => setIsEditingNote(true)} 
              className="px-4 py-2 bg-slate-100 hover:bg-[#d0a755] hover:text-[#1a2b3c] text-[#1a2b3c] text-xs font-black rounded-xl transition-colors"
            >
              تعديل الملاحظات
            </button>
          ) : (
            <button 
              onClick={saveNote} 
              className="px-4 py-2 bg-[#1a2b3c] text-white text-xs font-black rounded-xl flex items-center gap-2 hover:bg-[#d0a755] hover:text-[#1a2b3c] transition-colors"
            >
              <FiSave className="w-4 h-4" /> حفظ الملاحظة
            </button>
          )}
        </div>

        {isEditingNote ? (
          <textarea 
            value={adminNote}
            onChange={e => setAdminNote(e.target.value)}
            placeholder="اكتب أي ملاحظات تفيد الإدارة والسائقين أثناء التعامل مع هذا العميل..."
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-[#1a2b3c] outline-none focus:border-[#d0a755] min-h-[100px]"
          />
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
              {adminNote ? `"${adminNote}"` : "لا توجد ملاحظات مسجلة لهذا العميل حتى الآن. انقر على 'تعديل الملاحظات' للتدوين."}
            </p>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      {customerReviews.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-black text-[#1a2b3c] text-base flex items-center gap-2">
            <FiStar className="w-5 h-5 text-amber-500 fill-amber-500" /> آراء وتقييمات العميل المسجلة
          </h3>
          <div className="space-y-3">
            {customerReviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-800">"{rev.text}"</p>
                </div>
                <span className="text-xs font-bold text-slate-400">{rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Booking Timeline Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-black text-[#1a2b3c] text-lg tracking-tight">سجل كافة الحجوزات لـ {customerName} ({totalBookings})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-100">
                {["رقم الحجز", "الخدمة المطلوبة", "فئة الخدمة", "التاريخ والوقت", "السعر التقديري", "الحالة", "تعديل الحالة"].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">لا توجد حجوزات مسجلة لهذا العميل.</td></tr>
              ) : bookings.map(b => {
                const s = statusConfig[b.status] || statusConfig.new;
                return (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{b.id}</td>
                    <td className="px-6 py-4 font-bold text-[#1a2b3c]">{b.serviceName}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
                        {typeLabels[b.type] ?? b.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs" dir="ltr">{b.date}</td>
                    <td className="px-6 py-4 font-bold text-[#1a2b3c]">
                      {b.price ? `${new Intl.NumberFormat("ar-EG").format(b.price)} ج.م` : "3,500 ج.م"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-black border ${s.bg} ${s.color} ${s.border} uppercase`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={b.status}
                        onChange={e => updateStatusMutation.mutate({ id: b.id, status: e.target.value as BookingStatus })}
                        disabled={updateStatusMutation.isPending}
                        className="text-xs font-bold rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[#1a2b3c] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d0a755]/50 disabled:opacity-50"
                      >
                        <option value="new">جديد</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="completed">منتهي</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
