import type { Metadata } from "next";
import { Cairo, Outfit } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ليمو مصر | حجز ليموزين وفاست تراك وفنادق",
  description: "حجز سيارات ليموزين وفاست تراك وفنادق في مصر عبر واتساب.",
};

import { cookies } from "next/headers";
import { QueryProvider } from "@/components/QueryProvider";
import { ToastProvider } from "@/components/admin/ToastProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} ${outfit.variable} h-full antialiased bg-[#F9F8F6]`}>
      <body className="min-h-full flex flex-col font-cairo bg-[#F9F8F6] text-[#111111] selection:bg-[#B88A44]/30 selection:text-black">
        <div className="noise-overlay"></div>
        <QueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
