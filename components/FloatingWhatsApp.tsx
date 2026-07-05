"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";

export function FloatingWhatsApp({ phone }: { phone: string }) {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  // Show after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    // Stop pulse after 6 seconds
    const t2 = setTimeout(() => setPulse(false), 6000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent("مرحبًا ليمو مصر، أريد الاستفسار عن الحجز.")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl shadow-[#25D366]/30 transition-all duration-500 hover:scale-110 hover:shadow-[#25D366]/50 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {pulse && (
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-60" />
      )}
      <FaWhatsapp className="w-7 h-7 text-white relative z-10" />
    </a>
  );
}
