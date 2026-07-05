import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata = {
  title: "لوحة التحكم — ليمو مصر",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:mr-64">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
