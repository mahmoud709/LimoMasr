"use client";

import type { Booking, BookingStatus } from "@/lib/types";

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string }> = {
  new:       { label: "جديد",   color: "#3b82f6" },
  confirmed: { label: "مؤكد",  color: "#22c55e" },
  cancelled: { label: "ملغي",  color: "#ef4444" },
  completed: { label: "منتهي", color: "#94a3b8" },
};

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  car:        { label: "سيارة",     color: "#d0a755" },
  fast_track: { label: "فاست تراك", color: "#8b5cf6" },
  hotel:      { label: "فندق",      color: "#14b8a6" },
};

export function BookingStatusChart({ bookings }: { bookings: Booking[] }) {
  const total = bookings.length || 1;
  const counts = Object.entries(STATUS_CONFIG).map(([status, cfg]) => ({
    ...cfg,
    status,
    count: bookings.filter(b => b.status === status).length,
  }));

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
      <h3 className="font-black text-[#1a2b3c] text-sm uppercase tracking-wide mb-5">توزيع الحجوزات</h3>
      {/* Bar chart */}
      <div className="space-y-3">
        {counts.map(({ label, color, count }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#1a2b3c]/70">{label}</span>
              <span className="text-xs font-black text-[#1a2b3c]">{count}</span>
            </div>
            <div className="w-full bg-[#f0f2f5] rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(count / total) * 100}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Donut */}
      <div className="mt-6 flex items-center justify-center">
        <DonutChart segments={counts.map(c => ({ value: c.count, color: c.color }))} total={bookings.length} />
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
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
      <h3 className="font-black text-[#1a2b3c] text-sm uppercase tracking-wide mb-5">أنواع الخدمات</h3>
      <div className="space-y-3">
        {counts.map(({ label, color, count }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#1a2b3c]/70">{label}</span>
              <span className="text-xs font-black text-[#1a2b3c]">{count} ({Math.round((count / total) * 100)}%)</span>
            </div>
            <div className="w-full bg-[#f0f2f5] rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(count / total) * 100}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {counts.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-xs text-[#1a2b3c]/60 font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ segments, total }: { segments: { value: number; color: string }[]; total: number }) {
  const size = 100;
  const r = 35;
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
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f2f5" strokeWidth="10" />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="10"
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-black text-[#1a2b3c] leading-none">{total}</p>
          <p className="text-[9px] font-bold text-[#1a2b3c]/40 mt-0.5">حجز</p>
        </div>
      </div>
    </div>
  );
}
