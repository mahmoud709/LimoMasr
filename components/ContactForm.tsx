"use client";

import { useState } from "react";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

type ContactFormProps = {
  t: {
    formTitle: string;
    name: string;
    email: string;
    phone: string;
    phonePlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
  };
};

export function ContactForm({ t }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send");
      
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col h-full">
      <h2 className="text-xl font-black text-[#1a2b3c] mb-6 flex items-center gap-3">
        <span className="w-6 h-1 rounded-full bg-[#d0a755]"></span>
        {t.formTitle}
      </h2>
      
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200 text-sm font-bold flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-bold flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1 text-start">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#1a2b3c]">{t.name} <span className="text-red-500">*</span></label>
          <div className="relative">
            <FaUser className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-black/20" />
            <input type="text" name="name" placeholder={t.name} className="w-full bg-[#F9F8F6] border border-black/5 rounded-xl rtl:pr-12 ltr:pl-12 rtl:pl-4 ltr:pr-4 py-3.5 text-sm text-[#1a2b3c] focus:outline-none focus:ring-2 focus:ring-[#d0a755]/50 transition-all" required />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#1a2b3c]">{t.email} <span className="text-red-500">*</span></label>
          <div className="relative">
            <FaEnvelope className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-black/20" />
            <input type="email" name="email" placeholder="example@email.com" dir="ltr" className="w-full text-left bg-[#F9F8F6] border border-black/5 rounded-xl rtl:pr-12 ltr:pl-12 rtl:pl-4 ltr:pr-4 py-3.5 text-sm text-[#1a2b3c] focus:outline-none focus:ring-2 focus:ring-[#d0a755]/50 transition-all" required />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#1a2b3c]">{t.phone}</label>
          <div className="relative">
            <FaPhone className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 text-black/20" />
            <input type="tel" name="phone" placeholder={t.phonePlaceholder} dir="ltr" className="w-full text-left bg-[#F9F8F6] border border-black/5 rounded-xl rtl:pr-12 ltr:pl-12 rtl:pl-4 ltr:pr-4 py-3.5 text-sm text-[#1a2b3c] focus:outline-none focus:ring-2 focus:ring-[#d0a755]/50 transition-all" />
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-sm font-bold text-[#1a2b3c]">{t.message} <span className="text-red-500">*</span></label>
          <textarea name="message" placeholder={t.messagePlaceholder} className="w-full h-full min-h-[120px] bg-[#F9F8F6] border border-black/5 rounded-xl px-6 py-4 text-sm text-[#1a2b3c] focus:outline-none focus:ring-2 focus:ring-[#d0a755]/50 transition-all resize-none" required></textarea>
        </div>

        <button type="submit" disabled={loading} className={`w-full text-[#1a2b3c] font-black text-base py-4 rounded-xl transition-all mt-2 ${loading ? "bg-black/10 cursor-not-allowed" : "bg-[#d0a755] hover:bg-[#b89040] hover:shadow-[0_10px_20px_rgba(208,167,85,0.2)] hover:-translate-y-1"}`}>
          {loading ? "جاري الإرسال..." : t.send}
        </button>
      </form>
    </div>
  );
}
