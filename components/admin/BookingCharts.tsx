"use client";

import type { Booking, BookingStatus } from "@/lib/types";

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "جديد",   color: "#3b82f6", bg: "bg-blue-500" },
  confirmed: { label: "مؤكد",  color: "#10b981", bg: "bg-emerald-500" },
  completed: { label: "مكتمل", color: "#64748b", bg: "bg-slate-500" },
  cancelled: { label: "ملغي",  color: "#f43f5e", bg: "bg-rose-500" },
};

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  car:        { label: "سيارات ليموزين", color: "#d0a755", bg: "bg-[#d0a755]" },
  fast_track: { label: "مسار سريع VIP",  color: "#8b5cf6", bg: "bg-purple-500" },
  hotel:      { label: "حجوزات فنادق",   color: "#06b6d4", bg: "bg-cyan-500" },
};

export function BookingStatusChart({ bookings }: { bookings: Booking[] }) {
  const total = bookings.length || 1;
  const counts = Object.entries(STATUS_CONFIG).map(([status, cfg]) => ({
    ...cfg,
    status,
    count: bookings.filter(b => b.status === status).length,
  }));

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-[#1a2b3c] text-base tracking-tight">حالة الحجوزات التشغيلية</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">توزيع الطلبات حسب حالة المعالجة</p>
        </div>
        <span className="text-xs font-black px-3 py-1 bg-slate-100 rounded-full text-slate-600">
          إجمالي {bookings.length}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-center my-auto py-2">
        {/* Animated SVG Donut Chart */}
        <div className="flex items-center justify-center">
          <DonutChart segments={counts.map(c => ({ value: c.count, color: c.color }))} total={bookings.length} />
        </div>

        {/* Legend Breakdown */}
        <div className="space-y-3">
          {counts.map(({ label, color, count }) => {
            const percentage = Math.round((count / total) * 100);
            return (
              <div key={label} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-between transition-all hover:bg-slate-100/50">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-xs font-bold text-[#1a2b3c]">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#1a2b3c]">{count}</span>
                  <span className="text-[11px] font-bold text-slate-400">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BookingTypeChart({ bookings }: { bookings: Booking[] }) {
  const total = bookings.length || 1;
  const counts = Object.entries(TYPE_CONFIG).map(([type, cfg]) => ({
    ...cfg,
    type,
    count: bookings.filter(b => b.type === type).length,
  }));

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-[#1a2b3c] text-base tracking-tight">تصنيف الخدمات المطلوبة</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">نسبة الإقبال على أقسام الخدمات</p>
        </div>
      </div>

      <div className="space-y-5 my-auto">
        {counts.map(({ label, color, count }) => {
          const pct = Math.round((count / total) * 100);
          return (
            <div key={label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs font-bold text-[#1a2b3c]">{label}</span>
                </div>
                <span className="text-xs font-black text-[#1a2b3c]">{count} طلب ({pct}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/50">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400 font-medium">الخدمة الأكثر طلباً: <strong className="text-[#d0a755]">ليموزين المطارات والرحلات</strong></p>
      </div>
    </div>
  );
}

export function RevenueTrendChart({ bookings }: { bookings: Booking[] }) {
  const now = new Date();
  const monthsData: { name: string; revenue: number; isCurrent: boolean }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthName = new Intl.DateTimeFormat("ar-EG", { month: "short" }).format(d);

    const monthBookings = bookings.filter(b => {
      const bDate = new Date(b.createdAt || b.date);
      return !isNaN(bDate.getTime()) && bDate.getFullYear() === year && bDate.getMonth() === month;
    });

    const revenue = monthBookings.reduce((sum, b) => sum + (b.price || 3500), 0);

    monthsData.push({
      name: monthName,
      revenue,
      isCurrent: i === 0
    });
  }

  const currentMonthRevenue = monthsData[6].revenue;
  const prevMonthRevenue = monthsData[5].revenue;

  let growthText = "مؤشر مستقر";
  let isGrowthPositive = true;
  if (prevMonthRevenue > 0) {
    const diffPct = Math.round(((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100);
    if (diffPct > 0) {
      growthText = `↑ +${diffPct}% مقارنة بالشهر السابق`;
    } else if (diffPct < 0) {
      growthText = `↓ ${diffPct}% مقارنة بالشهر السابق`;
      isGrowthPositive = false;
    }
  } else if (currentMonthRevenue > 0) {
    growthText = `↑ نمو جديد هذا الشهر`;
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 3500), 0);
  const formattedRevenue = new Intl.NumberFormat("ar-EG").format(totalRevenue);

  const maxRev = Math.max(...monthsData.map(m => m.revenue), 5000);
  const points = monthsData.map((m, idx) => {
    const x = (idx / 6) * 460 + 20;
    const y = 80 - (m.revenue / maxRev) * 60;
    return { x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, "");

  const areaD = `${pathD} L 480 95 L 20 95 Z`;

  return (
    <div className="flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#d0a755]">تقديرات التشغيل الحية</span>
          <h3 className="font-black text-[#1a2b3c] text-base tracking-tight">مؤشر الإيرادات الإجمالي</h3>
        </div>
        <div className="text-left">
          <p className="text-xl font-black text-[#1a2b3c] leading-none">{formattedRevenue} <span className="text-xs text-[#d0a755]">ج.م</span></p>
          <p className={`text-[10px] font-bold mt-1 ${isGrowthPositive ? "text-emerald-600" : "text-rose-500"}`}>
            {growthText}
          </p>
        </div>
      </div>

      {/* Dynamic Wave SVG Graphic */}
      <div className="relative h-24 w-full my-auto">
        <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d0a755" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d0a755" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#chartGradient)" />
          <path d={pathD} fill="none" stroke="#d0a755" strokeWidth="3.5" strokeLinecap="round" />
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={monthsData[idx].isCurrent ? "6" : "3.5"}
              fill={monthsData[idx].isCurrent ? "#1a2b3c" : "#d0a755"}
              stroke="#d0a755"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-100">
        {monthsData.map((m, i) => (
          <span key={i} className={m.isCurrent ? "text-[#d0a755] font-black" : ""}>
            {m.name} {m.isCurrent ? "(الحالي)" : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ segments, total }: { segments: { value: number; color: string }[]; total: number }) {
  const size = 120;
  const r = 42;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const totalVal = segments.reduce((a, s) => a + s.value, 0) || 1;
  const slices = segments.map(seg => {
    const ratio = seg.value / totalVal;
    const dash = ratio * circumference;
    const slice = { ...seg, dash, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="relative group">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="12"
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="round"
            className="transition-all duration-700 hover:opacity-80 cursor-pointer"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-2xl font-black text-[#1a2b3c] leading-none">{total}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">طلب</p>
        </div>
      </div>
    </div>
  );
}
