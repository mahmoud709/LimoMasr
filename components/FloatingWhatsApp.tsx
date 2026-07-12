"use client";

import { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaTiktok,
  FaInstagram,
  FaSnapchatGhost,
  FaTelegramPlane,
  FaPhoneAlt,
  FaComments,
  FaTimes
} from "react-icons/fa";

interface FloatingWhatsAppProps {
  phone: string;
  socialLinks?: Record<string, string>;
  locale?: string;
}

export function FloatingWhatsApp({ phone, socialLinks = {}, locale = "ar" }: FloatingWhatsAppProps) {
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Show after 1.5 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    locale === "en" ? "Hello Limo Masr, I want to ask about booking." : "مرحبًا ليمو مصر، أريد الاستفسار عن الحجز."
  )}`;

  // Define social menu items
  const menuItems = [
    {
      id: "whatsapp",
      name: locale === "en" ? "WhatsApp" : "واتساب",
      icon: <FaWhatsapp className="w-5 h-5 text-white" />,
      color: "bg-[#25D366] shadow-[#25D366]/30",
      href: whatsappUrl,
    },
    {
      id: "phone",
      name: locale === "en" ? "Call Us" : "اتصل بنا",
      icon: <FaPhoneAlt className="w-4 h-4 text-white" />,
      color: "bg-[#1a2b3c] border border-[#d0a755]/50 shadow-black/20",
      href: `tel:${phone}`,
    },
    ...(socialLinks.telegram ? [{
      id: "telegram",
      name: locale === "en" ? "Telegram" : "تليجرام",
      icon: <FaTelegramPlane className="w-5 h-5 text-white" />,
      color: "bg-[#0088cc] shadow-[#0088cc]/30",
      href: socialLinks.telegram,
    }] : []),
    ...(socialLinks.instagram ? [{
      id: "instagram",
      name: locale === "en" ? "Instagram" : "إنستغرام",
      icon: <FaInstagram className="w-5 h-5 text-white" />,
      color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-[#dc2743]/20",
      href: socialLinks.instagram,
    }] : []),
    ...(socialLinks.tiktok ? [{
      id: "tiktok",
      name: locale === "en" ? "TikTok" : "تيك توك",
      icon: <FaTiktok className="w-4 h-4 text-white" />,
      color: "bg-black shadow-black/40",
      href: socialLinks.tiktok,
    }] : []),
    ...(socialLinks.snapchat ? [{
      id: "snapchat",
      name: locale === "en" ? "Snapchat" : "سناب شات",
      icon: <FaSnapchatGhost className="w-4 h-4 text-black" />,
      color: "bg-[#FFFC00] shadow-[#FFFC00]/30",
      href: socialLinks.snapchat,
    }] : []),
    ...(socialLinks.facebook ? [{
      id: "facebook",
      name: locale === "en" ? "Facebook" : "فيسبوك",
      icon: <FaFacebookF className="w-4 h-4 text-white" />,
      color: "bg-[#1877F2] shadow-[#1877F2]/30",
      href: socialLinks.facebook,
    }] : []),
  ];

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 flex flex-col items-center transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {/* Social Options Menu */}
      <div className="flex flex-col items-center gap-3 mb-4">
        {menuItems.map((item, index) => {
          // Staggered transition delay based on state
          const delay = isOpen ? index * 50 : (menuItems.length - 1 - index) * 30;
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.name}
              style={{
                transitionDelay: `${delay}ms`,
              }}
              className={`group relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${item.color} ${
                isOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-75 translate-y-4 pointer-events-none"
              }`}
            >
              {item.icon}
              
              {/* Tooltip Label sliding to the right */}
              <span className="absolute left-14 px-3 py-1 text-xs font-bold text-white bg-[#1a2b3c] border border-[#d0a755]/30 rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap shadow-md pointer-events-none">
                {item.name}
              </span>
            </a>
          );
        })}
      </div>

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="تواصل معنا"
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-[#d0a755] text-[#1a2b3c] rotate-90 shadow-[#d0a755]/30"
            : "bg-[#1a2b3c] text-[#d0a755] border border-[#d0a755]/30 shadow-[#1a2b3c]/30"
        }`}
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <div className="relative">
            {/* Pulsing indicator when closed */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#25D366] animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#25D366]" />
            <FaComments className="w-7 h-7" />
          </div>
        )}
      </button>
    </div>
  );
}
