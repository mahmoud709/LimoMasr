"use client";

import { useState } from "react";
import type { Article } from "@/lib/types";
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle, FiX, FiSave } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/admin/ToastProvider";
import ImageUploader from "@/components/admin/ImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";

const emptyForm: Omit<Article, "id" | "slug"> = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  category: "وجهات",
  date: new Date().toLocaleDateString("ar-EG", { month: "long", year: "numeric", day: "numeric" }),
  readTime: "٥ دقائق قراءة",
  published: true,
};

export function ArticlesAdminClient() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<"ar" | "en">("ar");

  const { data: articles = [], isLoading: loading } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      const res = await fetch("/api/admin/articles");
      if (!res.ok) throw new Error("فشل في جلب البيانات");
      return res.json();
    }
  });

  function openAdd() {
    setForm({
      ...emptyForm,
      translations: {
        ar: { title: "", excerpt: "", content: "", category: "" },
        en: { title: "", excerpt: "", content: "", category: "" }
      }
    });
    setEditing(null);
    setActiveLang("ar");
    setModal("add");
  }

  function openEdit(article: Article) {
    setForm({
      ...article,
      translations: {
        ar: {
          title: article.translations?.ar?.title || article.title || "",
          excerpt: article.translations?.ar?.excerpt || article.excerpt || "",
          content: article.translations?.ar?.content || article.content || "",
          category: article.translations?.ar?.category || article.category || "",
        },
        en: {
          title: article.translations?.en?.title || "",
          excerpt: article.translations?.en?.excerpt || "",
          content: article.translations?.en?.content || "",
          category: article.translations?.en?.category || "",
        }
      }
    });
    setEditing(article);
    setActiveLang("ar");
    setModal("edit");
  }

  const saveMutation = useMutation({
    mutationFn: async (data: Article) => {
      const isEdit = modal === "edit";
      const url = isEdit ? `/api/admin/articles/${data.id}` : "/api/admin/articles";
      const method = isEdit ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("حدث خطأ أثناء الحفظ");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(modal === "edit" ? "تم تحديث المقال بنجاح" : "تمت إضافة المقال بنجاح");
      setModal(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "فشل الحفظ");
    },
    onSettled: () => setSaving(false)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("حدث خطأ أثناء الحذف");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("تم حذف المقال بنجاح");
    },
    onError: (err: any) => {
      toast.error(err.message || "فشل الحذف");
    }
  });

  async function save() {
    setSaving(true);
    
    const arTitle = form.translations?.ar?.title || form.title;
    const arExcerpt = form.translations?.ar?.excerpt || form.excerpt;
    const arContent = form.translations?.ar?.content || form.content;
    const arCategory = form.translations?.ar?.category || form.category;

    const data: Article = {
      ...form,
      title: arTitle,
      excerpt: arExcerpt,
      content: arContent,
      category: arCategory,
      id: editing?.id ?? `article-${Date.now()}`,
      slug: editing?.slug ?? arTitle.replace(/\s+/g, "-").toLowerCase(),
      translations: form.translations
    };

    saveMutation.mutate(data);
  }

  function confirmDelete() {
    if (!deleteConfirm) return;
    deleteMutation.mutate(deleteConfirm);
    setDeleteConfirm(null);
  }

  const f = (key: keyof typeof form, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));
  const fTrans = (key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [activeLang]: {
          ...prev.translations?.[activeLang],
          [key]: value
        }
      }
    }));
  };

  const getTransVal = (key: "title" | "excerpt" | "content" | "category") => {
    return form.translations?.[activeLang]?.[key] || "";
  };

  return (
    <div className="flex-1 p-8 lg:px-12 xl:px-16 max-w-7xl mx-auto w-full space-y-6 relative">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0F1115] tracking-tight">إدارة المقالات</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">{articles.length} مقال في المدونة</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#BCA37F] text-white text-sm font-black px-6 py-3 rounded-xl hover:bg-[#A88F6A] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
          <FiPlus className="w-5 h-5" strokeWidth={3} />
          إضافة مقال جديد
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => (
            <div key={i} className="h-80 bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
              <div className="w-full h-40 bg-slate-100 rounded-2xl mb-4"></div>
              <div className="w-3/4 h-6 bg-slate-100 rounded-md mb-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              <div className="h-48 bg-slate-50 overflow-hidden relative">
                {article.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">صورة</div>
                )}
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black shadow-sm backdrop-blur-md ${article.published ? "bg-emerald-500/90 text-white" : "bg-slate-500/90 text-white"}`}>
                  {article.published ? "منشور" : "مسودة"}
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-[#BCA37F]/90 text-white text-[10px] font-black tracking-widest rounded-lg">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-black text-[#0F1115] text-lg leading-tight tracking-tight mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-500 mb-5 font-medium line-clamp-2">{article.excerpt}</p>
                
                <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
                  <button onClick={() => openEdit(article)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-xs font-black text-[#0F1115] hover:bg-[#0F1115] hover:text-white transition-all duration-300">
                    <FiEdit2 className="w-4 h-4" /> تعديل
                  </button>
                  <button onClick={() => setDeleteConfirm(article.id)} className="flex items-center justify-center w-11 h-11 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-5">
                <FiAlertTriangle className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-[#0F1115] mb-2">تأكيد الحذف</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium">هل أنت متأكد من رغبتك في حذف هذا المقال بشكل نهائي؟</p>
              
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3.5 rounded-xl font-black text-[#0F1115] bg-slate-100 hover:bg-slate-200 transition-colors">
                  إلغاء
                </button>
                <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-600 shadow-md hover:shadow-lg transition-all">
                  نعم، احذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-black text-[#0F1115] text-xl tracking-tight">{modal === "add" ? "كتابة مقال جديد" : "تعديل المقال"}</h2>
              <button onClick={() => setModal(null)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors shadow-sm border border-slate-100">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              {/* Language Switcher */}
              <div className="flex bg-slate-100/50 p-1 rounded-2xl w-full max-w-xs mx-auto border border-slate-200/50 shadow-inner mb-6">
                <button
                  onClick={() => setActiveLang("ar")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeLang === "ar"
                      ? "bg-white text-[#0F1115] shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/30"
                  }`}
                >
                  <span className="text-lg">🇸🇦</span> العربية
                </button>
                <button
                  onClick={() => setActiveLang("en")}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeLang === "en"
                      ? "bg-white text-[#0F1115] shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/30"
                  }`}
                >
                  <span className="text-lg">🇬🇧</span> English
                </button>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field label={`عنوان المقال (${activeLang === "ar" ? "عربي" : "إنجليزي"})`} value={getTransVal("title")} onChange={v => fTrans("title", v)} />
                <Field label={`التصنيف (${activeLang === "ar" ? "عربي" : "إنجليزي"})`} value={getTransVal("category")} onChange={v => fTrans("category", v)} placeholder="مثل: وجهات، نصائح، إلخ" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field label="التاريخ الظاهر" value={form.date} onChange={v => f("date", v)} />
                <Field label="مدة القراءة" value={form.readTime} onChange={v => f("readTime", v)} />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">نبذة مختصرة ({activeLang === "ar" ? "عربي" : "إنجليزي"})</label>
                <textarea 
                  value={getTransVal("excerpt")} 
                  onChange={e => fTrans("excerpt", e.target.value)} 
                  rows={2} 
                  dir={activeLang === "en" ? "ltr" : "rtl"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F] focus:border-transparent transition-all resize-none leading-relaxed" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">المحتوى ({activeLang === "ar" ? "عربي" : "إنجليزي"})</label>
                <RichTextEditor 
                  value={getTransVal("content")} 
                  onChange={v => fTrans("content", v)} 
                  placeholder={activeLang === "ar" ? "اكتب محتوى المقال هنا..." : "Write the article content here..."}
                  isEn={activeLang === "en"}
                />
              </div>

              <div className="grid grid-cols-2 gap-5 border-t border-slate-100 pt-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">صورة المقال (واحدة فقط)</label>
                  <ImageUploader 
                    images={form.image ? [form.image] : []} 
                    onChange={imgs => f("image", imgs[0] || "")} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">حالة النشر</label>
                  <select 
                    value={form.published ? "true" : "false"} 
                    onChange={e => f("published", e.target.value === "true")} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F] focus:border-transparent transition-all"
                  >
                    <option value="true">منشور ومرئي للزوار</option>
                    <option value="false">مسودة (غير مرئي)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-[#0F1115] text-white font-black py-4 rounded-xl hover:bg-[#BCA37F] transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <FiSave className="w-5 h-5" />
                {saving ? "جاري الحفظ..." : "حفظ المقال"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F] focus:border-transparent transition-all placeholder:text-slate-300" />
    </div>
  );
}
