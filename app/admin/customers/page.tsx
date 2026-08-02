import { getBookings, getReviews } from "@/lib/data";
import { FiUsers, FiSearch, FiPhone, FiMessageCircle, FiArrowRight, FiShield, FiStar, FiCalendar, FiClock } from "react-icons/fi";
import Link from "next/link";
import { CustomersListClient } from "./CustomersListClient";

export default async function CustomersPage() {
  const [bookings, reviews] = await Promise.all([
    getBookings(),
    getReviews()
  ]);

  // Group bookings by phone number
  const customersMap = new Map<string, {
    name: string;
    phone: string;
    cleanPhone: string;
    bookingsCount: number;
    completedCount: number;
    cancelledCount: number;
    totalSpent: number;
    lastBookingDate: string;
  }>();

  bookings.forEach(b => {
    const rawPhone = b.phone || "بدون رقم";
    const cleanPhone = rawPhone.replace(/\D/g, "") || rawPhone;
    
    if (!customersMap.has(cleanPhone)) {
      customersMap.set(cleanPhone, {
        name: b.customerName || "عميل بدون اسم",
        phone: rawPhone,
        cleanPhone,
        bookingsCount: 0,
        completedCount: 0,
        cancelledCount: 0,
        totalSpent: 0,
        lastBookingDate: b.date || b.createdAt || "",
      });
    }

    const customer = customersMap.get(cleanPhone)!;
    customer.bookingsCount += 1;
    if (b.status === "completed" || b.status === "confirmed") {
      customer.completedCount += 1;
    }
    if (b.status === "cancelled") {
      customer.cancelledCount += 1;
    }
    customer.totalSpent += (b.price || 3500);
  });

  const customersList = Array.from(customersMap.values());

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 animate-reveal-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d0a755]/15 border border-[#d0a755]/30 text-[#1a2b3c] text-xs font-black mb-2">
            <FiUsers className="w-3.5 h-3.5 text-[#d0a755]" /> دليل وإدارة العملاء
          </div>
          <h1 className="text-3xl font-black text-[#1a2b3c] tracking-tight">سجل العملاء التراكمي</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            إجمالي عدد العملاء المسجلين في النظام: <strong className="text-[#1a2b3c]">{customersList.length} عميل</strong>
          </p>
        </div>
      </div>

      {/* Client Search and Directory List */}
      <CustomersListClient customers={customersList} />
    </div>
  );
}
