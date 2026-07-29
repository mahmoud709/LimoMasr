import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { getArticles } from "@/lib/data";
import { cookies } from "next/headers";

export async function ArticlesSection() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ar';
  const isEn = locale === 'en';
  const articles = await getArticles();

  return (
    <section className="relative w-full py-24 bg-[#F9F8F6] overflow-hidden border-t border-black/5">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="text-start">
            <span className="flex items-center gap-4 mb-4 justify-end md:justify-start">
              <span className="w-8 h-[1px] bg-[#d0a755]"></span>
              <span className="text-[#d0a755] font-bold tracking-widest text-xs uppercase">أدلة وقصص من الداخل</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1a2b3c] tracking-tight">
              من مدونة ليمو مصر
            </h2>
          </div>
          <Link 
            href="/blog"
            className="shrink-0 px-6 py-3 bg-white text-[#1a2b3c] border border-black/10 text-sm font-bold rounded-full hover:bg-[#1a2b3c] hover:text-white transition-colors shadow-sm flex items-center gap-2 justify-center"
          >
            {isEn ? <FiArrowRight className="w-4 h-4" /> : <FiArrowLeft className="w-4 h-4" />}
            {isEn ? "Read All Articles" : "اقرأ كل المقالات"}
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((article) => {
            const title = isEn && article.translations?.en?.title ? article.translations.en.title : article.title;
            const excerpt = isEn && article.translations?.en?.excerpt ? article.translations.en.excerpt : article.excerpt;
            const category = isEn && article.translations?.en?.category ? article.translations.en.category : article.category;
            
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
                    <span>{article.date}</span>
                    <span className="w-1 h-1 rounded-full bg-[#d0a755]"></span>
                    <span>{article.readTime}</span>
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
    </section>
  );
}
