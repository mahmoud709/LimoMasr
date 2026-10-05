import type { MetadataRoute } from "next";
import { getDb } from "@/lib/mongodb";
import { localizedUrl, serviceSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Read directly: catalogue helpers can seed the database during a read.
  // Fail on database errors instead of publishing an incomplete sitemap.
  const db = await getDb();
  const [cars, articles] = await Promise.all([
    db.collection("cars").find({}, { projection: { slug: 1 } }).toArray(),
    db.collection("articles").find({ published: { $ne: false } }, { projection: { slug: 1 } }).toArray(),
  ]);
  const paths = new Set<string>(Object.keys(serviceSeo));
  for (const [prefix, entries] of [["/cars", cars], ["/blog", articles]] as const) {
    for (const item of entries) {
      if (typeof item.slug === "string" && item.slug.trim()) paths.add(`${prefix}/${encodeURIComponent(item.slug)}`);
    }
  }
  return [...paths].flatMap(path => (["ar", "en"] as const).map(locale => ({
    url: localizedUrl(path, locale),
    alternates: { languages: { "ar-EG": localizedUrl(path, "ar"), en: localizedUrl(path, "en"), "x-default": localizedUrl(path, "ar") } },
  })));
}
