"use client";

import { useState, useMemo } from "react";
import type { Booking, BookingStatus } from "@/lib/types";
import { FiDownload, FiSearch, FiFilter, FiClock, FiMessageCircle, FiUser, FiEye } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/admin/ToastProvider";
import { BookingDetailsModal } from "@/components/admin/BookingDetailsModal";
import { ServiceBadge } from "@/components/admin/ServiceBadge";
import Link from "next/link";

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: "جديد",   color: "text-blue-700",  bg: "bg-blue-50",  border: "border-blue-200" },
  confirmed: { label: "مؤكد",  color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  cancelled: { label: "ملغي",  color: "text-rose-700",   bg: "bg-rose-50",   border: "border-rose-200" },
  completed: { label: "منتهي", color: "text-slate-600",  bg: "bg-slate-50",  border: "border-slate-200" },
};

function formatDateTime(val: string) {
  try {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(d);
  } catch (e) {
    return val;
  }
}

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);

  // Fetch Bookings with React Query
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      if (!res.ok) throw new Error("فشل في جلب الحجوزات");
      return res.json();
    }
  });

  // Mutate Booking Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("فشل في تحديث حالة الحجز");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("تم تحديث حالة الحجز بنجاح");
    },
    onError: (err: any) => {
      toast.error(err.message || "حدث خطأ أثناء تحديث الحالة");
    },
  });

  function exportCsv() {
    const header = ["id", "type", "customerName", "phone", "serviceName", "date", "status", "createdAt"];
    const rows = bookings.map(b => header.map(k => JSON.stringify(String(b[k as keyof Booking] ?? ""))).join(","));
    const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "limo-masr-bookings.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() =>
    bookings.filter(b => {
      const matchSearch = !search || b.customerName?.includes(search) || b.phone?.includes(search) || b.serviceName?.includes(search);
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const matchType   = typeFilter === "all" || b.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    }),
    [bookings, search, statusFilter, typeFilter]
  );

  return (
    <div className="flex-1 p-6 md:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1a2b3c]">سجل الحجوزات الكامل</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">إجمالي الحجوزات المسجلة: {bookings.length}</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 bg-[#1a2b3c] text-white text-xs font-black px-5 py-3 rounded-xl hover:bg-[#2a3d52] transition-colors shadow-sm">
          <FiDownload className="w-4 h-4 text-[#d0a755]" />
          تصدير CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200/60">
          <FiSearch className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="بحث باسم العميل، رقم الهاتف، أو اسم الخدمة..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#1a2b3c] placeholder:text-slate-400 outline-none flex-1 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200/60">
          <FiFilter className="w-4 h-4 text-slate-400 shrink-0" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as BookingStatus | "all")} className="bg-transparent text-sm font-bold text-[#1a2b3c] outline-none cursor-pointer">
            <option value="all">كل الحالات التشغيلية</option>
            <option value="new">جديد</option>
            <option value="confirmed">مؤكد</option>
            <option value="cancelled">ملغي</option>
            <option value="completed">منتهي</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200/60">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-transparent text-sm font-bold text-[#1a2b3c] outline-none cursor-pointer">
            <option value="all">كل أقسام الخدمات</option>
            <option value="car">سيارة ليموزين</option>
            <option value="fast_track">مسار سريع VIP</option>
            <option value="hotel">فندق</option>
            <option value="flight">طيران</option>
            <option value="apartment">شقة فندقية</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                {["العميل", "الهاتف والتواصل", "الخدمة المطلوبة", "فئة الخدمة", "التاريخ", "الحالة", "تفاصيل الحجز والمسافرين", "تعديل الحالة"].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={8} className="px-6 py-16 text-center text-slate-400 text-sm">جاري تحميل البيانات…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-16 text-center text-slate-400 text-sm">لا توجد نتائج مطابقة للبحث</td></tr>
              ) : filtered.map(b => {
                const s = statusConfig[b.status] || statusConfig.new;
                const cleanPhone = b.phone ? b.phone.replace(/\D/g, "") : "";
                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <Link 
                        href={`/admin/customers/${encodeURIComponent(cleanPhone || b.phone)}`}
                        className="flex items-center gap-3 group/client"
                      >
                        <div className="w-9 h-9 rounded-full bg-[#1a2b3c] group-hover/client:bg-[#d0a755] group-hover/client:text-[#1a2b3c] text-[#d0a755] flex items-center justify-center font-black text-xs shrink-0 transition-colors shadow-sm">
                          {b.customerName ? b.customerName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-[#1a2b3c] text-sm group-hover/client:text-[#d0a755] transition-colors">{b.customerName}</p>
                          <span className="text-[11px] font-bold text-[#d0a755] flex items-center gap-1 mt-0.5">
                            <FiClock className="w-3 h-3" /> فتح الملف الكامل
                          </span>
                        </div>
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-600">{b.phone}</span>
                        {cleanPhone && (
                          <a 
                            href={`https://wa.me/${cleanPhone}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"
                            title="تواصل عبر الواتساب"
                          >
                            <FiMessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-700 font-medium">{b.serviceName}</td>
                    <td className="px-6 py-4">
                      <ServiceBadge type={b.type} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs" dir="ltr">{formatDateTime(b.date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3.5 py-1 rounded-full text-xs font-black border ${s.bg} ${s.color} ${s.border}`}>
                        {s.label}
                      </span>
                    </td>

                    {/* View Details Button */}
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForDetails(b)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 text-[#1a2b3c] hover:bg-[#d0a755] hover:text-[#1a2b3c] border border-amber-200/80 text-xs font-black transition-all shadow-xs cursor-pointer group"
                        title="عرض أسماء المسافرين والملاحظات وكافة التفاصيل"
                      >
                        <FiEye className="w-3.5 h-3.5 text-[#d0a755] group-hover:text-[#1a2b3c]" />
                        <span>عرض التفاصيل</span>
                        {b.passengers > 1 && (
                          <span className="bg-[#1a2b3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {b.passengers} أفراد
                          </span>
                        )}
                      </button>
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

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBookingForDetails}
        onClose={() => setSelectedBookingForDetails(null)}
      />
    </div>
  );
}
