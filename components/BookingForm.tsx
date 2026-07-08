"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import type { ServiceType } from "@/lib/types";
import { bookingMessage, buildWhatsappUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

type BookingFormProps = {
  type: ServiceType;
  serviceRefId: string;
  serviceName: string;
  whatsappNumber: string;
  price?: number;
};

export function BookingForm({
  type,
  serviceRefId,
  serviceName,
  whatsappNumber,
  price,
}: BookingFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [budget, setBudget] = useState(5000);
  const [bookingSource, setBookingSource] = useState<"web" | "whatsapp">("web");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Detect locale based on window location in client-side
  const isEn = typeof window !== "undefined" && window.location.search.includes("lang=en");

  // Fetch logged in customer if available to pre-fill details
  const { data: authData } = useQuery({
    queryKey: ["customerMe"],
    queryFn: async () => {
      const res = await fetch("/api/customer/me");
      if (!res.ok) return { user: null };
      return res.json();
    },
  });

  const user = authData?.user;

  useEffect(() => {
    if (user) {
      setCustomerName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  const message = useMemo(() => {
    let finalNotes = notes;
    if (['hotel', 'apartment'].includes(type)) {
      finalNotes = `الميزانية المتوقعة لليلة: ${budget} ج.م\n\nالملاحظات:\n${notes}`;
    }
    return bookingMessage({
      serviceName,
      customerName,
      phone,
      passengers,
      notes: finalNotes,
    });
  }, [type, serviceName, customerName, phone, passengers, notes, budget]);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          customerName,
          phone,
          serviceRefId,
          serviceName,
          notes: ['hotel', 'apartment'].includes(type) ? `[Budget: ${budget}] ${notes}` : notes,
          passengers,
          price,
          source: bookingSource,
        }),
      });

      if (res.ok) {
        if (bookingSource === "whatsapp") {
          window.open(buildWhatsappUrl(whatsappNumber, message), "_blank", "noopener,noreferrer");
        }
        setBookingSuccess(true);
      }
    } catch {
      // fail silently or handle error
    } finally {
      setSaving(false);
    }
  }

  if (bookingSuccess) {
    return (
      <div className="luxury-panel bg-white p-8 space-y-6 text-center" dir={isEn ? "ltr" : "rtl"}>
        <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4 border border-green-200">
          <FiCheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-[#1a2b3c]">
          {isEn ? "Booking Confirmed!" : "تم تأكيد الحجز!"}
        </h2>
        <p className="text-sm font-bold text-[#1a2b3c]/70 leading-relaxed max-w-sm mx-auto">
          {isEn 
            ? "Your booking has been saved. Our team will contact you shortly to confirm details."
            : "تم تسجيل طلبك بنجاح في النظام. سيقوم فريق خدمة العملاء بالتواصل معك قريباً عبر رقم الهاتف المدخل لتأكيد التفاصيل."}
        </p>
        
        <div className="pt-4 border-t border-black/5 flex flex-col gap-2">
          {user ? (
            <Link 
              href={isEn ? "/my-bookings?lang=en" : "/my-bookings"}
              className="inline-block bg-[#1a2b3c] text-white px-6 py-3.5 rounded-xl text-xs font-black hover:bg-[#1a2b3c]/90 transition-colors"
            >
              {isEn ? "View My Bookings" : "عرض حجوزاتي في الموقع"}
            </Link>
          ) : (
            <Link 
              href={isEn ? "/login?lang=en" : "/login"}
              className="inline-block bg-[#d0a755] text-[#1a2b3c] px-6 py-3.5 rounded-xl text-xs font-black hover:bg-[#b89040] transition-colors"
            >
              {isEn ? "Log In to Track Booking" : "سجل دخولك لمتابعة الحجز"}
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              setBookingSuccess(false);
              setNotes("");
            }}
            className="text-xs font-bold text-[#1a2b3c]/50 hover:text-[#1a2b3c] transition-colors mt-2"
          >
            {isEn ? "Make another booking" : "إجراء حجز آخر"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submitBooking} className="luxury-panel bg-white p-6 md:p-8 space-y-6">
      <div className="flex flex-col gap-1 border-b border-black/5 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-[1px] bg-[#d0a755]"></span>
          <h2 className="text-2xl font-black text-[#1a2b3c]">{isEn ? "Confirm Booking" : "تأكيد الحجز"}</h2>
        </div>
        <p className="text-sm font-bold text-[#d0a755] mt-1 pr-11 rtl:pr-11 ltr:pl-11">
          {isEn ? "Service:" : "الخدمة:"} {serviceName}
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            required
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="الاسم كاملًا"
            className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
          />
        </div>
        
        <div className="relative">
          <input
            required
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="رقم الهاتف للتواصل"
            className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755]"
          />
        </div>
        
        <div className="relative flex items-center justify-between rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-2 transition-all focus-within:border-[#d0a755] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#d0a755]">
          <span className="text-sm font-bold text-[#1a2b3c]/70 w-1/3">
            {['hotel', 'apartment'].includes(type) ? 'عدد الأفراد' : 'عدد الركاب'}
          </span>
          <input
            required
            type="number"
            min={1}
            value={passengers}
            onChange={(event) => setPassengers(Number(event.target.value))}
            className="w-2/3 bg-transparent py-1.5 text-left text-lg font-black text-[#1a2b3c] outline-none"
            dir="ltr"
          />
        </div>

        {['hotel', 'apartment'].includes(type) && (
          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-bold text-[#1a2b3c]">الميزانية لليلة الواحدة</p>
                <p className="text-[#d0a755] font-black text-sm dir-ltr">{budget} ج.م</p>
              </div>
              <input 
                type="range" 
                min={500} 
                max={20000} 
                step={500}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#d0a755] h-1 bg-black/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
        
        <div className="relative">
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={
              type === 'hotel' 
                ? "ملاحظات إضافية (المدينة المطلوبة، فنادق مفضلة...)" 
                : type === 'flight'
                ? "ملاحظات إضافية (الوجهة ذهاب وعودة، درجة الطيران، طلبات خاصة...)"
                : type === 'apartment'
                ? "ملاحظات إضافية (المدينة المطلوبة، عدد الغرف...)"
                : "ملاحظات إضافية (أماكن التوقف، طلبات خاصة...)"
            }
            rows={3}
            className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755] resize-none"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mt-6">
        {/* Book via Web */}
        <button
          type="submit"
          onClick={() => setBookingSource("web")}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a2b3c] px-6 py-4 text-sm font-black tracking-wide text-[#d0a755] shadow-[0_10px_20px_rgba(26,43,60,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1a2b3c]/90 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {saving && bookingSource === "web" ? (isEn ? "Submitting..." : "جاري الإرسال...") : (isEn ? "Book Directly on Website" : "تأكيد الحجز عبر الموقع")}
        </button>

        {/* Book via WhatsApp */}
        <button
          type="submit"
          onClick={() => setBookingSource("whatsapp")}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#25d366]/40 hover:border-[#25d366] bg-[#25d366]/5 hover:bg-[#25d366] text-[#25d366] hover:text-white px-6 py-3.5 text-sm font-black tracking-wide transition-all duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          <FaWhatsapp className="w-4 h-4 shrink-0" />
          {saving && bookingSource === "whatsapp" ? (isEn ? "Redirecting..." : "جاري التوجيه...") : (isEn ? "Confirm via WhatsApp" : "تأكيد ومتابعة عبر واتساب")}
        </button>
      </div>

      {!user && (
        <div className="text-center mt-4 pt-4 border-t border-black/5">
          <p className="text-xs font-bold text-[#1a2b3c]/50">
            {isEn ? (
              <>
                💡 Tip:{" "}
                <Link href="/login?lang=en" className="text-[#d0a755] underline hover:text-[#b89040]">
                  Log in
                </Link>{" "}
                or{" "}
                <Link href="/register?lang=en" className="text-[#d0a755] underline hover:text-[#b89040]">
                  register
                </Link>{" "}
                to track and cancel your bookings.
              </>
            ) : (
              <>
                💡 نصيحة:{" "}
                <Link href="/login" className="text-[#d0a755] underline hover:text-[#b89040]">
                  سجل دخولك
                </Link>{" "}
                أو{" "}
                <Link href="/register" className="text-[#d0a755] underline hover:text-[#b89040]">
                  أنشئ حساباً جديداً
                </Link>{" "}
                لتتمكن من تتبع حالة حجوزاتك وإلغائها لاحقاً.
              </>
            )}
          </p>
        </div>
      )}
    </form>
  );
}
