"use client";

import { useRouter, usePathname } from "next/navigation";

export function LanguageSwitcher({ currentLocale, targetLocale }: { currentLocale: string; targetLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Set the cookie so the preference is saved across refreshes
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Determine the new pathname with the updated locale prefix
    let newPath = pathname;
    if (pathname.startsWith("/en")) {
      newPath = pathname.replace(/^\/en/, `/${targetLocale}`);
    } else if (pathname.startsWith("/ar")) {
      newPath = pathname.replace(/^\/ar/, `/${targetLocale}`);
    } else {
      newPath = `/${targetLocale}${pathname === "/" ? "" : pathname}`;
    }
    
    // Preserve other search parameters if present (excluding old lang parameter)
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("lang");
    const query = searchParams.toString();
    const targetUrl = query ? `${newPath}?${query}` : newPath;

    router.push(targetUrl);
    router.refresh();
  };

  return (
    <a 
      href={`/${targetLocale}`}
      onClick={handleLanguageChange} 
      className="text-sm font-bold tracking-widest text-white/60 hover:text-white transition-colors duration-300 hidden sm:block uppercase cursor-pointer"
    >
      {targetLocale}
    </a>
  );
}
