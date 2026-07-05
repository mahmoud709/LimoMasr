import { getBookings, getCars, getFastTrackPackages, getHotels } from "@/lib/data";
import { FiCalendar, FiTruck, FiZap, FiMapPin, FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiInbox } from "react-icons/fi";
import Link from "next/link";
import type { BookingStatus } from "@/lib/types";
import { BookingStatusChart, BookingTypeChart } from "@/components/admin/BookingCharts";

const statusConfig: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "جديد",    color: "text-[#0F1115]", bg: "bg-gray-100 border-gray-200" },
  confirmed: { label: "مؤكد",   color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  cancelled: { label: "ملغي",   color: "text-rose-700",   bg: "bg-rose-50 border-rose-200" },
  completed: { label: "منتهي",  color: "text-slate-500",  bg: "bg-slate-50 border-slate-200" },
};

const typeLabels: Record<string, string> = {
  car: "سيارة",
  fast_track: "فاست تراك",
  hotel: "فندق",
};

export default async function AdminPage() {
  const [bookings, cars, packages, hotels] = await Promise.all([
    getBookings(),
    getCars(),
    getFastTrackPackages(),
    getHotels(),
  ]);

  const newCount       = bookings.filter(b => b.status === "new").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;
  const recentBookings = bookings.slice(0, 8);

  const kpis = [
    { label: "أسطول السيارات", value: cars.length,      icon: FiTruck,       color: "bg-[#0F1115]",  href: "/admin/cars" },
    { label: "فاست تراك",     value: packages.length,  icon: FiZap,         color: "bg-[#1E293B]",  href: "/admin/fast-track" },
    { label: "شبكة الفنادق",   value: hotels.length,    icon: FiMapPin,      color: "bg-[#334155]",  href: "/admin/hotels" },
    { label: "الحجوزات النشطة", value: bookings.length,  icon: FiCalendar,    color: "bg-[#BCA37F]",  href: "/admin/bookings" }, // Refined champagne gold
  ];

  const statusCards = [
    { label: "حجوزات جديدة",   value: newCount,       icon: FiAlertCircle,  color: "text-blue-600",  bg: "bg-blue-50/50",   border: "border-blue-100" },
    { label: "مؤكدة للتنفيذ",  value: confirmedCount, icon: FiCheckCircle,  color: "text-emerald-600", bg: "bg-emerald-50/50",  border: "border-emerald-100" },
    { label: "مكتملة ومغلقة",   value: completedCount, icon: FiClock,        color: "text-slate-500",  bg: "bg-slate-50/50",   border: "border-slate-100" },
    { label: "ملغاة",         value: cancelledCount, icon: FiXCircle,      color: "text-rose-600",   bg: "bg-rose-50/50",    border: "border-rose-100" },
  ];

  return (
    <div className="flex-1 p-8 lg:px-12 xl:px-16 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0F1115] tracking-tight">لوحة التحكم التنفيذية</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">نظرة عامة على نشاط شبكة ليمو مصر الفاخرة.</p>
        </div>
      </div>

      {/* KPI Cards - Luxury Metric Display */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {kpis.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex items-center gap-5 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg shadow-black/5 shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110`}>
              <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-black text-[#0F1115] tracking-tight leading-none mb-1">{value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Booking Status Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statusCards.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-5 flex items-center gap-4 transition-colors hover:bg-white`}>
            <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border ${border}`}>
              <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.5} />
            </div>
            <div>
              <p className={`text-2xl font-black ${color} leading-none mb-1`}>{value}</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <BookingStatusChart bookings={bookings} />
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <BookingTypeChart bookings={bookings} />
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-black text-[#0F1115] text-lg tracking-tight">أحدث الطلبات الواردة</h2>
          <Link href="/admin/bookings" className="text-xs font-bold text-[#BCA37F] hover:text-[#9A815C] transition-colors flex items-center gap-1">
            سجل الحجوزات بالكامل <span className="text-lg leading-none">←</span>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b border-slate-100">
                {["العميل", "الخدمة المطلوبة", "فئة الحجز", "تاريخ التنفيذ", "حالة الطلب"].map(h => (
                  <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <FiInbox className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
                      </div>
                      <p className="text-base font-bold text-slate-600 mb-1">صندوق الحجوزات فارغ</p>
                      <p className="text-sm text-slate-400">لا توجد أي حجوزات مسجلة في النظام حتى اللحظة.</p>
                    </div>
                  </td>
                </tr>
              ) : recentBookings.map((b) => {
                const s = statusConfig[b.status];
                return (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group cursor-default">
                    <td className="px-8 py-5">
                      <p className="font-bold text-[#0F1115] text-sm">{b.customerName}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{b.phone}</p>
                    </td>
                    <td className="px-8 py-5 text-slate-600 font-medium">{b.serviceName}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold tracking-wide">
                        {typeLabels[b.type] ?? b.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 text-sm font-medium">{b.date}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3.5 py-1.5 rounded-full text-[11px] font-black border ${s.bg} ${s.color} tracking-wide uppercase`}>
                        {s.label}
                      </span>
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
