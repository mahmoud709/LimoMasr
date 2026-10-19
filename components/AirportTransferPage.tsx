import Link from "next/link";
import { BookingForm } from "./BookingForm";
import { PublicLayout } from "./PublicLayout";
import { JsonLd } from "./JsonLd";
import { airportServices, airportCopy, type AirportKey } from "@/lib/airport-services";
import { getSiteSettings } from "@/lib/data";
import { seoLocale, type SeoProps } from "@/lib/seo";
import { withLang } from "@/lib/i18n";
import { serviceGraph } from "@/lib/structured-data";
export async function AirportTransferPage({ airportKey, ...props }: SeoProps & { airportKey: AirportKey }) {
  const [locale, settings] = await Promise.all([seoLocale(props), getSiteSettings()]);
  const airport = airportServices[airportKey], copy = airportCopy(airportKey, locale);
  const en = locale === "en";
  return <PublicLayout settings={settings} locale={locale} whatsappType="car">
    <JsonLd nodes={serviceGraph(airport.path, locale, copy.title, copy.intro, "Airport pickup and drop-off", [{ path: "/airports", name: en ? "Airports" : "المطارات" }])} />
    <main className="mx-auto max-w-7xl px-6 md:px-8 pt-32 pb-20">
      <nav aria-label={en ? "Breadcrumbs" : "مسار الصفحة"} className="flex flex-wrap gap-3 mb-8 text-sm">
        <Link href={withLang("/", locale)}>{en ? "Home" : "الرئيسية"}</Link><span aria-hidden="true">/</span>
        <Link href={withLang("/airports", locale)}>{en ? "Airports" : "المطارات"}</Link><span aria-hidden="true">/</span><span aria-current="page">{airport.names[locale]}</span>
      </nav>
      <h1 className="text-3xl md:text-5xl font-black text-[#1a2b3c] mb-6">{copy.title}</h1>
      <p className="max-w-3xl leading-8 mb-10">{copy.intro}</p>
      <div className="grid gap-10 lg:grid-cols-2">
        <section className="space-y-8">
          <div><h2 className="text-2xl font-bold mb-3">{copy.arrival}</h2><p className="leading-8">{copy.arrivalText}</p></div>
          <div><h2 className="text-2xl font-bold mb-3">{copy.departure}</h2><p className="leading-8">{copy.departureText}</p></div>
          <div><h2 className="text-2xl font-bold mb-3">{copy.heading}</h2><ul className="list-disc ps-6 space-y-3">{copy.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>
          <p className="leading-8">{copy.airportCheck} <Link className="underline" href={withLang(copy.otherPath, locale)}>{copy.otherLabel}</Link></p>
          <div><h2 className="text-2xl font-bold mb-3">{en ? "Questions about this airport transfer" : "أسئلة عن النقل في هذا المطار"}</h2>{copy.faqs.map(faq => <details key={faq.question} className="border-b py-4"><summary className="font-bold cursor-pointer">{faq.question}</summary><p className="pt-3 leading-8">{faq.answer}</p></details>)}</div>
          <p className="leading-8">{copy.note}</p>
          <nav aria-label={en ? "Related services" : "خدمات مرتبطة"} className="flex flex-wrap gap-4 underline">
            <Link href={withLang("/cars", locale)}>{en ? "Choose your vehicle" : "اختر السيارة"}</Link>
            <Link href={withLang("/hotels", locale)}>{en ? "Hotel booking" : "حجز فنادق"}</Link>
            <Link href={withLang("/hotel-apartments", locale)}>{en ? "Serviced apartments" : "شقق فندقية"}</Link>
            <Link href={withLang("/contact", locale)}>{en ? "Contact the team" : "تواصل مع الفريق"}</Link>
          </nav>
        </section>
        <BookingForm airportTransfer={{ code: airport.code, name: airport.names[locale] }} type="car" serviceRefId={"airport-transfer-" + airport.code} serviceName={copy.title} whatsappNumber={settings.whatsappCarNumber} locale={locale} />
      </div>
    </main>
  </PublicLayout>;
}
