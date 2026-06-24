"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Booking, Car, FastTrackPackage, HotelOption, SiteSettings } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type Tab = "overview" | "cars" | "fast" | "hotels" | "bookings" | "settings";

const tabs: [Tab, string][] = [
  ["overview", "الإحصائيات"],
  ["cars", "السيارات"],
  ["fast", "الفاست تراك"],
  ["hotels", "الفنادق"],
  ["bookings", "الحجوزات"],
  ["settings", "الإعدادات"],
];

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  return response.json();
}

function JsonEditor({ title, value, onSave }: { title: string; value: unknown; onSave: (value: unknown) => Promise<void> }) {
  const [draft, setDraft] = useState(JSON.stringify(value, null, 2));
  const [status, setStatus] = useState("");

  async function save() {
    try {
      await onSave(JSON.parse(draft));
      setStatus("تم الحفظ");
    } catch {
      setStatus("JSON غير صالح");
    }
  }

  return (
    <section className="rounded-lg bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">{title}</h2>
        <button onClick={save} className="rounded-md bg-[#17110d] px-4 py-2 text-sm font-bold text-white">حفظ</button>
      </div>
      <textarea value={draft} onChange={(event) => setDraft(event.target.value)} dir="ltr" className="min-h-[420px] w-full rounded-md border border-black/15 p-3 font-mono text-sm" />
      {status ? <p className="mt-2 text-sm font-bold text-[#7b1f2a]">{status}</p> : null}
    </section>
  );
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [cars, setCars] = useState<Car[]>([]);
  const [packages, setPackages] = useState<FastTrackPackage[]>([]);
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  async function loadAll() {
    const [carsData, fastData, hotelsData, bookingsData, settingsData] = await Promise.all([
      fetchJson<Car[]>("/api/admin/cars"),
      fetchJson<FastTrackPackage[]>("/api/admin/fast-track"),
      fetchJson<HotelOption[]>("/api/admin/hotels"),
      fetchJson<Booking[]>("/api/bookings"),
      fetchJson<SiteSettings>("/api/admin/settings"),
    ]);
    setCars(carsData);
    setPackages(fastData);
    setHotels(hotelsData);
    setBookings(bookingsData);
    setSettings(settingsData);
  }

  const stats = useMemo(() => ({
    cars: cars.length,
    packages: packages.length,
    hotels: hotels.length,
    bookings: bookings.length,
    newBookings: bookings.filter((booking) => booking.status === "new").length,
  }), [cars, packages, hotels, bookings]);

  async function login() {
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123")) {
      await loadAll();
      setLoggedIn(true);
    }
  }

  async function put(url: string, value: unknown) {
    await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });
    await loadAll();
  }

  async function updateBooking(booking: Booking, status: Booking["status"]) {
    await fetch("/api/bookings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: booking.id, status }) });
    await loadAll();
  }

  function exportCsv() {
    const header = ["id", "type", "customerName", "phone", "serviceName", "date", "status", "createdAt"];
    const rows = bookings.map((booking) => header.map((key) => JSON.stringify(String(booking[key as keyof Booking] ?? ""))).join(","));
    const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "limo-masr-bookings.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!loggedIn) {
    return (
      <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#17110d] px-4">
        <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h1 className="text-2xl font-black">دخول لوحة التحكم</h1>
          <p className="mt-2 text-sm text-black/60">كلمة المرور الافتراضية: admin123 أو NEXT_PUBLIC_ADMIN_PASSWORD.</p>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="كلمة المرور" className="mt-5 w-full rounded-md border border-black/15 px-3 py-3" />
          <button onClick={login} className="mt-3 w-full rounded-md bg-[#17110d] px-4 py-3 font-black text-white">دخول</button>
        </section>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7f4ee] text-[#17110d]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black">لوحة تحكم ليمو مصر</h1>
            <p className="text-sm text-black/60">إدارة المحتوى والحجوزات من مكان واحد.</p>
          </div>
          <Link href="/" className="rounded-md bg-[#17110d] px-4 py-2 text-center text-sm font-bold text-white">عرض الموقع</Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <nav className="mb-6 flex gap-2 overflow-x-auto">
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold ${tab === id ? "bg-[#17110d] text-white" : "bg-white"}`}>{label}</button>
          ))}
        </nav>

        {tab === "overview" ? (
          <section className="grid gap-4 md:grid-cols-5">
            {[["السيارات", stats.cars], ["الباقات", stats.packages], ["المدن", stats.hotels], ["الحجوزات", stats.bookings], ["الجديدة", stats.newBookings]].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-white p-5 shadow-sm">
                <p className="text-sm text-black/55">{label}</p>
                <p className="mt-2 text-3xl font-black text-[#7b1f2a]">{value}</p>
              </div>
            ))}
          </section>
        ) : null}

        {tab === "cars" ? <JsonEditor key="cars" title="إدارة السيارات" value={cars} onSave={(value) => put("/api/admin/cars", value)} /> : null}
        {tab === "fast" ? <JsonEditor key="fast" title="إدارة باقات الفاست تراك" value={packages} onSave={(value) => put("/api/admin/fast-track", value)} /> : null}
        {tab === "hotels" ? <JsonEditor key="hotels" title="إدارة الفنادق والمدن" value={hotels} onSave={(value) => put("/api/admin/hotels", value)} /> : null}
        {tab === "settings" && settings ? <JsonEditor key="settings" title="الإعدادات العامة والمحتوى" value={settings} onSave={(value) => put("/api/admin/settings", value)} /> : null}

        {tab === "bookings" ? (
          <section className="rounded-lg bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-black">الحجوزات</h2>
              <button onClick={exportCsv} className="rounded-md bg-[#d8b35a] px-4 py-2 text-sm font-black text-[#17110d]">تصدير CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-right text-sm">
                <thead className="bg-[#f7f4ee]"><tr>{["العميل", "الهاتف", "الخدمة", "التاريخ", "السعر", "الحالة"].map((head) => <th key={head} className="p-3">{head}</th>)}</tr></thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-black/10">
                      <td className="p-3 font-bold">{booking.customerName}</td>
                      <td className="p-3">{booking.phone}</td>
                      <td className="p-3">{booking.serviceName}</td>
                      <td className="p-3">{booking.date}</td>
                      <td className="p-3">{formatCurrency(booking.price)}</td>
                      <td className="p-3">
                        <select value={booking.status} onChange={(event) => updateBooking(booking, event.target.value as Booking["status"])} className="rounded-md border border-black/15 px-2 py-2">
                          <option value="new">جديد</option>
                          <option value="confirmed">مؤكد</option>
                          <option value="cancelled">ملغي</option>
                          <option value="completed">منتهي</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
