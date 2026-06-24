"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function LanguageSwitcher({ currentLocale, targetLocale }: { currentLocale: string, targetLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Set the cookie so the preference is saved across refreshes
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Navigate to the new URL with the language query parameter
    router.push(`${pathname}?lang=${targetLocale}`);
    router.refresh();
  };

  return (
    <a 
      href={`${pathname}?lang=${targetLocale}`}
      onClick={handleLanguageChange} 
      className="text-sm font-bold tracking-widest text-white/60 hover:text-white transition-colors duration-300 hidden sm:block uppercase cursor-pointer"
    >
      {targetLocale}
    </a>
  );
}
