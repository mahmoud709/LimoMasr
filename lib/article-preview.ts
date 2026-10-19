import type { Article } from "./types";
export type ArticlePreview = Omit<Article, "content" | "translations"> & {
  translations?: { ar?: Omit<NonNullable<NonNullable<Article["translations"]>["ar"]>, "content">; en?: Omit<NonNullable<NonNullable<Article["translations"]>["en"]>, "content"> };
};
/** Keep complete article bodies on their detail pages, out of carousel payloads. */
export function articlePreview(article: Article): ArticlePreview {
  const { id, slug, title, excerpt, image, category, date, readTime, published, sortOrder } = article;
  const translation = (value: NonNullable<Article["translations"]>["en"]) => value ? {
    title: value.title, excerpt: value.excerpt, category: value.category, date: value.date, readTime: value.readTime,
  } : undefined;
  return { id, slug, title, excerpt, image, category, date, readTime, published, sortOrder,
    translations: { ar: translation(article.translations?.ar), en: translation(article.translations?.en) } };
}
