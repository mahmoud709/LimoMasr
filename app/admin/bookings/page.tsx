"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { Booking, BookingStatus } from "@/lib/types";
import { FiDownload, FiSearch, FiFilter } from "react-icons/fi";
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
};

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Fetch Bookings with React Query - Polling every 5 seconds for Real-time updates
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      if (!res.ok) throw new Error("فشل في جلب الحجوزات");
      return res.json();
    }
  });

  // Listen to Server-Sent Events (SSE) for Real-Time Bookings
  useEffect(() => {
    const sse = new EventSource("/api/admin/bookings/stream");
    
    sse.onmessage = (event) => {
      try {
        const newBooking = JSON.parse(event.data);
        queryClient.setQueryData<Booking[]>(["bookings"], (old) => {
          if (!old) return [newBooking];
          // Prevent duplicates
          if (old.some(b => b.id === newBooking.id)) return old;
          return [newBooking, ...old];
        });
      } catch (err) {
        console.error("SSE parse error", err);
      }
    };

    return () => {
      sse.close();
    };
  }, [queryClient]);

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

  // Real-time Sound & Toast Notification for new bookings
  const newCount = bookings.filter(b => b.status === "new").length;
  const prevNewCountRef = useRef<number | null>(null);

  useEffect(() => {
    // Only alert if we already established the initial count and it increased
    if (prevNewCountRef.current !== null && newCount > prevNewCountRef.current) {
      toast.info(`هناك حجز جديد وارد! لدينا الآن ${newCount} حجوزات جديدة.`);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
    prevNewCountRef.current = newCount;
  }, [newCount, toast]);

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
                    <td className="px-5 py-4 font-bold text-[#1a2b3c]">{b.customerName}</td>
                    <td className="px-5 py-4 text-[#1a2b3c]/60 font-mono">{b.phone}</td>
                    <td className="px-5 py-4 text-[#1a2b3c]/70">{b.serviceName}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#1a2b3c]/8 text-[#1a2b3c] text-xs font-bold">
                        {typeLabels[b.type] ?? b.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#1a2b3c]/50">{b.date}</td>
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
    </div>
  );
}
