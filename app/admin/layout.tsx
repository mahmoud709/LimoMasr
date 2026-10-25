import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { headers, cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { QueryProvider } from "@/components/QueryProvider";
import { ToastProvider } from "@/components/admin/ToastProvider";

export const metadata = {
  robots: { index: false, follow: false },
  title: "لوحة التحكم — ليمو مصر",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  const isAuthenticated = token ? verifyAdminToken(token) : false;

  if (!isAuthenticated) {
    const requestHeaders = await headers();
    if (requestHeaders.get("x-site-path") !== "/admin/login") redirect("/ar/admin/login");
    return (
      <div className="min-h-screen bg-[#1a2b3c]" dir="rtl">
        {children}
      </div>
    );
  }

  return (
    <QueryProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[#f0f2f5] flex" dir="rtl">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0 lg:mr-64">
            <AdminHeader />
            {children}
          </div>
        </div>
      </ToastProvider>
    </QueryProvider>
  );
}
