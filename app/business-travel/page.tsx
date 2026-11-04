import Link from "next/link";
import { CorporateSection } from "@/components/CorporateSection";
import { JsonLd } from "@/components/JsonLd";
import { PublicLayout } from "@/components/PublicLayout";
import { getSiteSettings } from "@/lib/data";
import { withLang } from "@/lib/i18n";
import { serviceGraph } from "@/lib/structured-data";
import { serviceMetadata, seoLocale, type SeoProps } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const generateMetadata = serviceMetadata("/business-travel");

export default async function BusinessTravelPage(props: SeoProps) {
  const [locale, settings] = await Promise.all([seoLocale(props), getSiteSettings()]);
  const isEn = locale === "en";
  const title = isEn ? "Corporate & Conference Transportation in Egypt" : "خدمات الشركات والمؤتمرات في مصر";
  const description = isEn
    ? "Request company transportation, delegation transfers, conference logistics and day tours from Limo Egypt. Share your itinerary to discuss availability and a tailored quote."
    : "اطلب خدمات نقل الشركات والوفود والمؤتمرات والرحلات اليومية من ليمو مصر. أرسل خط سيرك لمراجعة التوافر وطلب عرض يناسب احتياج شركتك.";

  return (
    <PublicLayout settings={settings} locale={locale} whatsappType="car">
      <JsonLd nodes={serviceGraph("/business-travel", locale, title, description, "Corporate transportation and event services")} />
      <main className="mx-auto w-full max-w-7xl px-6 md:px-8 pt-32 pb-20" dir={isEn ? "ltr" : "rtl"}>
        <nav aria-label={isEn ? "Breadcrumbs" : "مسار الصفحة"} className="mb-8 flex gap-3 text-sm">
          <Link href={withLang("/", locale)} className="underline underline-offset-4">{isEn ? "Home" : "الرئيسية"}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{isEn ? "Business Travel" : "خدمات الشركات"}</span>
        </nav>
        <header className="mb-10">
          <h1 className="mb-5 text-3xl font-black text-[#1a2b3c] md:text-5xl">{title}</h1>
          <p className="max-w-3xl text-base leading-8 text-[#1a2b3c]/75 md:text-lg">{description}</p>
        </header>
        <CorporateSection locale={locale} />
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <Link href={withLang("/contact", locale)} className="inline-flex rounded-xl bg-[#1a2b3c] px-6 py-3 font-bold text-white hover:bg-[#d0a755] hover:text-[#1a2b3c]">
            {isEn ? "Contact the team about a company request" : "تواصل مع الفريق لطلب خدمة للشركات"}
          </Link>
        </div>
      </main>
    </PublicLayout>
  );
}