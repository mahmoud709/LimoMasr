"use client";

import { useState } from "react";
import type { Booking, Review } from "@/lib/types";
import Link from "next/link";
import { FiArrowRight, FiInbox, FiMessageCircle, FiUser, FiEye } from "react-icons/fi";
import { BookingDetailsModal } from "@/components/admin/BookingDetailsModal";
import { ServiceBadge } from "@/components/admin/ServiceBadge";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: "جديد",    color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  confirmed: { label: "مؤكد",   color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  completed: { label: "مكتمل",  color: "text-slate-600",   bg: "bg-slate-100",   border: "border-slate-200" },
  cancelled: { label: "ملغي",   color: "text-rose-700",    bg: "bg-rose-50",    border: "border-rose-200" },
};

export function RecentBookingsTable({ bookings }: { bookings: Booking[]; reviews?: Review[] }) {
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const recentBookings = bookings.slice(0, 8);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="font-black text-[#1a2b3c] text-lg tracking-tight">جدول الحجوزات الحديثة الواردة</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">انقر على أي عميل لفتح صفحته التنفيذية الشاملة والسجل بالكامل</p>
        </div>
        <Link href="/admin/bookings" className="px-4 py-2 rounded-xl bg-[#d0a755]/10 text-[#1a2b3c] text-xs font-black hover:bg-[#d0a755]/20 transition-colors flex items-center gap-2">
          استعراض كافة الحجوزات <FiArrowRight className="w-4 h-4 text-[#d0a755]" />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/30">
              {["العميل", "الخدمة المطلوبة", "فئة الحجز", "تاريخ التنفيذ", "تفاصيل الحجز", "تواصل سريع", "حالة الطلب"].map(h => (
                <th key={h} className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-24">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                      <FiInbox className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-base font-bold text-slate-600 mb-1">صندوق الحجوزات فارغ حالياً</p>
                    <p className="text-sm text-slate-400">لا توجد أي حجوزات جديدة مسجلة في النظام.</p>
                  </div>
                </td>
              </tr>
            ) : recentBookings.map((b) => {
              const s = statusConfig[b.status] || statusConfig.new;
              const cleanPhone = b.phone ? b.phone.replace(/\D/g, "") : "";
              const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : "#";

              return (
                <tr 
                  key={b.id} 
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <Link 
                      href={`/admin/customers/${encodeURIComponent(cleanPhone || b.phone)}`}
                      className="flex items-center gap-3 group/client"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#1a2b3c] group-hover/client:bg-[#d0a755] group-hover/client:text-[#1a2b3c] text-[#d0a755] flex items-center justify-center font-black text-xs shrink-0 transition-colors shadow-sm">
                        {b.customerName ? b.customerName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <p className="font-bold text-[#1a2b3c] text-sm group-hover/client:text-[#d0a755] transition-colors">{b.customerName}</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">{b.phone}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-8 py-5 text-slate-700 font-medium">{b.serviceName}</td>
                  <td className="px-8 py-5">
                    <ServiceBadge type={b.type} />
                  </td>
                  <td className="px-8 py-5 text-slate-500 text-sm font-medium">{b.date}</td>
                  
                  {/* View Details Button */}
                  <td className="px-8 py-5">
                    <button
                      type="button"
                      onClick={() => setSelectedBookingForDetails(b)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-[#1a2b3c] hover:bg-[#d0a755] hover:text-[#1a2b3c] border border-amber-200/80 text-xs font-black transition-all shadow-xs cursor-pointer group/btn"
                      title="عرض أسماء المسافرين والملاحظات وكافة التفاصيل"
                    >
                      <FiEye className="w-3.5 h-3.5 text-[#d0a755] group-hover/btn:text-[#1a2b3c]" />
                      <span>التفاصيل</span>
                      {(b.passengers ?? 0) > 1 && (
                        <span className="bg-[#1a2b3c] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full mr-1">
                          {b.passengers}
                        </span>
                      )}
                    </button>
                  </td>

                  <td className="px-8 py-5">
                    {cleanPhone ? (
                      <a 
                        href={waLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <FiMessageCircle className="w-3.5 h-3.5" /> واتساب
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-black border ${s.bg} ${s.color} ${s.border} tracking-wide uppercase`}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <BookingDetailsModal
        booking={selectedBookingForDetails}
        onClose={() => setSelectedBookingForDetails(null)}
      />
    </div>
  );
}
