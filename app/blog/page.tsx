import { PublicLayout } from "@/components/PublicLayout";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { cookies } from "next/headers";
import { getSiteSettings, getArticles } from "@/lib/data";
import { formatArticleDate, formatArticleReadTime } from "@/lib/utils";

export const metadata = {
  title: "المدونة | ليمو مصر",
  description: "أدلة وقصص من الداخل - من مدونة ليمو مصر",
};

export default async function BlogPage() {
  const [settings, articles] = await Promise.all([getSiteSettings(), getArticles(true)]);
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
  const isEn = locale === "en";

  return (
    <PublicLayout settings={settings}>
      <main className="min-h-screen bg-[#F9F8F6] pt-32 pb-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-black text-[#1a2b3c] mb-6">{isEn ? "Blog" : "المدونة"}</h1>
            <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto">
              {isEn ? "Comprehensive guides, insider tips, and inspiring stories about Egypt's best destinations." : "أدلة شاملة، نصائح من الداخل، وقصص ملهمة عن أفضل الوجهات في مصر."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const title = isEn && article.translations?.en?.title ? article.translations.en.title : article.title;
              const excerpt = isEn && article.translations?.en?.excerpt ? article.translations.en.excerpt : article.excerpt;
              const category = isEn && article.translations?.en?.category ? article.translations.en.category : article.category;
              const date = isEn && article.translations?.en?.date ? article.translations.en.date : formatArticleDate(article.date, isEn);
              const readTime = isEn && article.translations?.en?.readTime ? article.translations.en.readTime : formatArticleReadTime(article.readTime, isEn);
              
              return (
                <Link 
                  href={isEn ? `/en/blog/${article.slug}` : `/blog/${article.slug}`} 
                  key={article.id}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(208,167,85,0.15)] transition-all duration-500 hover:-translate-y-2 group block"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={article.image}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-black text-[#1a2b3c] tracking-widest shadow-lg">
                      {category}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4">
                      <span>{date}</span>
                      <span className="w-1 h-1 rounded-full bg-[#d0a755]"></span>
                      <span>{readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-black text-[#1a2b3c] mb-4 leading-tight group-hover:text-[#d0a755] transition-colors">
                      {title}
                    </h3>
                    
                    <p className="text-gray-500 font-medium line-clamp-2 leading-relaxed mb-6">
                      {excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-[#d0a755] font-black text-sm group-hover:gap-4 transition-all">
                      {isEn ? "Read Article" : "اقرأ المقال"} 
                      {isEn ? <FiArrowRight className="w-4 h-4" /> : <FiArrowLeft className="w-4 h-4" />}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </main>
    </PublicLayout>
  );
}
