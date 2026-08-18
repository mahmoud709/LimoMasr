"use client";

import { useState, useEffect } from "react";
import type { Locale, Review } from "@/lib/types";
import { FaStar, FaGoogle, FaTimes } from "react-icons/fa";

export function ReviewsSection({ locale }: { locale: Locale }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", rating: 5, text: "" });

  const isRtl = locale === "ar";
  const t = {
    title: locale === "ar" ? "سافر مع الشريك الذي يثق به العملاء" : "Travel with the partner trusted by customers",
    subtitle: locale === "ar" ? "آراء حقيقية من عملائنا" : "Real reviews from our customers",
    addReview: locale === "ar" ? "أضف تقييمك" : "Write a review",
    formTitle: locale === "ar" ? "اكتب تقييمك" : "Write your review",
    nameLabel: locale === "ar" ? "الاسم" : "Name",
    ratingLabel: locale === "ar" ? "التقييم" : "Rating",
    textLabel: locale === "ar" ? "رأيك بصراحة" : "Your honest review",
    submit: locale === "ar" ? "إرسال التقييم" : "Submit Review",
    submitting: locale === "ar" ? "جاري الإرسال..." : "Submitting...",
    successMsg: locale === "ar" ? "شكراً لك! تم إرسال تقييمك بنجاح وسيتم مراجعته." : "Thank you! Your review has been submitted and is pending approval.",
    note: locale === "ar" ? "يتم سحب التقييمات وعرضها بشفافية لضمان مصداقية التجربة." : "Reviews are pulled and displayed transparently to ensure a credible experience.",
  };

  useEffect(() => {
    fetch("/api/reviews")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccess(false);
          setFormData({ name: "", rating: 5, text: "" });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 px-6 py-3 bg-[#1a2b3c] text-white text-sm font-bold rounded-xl hover:bg-[#d0a755] hover:text-[#1a2b3c] transition-colors shadow-sm"
          >
            {t.addReview}
          </button>
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

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={isRtl ? "rtl" : "ltr"}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f2f5] text-[#1a2b3c]/60 hover:bg-[#1a2b3c] hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
            
            <h3 className="text-2xl font-black text-[#1a2b3c] mb-6">{t.formTitle}</h3>
            
            {success ? (
              <div className="p-6 bg-green-50 text-green-700 rounded-2xl text-center font-bold text-sm">
                {t.successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/60 mb-2 uppercase">{t.nameLabel}</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#f0f2f5] rounded-xl px-4 py-3 text-sm font-medium text-[#1a2b3c] outline-none focus:ring-2 focus:ring-[#d0a755]/50" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/60 mb-2 uppercase">{t.ratingLabel}</label>
                  <div className="flex gap-2" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, rating: star})}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <FaStar className={`w-8 h-8 ${star <= formData.rating ? "text-[#FFC107]" : "text-gray-200"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/60 mb-2 uppercase">{t.textLabel}</label>
                  <textarea 
                    required 
                    rows={4}
                    value={formData.text} 
                    onChange={e => setFormData({...formData, text: e.target.value})}
                    className="w-full bg-[#f0f2f5] rounded-xl px-4 py-3 text-sm font-medium text-[#1a2b3c] outline-none focus:ring-2 focus:ring-[#d0a755]/50 resize-none" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-[#1a2b3c] text-white font-bold py-3.5 rounded-xl hover:bg-[#d0a755] hover:text-[#1a2b3c] transition-colors disabled:opacity-50"
                >
                  {submitting ? t.submitting : t.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
