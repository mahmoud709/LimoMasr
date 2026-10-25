import type { Locale, Review } from "@/lib/types";
import { FaStar, FaGoogle } from "react-icons/fa";
import { ReviewFormTrigger } from "./ReviewFormTrigger";

export function ReviewsSection({ locale, initialReviews }: { locale: Locale; initialReviews: Review[] }) {
  const reviews = initialReviews;
  const t = {
    title: locale === "ar" ? "سافر مع الشريك الذي يثق به العملاء" : "Travel with the partner trusted by customers",
    subtitle: locale === "ar" ? "آراء حقيقية من عملائنا" : "Real reviews from our customers",
    note: locale === "ar" ? "يتم سحب التقييمات وعرضها بشفافية لضمان مصداقية التجربة." : "Reviews are pulled and displayed transparently to ensure a credible experience.",
  };

  return (
    <section className="relative w-full pt-16 pb-8 bg-white overflow-hidden border-t border-black/5">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-reveal-1">
          <div className="text-start">
            <span className="flex items-center gap-4 mb-4">
              <span className="w-8 h-[1px] bg-[#d0a755]"></span>
              <span className="text-[#d0a755] font-bold tracking-widest text-xs uppercase">{t.subtitle}</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1a2b3c] tracking-tight">
              {t.title}
            </h2>
          </div>
          <ReviewFormTrigger locale={locale} />
        </div>

        {/* Slider / Grid Container */}
        <div className={`relative flex overflow-hidden -mx-4 md:-mx-8 group pb-4 ${reviews.length <= 4 ? 'justify-center' : ''}`}>
          {reviews.length > 4 && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#F9F8F6] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#F9F8F6] to-transparent z-10 pointer-events-none"></div>
            </>
          )}
          
          <div className={`flex w-max gap-6 px-4 ${reviews.length > 4 ? 'animate-marquee-reviews hover:[animation-play-state:paused]' : 'mx-auto'}`}>
            {reviews.length > 0 ? (
              (reviews.length > 4 ? [...reviews, ...reviews, ...reviews, ...reviews] : reviews).map((review, idx) => {
                const dateObj = new Date(review.date);
                const formattedDate = locale === "ar" 
                  ? `${dateObj.toLocaleString('ar-EG', { month: 'long' })} ${dateObj.getFullYear()}`
                  : `${dateObj.toLocaleString('en-US', { month: 'long' })} ${dateObj.getFullYear()}`;

                return (
                  <div 
                    key={`${review.id}-${idx}`}
                    className={`shrink-0 w-[300px] md:w-[350px] bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col transition-all hover:shadow-md ${reviews.length > 4 ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    style={{ whiteSpace: 'normal' }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      {review.source === "google" ? (
                        <FaGoogle className="w-5 h-5 text-[#4285F4]" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#d0a755]/20 flex items-center justify-center text-[#d0a755] font-bold text-xs">W</div>
                      )}
                      <span className="text-xs text-[#1a2b3c]/50 font-medium">{formattedDate}</span>
                    </div>
                    
                    <h4 className="font-bold text-[#1a2b3c] text-lg mb-2 truncate">{review.name}</h4>
                    
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={`w-4 h-4 ${i < review.rating ? "text-[#FFC107]" : "text-gray-200"}`} />
                      ))}
                    </div>
                    
                    <p className="text-sm text-[#1a2b3c]/70 leading-relaxed line-clamp-4 flex-1 font-light">
                      {review.text}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center text-[#1a2b3c]/40 font-medium py-12 px-8">
                {locale === "ar" ? "لا توجد تقييمات حالياً." : "No reviews yet."}
              </div>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <p className="text-xs text-[#1a2b3c]/40 mt-4 text-start font-medium px-4">
            {t.note}
          </p>
        )}

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-reviews {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .animate-marquee-reviews {
          animation: scroll-reviews 60s linear infinite;
        }
        [dir="rtl"] .animate-marquee-reviews {
          animation: scroll-reviews-rtl 60s linear infinite;
        }
        @keyframes scroll-reviews-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(50% + 12px)); }
        }
      `}} />

    </section>
  );
}
