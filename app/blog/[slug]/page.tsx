import { sanitizeHtml } from "@/lib/sanitize";
import { PublicLayout } from "@/components/PublicLayout";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getSiteSettings, getArticles, getArticleBySlug } from "@/lib/data";
import { formatArticleDate, formatArticleReadTime } from "@/lib/utils";
import { ArticleClient } from "@/components/ArticleClient";
import type { Locale } from "@/lib/types";
import { pageMetadata, seoLocale, type SeoProps } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: SeoProps & { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const locale = await seoLocale(props);
  const article = await getArticleBySlug(decodeURIComponent(slug));
  
  if (!article) notFound();
  
  const title = locale === "en" ? article.translations?.en?.title || article.title : article.title;
  const excerpt = locale === "en" ? article.translations?.en?.excerpt || article.excerpt : article.excerpt;
  const metadata = pageMetadata(`/blog/${encodeURIComponent(article.slug)}`, locale, `${title} | ${locale === "en" ? "Limo Egypt" : "ليمو مصر"}`, excerpt, article.image ? [article.image] : []);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article" } };
}

export default async function ArticlePage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ __locale?: string }>;
}) {
  const [{ slug }, searchParamsResolved, settings, allArticles] = await Promise.all([
    params,
    searchParams ?? Promise.resolve<{ __locale?: string }>({}),
    getSiteSettings(),
    getArticles(true)
  ]);

  const article = await getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const cookieStore = await cookies();
  const locale = ((searchParamsResolved?.__locale || cookieStore.get('NEXT_LOCALE')?.value || 'ar') as Locale);
  const isEn = locale === "en";

  const enTrans = article.translations?.en;
  const title = isEn && enTrans?.title ? enTrans.title : article.title;
  const excerpt = isEn && enTrans?.excerpt ? enTrans.excerpt : article.excerpt;
  const content = isEn && enTrans?.content ? enTrans.content : article.content;
  const category = isEn && enTrans?.category ? enTrans.category : article.category;
  const date = isEn && enTrans?.date ? enTrans.date : formatArticleDate(article.date, isEn);
  const readTime = isEn && enTrans?.readTime ? enTrans.readTime : formatArticleReadTime(article.readTime, isEn);

  const localizedArticle = {
    ...article,
    title,
    excerpt,
    content,
    category,
    date,
    readTime
  };

  const relatedArticles = allArticles.filter(a => a.slug !== article.slug);
  const sanitizedContentHtml = sanitizeHtml(content);

  return (
    <PublicLayout settings={settings} locale={locale}>
      <ArticleClient 
        article={localizedArticle}
        contentHtml={sanitizedContentHtml}
        relatedArticles={relatedArticles}
        settings={settings}
        isEn={isEn}
      />
    </PublicLayout>
  );
}
