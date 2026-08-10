"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import type { Article } from "@/lib/types";
import { formatArticleDate, formatArticleReadTime } from "@/lib/utils";

export function ArticlesCarousel({ articles, isEn }: { articles: Article[], isEn: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "next" | "prev") => {
    if (scrollRef.current) {
      const scrollStep = window.innerWidth < 768 ? scrollRef.current.clientWidth : scrollRef.current.clientWidth / 3;
      const direction = dir === "next" ? 1 : -1;
      const sign = isEn ? 1 : -1;
      scrollRef.current.scrollBy({
        left: sign * direction * scrollStep,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || articles.length <= 3) return; // Only auto-scroll if there are more than 3 items (or on mobile)

    let interval: NodeJS.Timeout;

    const startScroll = () => {
      interval = setInterval(() => {
        if (!scrollRef.current) return;
        
        // If content fits without scrolling (e.g., on ultra wide screens), don't scroll
        if (scrollRef.current.scrollWidth <= scrollRef.current.clientWidth) return;

        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        
        // Check if we reached the end (RTL can have negative or zero scrollLeft depending on browser)
        const currentScroll = Math.abs(scrollRef.current.scrollLeft);
        const isEnd = currentScroll >= maxScroll - 10;

        if (isEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll by one item width approx
          const scrollStep = window.innerWidth < 768 
            ? scrollRef.current.clientWidth 
            : scrollRef.current.clientWidth / 3;
            
          scrollRef.current.scrollBy({ left: (isEn ? 1 : -1) * scrollStep, behavior: "smooth" });
        }
      }, 4000); // 4 seconds
    };

    // only start auto scroll if on mobile or if there are more items than fit
    startScroll();

    el.addEventListener("mouseenter", () => clearInterval(interval));
    el.addEventListener("mouseleave", startScroll);
    el.addEventListener("touchstart", () => clearInterval(interval), { passive: true });
    el.addEventListener("touchend", startScroll, { passive: true });

    return () => {
      clearInterval(interval);
      el.removeEventListener("mouseenter", () => clearInterval(interval));
      el.removeEventListener("mouseleave", startScroll);
      el.removeEventListener("touchstart", () => clearInterval(interval));
      el.removeEventListener("touchend", startScroll);
    };
  }, [articles.length, isEn]);

  return (
    <div dir={isEn ? "ltr" : "rtl"} className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative z-10">
        <div className="text-start">
          <span className="flex items-center gap-4 mb-4 justify-start">
            <span className="w-8 h-[1px] bg-[#d0a755]"></span>
            <span className="text-[#d0a755] font-bold tracking-widest text-xs uppercase">
              {isEn ? "Guides & Insider Stories" : "أدلة وقصص من الداخل"}
            </span>
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1a2b3c] tracking-tight">
            {isEn ? "From Limo Egypt Blog" : "من مدونة ليمو مصر"}
          </h2>
        </div>
        <div className="flex flex-row items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto">
          {/* Navigation Arrows first */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => scroll("prev")} 
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#1a2b3c] hover:border-[#1a2b3c] hover:text-[#d0a755] transition-all text-[#1a2b3c]"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEn ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
            <button 
              onClick={() => scroll("next")} 
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#1a2b3c] hover:border-[#1a2b3c] hover:text-[#d0a755] transition-all text-[#1a2b3c]"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEn ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>

          {/* Read All Articles Button after buttons */}
          <Link 
            href={isEn ? "/en/blog" : "/blog"}
            className="shrink-0 px-6 py-3 bg-white text-[#1a2b3c] border border-black/10 text-sm font-bold rounded-full hover:bg-[#1a2b3c] hover:text-white transition-colors shadow-sm flex items-center gap-2 justify-center group"
          >
            <span>{isEn ? "Read All Articles" : "اقرأ كل المقالات"}</span>
            {isEn ? (
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            ) : (
              <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            )}
          </Link>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
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
              className="snap-center shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(208,167,85,0.15)] transition-all duration-500 hover:-translate-y-2 group block"
            >
              <div className="relative h-64 overflow-hidden">
                {article.image ? (
                  <Image 
                    src={article.image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1a2b3c]/5 flex items-center justify-center p-6 text-center">
                    <span className="text-[#1a2b3c]/40 font-black text-lg leading-tight line-clamp-3">{title}</span>
                  </div>
                )}
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
                
                <h3 className="text-xl font-black text-[#1a2b3c] mb-4 leading-tight group-hover:text-[#d0a755] transition-colors line-clamp-2" title={title}>
                  {title}
                </h3>
                
                <p className="text-gray-500 font-medium line-clamp-2 leading-relaxed mb-6">
                  {excerpt}
                </p>
                
                <div className="flex items-center gap-2 text-[#d0a755] font-black text-sm group-hover:gap-4 transition-all">
                  <span>{isEn ? "Read Article" : "اقرأ المقال"}</span>
                  {isEn ? (
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
