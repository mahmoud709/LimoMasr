import Link from "next/link";
import { withLang } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
export function ArticleServiceLinks({ locale, subject }: { locale: Locale; subject: string }) {
  const en = locale === "en";
  const links = [
    { path: "/cars", ar: "قارن السيارات واطلب حجز التنقل", en: "Compare cars and request transport" },
    { path: "/hotels", ar: "اطلب عرض إقامة في فندق", en: "Request a hotel stay quote" },
    { path: "/hotel-apartments", ar: "استعرض الشقق الفندقية", en: "Explore serviced apartments" },
  ];
  if (/cairo|القاهرة/i.test(subject)) links.push({ path: "/cairo-airport-transfer", ar: "طلبات نقل مطار القاهرة", en: "Cairo Airport transfer enquiries" });
  if (/sphinx|سفنكس/i.test(subject)) links.push({ path: "/sphinx-airport-transfer", ar: "طلبات نقل مطار سفنكس", en: "Sphinx Airport transfer enquiries" });
  return <nav aria-label={en ? "Services for planning this trip" : "خدمات لتخطيط هذه الرحلة"} className="mb-10 rounded-2xl bg-white border border-black/10 p-6">
    <h2 className="text-lg font-bold mb-4">{en ? "Plan transport and accommodation" : "خطط للتنقل والإقامة"}</h2>
    <div className="flex flex-wrap gap-4">{links.map(link => <Link key={link.path} className="underline" href={withLang(link.path, locale)}>{en ? link.en : link.ar}</Link>)}</div>
  </nav>;
}
