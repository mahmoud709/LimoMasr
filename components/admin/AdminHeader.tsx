"use client";

import { useState, useEffect, useRef } from "react";
import { FiBell, FiCalendar, FiClock, FiCheckCircle } from "react-icons/fi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking } from "@/lib/types";
import { useToast } from "@/components/admin/ToastProvider";
import Link from "next/link";

function formatRelativeTime(dateString: string) {
  const diffInSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("ar-EG", { numeric: "auto" });
  
  if (diffInSeconds < 60) return "الآن";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return rtf.format(-diffInMinutes, "minute");
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return rtf.format(-diffInHours, "hour");
  const diffInDays = Math.floor(diffInHours / 24);
  return rtf.format(-diffInDays, "day");
}

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

  // Read State Management
  const [readIds, setReadIds] = useState<string[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem("readNotificationIds");
    if (saved) {
      try { setReadIds(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  function markAsRead(id: string) {
    setReadIds(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem("readNotificationIds", JSON.stringify(next));
      return next;
    });
  }

  const unreadBookings = newBookings.filter(b => !readIds.includes(b.id));

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
          {unreadBookings.length > 0 && (
            <span className="absolute -top-1 -right-1 flex w-5 h-5 items-center justify-center bg-rose-500 rounded-full text-white text-[10px] font-black border-2 border-white shadow-sm">
              {unreadBookings.length}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute left-0 mt-3 w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 origin-top-left">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-black text-[#0F1115] text-sm tracking-tight">أحدث الإشعارات</h3>
              <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-1 rounded-md">
                {unreadBookings.length} غير مقروء
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
                  {last10.map((booking) => {
                    const isRead = readIds.includes(booking.id);
                    return (
                    <div 
                      key={booking.id}
                      className={`p-4 flex gap-4 transition-colors group relative ${isRead ? 'bg-slate-50/50 opacity-70' : 'hover:bg-slate-50 bg-white'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#BCA37F]/10 text-[#BCA37F] flex items-center justify-center shrink-0">
                        <FiCalendar className="w-4 h-4" />
                      </div>
                      <Link 
                        href="/admin/bookings" 
                        onClick={() => { setIsOpen(false); markAsRead(booking.id); }}
                        className="flex-1 block"
                      >
                        <p className={`text-sm mb-0.5 ${isRead ? 'font-medium text-slate-600' : 'font-black text-[#0F1115]'}`}>
                          حجز جديد من <span className="text-[#BCA37F]">{booking.customerName}</span>
                        </p>
                        <p className="text-xs font-medium text-slate-500 line-clamp-1 mb-1.5">
                          {booking.serviceName}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <FiClock className="w-3 h-3" />
                          {booking.createdAt ? formatRelativeTime(booking.createdAt) : "الآن"}
                        </div>
                      </Link>
                      {!isRead && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); markAsRead(booking.id); }}
                          title="تحديد كمقروء"
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-emerald-50 hover:text-emerald-500 transition-colors shrink-0"
                        >
                          <FiCheckCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  )})}
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
