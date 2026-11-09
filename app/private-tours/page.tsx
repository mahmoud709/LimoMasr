import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PublicLayout } from "@/components/PublicLayout";
import { getSiteSettings } from "@/lib/data";
import { withLang } from "@/lib/i18n";
import { seoLocale, serviceMetadata, type SeoProps } from "@/lib/seo";
import { serviceGraph } from "@/lib/structured-data";
export const dynamic = "force-dynamic";
export const generateMetadata = serviceMetadata("/private-tours");
export default async function PrivateToursPage(props: SeoProps) {
  const [locale, settings] = await Promise.all([seoLocale(props), getSiteSettings()]);
  const en = locale === "en";
  const title = en ? "Private trips in Egypt" : "رحلات سياحية خاصة في مصر";
  const description = en ? "Discuss a private trip itinerary and duration with Limo Egypt." : "تواصل مع ليمو مصر لمناقشة وجهة الرحلة ومدتها وتفاصيل العرض.";
  const destinations = en ? ["Cairo and Giza", "Alexandria", "Sharm El Sheikh", "Hurghada", "Luxor"] : ["القاهرة والجيزة", "الإسكندرية", "شرم الشيخ", "الغردقة", "الأقصر"];
  return <PublicLayout settings={settings} locale={locale} whatsappType="car">
    <JsonLd nodes={serviceGraph("/private-tours", locale, title, description, "Private travel enquiries")} />
    <main className="mx-auto max-w-5xl px-6 md:px-8 pt-32 pb-20" dir={en ? "ltr" : "rtl"}>
      <nav aria-label={en ? "Breadcrumbs" : "مسار الصفحة"} className="mb-8 flex gap-3 text-sm"><Link href={withLang("/", locale)} className="underline">{en ? "Home" : "الرئيسية"}</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
      <h1 className="text-3xl md:text-5xl font-black text-[#1a2b3c]">{title}</h1>
      <p className="mt-6 leading-8">{en ? "Choose a destination and share your dates, group size and interests. The team will discuss the itinerary, duration and available options with you." : "اختر وجهتك وأرسل التواريخ وعدد المسافرين واهتماماتك. يناقش الفريق معك خط السير والمدة والخيارات المتاحة."}</p>
      <section className="mt-10 rounded-3xl bg-white border border-black/10 p-6 md:p-10"><h2 className="text-2xl font-bold">{en ? "Destinations for your enquiry" : "وجهات للاستفسار عن رحلتك"}</h2>
        <ul className="mt-5 list-disc ps-6 space-y-3">{destinations.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="mt-6 leading-8">{en ? "The company can discuss other destinations based on your request. Availability, programme, duration, price and what is included are agreed directly with the team; do not assume tickets, guides or accommodation are included." : "يمكن مناقشة وجهات أخرى حسب طلبك. يتم الاتفاق مع الفريق على التوافر والبرنامج والمدة والسعر وما يشمله العرض؛ لا تفترض شمول التذاكر أو المرشد أو الإقامة."}</p>
        <Link href={withLang("/contact", locale)} className="mt-6 inline-flex rounded-xl bg-[#1a2b3c] px-6 py-3 font-bold text-white">{en ? "Discuss your trip" : "تواصل لترتيب رحلتك"}</Link>
      </section>
      <nav aria-label={en ? "Related services" : "خدمات مرتبطة"} className="mt-8 flex flex-wrap gap-5"><Link className="underline" href={withLang("/car-with-driver", locale)}>{en ? "Car with driver" : "سيارة بسائق"}</Link><Link className="underline" href={withLang("/hotels", locale)}>{en ? "Hotels" : "الفنادق"}</Link><Link className="underline" href={withLang("/blog", locale)}>{en ? "Travel guides" : "أدلة السفر"}</Link></nav>
    </main>
  </PublicLayout>;
}
