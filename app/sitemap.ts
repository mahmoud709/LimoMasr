import type { MetadataRoute } from "next";
import { getDb } from "@/lib/mongodb";
import { localizedUrl, serviceSeo } from "@/lib/seo";
import { hasEnglishArticle } from "@/lib/article-publication";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Public catalogue only; database failure must not publish a partial sitemap.
  const db = await getDb();
  const [cars, articles] = await Promise.all([
    db.collection("cars").find({}, { projection: { slug: 1 } }).toArray(),
    db.collection("articles").find({ published: { $ne: false } }, { projection: { slug: 1, "translations.en.title": 1, "translations.en.excerpt": 1, "translations.en.content": 1 } }).toArray(),
  ]);
  const paths = new Map<string, boolean>(Object.keys(serviceSeo).map(path => [path, true]));
  for (const car of cars) if (typeof car.slug === "string" && car.slug.trim()) paths.set("/cars/" + encodeURIComponent(car.slug), true);
  for (const article of articles) if (typeof article.slug === "string" && article.slug.trim()) paths.set("/blog/" + encodeURIComponent(article.slug), hasEnglishArticle(article));
  return [...paths].flatMap(([path, englishReady]) => (englishReady ? ["ar", "en"] as const : ["ar"] as const).map(locale => ({
    url: localizedUrl(path, locale),
    alternates: { languages: { "ar-EG": localizedUrl(path, "ar"), ...(englishReady ? { en: localizedUrl(path, "en") } : {}), "x-default": localizedUrl(path, "ar") } },
  })));
}
