"use client";

import { useState } from "react";
import type { Review } from "@/lib/types";
import { FiCheck, FiTrash2, FiClock, FiStar } from "react-icons/fi";
import { useToast } from "@/components/admin/ToastProvider";

export function ReviewsAdminClient({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const toast = useToast();

  const handleApprove = async (id: string, approved: boolean) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      
      if (!res.ok) throw new Error("Failed");
      
      setReviews(reviews.map(r => r.id === id ? { ...r, approved } : r));
      toast.success("تم تحديث حالة التقييم");
    } catch (err) {
      toast.error("فشل في تحديث التقييم");
    } finally {
      setLoadingId(null);
    }
  };

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    
    setLoadingId(deleteConfirmId);
    const idToDelete = deleteConfirmId;
    setDeleteConfirmId(null);
    
    try {
      const res = await fetch(`/api/admin/reviews/${idToDelete}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed");
      
      setReviews(reviews.filter(r => r.id !== idToDelete));
      toast.success("تم حذف التقييم بنجاح");
    } catch (err) {
      toast.error("فشل في حذف التقييم");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex-1 p-8 lg:px-12 xl:px-16 max-w-7xl mx-auto w-full space-y-6 relative">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0F1115] tracking-tight">إدارة التقييمات</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">إدارة ومراجعة تقييمات العملاء</p>
        </div>
        <span className="bg-[#1a2b3c] text-white px-4 py-1.5 rounded-lg text-sm font-bold">
          {reviews.length} تقييم
        </span>
      </div>

      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500 font-medium">
            لا توجد تقييمات حالياً.
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col gap-5 transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-black text-xl text-[#1a2b3c]">{review.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${review.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {review.approved ? <FiCheck /> : <FiClock />}
                      {review.approved ? 'معتمد' : 'بانتظار المراجعة'}
                    </div>
                  </div>
                  <div className="flex gap-1 text-[#FFC107]">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-200 fill-transparent"}`} />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleApprove(review.id, !review.approved)}
                    disabled={loadingId === review.id}
                    className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                      review.approved 
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                        : "bg-[#d0a755] text-[#1a2b3c] hover:bg-[#b58f44] hover:shadow-lg hover:-translate-y-0.5"
                    } disabled:opacity-50`}
                  >
                    {review.approved ? "إلغاء الاعتماد" : "اعتماد التقييم"}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(review.id)}
                    disabled={loadingId === review.id}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <FiTrash2 className="w-5 h-5 mx-auto" />
                  </button>
                </div>
              </div>
              
              <div className="bg-[#F9F8F6] p-5 rounded-xl border border-black/5 relative">
                <p className="text-gray-700 text-base leading-relaxed">{review.text}</p>
                <div className="absolute bottom-4 rtl:left-4 ltr:right-4 text-xs text-gray-400 font-medium">
                  {new Date(review.date).toLocaleDateString('ar-EG')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-[#1a2b3c] mb-2">تأكيد الحذف</h3>
            <p className="text-gray-600 text-sm mb-6">هل أنت متأكد من رغبتك في حذف هذا التقييم نهائياً؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button 
                onClick={executeDelete}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors text-sm"
              >
                تأكيد الحذف
              </button>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
