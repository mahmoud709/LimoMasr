import { PublicLayout } from "@/components/PublicLayout";
import { getSiteSettings } from "@/lib/data";
import { MyBookingsClient } from "@/components/MyBookingsClient";
import type { Locale } from "@/lib/types";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function MyBookingsPage({ searchParams }: PageProps) {
  const settings = await getSiteSettings();
  const params = await searchParams;
  const locale: Locale = params.lang === "en" ? "en" : "ar";

  return (
    <PublicLayout settings={settings} locale={locale}>
      <main className="mx-auto max-w-[1000px] px-6 py-32 md:py-40 relative z-10 min-h-[70vh]">
        <MyBookingsClient />
      </main>
    </PublicLayout>
  );
}
