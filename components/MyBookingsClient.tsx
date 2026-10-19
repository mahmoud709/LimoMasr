import Link from "next/link";
import type { Locale } from "@/lib/types";
import { customerBookingMessages } from "@/lib/customer-booking-access";

/** Render the disabled state without account requests, booking queries or mutations. */
export function MyBookingsClient({ locale }: { locale: Locale }) {
  const message = customerBookingMessages[locale];
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 md:p-10 shadow-sm" dir={locale === "ar" ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-black text-[#1a2b3c]">{message.title}</h1>
      <p className="mt-4 text-base leading-8 text-[#1a2b3c]/80">{message.description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded-xl bg-[#1a2b3c] px-5 py-3 font-bold text-white" href={`/${locale}/contact`}>{message.contact}</Link>
        <Link className="rounded-xl border border-[#1a2b3c]/20 px-5 py-3 font-bold text-[#1a2b3c]" href={`/${locale}`}>{message.book}</Link>
      </div>
    </section>
  );
}
