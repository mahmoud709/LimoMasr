"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

type NavItem = readonly [string, string];

export function MobileMenu({ 
  navItems, 
  translations, 
  locale,
  portalLink,
  portalText
}: { 
  navItems: readonly NavItem[]; 
  translations: Record<string, string>; 
  locale: "ar" | "en";
  portalLink?: string;
  portalText?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Helper to prepend locale correctly
  const getHref = (path: string) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (cleanPath === "/") return `/${locale}`;
    return `/${locale}${cleanPath}`;
  };

  return (
    <div className="lg:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-white p-2 hover:text-[#d0a755] transition-colors focus:outline-none z-[60]"
        aria-label="Toggle Menu"
      >
        {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </button>

      {/* Mobile Drawer (Portaled to body to escape header's backdrop-blur containing block) */}
      {mounted && createPortal(
        <div 
          className={`fixed inset-0 top-[80px] md:top-[96px] bg-[#1a2b3c]/98 backdrop-blur-3xl z-[55] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : (locale === 'ar' ? 'translate-x-full' : '-translate-x-full')} border-t border-[#d0a755]/20`}
        >
          <nav className="flex flex-col items-center justify-start pt-10 gap-6 h-full overflow-y-auto pb-20">
            {navItems.map(([key, href]) => (
              <Link 
                key={href} 
                href={getHref(href)} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold tracking-wide text-white hover:text-[#d0a755] transition-colors relative group py-2"
              >
                {translations[key]}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d0a755] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            {portalLink && portalText && (
              <Link
                href={getHref(portalLink)}
                onClick={() => setIsOpen(false)}
                className="text-lg font-black tracking-wide text-[#d0a755] hover:text-white transition-colors relative group py-2 mt-4 border-t border-white/10 w-4/5 text-center"
              >
                {portalText}
              </Link>
            )}
          </nav>
        </div>,
        document.body
      )}
    </div>
  );
}
