import { getBookings, getCars, getFastTrackPackages, getHotels, getReviews } from "@/lib/data";
import { 
  FiCalendar, FiTruck, FiZap, FiDollarSign, FiTrendingUp, 
  FiAlertCircle, FiCheckCircle, FiClock, FiXCircle, FiLayers, FiEye
} from "react-icons/fi";
import Link from "next/link";
import { BookingStatusChart, BookingTypeChart, RevenueTrendChart } from "@/components/admin/BookingCharts";
import { RecentBookingsTable } from "@/components/admin/RecentBookingsTable";

export default async function AdminPage() {
  const [bookings, cars, packages, hotels, reviews] = await Promise.all([
    getBookings(),
    getCars(),
    getFastTrackPackages(),
    getHotels(),
    getReviews(),
  ]);

  const newCount       = bookings.filter(b => b.status === "new").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;

  const estimatedTotal = bookings.reduce((acc, b) => acc + (b.price || 3500), 0);
  const formattedTotal = new Intl.NumberFormat("ar-EG").format(estimatedTotal);

  return (
    <div className="flex-1 p-6 md:p-10 lg:p-12 max-w-[1600px] mx-auto w-full space-y-8 animate-reveal-1">
      
      {/* 1. Executive Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#1a2b3c] via-[#0F1115] to-[#1a2b3c] p-8 md:p-12 text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#d0a755]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d0a755]/20 border border-[#d0a755]/30 text-[#d0a755] text-xs font-black tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#d0a755] animate-ping"></span>
              نظام إدارة شبكة ليمو مصر الفاخرة
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              أهلاً بك في مركز التحكم التنفيذي
            </h1>
            <p className="text-white/70 text-sm md:text-base font-light leading-relaxed">
              متابعة حية للأسطول، الحجوزات النشطة، المسار السريع بالمطارات، وتقارير التشغيل اليومية.
            </p>
          </div>

          {/* Quick Stats Widget */}
          <div className="flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="px-4 py-2 border-l border-white/10">
              <p className="text-xs font-bold text-white/50">إجمالي الحجوزات</p>
              <p className="text-2xl font-black text-[#d0a755]">{bookings.length}</p>
            </div>
            <div className="px-4 py-2 border-l border-white/10">
              <p className="text-xs font-bold text-white/50">الطلبات الجديدة</p>
              <p className="text-2xl font-black text-emerald-400">{newCount}</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-xs font-bold text-white/50">حالة الخادم</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> متصل وحي
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Executive Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/bookings" className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#d0a755]/30 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1a2b3c] text-[#d0a755] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FiCalendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
              <FiTrendingUp className="w-3 h-3" /> نشط
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">إجمالي الحجوزات</p>
          <p className="text-3xl font-black text-[#1a2b3c] tracking-tight">{bookings.length}</p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{newCount} حجز جديد بانتظار التأكيد</span>
          </div>
        </Link>

        <Link href="/admin/cars" className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#d0a755]/30 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1a2b3c] text-[#d0a755] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FiTruck className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              جاهزية عالية
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">أسطول الليموزين</p>
          <p className="text-3xl font-black text-[#1a2b3c] tracking-tight">{cars.length} <span className="text-sm font-medium text-slate-400">مركبة</span></p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>فئات فاخرة وعائلية</span>
          </div>
        </Link>

        <Link href="/admin/fast-track" className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#d0a755]/30 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1a2b3c] text-[#d0a755] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FiZap className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
              VIP المطارات
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">باقات المسار السريع</p>
          <p className="text-3xl font-black text-[#1a2b3c] tracking-tight">{packages.length} <span className="text-sm font-medium text-slate-400">باقة</span></p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>تغطية كاملة للمطارات</span>
          </div>
        </Link>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#d0a755] text-[#1a2b3c] flex items-center justify-center shadow-lg">
              <FiDollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              تقدير حقيقي
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">إجمالي القيمة التقديرية</p>
          <p className="text-3xl font-black text-[#1a2b3c] tracking-tight">{formattedTotal} <span className="text-xs font-bold text-[#d0a755]">ج.م</span></p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>يشمل كافة الخدمات المنفذة</span>
          </div>
        </div>
      </div>

      {/* 3. Operational Breakdown Quick Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "طلبات جديدة بانتظار الإجراء", value: newCount, icon: FiAlertCircle, color: "text-blue-600", bg: "bg-blue-50/60", border: "border-blue-100" },
          { label: "حجوزات مؤكدة وجارية", value: confirmedCount, icon: FiCheckCircle, color: "text-emerald-600", bg: "bg-emerald-50/60", border: "border-emerald-100" },
          { label: "رحلات مكتملة بالكامل", value: completedCount, icon: FiClock, color: "text-slate-600", bg: "bg-slate-100/60", border: "border-slate-200" },
          { label: "حجوزات ملغاة", value: cancelledCount, icon: FiXCircle, color: "text-rose-600", bg: "bg-rose-50/60", border: "border-rose-100" },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-5 flex items-center gap-4 transition-all hover:bg-white hover:shadow-md`}>
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
              <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.5} />
            </div>
            <div>
              <p className={`text-2xl font-black ${color} leading-none mb-1`}>{value}</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Analytics & Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <BookingStatusChart bookings={bookings} />
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <BookingTypeChart bookings={bookings} />
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <RevenueTrendChart bookings={bookings} />
        </div>
      </div>

      {/* 5. Executive Action Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1a2b3c] text-[#d0a755] flex items-center justify-center font-bold">
            <FiLayers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-[#1a2b3c] text-sm">إدارة المحتوى والخدمات السريعة</h3>
            <p className="text-xs text-slate-400 font-medium">الوصول السريع للأقسام والإعدادات العامة</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/bookings" className="px-4 py-2.5 rounded-xl bg-[#1a2b3c] text-white text-xs font-black hover:bg-[#1a2b3c]/90 transition-colors inline-flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-[#d0a755]" /> جدول الحجوزات
          </Link>
          <Link href="/admin/cars" className="px-4 py-2.5 rounded-xl bg-slate-100 text-[#1a2b3c] text-xs font-bold hover:bg-slate-200 transition-colors inline-flex items-center gap-2">
            <FiTruck className="w-4 h-4 text-slate-500" /> إضافة سيارة
          </Link>
          <Link href="/admin/articles" className="px-4 py-2.5 rounded-xl bg-slate-100 text-[#1a2b3c] text-xs font-bold hover:bg-slate-200 transition-colors inline-flex items-center gap-2">
            <FiEye className="w-4 h-4 text-slate-500" /> المقالات والأخبار
          </Link>
        </div>
      </div>

      {/* 6. Live Interactive Recent Bookings Table with Customer 360 Drawer */}
      <RecentBookingsTable bookings={bookings} reviews={reviews} />
    </div>
  );
}
