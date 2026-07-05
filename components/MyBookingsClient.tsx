"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ToastProvider";
import { FiCalendar, FiTruck, FiZap, FiMapPin, FiLogOut, FiSlash, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";
import type { Booking, BookingStatus } from "@/lib/types";

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string; border: string; icon: any }> = {
  new:       { label: "جديد",    labelEn: "New",       color: "text-blue-700",  bg: "bg-blue-50",  border: "border-blue-200", icon: FiAlertCircle } as any,
  confirmed: { label: "مؤكد",   labelEn: "Confirmed", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: FiCheckCircle } as any,
  cancelled: { label: "ملغي",   labelEn: "Cancelled", color: "text-red-700",   bg: "bg-red-50",   border: "border-red-200", icon: FiXCircle } as any,
  completed: { label: "منتهي",  labelEn: "Completed", color: "text-gray-600",  bg: "bg-gray-50",  border: "border-gray-200", icon: FiClock } as any,
};

const serviceIcons = {
  car: FiTruck,
  fast_track: FiZap,
  hotel: FiMapPin,
};

const typeLabels: Record<string, { ar: string; en: string }> = {
  car: { ar: "ليموزين", en: "Limousine" },
  fast_track: { ar: "المسار السريع", en: "Fast Track" },
  hotel: { ar: "فندق", en: "Hotel Room" },
};

// Date formatter helper using Intl API
function formatBookingDate(dateStr: string, lang: "ar" | "en") {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    
    // Check if the original string specifies a time (has T or space or colon)
    const hasTime = dateStr.includes("T") || dateStr.includes(" ") || dateStr.includes(":");
    
    const formattedDate = d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    if (hasTime) {
      const formattedTime = d.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return lang === "ar" ? `${formattedDate} - ${formattedTime}` : `${formattedDate} at ${formattedTime}`;
    }
    
    return formattedDate;
  } catch {
    return dateStr;
  }
}

export function MyBookingsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "ar";
  const queryClient = useQueryClient();
  const toast = useToast();

  const [page, setPage] = useState(1);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const t = {
    ar: {
      welcome: "مرحباً بك،",
      logout: "تسجيل الخروج",
      title: "حجوزاتي",
      subtitle: "تابع تفاصيل وإلغاء حجوزاتك النشطة",
      loading: "جاري التحميل...",
      noBookings: "لا توجد لديك حجوزات حتى الآن.",
      bookNow: "احجز رحلتك الأولى الآن",
      cancel: "إلغاء الحجز",
      cancelling: "جاري الإلغاء...",
      cancelConfirm: "هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟",
      cancelSuccess: "تم إلغاء الحجز بنجاح",
      cancelError: "فشل إلغاء الحجز",
      bookingDate: "تاريخ الحجز",
      passengers: "الأفراد: ",
      price: "السعر: ",
      egp: "ج.م",
      status: "حالة الحجز",
      notes: "الملاحظات: ",
    },
    en: {
      welcome: "Welcome, ",
      logout: "Log Out",
      title: "My Bookings",
      subtitle: "Track, manage and cancel your active bookings",
      loading: "Loading bookings...",
      noBookings: "You have no bookings yet.",
      bookNow: "Book your first service now",
      cancel: "Cancel Booking",
      cancelling: "Cancelling...",
      cancelConfirm: "Are you sure you want to cancel this booking?",
      cancelSuccess: "Booking cancelled successfully",
      cancelError: "Failed to cancel booking",
      bookingDate: "Booking Date",
      passengers: "Guests: ",
      price: "Price: ",
      egp: "EGP",
      status: "Status",
      notes: "Notes: ",
    }
  }[lang];

  // 1. Get Logged-in Customer
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["customerMe"],
    queryFn: async () => {
      const res = await fetch("/api/customer/me");
      if (!res.ok) return { user: null };
      return res.json();
    },
  });

  const user = authData?.user;

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(lang === "en" ? "/login?lang=en" : "/login");
    }
  }, [user, authLoading, router, lang]);

  // 2. Get Customer's Paginated Bookings
  const { data: bookingsData = { bookings: [], total: 0, totalPages: 0 }, isLoading: bookingsLoading } = useQuery({
    queryKey: ["customerBookings", page],
    queryFn: async () => {
      const res = await fetch(`/api/customer/bookings?page=${page}&limit=12`);
      if (!res.ok) throw new Error("فشل تحميل الحجوزات");
      return res.json();
    },
    enabled: !!user,
  });

  const bookings = bookingsData.bookings as Booking[];
  const totalPages = bookingsData.totalPages || 0;

  // 3. Mutation to Cancel Booking
  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/customer/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "cancelled" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "فشل إلغاء الحجز");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      toast.success(t.cancelSuccess);
    },
    onError: (err: any) => {
      toast.error(err.message || t.cancelError);
    },
  });

  // 4. Mutation to Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch("/api/customer/logout", { method: "POST" });
    },
    onSuccess: () => {
      router.push(lang === "en" ? "/login?lang=en" : "/login");
      router.refresh();
    },
  });

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center text-[#1a2b3c]/50 font-bold">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Welcome Banner */}
      <div className="bg-[#1a2b3c] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-[#d0a755]/30">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, #d0a755 0%, transparent 20%)' }}></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-black mb-1">
              {t.welcome} <span className="text-[#d0a755]">{user.name}</span>!
            </h2>
            <p className="text-white/60 text-xs md:text-sm font-medium">{user.phone}</p>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-400 font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm border border-white/10 transition-colors cursor-pointer self-start"
          >
            <FiLogOut className="w-4 h-4" />
            {t.logout}
          </button>
        </div>
      </div>

      {/* Bookings Section */}
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#1a2b3c]">{t.title}</h1>
          <p className="text-sm text-[#1a2b3c]/50 mt-1">{t.subtitle}</p>
        </div>

        {bookingsLoading ? (
          <div className="text-center py-20 text-[#1a2b3c]/30 font-bold">{t.loading}</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f9f8f6] flex items-center justify-center mx-auto mb-4 text-[#1a2b3c]/20 text-2xl">📋</div>
            <p className="text-[#1a2b3c]/60 font-bold mb-4">{t.noBookings}</p>
            <button
              onClick={() => router.push(lang === "en" ? "/?lang=en" : "/")}
              className="bg-[#d0a755] text-[#1a2b3c] font-black py-2.5 px-6 rounded-xl hover:bg-[#b89040] transition-colors text-sm"
            >
              {t.bookNow}
            </button>
          </div>
        ) : (
          <>
            {/* Show 3 columns at LG screen widths (3 in a row) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookings.map((booking) => {
                const ServiceIcon = serviceIcons[booking.type] || FiCalendar;
                const typeLabel = typeLabels[booking.type]?.[lang] || booking.type;
                const s = statusConfig[booking.status];
                const StatusIcon = s?.icon || FiClock;
                const statusLabel = lang === "en" ? (s as any)?.labelEn : s?.label;

                return (
                  <div key={booking.id} className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                    {/* Card Header */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg bg-[#1a2b3c]/5 text-[#1a2b3c] flex items-center justify-center shrink-0">
                            <ServiceIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[#1a2b3c]/50 text-[10px] font-bold uppercase tracking-wider">{typeLabel}</p>
                            <h3 className="font-black text-[#1a2b3c] text-sm leading-tight mt-0.5">{booking.serviceName}</h3>
                          </div>
                        </div>

                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border ${s?.bg} ${s?.color} ${s?.border}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusLabel}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-bold text-[#1a2b3c]/70 border-t border-black/5 pt-4">
                        <div className="flex items-start gap-2">
                          <FiCalendar className="w-3.5 h-3.5 text-[#d0a755] mt-0.5 shrink-0" />
                          <span className="leading-relaxed">
                            {t.bookingDate}: <span className="text-[#1a2b3c] font-black">{formatBookingDate(booking.date, lang)}</span>
                          </span>
                        </div>
                        
                        {booking.passengers && (
                          <p>{t.passengers} <span className="text-[#1a2b3c]">{booking.passengers}</span></p>
                        )}

                        {booking.price && (
                          <p>{t.price} <span className="text-[#d0a755] font-black">{booking.price.toLocaleString(lang === "en" ? "en-US" : "ar-EG")} {t.egp}</span></p>
                        )}

                        {booking.notes && (
                          <p className="text-xs text-[#1a2b3c]/50 font-medium bg-[#f9f8f6] p-2.5 rounded-lg mt-2">
                            {t.notes}{booking.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions: ONLY allow cancellation if status is "new" (جديد) */}
                    {booking.status === "new" && (
                      <div className="mt-5 pt-4 border-t border-black/5">
                        <button
                          onClick={() => setBookingToCancel(booking.id)}
                          className="w-full flex items-center justify-center gap-2 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          <FiSlash className="w-3.5 h-3.5" />
                          {t.cancel}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12" dir="ltr">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-black/10 rounded-xl text-xs font-bold text-[#1a2b3c] hover:bg-[#1a2b3c]/5 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  {lang === "en" ? "Previous" : "السابق"}
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-[#1a2b3c] text-white shadow-md shadow-[#1a2b3c]/20"
                        : "border border-black/10 text-[#1a2b3c] hover:bg-[#1a2b3c]/5"
                    }`}
                  >
                    {pageNum.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-black/10 rounded-xl text-xs font-bold text-[#1a2b3c] hover:bg-[#1a2b3c]/5 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  {lang === "en" ? "Next" : "التالي"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-black/5 p-6 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <FiLogOut className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-black text-[#1a2b3c] mb-2">
              {lang === "en" ? "Log Out" : "تسجيل الخروج"}
            </h3>
            <p className="text-xs font-bold text-[#1a2b3c]/60 leading-relaxed mb-6">
              {lang === "en" ? "Are you sure you want to log out of your account?" : "هل أنت متأكد من رغبتك في تسجيل الخروج من حسابك؟"}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all cursor-pointer"
              >
                {lang === "en" ? "Cancel" : "إلغاء"}
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logoutMutation.mutate();
                }}
                className="bg-red-500 text-white hover:bg-red-600 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-red-500/20 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                {lang === "en" ? "Log Out" : "خروج"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-black/5 p-6 w-full max-w-sm shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-200">
              <FiSlash className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-black text-[#1a2b3c] mb-2">
              {lang === "en" ? "Cancel Booking" : "إلغاء الحجز"}
            </h3>
            <p className="text-xs font-bold text-[#1a2b3c]/60 leading-relaxed mb-6">
              {lang === "en" ? "Are you sure you want to cancel this booking? This action cannot be undone." : "هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setBookingToCancel(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all cursor-pointer"
              >
                {lang === "en" ? "Close" : "تراجع"}
              </button>
              <button
                onClick={() => {
                  const id = bookingToCancel;
                  setBookingToCancel(null);
                  cancelMutation.mutate(id);
                }}
                disabled={cancelMutation.isPending}
                className="bg-red-500 text-white hover:bg-red-600 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-red-500/20 hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {cancelMutation.isPending ? (lang === "en" ? "Cancelling..." : "جاري الإلغاء...") : (lang === "en" ? "Confirm Cancel" : "تأكيد الإلغاء")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
