"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FiArrowRight, 
  FiArrowLeft, 
  FiClock, 
  FiCalendar, 
  FiShare2, 
  FiCheck, 
  FiCopy, 
  FiList, 
  FiCompass, 
  FiCheckCircle, 
  FiMessageSquare,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import type { Article, SiteSettings } from "@/lib/types";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function ArticleClient({
  article,
  contentHtml,
  relatedArticles,
  settings,
  isEn
}: {
  article: Article;
  contentHtml: string;
  relatedArticles: Article[];
  settings: SiteSettings;
  isEn: boolean;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeTocId, setActiveTocId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [processedContent, setProcessedContent] = useState(contentHtml);

  // 1. Calculate reading progress & process TOC headings in DOM
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }

      // Check active TOC item
      const headings = document.querySelectorAll(".article-content h2, .article-content h3");
      let currentActiveId = "";
      headings.forEach((heading) => {
        const top = heading.getBoundingClientRect().top;
        if (top <= 180) {
          currentActiveId = heading.id;
        }
      });
      if (currentActiveId) {
        setActiveTocId(currentActiveId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Parse Headings for TOC & inject IDs into HTML
  useEffect(() => {
    if (typeof window === "undefined") return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(contentHtml, "text/html");
    const headings = doc.querySelectorAll("h2, h3");
    const tocItems: TocItem[] = [];

    headings.forEach((heading, idx) => {
      const text = heading.textContent?.trim() || "";
      if (!text) return;
      const id = `heading-${idx}-${text.slice(0, 15).replace(/\s+/g, "-").toLowerCase()}`;
      heading.id = id;
      tocItems.push({
        id,
        text,
        level: heading.tagName.toLowerCase() === "h2" ? 2 : 3
      });
    });

    setToc(tocItems);
    setProcessedContent(doc.body.innerHTML);
  }, [contentHtml]);

  // 3. Share URL
  const articleUrl = typeof window !== "undefined" ? window.location.href : "";
  
  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };


  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Scroll Progress Bar at very top */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-black/5 z-50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-[#d0a755] via-[#e5c178] to-[#1a2b3c] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className="min-h-screen bg-[#F9F8F6] pt-28 pb-24 relative z-10" dir={isEn ? "ltr" : "rtl"}>
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 md:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="mb-8 flex items-center justify-between animate-reveal-1">
            <Link 
              href={isEn ? "/en/blog" : "/blog"}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-black/5 text-xs font-bold text-slate-600 hover:text-[#1a2b3c] hover:border-[#d0a755]/30 hover:shadow-md transition-all group"
            >
              {isEn ? <FiArrowLeft className="w-4 h-4 text-[#d0a755] group-hover:-translate-x-1 transition-transform" /> : <FiArrowRight className="w-4 h-4 text-[#d0a755] group-hover:translate-x-1 transition-transform" />}
              <span>{isEn ? "Back to All Articles" : "العودة لجميع المقالات"}</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-bold">
              <span>{isEn ? "Limo Egypt Blog" : "مدونة ليمو مصر"}</span>
              <span>/</span>
              <span className="text-[#d0a755]">{article.category}</span>
            </div>
          </nav>

          {/* Article Hero Header */}
          <header className="mb-12 text-center max-w-4xl mx-auto animate-reveal-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d0a755]/10 border border-[#d0a755]/30 text-[#b88a44] text-xs font-black uppercase tracking-widest mb-6">
              <FiCompass className="w-3.5 h-3.5" />
              <span>{article.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1a2b3c] leading-[1.25] tracking-tight mb-8">
              {article.title}
            </h1>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-500 border-y border-black/5 py-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1a2b3c] text-white flex items-center justify-center text-[10px] font-black">
                  LM
                </div>
                <span className="text-[#1a2b3c] font-black">{isEn ? "Limo Egypt Editorial" : "فريق تحرير ليمو مصر"}</span>
                <FiCheckCircle className="w-3.5 h-3.5 text-[#d0a755]" title={isEn ? "Verified Author" : "كاتب موثوق"} />
              </div>

              <span className="hidden sm:inline text-slate-200">•</span>

              <div className="flex items-center gap-1.5">
                <FiCalendar className="w-4 h-4 text-[#d0a755]" />
                <span>{article.date}</span>
              </div>

              <span className="hidden sm:inline text-slate-200">•</span>

              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full text-amber-800 border border-amber-200/50">
                <FiClock className="w-3.5 h-3.5 text-[#d0a755]" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </header>

          {/* Main Hero Image */}
          {article.image && (
            <div className="relative w-full h-[320px] sm:h-[460px] md:h-[560px] rounded-[2.5rem] overflow-hidden mb-14 shadow-2xl border-4 border-white animate-reveal-2">
              <Image 
                src={article.image} 
                alt={article.title} 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-1000 ease-out" 
                priority 
                sizes="(max-width: 1400px) 100vw, 1360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b3c]/60 via-transparent to-transparent opacity-80 pointer-events-none" />
              <div className="absolute bottom-6 right-6 left-6 text-white text-xs font-medium flex items-center justify-between">
                <span className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  {isEn ? "Limo Egypt Exclusive Destinations Guide" : "دليل ليمو مصر الحصري للوجهات السياحية"}
                </span>
              </div>
            </div>
          )}

          {/* Two-Column Grid: Content + Sidebar */}
          <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-start">
            
            {/* Left Main Article Column */}
            <div className="space-y-12 animate-reveal-2">
              
              {/* Excerpt Lead Box */}
              {article.excerpt && (
                <div className="bg-gradient-to-br from-white to-[#F9F8F6] p-6 sm:p-8 rounded-3xl border border-[#d0a755]/30 shadow-md relative overflow-hidden">
                  <div className={`absolute top-0 w-2 h-full bg-[#d0a755] ${isEn ? "left-0" : "right-0"}`} />
                  <p className={`text-base sm:text-lg font-bold text-[#1a2b3c] leading-relaxed italic ${isEn ? "text-left" : "text-right"}`}>
                    &ldquo;{article.excerpt}&rdquo;
                  </p>
                </div>
              )}

              {/* Main Article Content Container */}
              <div 
                className={`article-content bg-white p-6 sm:p-10 md:p-12 rounded-[2.5rem] border border-black/5 shadow-xl ${isEn ? "text-left" : "text-right"}`}
                dir={isEn ? "ltr" : "rtl"}
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* In-Article Booking Banner */}
              <div className="bg-gradient-to-r from-[#1a2b3c] to-[#253d54] text-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#d0a755]/30">
                <div className={`space-y-2 ${isEn ? "text-center md:text-left" : "text-center md:text-right"}`}>
                  <span className="text-[#d0a755] text-xs font-black uppercase tracking-widest block">
                    {isEn ? "Luxury Chauffeur Service" : "خدمة ليموزين فاخرة"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {isEn ? "Planning a trip to this destination?" : "تخطط لزيارة هذه الوجهة بطريقة مريحة؟"}
                  </h3>
                  <p className="text-sm text-white/70 font-light max-w-lg">
                    {isEn ? "Book a private luxury car with a professional driver from Limo Egypt." : "احجز سيارتك الفاخرة مع سائق محترف من ليمو مصر لتستمتع برحلتك بأعلى درجات الرفاهية والأمان."}
                  </p>
                </div>
                <Link 
                  href={isEn ? "/en/cars" : "/cars"}
                  className="bg-[#d0a755] hover:bg-[#b88a44] text-[#1a2b3c] hover:text-white font-black px-8 py-4 rounded-2xl text-sm transition-all duration-300 shadow-lg hover:shadow-xl shrink-0 border border-white/20"
                >
                  {isEn ? "Explore Fleet & Book" : "استكشف الأسطول واحجز الآن"}
                </Link>
              </div>

              {/* Author / Brand Bio */}
              <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-md flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-[#1a2b3c] text-[#d0a755] flex items-center justify-center font-black text-2xl shrink-0 shadow-md">
                  LM
                </div>
                <div className={`space-y-2 ${isEn ? "text-center sm:text-left" : "text-center sm:text-right"}`}>
                  <h4 className="text-lg font-black text-[#1a2b3c]">
                    {isEn ? "Limo Egypt Travel Editorial" : "فريق تحرير ليمو مصر"}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {isEn 
                      ? "Providing high-end limousine services, airport transfers, and curated travel guides across Egypt." 
                      : "المصدر الموثوق لأرقى خدمات الليموزين، والنقل السياحي الفاخر، وتغطيات الوجهات السياحية والأثرية في كافة أنحاء مصر."}
                  </p>
                </div>
              </div>

              {/* Share Bar */}
              <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-black text-[#1a2b3c]">
                  <FiShare2 className="w-4 h-4 text-[#d0a755]" />
                  <span>{isEn ? "Share this guide:" : "مشاركة المقال مع أصدقائك:"}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#1a2b3c] hover:text-white text-xs font-black transition-all shadow-sm"
                  >
                    {copied ? (
                      <>
                        <FiCheck className="w-4 h-4 text-emerald-500" />
                        <span>{isEn ? "Copied!" : "تم النسخ!"}</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-4 h-4 text-[#d0a755]" />
                        <span>{isEn ? "Copy Link" : "نسخ الرابط"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Right Sticky Sidebar Column */}
            <aside className="space-y-8 lg:sticky lg:top-32 animate-reveal-3">
              
              {/* Table of Contents Box */}
              {toc.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-black/5 text-[#1a2b3c]">
                    <FiList className="w-4 h-4 text-[#d0a755]" />
                    <h3 className="font-black text-sm uppercase tracking-wider">
                      {isEn ? "Table of Contents" : "فهرس المقال"}
                    </h3>
                  </div>

                  <ul className="space-y-2 text-xs font-bold text-slate-600 max-h-[340px] overflow-y-auto pr-1">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToHeading(item.id)}
                          className={`text-right w-full py-1.5 px-3 rounded-xl transition-all flex items-center gap-2 ${
                            activeTocId === item.id 
                              ? "bg-[#d0a755]/15 text-[#1a2b3c] font-black border-r-4 border-[#d0a755]" 
                              : "hover:bg-slate-50 hover:text-[#1a2b3c]"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d0a755] shrink-0" />
                          <span className="line-clamp-1">{item.text}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Car Booking Widget */}
              <div className="bg-gradient-to-br from-[#1a2b3c] to-[#0F1115] text-white p-7 rounded-3xl shadow-xl space-y-5 border border-[#d0a755]/20">
                <div className="w-12 h-12 rounded-2xl bg-[#d0a755]/20 text-[#d0a755] flex items-center justify-center font-black">
                  🚗
                </div>
                <div>
                  <h4 className="text-lg font-black text-white mb-1">
                    {isEn ? "Need Chauffeur Transportation?" : "احجز سيارتك للرحلة"}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {isEn ? "Premium cars & luxury vans with professional drivers for all Egypt cities." : "أسطول سيارات سيدان وفان فاخرة وسائقين محترفين للتنقلات والرحلات بين المحافظات."}
                  </p>
                </div>
                <Link
                  href={isEn ? "/en/cars" : "/cars"}
                  className="w-full flex items-center justify-center gap-2 bg-[#d0a755] hover:bg-[#b88a44] text-[#1a2b3c] font-black py-3 rounded-xl text-xs transition-all shadow-md"
                >
                  <span>{isEn ? "View Available Fleet" : "عرض السيارات المتاحة"}</span>
                  {isEn ? <FiArrowRight className="w-4 h-4" /> : <FiArrowLeft className="w-4 h-4" />}
                </Link>
              </div>

              {/* Direct WhatsApp Widget */}
              <div className="bg-emerald-50 border border-emerald-200/60 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md">
                    <FaWhatsapp className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-sm">
                      {isEn ? "Quick WhatsApp Booking" : "حجز واستفسار سريع"}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {isEn ? "Available 24/7 for custom trips" : "متواجدون على مدار 24 ساعة"}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${settings.whatsappServiceNumber || settings.whatsappCarNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black py-3 rounded-xl text-xs transition-colors shadow-md"
                >
                  <FiMessageSquare className="w-4 h-4" />
                  <span>{isEn ? "Chat on WhatsApp" : "تواصل عبر واتساب مباشر"}</span>
                </a>
              </div>

            </aside>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <section className="mt-24 pt-16 border-t border-black/10">
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-[#d0a755] font-black text-xs uppercase tracking-widest block mb-2">
                  {isEn ? "More Insights" : "اقرأ أيضاً"}
                </span>
                <h3 className="text-3xl font-black text-[#1a2b3c]">
                  {isEn ? "Related Destination Guides" : "مقالات ذات صلة قد تهمك"}
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.slice(0, 3).map((rel) => {
                  const relTrans = rel.translations?.en as any;
                  const relTitle = isEn && relTrans?.title ? relTrans.title : rel.title;
                  const relExcerpt = isEn && relTrans?.excerpt ? relTrans.excerpt : rel.excerpt;

                  return (
                    <article key={rel.id} className="bg-white rounded-3xl border border-black/5 shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col">
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        {rel.image ? (
                          <Image 
                            src={rel.image} 
                            alt={relTitle} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#d0a755] text-4xl">🏛️</div>
                        )}
                        <span className="absolute top-3 right-3 bg-[#1a2b3c] text-[#d0a755] text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                          {rel.category}
                        </span>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h4 className="font-black text-[#1a2b3c] text-lg mb-3 line-clamp-2 group-hover:text-[#d0a755] transition-colors">
                          {relTitle}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6 leading-relaxed">
                          {relExcerpt}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black text-[#1a2b3c]">
                          <span>{rel.readTime}</span>
                          <Link 
                            href={isEn ? `/en/blog/${rel.slug}` : `/blog/${rel.slug}`} 
                            className="flex items-center gap-1 text-[#d0a755] hover:underline"
                          >
                            <span>{isEn ? "Read Guide" : "اقرأ المقال"}</span>
                            {isEn ? <FiArrowRight className="w-3.5 h-3.5" /> : <FiArrowLeft className="w-3.5 h-3.5" />}
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}
