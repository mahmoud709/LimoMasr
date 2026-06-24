import { PublicLayout } from "@/components/PublicLayout";
import { getSiteSettings } from "@/lib/data";

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return (
    <PublicLayout settings={settings}>
      <main className="mx-auto max-w-5xl px-8 py-32 relative z-10 animate-reveal-1">
        <article className="luxury-panel p-10 md:p-16 text-lg md:text-xl text-[#1a2b3c]/80 leading-loose">
          <h1 className="mb-8 text-4xl md:text-5xl font-black text-[#1a2b3c]">سياسة الخصوصية</h1>
          <div className="whitespace-pre-wrap">{settings.privacy}</div>
        </article>
      </main>
    </PublicLayout>
  );
}
