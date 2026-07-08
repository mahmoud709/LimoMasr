"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { Booking, BookingStatus } from "@/lib/types";
import { FiDownload, FiSearch, FiFilter, FiClock, FiX } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/admin/ToastProvider";

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: "جديد",   color: "text-blue-700",  bg: "bg-blue-50",  border: "border-blue-200" },
  confirmed: { label: "مؤكد",  color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
  cancelled: { label: "ملغي",  color: "text-red-700",   bg: "bg-red-50",   border: "border-red-200" },
  completed: { label: "منتهي", color: "text-gray-600",  bg: "bg-gray-50",  border: "border-gray-200" },
};

const typeLabels: Record<string, string> = {
  car: "سيارة",
  fast_track: "فاست تراك",
  hotel: "فندق",
  flight: "طيران",
  apartment: "شقة فندقية",
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
  const [clientHistory, setClientHistory] = useState<string | null>(null);

  // Fetch Bookings with React Query - Polling every 5 seconds for Real-time updates
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      if (!res.ok) throw new Error("فشل في جلب الحجوزات");
      return res.json();
    }
  });

  // SSE and Audio Notifications are now handled globally by the AdminHeader component.
  // The queryClient cache is automatically updated, which triggers a re-render here.

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

  // Note: Audio and toast alert logic has been moved to the global AdminHeader component.

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
      const matchSearch = !search || b.customerName.includes(search) || b.phone.includes(search) || b.serviceName.includes(search);
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const matchType   = typeFilter === "all" || b.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    }),
    [bookings, search, statusFilter, typeFilter]
  );

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a2b3c]">الحجوزات</h1>
          <p className="text-sm text-[#1a2b3c]/50 mt-1">{bookings.length} حجز إجمالي</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 bg-[#1a2b3c] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#2a3d52] transition-colors shadow-sm">
          <FiDownload className="w-4 h-4" />
          تصدير CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 mb-5 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-[#f0f2f5] rounded-xl px-3 py-2">
          <FiSearch className="w-4 h-4 text-[#1a2b3c]/40 shrink-0" />
          <input
            type="text"
            placeholder="بحث باسم العميل أو الهاتف..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#1a2b3c] placeholder:text-[#1a2b3c]/40 outline-none flex-1 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 bg-[#f0f2f5] rounded-xl px-3 py-2">
          <FiFilter className="w-4 h-4 text-[#1a2b3c]/40 shrink-0" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as BookingStatus | "all")} className="bg-transparent text-sm text-[#1a2b3c] outline-none font-medium cursor-pointer">
            <option value="all">كل الحالات</option>
            <option value="new">جديد</option>
            <option value="confirmed">مؤكد</option>
            <option value="cancelled">ملغي</option>
            <option value="completed">منتهي</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[#f0f2f5] rounded-xl px-3 py-2">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-transparent text-sm text-[#1a2b3c] outline-none font-medium cursor-pointer">
            <option value="all">كل الأنواع</option>
            <option value="car">سيارة</option>
            <option value="fast_track">فاست تراك</option>
            <option value="hotel">فندق</option>
            <option value="flight">طيران</option>
            <option value="apartment">شقة فندقية</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right min-w-[900px]">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-black/5">
                {["العميل", "الهاتف", "الخدمة", "النوع", "التاريخ", "الحالة", "إجراء"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-black text-[#1a2b3c]/40 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center text-[#1a2b3c]/30 text-sm">جاري التحميل…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center text-[#1a2b3c]/30 text-sm">لا توجد نتائج</td></tr>
              ) : filtered.map(b => {
                const s = statusConfig[b.status];
                return (
                  <tr key={b.id} className="border-t border-black/5 hover:bg-[#f8f9fa] transition-colors">
                    <td className="px-5 py-4 font-bold text-[#1a2b3c]">
                      <div className="flex items-center justify-end gap-2">
                        {b.customerName}
                        <button 
                          onClick={() => setClientHistory(b.phone)}
                          className="w-7 h-7 rounded-full bg-[#1a2b3c]/5 flex items-center justify-center text-[#1a2b3c]/50 hover:bg-[#1a2b3c] hover:text-[#d0a755] transition-colors"
                          title="عرض سجل العميل"
                        >
                          <FiClock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#1a2b3c]/60 font-mono">{b.phone}</td>
                    <td className="px-5 py-4 text-[#1a2b3c]/70">{b.serviceName}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#1a2b3c]/8 text-[#1a2b3c] text-xs font-bold">
                        {typeLabels[b.type] ?? b.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#1a2b3c]/50" dir="ltr">{formatDateTime(b.date)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${s.bg} ${s.color} ${s.border}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={b.status}
                        onChange={e => updateStatusMutation.mutate({ id: b.id, status: e.target.value as BookingStatus })}
                        disabled={updateStatusMutation.isPending}
                        className="text-xs font-bold rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[#1a2b3c] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d0a755]/50 disabled:opacity-50"
                      >
                        <option value="new">جديد</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="cancelled">ملغي</option>
                        <option value="completed">منتهي</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Client History Modal */}
      {clientHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="font-black text-[#0F1115] text-xl tracking-tight">السجل التاريخي للعميل</h2>
                <p className="text-sm font-medium text-slate-500 mt-1" dir="ltr">{clientHistory}</p>
              </div>
              <button onClick={() => setClientHistory(null)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors shadow-sm border border-slate-100">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
              <div className="space-y-4">
                {bookings.filter(b => b.phone === clientHistory).map((b, idx) => {
                  const s = statusConfig[b.status];
                  return (
                    <div key={b.id} className="p-5 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all bg-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-2 h-full bg-slate-100 group-hover:bg-[#BCA37F] transition-colors" />
                      <div className="flex flex-wrap gap-6 items-center justify-between pr-4">
                        <div>
                          <p className="text-sm font-black text-[#0F1115] mb-1">{b.serviceName}</p>
                          <p className="text-xs font-bold text-slate-500">رقم الحجز: <span className="font-mono text-slate-400">{b.id.split("-")[1]}</span></p>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-600 mb-1" dir="ltr">{formatDateTime(b.date)}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black border ${s.bg} ${s.color} ${s.border}`}>
                            {s.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
