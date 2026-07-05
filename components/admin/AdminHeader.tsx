"use client";

import { useState, useEffect, useRef } from "react";
import { FiBell, FiCalendar, FiClock } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking } from "@/lib/types";
import { useToast } from "@/components/admin/ToastProvider";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch bookings using React Query (shares cache with Bookings Page)
  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("فشل في جلب الإشعارات");
      return res.json();
    }
  });

  // Calculate new bookings
  const newBookings = bookings.filter(b => b.status === "new");
  
  // Sort by date descending to get the most recent
  const sortedNewBookings = [...newBookings].sort((a, b) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
  
  const last10 = sortedNewBookings.slice(0, 10);
  const prevCount = useRef<number>(0);

  // Global SSE Listener for Real-Time Updates
  useEffect(() => {
    const sse = new EventSource("/api/admin/bookings/stream");
    
    sse.onmessage = (event) => {
      try {
        const newBooking = JSON.parse(event.data);
        queryClient.setQueryData<Booking[]>(["bookings"], (old) => {
          if (!old) return [newBooking];
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

  // Audio and Toast Trigger
  useEffect(() => {
    if (newBookings.length > prevCount.current && prevCount.current !== 0) {
      toast.info(`هناك حجز جديد وارد! لدينا الآن ${newBookings.length} حجوزات جديدة.`);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
    prevCount.current = newBookings.length;
  }, [newBookings.length, toast]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-20 bg-white border-b border-slate-100 flex items-center justify-end px-8 sticky top-0 z-30 shadow-sm">
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
        >
          <FiBell className="w-5 h-5" />
          {newBookings.length > 0 && (
            <span className="absolute top-2 right-2 flex w-3.5 h-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full w-3.5 h-3.5 bg-rose-500 border-2 border-white text-[9px] items-center justify-center text-white font-black">
              </span>
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute left-0 mt-3 w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 origin-top-left">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-black text-[#0F1115] text-sm tracking-tight">أحدث الإشعارات</h3>
              <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-1 rounded-md">
                {newBookings.length} جديد
              </span>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {last10.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <FiBell className="w-8 h-8 text-slate-200 mb-3" />
                  <p className="text-sm font-bold text-slate-400">لا توجد إشعارات جديدة</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {last10.map((booking) => (
                    <Link 
                      href="/admin/bookings" 
                      key={booking.id}
                      onClick={() => setIsOpen(false)}
                      className="p-4 flex gap-4 hover:bg-slate-50 transition-colors group block"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#BCA37F]/10 text-[#BCA37F] flex items-center justify-center shrink-0">
                        <FiCalendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#0F1115] mb-0.5">
                          حجز جديد من <span className="text-[#BCA37F]">{booking.customerName}</span>
                        </p>
                        <p className="text-xs font-medium text-slate-500 line-clamp-1 mb-1.5">
                          {booking.serviceName}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <FiClock className="w-3 h-3" />
                          {booking.createdAt ? formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true, locale: ar }) : "الآن"}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
              <Link 
                href="/admin/bookings"
                onClick={() => setIsOpen(false)}
                className="text-xs font-black text-[#BCA37F] hover:text-[#0F1115] transition-colors"
              >
                عرض كل الحجوزات
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
