"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { FaStar, FaTimes } from "react-icons/fa";
import type { Locale } from "@/lib/types";

export default function ReviewFormDialog({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", rating: 5, text: "" });
  const isRtl = locale === "ar";
  const t = {
    formTitle: isRtl ? "اكتب تقييمك" : "Write your review",
    nameLabel: isRtl ? "الاسم" : "Name",
    ratingLabel: isRtl ? "التقييم" : "Rating",
    textLabel: isRtl ? "رأيك بصراحة" : "Your honest review",
    submit: isRtl ? "إرسال التقييم" : "Submit Review",
    submitting: isRtl ? "جاري الإرسال..." : "Submitting...",
    successMsg: isRtl ? "شكراً لك! تم إرسال تقييمك بنجاح وسيتم مراجعته." : "Thank you! Your review has been submitted and is pending approval.",
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setFormData({ name: "", rating: 5, text: "" });
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir={isRtl ? "rtl" : "ltr"}>
      <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          aria-label={isRtl ? "إغلاق" : "Close"}
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
              <label htmlFor="review-name" className="block text-xs font-black text-[#1a2b3c]/60 mb-2 uppercase">{t.nameLabel}</label>
              <input
                id="review-name"
                required
                type="text"
                value={formData.name}
                onChange={event => setFormData({ ...formData, name: event.target.value })}
                className="w-full bg-[#f0f2f5] rounded-xl px-4 py-3 text-sm font-medium text-[#1a2b3c] outline-none focus:ring-2 focus:ring-[#d0a755]/50"
              />
            </div>

            <div>
              <label id="review-rating-label" className="block text-xs font-black text-[#1a2b3c]/60 mb-2 uppercase">{t.ratingLabel}</label>
              <div className="flex gap-2" dir="ltr" role="group" aria-labelledby="review-rating-label">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    aria-label={isRtl ? `${star} من 5 نجوم` : `${star} out of 5 stars`}
                    aria-pressed={star === formData.rating}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <FaStar className={`w-8 h-8 ${star <= formData.rating ? "text-[#FFC107]" : "text-gray-200"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="review-text" className="block text-xs font-black text-[#1a2b3c]/60 mb-2 uppercase">{t.textLabel}</label>
              <textarea
                id="review-text"
                required
                rows={4}
                value={formData.text}
                onChange={event => setFormData({ ...formData, text: event.target.value })}
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
    </div>,
    document.body
  );
}