"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FiSearch, FiPhone, FiMessageCircle, FiArrowRight, FiShield, FiStar, FiCalendar, FiClock } from "react-icons/fi";

interface CustomerSummary {
  name: string;
  phone: string;
  cleanPhone: string;
  bookingsCount: number;
  completedCount: number;
  cancelledCount: number;
  totalSpent: number;
  lastBookingDate: string;
}

export function CustomersListClient({ customers }: { customers: CustomerSummary[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return customers;
    const query = search.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.phone.includes(query) || 
      c.cleanPhone.includes(query)
    );
  }, [customers, search]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200/60">
          <FiSearch className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="بحث باسم العميل أو رقم الهاتف..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-[#1a2b3c] placeholder:text-slate-400 outline-none flex-1 font-medium"
          />
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 bg-white rounded-3xl border border-slate-100 text-center">
            <FiSearch className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-600">لم نجد أي عميل مطابق للبحث</p>
          </div>
        ) : filtered.map(c => {
          const cancellationRate = c.bookingsCount > 0 ? Math.round((c.cancelledCount / c.bookingsCount) * 100) : 0;
          
          let vipTier = { label: "عميل جديد", color: "bg-slate-100 text-slate-700 border-slate-200" };
          if (cancellationRate > 50 && c.bookingsCount >= 2) {
            vipTier = { label: "⚠️ إلغاء متكرر", color: "bg-rose-100 text-rose-800 border-rose-200" };
          } else if (c.bookingsCount >= 4 || c.totalSpent >= 15000) {
            vipTier = { label: "👑 عميل ذهبي VIP", color: "bg-[#d0a755]/20 text-[#1a2b3c] border-[#d0a755]" };
          } else if (c.bookingsCount >= 2) {
            vipTier = { label: "⭐️ عميل مميز", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
          }

          const formattedSpent = new Intl.NumberFormat("ar-EG").format(c.totalSpent);

          return (
            <div key={c.cleanPhone} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-[#d0a755]/30 transition-all duration-300 flex flex-col justify-between space-y-5 group">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1a2b3c] group-hover:bg-[#d0a755] group-hover:text-[#1a2b3c] text-[#d0a755] font-black text-lg flex items-center justify-center shadow-md transition-colors">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-[#1a2b3c] text-lg leading-tight group-hover:text-[#d0a755] transition-colors">{c.name}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5" dir="ltr">{c.phone}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${vipTier.color}`}>
                    {vipTier.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block">عدد الرحلات</span>
                    <span className="text-lg font-black text-[#1a2b3c]">{c.bookingsCount} حجز</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block">إجمالي الإنفاق</span>
                    <span className="text-lg font-black text-[#1a2b3c]">{formattedSpent} <span className="text-[10px] text-[#d0a755]">ج.م</span></span>
                  </div>
                </div>

                {c.cancelledCount > 0 && (
                  <div className="flex items-center justify-between text-xs text-slate-500 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                    <span>عدد الإلغاءات: <strong className="text-rose-600">{c.cancelledCount}</strong></span>
                    <span className="text-[11px] font-bold text-rose-600">نسبة {cancellationRate}%</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <a 
                    href={`tel:${c.phone}`}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#1a2b3c] hover:text-white text-slate-600 flex items-center justify-center transition-colors"
                    title="اتصال تلفوني"
                  >
                    <FiPhone className="w-3.5 h-3.5" />
                  </a>
                  {c.cleanPhone && (
                    <a 
                      href={`https://wa.me/${c.cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 border border-emerald-200 flex items-center justify-center transition-colors"
                      title="محادثة واتساب"
                    >
                      <FiMessageCircle className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <Link 
                  href={`/admin/customers/${encodeURIComponent(c.cleanPhone)}`}
                  className="px-4 py-2 rounded-xl bg-[#1a2b3c] text-white text-xs font-black hover:bg-[#d0a755] hover:text-[#1a2b3c] transition-colors flex items-center gap-2"
                >
                  فتح الملف الكامل <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
