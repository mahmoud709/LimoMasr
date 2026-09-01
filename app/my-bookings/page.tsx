import { PublicLayout } from "@/components/PublicLayout";
import { getSiteSettings } from "@/lib/data";
import { MyBookingsClient } from "@/components/MyBookingsClient";
import type { Locale } from "@/lib/types";

import { cookies } from "next/headers";

type PageProps = {
  searchParams: Promise<{ lang?: string; __locale?: string }>;
};

export default async function MyBookingsPage({ searchParams }: PageProps) {
  const settings = await getSiteSettings();
  const cookieStore = await cookies();
  const params = await searchParams;
  const locale: Locale = ((params.__locale || params.lang || cookieStore.get('NEXT_LOCALE')?.value || "ar") as Locale);

  return (
    <PublicLayout settings={settings} locale={locale}>
      <main className="mx-auto max-w-[1000px] px-6 py-32 md:py-40 relative z-10 min-h-[70vh]">
        <MyBookingsClient />
      </main>
    </PublicLayout>
  );
}
