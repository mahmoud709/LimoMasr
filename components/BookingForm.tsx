"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ServiceType } from "@/lib/types";
import { bookingMessage, buildWhatsappUrl } from "@/lib/utils";

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

  const message = useMemo(() => {
    let finalNotes = notes;
    if (type === 'hotel') {
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
    await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        customerName,
        phone,
        serviceRefId,
        serviceName,
        notes: type === 'hotel' ? `[Budget: ${budget}] ${notes}` : notes,
        passengers,
        price,
        source: "whatsapp",
      }),
    });
    setSaving(false);
    window.open(buildWhatsappUrl(whatsappNumber, message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={submitBooking} className="luxury-panel bg-white p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-black/5 pb-4 mb-6">
        <span className="w-8 h-[1px] bg-[#d0a755]"></span>
        <h2 className="text-2xl font-black text-[#1a2b3c]">تأكيد الحجز</h2>
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
            {type === 'hotel' ? 'عدد الأفراد' : 'عدد الركاب'}
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

        {type === 'hotel' && (
          <div className="space-y-4 py-2">
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-bold text-[#1a2b3c]">الميزانية لليلة الواحدة</p>
                <p className="text-[#d0a755] font-black text-sm dir-ltr">{budget} ج.م</p>
              </div>
              <input 
                type="range" 
                min={1000} 
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
                : "ملاحظات إضافية (أماكن التوقف، طلبات خاصة...)"
            }
            rows={3}
            className="w-full rounded-xl border border-black/10 bg-[#F9F8F6] px-4 py-3.5 text-sm font-medium text-[#1a2b3c] placeholder-[#1a2b3c]/40 outline-none transition-all focus:border-[#d0a755] focus:bg-white focus:ring-1 focus:ring-[#d0a755] resize-none"
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={saving}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a2b3c] px-6 py-4 text-sm font-black tracking-wide text-[#d0a755] shadow-[0_10px_20px_rgba(26,43,60,0.1)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1a2b3c]/90 hover:shadow-[0_15px_30px_rgba(26,43,60,0.2)] disabled:pointer-events-none disabled:opacity-60"
      >
        {saving ? "جاري الإرسال..." : "إتمام الحجز عبر واتساب"}
      </button>
    </form>
  );
}
