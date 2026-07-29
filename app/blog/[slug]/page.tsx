import { PublicLayout } from "@/components/PublicLayout";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { cookies } from "next/headers";
import Image from "next/image";
import { getSiteSettings, getArticles, getArticleBySlug } from "@/lib/data";

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) return { title: "مقال غير موجود" };
  
  return {
    title: `${article.title} | ليمو مصر`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([
    getArticleBySlug(slug),
    getSiteSettings()
  ]);

  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
  const isEn = locale === "en";

  if (!article) {
    notFound();
  }

  const title = isEn && article.translations?.en?.title ? article.translations.en.title : article.title;
  const content = isEn && article.translations?.en?.content ? article.translations.en.content : article.content;
  const category = isEn && article.translations?.en?.category ? article.translations.en.category : article.category;

  return (
    <PublicLayout settings={settings}>
      <main className="min-h-screen bg-[#F9F8F6] pt-32 pb-24" dir={isEn ? "ltr" : "rtl"}>
        <article className="mx-auto max-w-[800px] px-6 md:px-8">
          
          <div className="mb-12">
            <Link 
              href={isEn ? "/en/blog" : "/blog"}
              className={`inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#d0a755] transition-colors mb-8 ${isEn ? "" : "flex-row-reverse justify-end"}`}
            >
              {isEn ? <FiArrowLeft className="w-4 h-4" /> : <FiArrowRight className="w-4 h-4" />}
              {isEn ? "Back to Blog" : "العودة للمدونة"}
            </Link>
            
            <div className="text-center">
              <span className="text-[#d0a755] font-black text-sm uppercase tracking-widest block mb-4">
                {category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a2b3c] mb-6 leading-tight">
                {title}
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm font-medium">
                <span>{article.date}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>

          <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-16 shadow-lg">
            <Image 
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 800px) 100vw, 800px"
              priority
            />
          </div>

          <div 
            className={`prose prose-lg prose-slate prose-headings:font-black prose-headings:text-[#1a2b3c] prose-a:text-[#d0a755] prose-img:rounded-3xl max-w-none mb-16 ${isEn ? "text-left" : "text-right"}`}
            dangerouslySetInnerHTML={{ __html: content }} 
          />

        </article>
      </main>
    </PublicLayout>
  );
}
