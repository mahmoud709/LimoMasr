"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome, FiCalendar, FiTruck, FiZap,
  FiMapPin, FiSettings, FiExternalLink, FiLogOut,
  FiMenu, FiX,
} from "react-icons/fi";

const navItems = [
  { href: "/admin", label: "الرئيسية", icon: FiHome, exact: true },
  { href: "/admin/bookings", label: "الحجوزات", icon: FiCalendar },
  { href: "/admin/cars", label: "السيارات", icon: FiTruck },
  { href: "/admin/fast-track", label: "فاست تراك", icon: FiZap },
  { href: "/admin/hotels", label: "الفنادق", icon: FiMapPin },
  { href: "/admin/settings", label: "الإعدادات", icon: FiSettings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d0a755] flex items-center justify-center shadow-lg">
            <span className="text-[#1a2b3c] font-black text-lg">L</span>
          </div>
          <div>
            <p className="text-white font-black text-base leading-tight">ليمو مصر</p>
            <p className="text-white/40 text-xs font-medium">لوحة التحكم</p>
          </div>
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="mr-auto lg:hidden text-white/40 hover:text-white transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                active
                  ? "bg-[#d0a755] text-[#1a2b3c] shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-[#1a2b3c]" : "text-white/50 group-hover:text-white"}`} />
              {label}
              {active && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-[#1a2b3c]/40" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/8 transition-all duration-200 group">
          <FiExternalLink className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
          عرض الموقع
        </Link>
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 right-0 h-full w-64 bg-[#1a2b3c] flex-col z-40 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 bg-[#1a2b3c] rounded-xl flex items-center justify-center text-white shadow-lg"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-[#1a2b3c] flex flex-col z-50 shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
        <SidebarContent />
      </aside>
    </>
  );
}

function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
    >
      <FiLogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
      تسجيل الخروج
    </button>
  );
}
