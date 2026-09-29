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
  title: "ليمو مصر | حجز فنادق، استقبال مطارات، وسيارات VIP في مصر",
  description: "رتب رحلتك إلى مصر بالكامل في خطوة واحدة. حجز أرقى الفنادق والشقق الفندقية، استقبال من المطار بسيارات فاخرة (ليموزين)، وخدمات المسار السريع (VIP Fast Track).",
};

import Script from "next/script";
import { cookies } from "next/headers";
import { QueryProvider } from "@/components/QueryProvider";
import { ToastProvider } from "@/components/admin/ToastProvider";
import { GoogleAdsEvents } from "@/components/GoogleAdsEvents";
import { GOOGLE_ADS_ID } from "@/lib/gtag";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} ${outfit.variable} h-full antialiased bg-[#F9F8F6] overflow-x-hidden`}>
      <head>
        {/* Google Ads (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-cairo bg-[#F9F8F6] text-[#111111] selection:bg-[#B88A44]/30 selection:text-black overflow-x-hidden">
        <div className="noise-overlay"></div>
        <QueryProvider>
          <ToastProvider>
            <GoogleAdsEvents />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
