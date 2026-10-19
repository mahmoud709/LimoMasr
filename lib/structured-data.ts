import { localizedUrl, SITE_URL } from "./seo";
import type { Locale } from "./types";
type Reference = { "@id": string };
type Organization = { "@type": "Organization"; "@id": string; name: string; url: string };
type WebSite = { "@type": "WebSite"; "@id": string; name: string; url: string; publisher: Reference; inLanguage: string[] };
type BreadcrumbList = { "@type": "BreadcrumbList"; itemListElement: { "@type": "ListItem"; position: number; name: string; item: string }[] };
type Service = { "@type": "Service"; "@id": string; name: string; description: string; url: string; serviceType: string; provider: Organization };
type BlogPosting = { "@type": "BlogPosting"; "@id": string; headline: string; description: string; url: string; mainEntityOfPage: string; inLanguage: string; publisher: Organization; image?: string; datePublished?: string };
export type StructuredNode = Organization | WebSite | BreadcrumbList | Service | BlogPosting;
const publisher = { "@id": SITE_URL + "/#organization" };
const organization: Organization = { "@type": "Organization", ...publisher, name: "Limo Egypt", url: SITE_URL };
export function organizationGraph(): StructuredNode[] {
  return [organization,
    { "@type": "WebSite", "@id": SITE_URL + "/#website", name: "Limo Egypt", url: SITE_URL, publisher, inLanguage: ["ar-EG", "en"] }];
}
export function breadcrumbs(locale: Locale, items: { path: string; name: string }[]): BreadcrumbList {
  return { "@type": "BreadcrumbList", itemListElement: [{ path: "/", name: locale === "ar" ? "الرئيسية" : "Home" }, ...items].map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: localizedUrl(item.path, locale) })) };
}
export function serviceGraph(path: string, locale: Locale, name: string, description: string, serviceType: string, parents: { path: string; name: string }[] = []): StructuredNode[] {
  const url = localizedUrl(path, locale);
  return [{ "@type": "Service", "@id": url + "#service", name, description, serviceType, url, provider: organization }, breadcrumbs(locale, [...parents, { path, name }])];
}
export function articleGraph(path: string, locale: Locale, article: { title: string; excerpt: string; image: string; date: string }): StructuredNode[] {
  const url = localizedUrl(path, locale);
  const date = /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(article.date) && Number.isFinite(Date.parse(article.date)) ? article.date : undefined;
  const image = /^https?:\/\//.test(article.image) ? article.image : undefined;
  return [{ "@type": "BlogPosting", "@id": url + "#article", headline: article.title, description: article.excerpt, url, mainEntityOfPage: url, inLanguage: locale === "ar" ? "ar-EG" : "en", publisher: organization, ...(date ? { datePublished: date } : {}), ...(image ? { image } : {}) },
    breadcrumbs(locale, [{ path: "/blog", name: locale === "ar" ? "المدونة" : "Blog" }, { path, name: article.title }])];
}
export function serializeStructuredData(nodes: StructuredNode[]) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
