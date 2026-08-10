import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { cookies } from "next/headers";

export const metadata = {
  title: "لوحة التحكم — ليمو مصر",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("admin-token");

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-[#1a2b3c]" dir="rtl">{children}</div>;
  }

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
