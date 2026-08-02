"use client";

import { useState, useEffect } from "react";
import type { Booking, Review } from "@/lib/types";
import { 
  FiX, FiPhone, FiMessageCircle, FiCalendar, FiCheckCircle, 
  FiXCircle, FiClock, FiStar, FiAward, FiDollarSign, FiEdit3, FiSave
} from "react-icons/fi";

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

export function CustomerProfileModal({ 
  phone, 
  bookings, 
  reviews = [], 
  onClose 
}: { 
  phone: string; 
  bookings: Booking[]; 
  reviews?: Review[]; 
  onClose: () => void; 
}) {
  // Filter bookings for this customer by phone
  const customerBookings = bookings.filter(b => b.phone === phone || (b.phone && phone && b.phone.replace(/\D/g, "") === phone.replace(/\D/g, "")));
  
  const customerName = customerBookings[0]?.customerName || "عميل ليمو مصر";
  const cleanPhone = phone.replace(/\D/g, "");

  const totalBookings = customerBookings.length;
  const completedCount = customerBookings.filter(b => b.status === "completed" || b.status === "confirmed").length;
  const cancelledCount = customerBookings.filter(b => b.status === "cancelled").length;
  const newCount = customerBookings.filter(b => b.status === "new").length;

  const cancellationRate = totalBookings > 0 ? Math.round((cancelledCount / totalBookings) * 100) : 0;
  
  const totalSpent = customerBookings.reduce((sum, b) => sum + (b.price || 3500), 0);
  const formattedSpent = new Intl.NumberFormat("ar-EG").format(totalSpent);

  // VIP status calculation
  let vipTier = { label: "عميل جديد", color: "bg-slate-100 text-slate-700 border-slate-200" };
  if (cancellationRate > 50 && totalBookings >= 2) {
    vipTier = { label: "⚠️ إلغاء متكرر", color: "bg-rose-100 text-rose-800 border-rose-200" };
  } else if (totalBookings >= 4 || totalSpent >= 15000) {
    vipTier = { label: "👑 عميل ذهبي VIP", color: "bg-[#d0a755]/20 text-[#1a2b3c] border-[#d0a755]" };
  } else if (totalBookings >= 2) {
    vipTier = { label: "⭐️ عميل مميز", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }

  // Admin notes local memory per customer phone
  const [adminNote, setAdminNote] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`customer_note_${cleanPhone}`);
    if (saved) setAdminNote(saved);
  }, [cleanPhone]);

  function saveNote() {
    localStorage.setItem(`customer_note_${cleanPhone}`, adminNote);
    setIsEditingNote(false);
  }

  // Customer reviews
  const customerReviews = reviews.filter(r => r.name === customerName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1a2b3c] via-[#0F1115] to-[#1a2b3c] p-6 md:p-8 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-[#1a2b3c] transition-all shadow-md"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#d0a755] text-[#1a2b3c] font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
              {customerName.charAt(0).toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-black text-white">{customerName}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${vipTier.color}`}>
                  {vipTier.label}
                </span>
              </div>
              <p className="text-white/60 text-sm font-mono dir-ltr flex items-center gap-2">
                <FiPhone className="w-3.5 h-3.5 text-[#d0a755]" /> {phone}
              </p>
            </div>

            {/* Direct Contact Buttons */}
            <div className="mr-auto flex items-center gap-3 pt-3 sm:pt-0">
              <a 
                href={`tel:${phone}`}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white hover:text-[#1a2b3c] text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
              >
                <FiPhone className="w-4 h-4 text-[#d0a755]" /> اتصال
              </a>
              {cleanPhone && (
                <a 
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <FiMessageCircle className="w-4 h-4" /> واتساب
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Key Customer Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#F9F8F6] p-5 rounded-2xl border border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-400 block mb-1">إجمالي الحجوزات</span>
              <span className="text-3xl font-black text-[#1a2b3c]">{totalBookings}</span>
              <span className="text-[11px] font-medium text-slate-500 block mt-1">رحلات بالكامل</span>
            </div>

            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 text-center">
              <span className="text-xs font-bold text-emerald-600 block mb-1">المكتملة والمؤكدة</span>
              <span className="text-3xl font-black text-emerald-700">{completedCount}</span>
              <span className="text-[11px] font-bold text-emerald-600 block mt-1">رحلة جارية ومغلقة</span>
            </div>

            <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 text-center">
              <span className="text-xs font-bold text-rose-600 block mb-1">الحجوزات الملغاة</span>
              <span className="text-3xl font-black text-rose-700">{cancelledCount}</span>
              <span className="text-[11px] font-bold text-rose-600 block mt-1">نسبة الإلغاء {cancellationRate}%</span>
            </div>

            <div className="bg-[#d0a755]/10 p-5 rounded-2xl border border-[#d0a755]/20 text-center">
              <span className="text-xs font-bold text-[#1a2b3c] block mb-1">إجمالي إنفاق العميل</span>
              <span className="text-2xl font-black text-[#1a2b3c]">{formattedSpent}</span>
              <span className="text-[11px] font-bold text-[#d0a755] block mt-1">ج.م قيمة إجمالية</span>
            </div>
          </div>

          {/* Admin Private Notes & Memory */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[#1a2b3c] text-sm flex items-center gap-2">
                <FiEdit3 className="w-4 h-4 text-[#d0a755]" /> ملاحظات وتوصيات الإدارة الخاصة بالعميل
              </h3>
              {!isEditingNote ? (
                <button 
                  onClick={() => setIsEditingNote(true)} 
                  className="text-xs font-bold text-[#d0a755] hover:underline"
                >
                  تعديل الملاحظة
                </button>
              ) : (
                <button 
                  onClick={saveNote} 
                  className="px-3 py-1 bg-[#1a2b3c] text-white text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-[#d0a755] hover:text-[#1a2b3c] transition-colors"
                >
                  <FiSave className="w-3.5 h-3.5" /> حفظ
                </button>
              )}
            </div>

            {isEditingNote ? (
              <textarea 
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder="اكتب أي تفاصيل هامة (مثلاً: يعشق فئة مرسيدس E-Class، يفضل الدفع كاش، غير محب للتأخير...)"
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-[#1a2b3c] outline-none focus:border-[#d0a755] min-h-[80px]"
              />
            ) : (
              <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                {adminNote ? `"${adminNote}"` : "لا توجد ملاحظات إدارية دُوّنت لهذا العميل بعد. انقر على 'تعديل الملاحظة' لإضافة معلومات هامة."}
              </p>
            )}
          </div>

          {/* Customer Reviews Section if any */}
          {customerReviews.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-black text-[#1a2b3c] text-sm flex items-center gap-2">
                <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" /> آراء وتقييمات العميل للموقع
              </h3>
              <div className="space-y-2">
                {customerReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <FiStar key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                      <p className="text-xs font-medium text-slate-700">"{rev.comment}"</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Booking History Timeline */}
          <div className="space-y-4">
            <h3 className="font-black text-[#1a2b3c] text-base tracking-tight flex items-center gap-2">
              <FiClock className="w-4 h-4 text-[#d0a755]" /> سجل وسجل كافة الحجوزات ({customerBookings.length})
            </h3>

            {customerBookings.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">لا توجد حجوزات مسجلة لهذا الرقم.</p>
            ) : (
              <div className="space-y-3">
                {customerBookings.map((b) => {
                  const s = statusConfig[b.status] || statusConfig.new;
                  return (
                    <div key={b.id} className="p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#1a2b3c] text-sm">{b.serviceName}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                            {typeLabels[b.type] ?? b.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          تاريخ الحجز: <span className="font-bold text-slate-600">{b.date}</span>
                        </p>
                        {b.notes && (
                          <p className="text-xs text-[#d0a755] font-medium mt-1">ملاحظات: {b.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                        <div className="text-left">
                          <span className="text-sm font-black text-[#1a2b3c] block">
                            {b.price ? `${new Intl.NumberFormat("ar-EG").format(b.price)} ج.م` : "سعر تقديري 3,500 ج.م"}
                          </span>
                        </div>
                        <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-black border ${s.bg} ${s.color} ${s.border} uppercase`}>
                          {s.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
