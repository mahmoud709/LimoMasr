import { sanitizeHtml } from "@/lib/sanitize";
import { PublicLayout } from "@/components/PublicLayout";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getSiteSettings, getArticles, getArticleBySlug } from "@/lib/data";
import { formatArticleDate, formatArticleReadTime } from "@/lib/utils";
import { ArticleClient } from "@/components/ArticleClient";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) return { title: "مقال غير موجود | ليمو مصر" };
  
  return {
    title: `${article.title} | ليمو مصر`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : [],
    }
  };
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

  const enTrans = article.translations?.en as any;
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
