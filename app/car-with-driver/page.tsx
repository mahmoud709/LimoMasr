import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PublicLayout } from "@/components/PublicLayout";
import { getSiteSettings } from "@/lib/data";
import { withLang } from "@/lib/i18n";
import { serviceMetadata, seoLocale, type SeoProps } from "@/lib/seo";
import { serviceGraph } from "@/lib/structured-data";

export const dynamic = "force-dynamic";
export const generateMetadata = serviceMetadata("/car-with-driver");

export default async function CarWithDriverPage(props: SeoProps) {
  const [locale, settings] = await Promise.all([seoLocale(props), getSiteSettings()]);
  const en = locale === "en";
  const title = en ? "Request a car with a driver in Egypt" : "طلب سيارة بسائق في مصر";
  const description = en
    ? "Choose a vehicle and share your trip details with Limo Egypt to request a car with a driver."
    : "اختر سيارة وأرسل تفاصيل رحلتك إلى ليمو مصر لطلب سيارة بسائق.";
  const items = en
    ? ["Pickup address, destination and any planned stops.", "Trip date and time, or the dates you need the car for.", "Number of passengers and any luggage requirements.", "Your preferred vehicle and a complete contact number."]
    : ["عنوان الانطلاق والوجهة وأي توقفات تخطط لها.", "تاريخ الرحلة ووقتها، أو تواريخ احتياجك للسيارة.", "عدد الركاب ومتطلبات الأمتعة إن وجدت.", "السيارة المفضلة ورقم هاتف كامل للتواصل."];
  return <PublicLayout settings={settings} locale={locale} whatsappType="car">
    <JsonLd nodes={serviceGraph("/car-with-driver", locale, title, description, "Car with driver")} />
    <main className="mx-auto w-full max-w-5xl px-6 md:px-8 pt-32 pb-20" dir={en ? "ltr" : "rtl"}>
      <nav aria-label={en ? "Breadcrumbs" : "مسار الصفحة"} className="mb-8 flex flex-wrap gap-3 text-sm">
        <Link href={withLang("/", locale)} className="underline">{en ? "Home" : "الرئيسية"}</Link>
        <span aria-hidden="true">/</span><span aria-current="page">{en ? "Car with driver" : "سيارة بسائق"}</span>
      </nav>
      <h1 className="text-3xl md:text-5xl font-black text-[#1a2b3c] leading-tight">{title}</h1>
      <p className="mt-6 max-w-3xl leading-8">{description} {en ? "All vehicles come with a private driver. Trips can be requested across Egypt, including consecutive days, subject to availability. Tell the team your itinerary and dates." : "جميع السيارات بسائق خاص، ويمكن طلب الرحلات في أنحاء الجمهورية ولعدة أيام متواصلة حسب التوافر. أرسل خط السير والتواريخ إلى الفريق."}</p>
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-6 md:p-10" aria-labelledby="trip-details">
        <h2 id="trip-details" className="text-2xl font-bold">{en ? "Prepare your trip details" : "جهّز تفاصيل رحلتك"}</h2>
        <ul className="mt-5 list-disc ps-6 space-y-3 leading-7">{items.map(item => <li key={item}>{item}</li>)}</ul>
        <p className="mt-6 leading-8">{en ? "Check the final quote, what is included and the waiting, extra-stop and cancellation terms with the team before confirming. Sending a request does not itself confirm the booking." : "راجع العرض النهائي وما يشمله وشروط الانتظار والتوقفات الإضافية والإلغاء مع الفريق قبل التأكيد. إرسال الطلب وحده لا يعني تأكيد الحجز."}</p>
        <Link href={withLang("/cars", locale)} className="mt-6 inline-flex rounded-xl bg-[#1a2b3c] px-6 py-3 font-bold text-white">{en ? "Choose a car and request a quote" : "اختر سيارة واطلب عرض سعر"}</Link>
      </section>
      <section className="mt-12" aria-labelledby="driver-questions">
        <h2 id="driver-questions" className="text-2xl font-bold">{en ? "Questions before booking" : "أسئلة قبل الحجز"}</h2>
        <h3 className="mt-5 font-bold">{en ? "Can I request a car for more than one day?" : "هل يمكن طلب سيارة لأكثر من يوم؟"}</h3>
        <p className="mt-2 leading-8">{en ? "Yes. You can request a car with a driver for consecutive days. Share your dates and itinerary to check availability and the final details." : "نعم، يمكنك طلب سيارة بسائق لعدة أيام متواصلة. أرسل التواريخ وخط السير لمراجعة التوافر والتفاصيل النهائية."}</p>
        <h3 className="mt-5 font-bold">{en ? "What does the displayed car price include?" : "ماذا يشمل سعر السيارة المعروض؟"}</h3>
        <p className="mt-2 leading-8">{en ? "According to the company, the displayed car price includes the driver, fuel, luggage, road and bridge fees, parking, unlimited waiting until the customer exits and extra stops, with no additional charge. Share your full itinerary when requesting the trip." : "بحسب الشركة يشمل سعر السيارة المعروض السائق والبنزين والحقائب ورسوم الطرق والكباري والمواقف والانتظار المفتوح حتى خروج العميل والتوقفات الإضافية دون أي مبلغ إضافي. وضح خط سيرك كاملًا عند طلب الرحلة."}</p>
        <h3 className="mt-5 font-bold">{en ? "How do I arrange an airport transfer?" : "كيف أطلب استقبالًا أو توصيلًا للمطار؟"}</h3>
        <p className="mt-2 leading-8">{en ? "See the transfer pages for Cairo and Sphinx airports and send your arrival or departure details." : "راجع صفحتي نقل مطار القاهرة وسفنكس وأرسل بيانات الوصول أو المغادرة."}</p>
      </section>
      <nav aria-label={en ? "Related services" : "خدمات مرتبطة"} className="mt-10 flex flex-wrap gap-5 border-t border-black/10 pt-6">
        <Link className="underline" href={withLang("/cairo-airport-transfer", locale)}>{en ? "Cairo Airport transfer" : "نقل مطار القاهرة"}</Link>
        <Link className="underline" href={withLang("/sphinx-airport-transfer", locale)}>{en ? "Sphinx Airport transfer" : "نقل مطار سفنكس"}</Link>
        <Link className="underline" href={withLang("/contact", locale)}>{en ? "Contact us" : "تواصل معنا"}</Link>
        <Link className="underline" href={withLang("/private-tours", locale)}>{en ? "Private trip enquiries" : "طلبات الرحلات السياحية"}</Link>
      </nav>
    </main>
  </PublicLayout>;
}
