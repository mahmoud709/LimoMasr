import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { JsonLd } from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/data";
import { airportServices } from "@/lib/airport-services";
import { breadcrumbs } from "@/lib/structured-data";
import { withLang } from "@/lib/i18n";
import { serviceMetadata, seoLocale, type SeoProps } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const generateMetadata = serviceMetadata("/airports");
export default async function AirportsPage(props: SeoProps) {
  const [locale, settings] = await Promise.all([seoLocale(props), getSiteSettings()]);
  const en = locale === "en";
  return <PublicLayout settings={settings} locale={locale} whatsappType="car">
    <JsonLd nodes={[breadcrumbs(locale, [{ path: "/airports", name: en ? "Airports" : "المطارات" }])]} />
    <main className="mx-auto w-full max-w-7xl px-6 md:px-8 pt-32 pb-20">
      <nav aria-label={en ? "Breadcrumbs" : "مسار الصفحة"} className="flex gap-3 mb-8 text-sm">
        <Link href={withLang("/", locale)}>{en ? "Home" : "الرئيسية"}</Link>
        <span aria-hidden="true">/</span><span aria-current="page">{en ? "Airports" : "المطارات"}</span>
      </nav>
      <h1 className="text-3xl md:text-5xl font-black text-[#1a2b3c] mb-6">{en ? "Airport pickup and drop-off" : "المطارات: الاستقبال والتوصيل"}</h1>
      <p className="max-w-3xl leading-8 mb-10">{en ? "Choose an airport to review its car pickup and drop-off service and send your trip details for an enquiry." : "اختر المطار للاطلاع على خدمة الاستقبال والتوصيل بالسيارة، وأرسل تفاصيل الرحلة للاستفسار عن الحجز."}</p>
      <section aria-labelledby="airport-list">
        <h2 id="airport-list" className="text-2xl font-bold mb-6">{en ? "Choose your airport" : "اختر المطار"}</h2>
        <div className="grid gap-6 md:grid-cols-2">{Object.values(airportServices).map(airport => <Link key={airport.code} href={withLang(airport.path, locale)} className="rounded-2xl border border-black/10 bg-white p-6 hover:border-[#d0a755] focus-visible:outline-2 focus-visible:outline-offset-4">
          <h3 className="text-xl font-bold mb-3">{airport.names[locale]} <span dir="ltr">({airport.code})</span></h3>
          <p className="leading-7">{en ? "Car pickup from this airport or drop-off before departure." : "طلب استقبال من المطار أو توصيل إليه للمغادرة."}</p>
          <span className="inline-block mt-4 underline">{en ? "View transfer details" : "عرض تفاصيل النقل"}</span>
        </Link>)}</div>
      </section>
      <p className="mt-8 leading-8">{en ? "Confirm availability, pricing and arrangements with the team before your trip. Airport-specific Fast Track availability must be checked separately." : "راجع التوافر والسعر وترتيبات النقل مع الفريق قبل رحلتك. توافر فاست تراك في مطار محدد يحتاج إلى مراجعة منفصلة."}</p>
    </main>
  </PublicLayout>;
}
