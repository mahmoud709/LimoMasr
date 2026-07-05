"use client";

import { useState } from "react";
import type { Car } from "@/lib/types";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiTag, FiX, FiSave, FiAlertTriangle } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/admin/ToastProvider";
import ImageUploader from "@/components/admin/ImageUploader";

const emptyForm: Omit<Car, "id" | "slug"> = {
  categoryName: "",
  subtitle: "",
  models: [],
  year: new Date().getFullYear().toString(),
  seats: 4,
  price: 0,
  priceUnit: "per_trip",
  images: [],
  status: "available",
  sortOrder: 99,
  tag: "",
  notes: "",
  translations: {
    ar: { categoryName: "", subtitle: "", tag: "", notes: "" },
    en: { categoryName: "", subtitle: "", tag: "", notes: "" },
  }
};

export default function CarsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Car | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [modelsText, setModelsText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: cars = [], isLoading: loading } = useQuery<Car[]>({
    queryKey: ["cars"],
    queryFn: async () => {
      const res = await fetch("/api/admin/cars");
      if (!res.ok) throw new Error("فشل في جلب البيانات");
      return res.json();
    }
  });

  function openAdd() {
    setForm({
      ...emptyForm,
      translations: {
        ar: { categoryName: "", subtitle: "", tag: "", notes: "" },
        en: { categoryName: "", subtitle: "", tag: "", notes: "" },
      }
    });
    setModelsText("");
    setEditing(null);
    setModal("add");
  }

  function openEdit(car: Car) {
    setForm({
      ...car,
      translations: {
        ar: {
          categoryName: car.translations?.ar?.categoryName || car.categoryName || "",
          subtitle: car.translations?.ar?.subtitle || car.subtitle || "",
          tag: car.translations?.ar?.tag || car.tag || "",
          notes: car.translations?.ar?.notes || car.notes || "",
        },
        en: {
          categoryName: car.translations?.en?.categoryName || "",
          subtitle: car.translations?.en?.subtitle || "",
          tag: car.translations?.en?.tag || "",
          notes: car.translations?.en?.notes || "",
        }
      }
    });
    setModelsText(car.models.join("\n"));
    setEditing(car);
    setModal("edit");
  }

  const saveMutation = useMutation({
    mutationFn: async (data: Car) => {
      const isEdit = modal === "edit";
      const url = isEdit ? `/api/admin/cars/${data.id}` : "/api/admin/cars";
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
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success(modal === "edit" ? "تم تحديث السيارة بنجاح" : "تمت إضافة السيارة بنجاح");
      setModal(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "فشل الحفظ");
    },
    onSettled: () => setSaving(false)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/cars/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("حدث خطأ أثناء الحذف");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success("تم حذف السيارة بنجاح");
    },
    onError: (err: any) => {
      toast.error(err.message || "فشل الحذف");
    }
  });

  async function save() {
    setSaving(true);
    
    const arName = form.translations?.ar?.categoryName || form.categoryName || "سيارة جديدة";
    const arSubtitle = form.translations?.ar?.subtitle || form.subtitle || "";
    const arTag = form.translations?.ar?.tag || form.tag || "";
    const arNotes = form.translations?.ar?.notes || form.notes || "";

    const enName = form.translations?.en?.categoryName || arName;
    const enSubtitle = form.translations?.en?.subtitle || arSubtitle;
    const enTag = form.translations?.en?.tag || arTag;
    const enNotes = form.translations?.en?.notes || arNotes;

    const data: Car = {
      ...form,
      categoryName: arName,
      subtitle: arSubtitle,
      tag: arTag,
      notes: arNotes,
      id: editing?.id ?? `car-${Date.now()}`,
      slug: editing?.slug ?? arName.replace(/\s+/g, "-").toLowerCase(),
      models: modelsText.split("\n").map(s => s.trim()).filter(Boolean),
      images: form.images,
      translations: {
        ar: { categoryName: arName, subtitle: arSubtitle, tag: arTag, notes: arNotes },
        en: { categoryName: enName, subtitle: enSubtitle, tag: enTag, notes: enNotes }
      }
    };

    saveMutation.mutate(data);
  }

  async function deleteCar(id: string) {
    setDeleteConfirm(id);
  }

  function confirmDelete() {
    if (!deleteConfirm) return;
    deleteMutation.mutate(deleteConfirm);
    setDeleteConfirm(null);
  }

  const f = (key: keyof typeof form, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));
  const fTrans = (locale: "ar" | "en", key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [locale]: {
          ...prev.translations?.[locale],
          [key]: value
        }
      }
    }));
  };

  return (
    <div className="flex-1 p-8 lg:px-12 xl:px-16 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#0F1115] tracking-tight">إدارة الأسطول</h1>
          <p className="text-sm font-medium text-slate-500 mt-2">{cars.length} سيارة مسجلة في النظام</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#BCA37F] text-white text-sm font-black px-6 py-3 rounded-xl hover:bg-[#A88F6A] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
          <FiPlus className="w-5 h-5" strokeWidth={3} />
          إضافة سيارة جديدة
        </button>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3].map(i => (
            <div key={i} className="h-80 bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
              <div className="w-full h-40 bg-slate-100 rounded-2xl mb-4"></div>
              <div className="w-3/4 h-6 bg-slate-100 rounded-md mb-2"></div>
              <div className="w-1/2 h-4 bg-slate-100 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div key={car.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              {/* Image */}
              <div className="h-48 bg-slate-50 overflow-hidden relative">
                {car.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={car.images[0]} alt={car.categoryName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200 text-5xl">🚗</div>
                )}
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black shadow-sm backdrop-blur-md ${car.status === "available" ? "bg-emerald-500/90 text-white" : "bg-rose-500/90 text-white"}`}>
                  {car.status === "available" ? "متاح للحجز" : "غير متاح"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-black text-[#0F1115] text-lg leading-tight tracking-tight">
                    {car.categoryName}
                    {car.translations?.en?.categoryName && (
                      <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{car.translations.en.categoryName}</span>
                    )}
                  </h3>
                  {car.tag && (
                    <span className="px-2.5 py-1 bg-[#BCA37F]/10 text-[#BCA37F] text-[10px] font-black tracking-widest uppercase rounded-lg shrink-0 border border-[#BCA37F]/20">{car.tag}</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-5 font-medium line-clamp-2">{car.subtitle}</p>
                
                <div className="flex items-center gap-5 text-sm font-bold text-slate-600 mb-6 mt-auto">
                  <span className="flex items-center gap-1.5"><FiUsers className="w-4 h-4 text-[#BCA37F]" /> {car.seats} مقاعد</span>
                  <span className="flex items-center gap-1.5"><FiTag className="w-4 h-4 text-[#BCA37F]" /> {car.price.toLocaleString("ar-EG")} ج.م</span>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button onClick={() => openEdit(car)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-xs font-black text-[#0F1115] hover:bg-[#0F1115] hover:text-white transition-all duration-300">
                    <FiEdit2 className="w-4 h-4" /> تعديل
                  </button>
                  <button onClick={() => deleteCar(car.id)} className="flex items-center justify-center w-11 h-11 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300">
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
              <p className="text-sm text-slate-500 mb-8 font-medium">هل أنت متأكد من رغبتك في حذف هذه السيارة بشكل نهائي؟ لا يمكن التراجع عن هذه الخطوة.</p>
              
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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-black text-[#0F1115] text-xl tracking-tight">{modal === "add" ? "تسجيل سيارة جديدة" : "تعديل بيانات السيارة"}</h2>
              <button onClick={() => setModal(null)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors shadow-sm border border-slate-100">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              
              <div className="grid grid-cols-2 gap-5">
                <Field label="اسم الفئة (عربي)" value={form.translations?.ar?.categoryName || ""} onChange={v => fTrans("ar", "categoryName", v)} />
                <Field label="اسم الفئة (إنجليزي)" value={form.translations?.en?.categoryName || ""} onChange={v => fTrans("en", "categoryName", v)} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field label="العنوان الفرعي (عربي)" value={form.translations?.ar?.subtitle || ""} onChange={v => fTrans("ar", "subtitle", v)} />
                <Field label="العنوان الفرعي (إنجليزي)" value={form.translations?.en?.subtitle || ""} onChange={v => fTrans("en", "subtitle", v)} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field label="الوسم (عربي)" value={form.translations?.ar?.tag || ""} onChange={v => fTrans("ar", "tag", v)} placeholder="مثال: الأكثر حجزاً" />
                <Field label="الوسم (إنجليزي)" value={form.translations?.en?.tag || ""} onChange={v => fTrans("en", "tag", v)} placeholder="e.g. Most Booked" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field label="ملاحظات (عربي)" value={form.translations?.ar?.notes || ""} onChange={v => fTrans("ar", "notes", v)} />
                <Field label="ملاحظات (إنجليزي)" value={form.translations?.en?.notes || ""} onChange={v => fTrans("en", "notes", v)} />
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                <Field label="سنة الصنع" value={form.year} onChange={v => f("year", v)} />
                <FieldNum label="عدد المقاعد" value={form.seats} onChange={v => f("seats", v)} />
                <FieldNum label="التسعير (ج.م)" value={form.price} onChange={v => f("price", v)} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">وحدة التسعير</label>
                  <select value={form.priceUnit} onChange={e => f("priceUnit", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F] focus:border-transparent transition-all">
                    <option value="per_trip">لكل رحلة المطار</option>
                    <option value="per_hour">تسعير بالساعة</option>
                    <option value="per_person">لكل راكب</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">حالة السيارة</label>
                  <select value={form.status} onChange={e => f("status", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F] focus:border-transparent transition-all">
                    <option value="available">متاح للحجز المباشر</option>
                    <option value="unavailable">مغلق / صيانة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">الطرازات المتاحة (طراز في كل سطر)</label>
                <textarea value={modelsText} onChange={e => setModelsText(e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F] focus:border-transparent transition-all resize-none leading-relaxed" placeholder="Mercedes S-Class&#10;BMW 7 Series" />
              </div>

              <div className="border-t border-slate-100 pt-6">
                <ImageUploader images={form.images} onChange={imgs => f("images", imgs)} />
              </div>

              <div className="w-1/3">
                <Field label="أولوية العرض" value={String(form.sortOrder)} onChange={v => f("sortOrder", Number(v))} />
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-[#0F1115] text-white font-black py-4 rounded-xl hover:bg-[#BCA37F] transition-colors duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <FiSave className="w-5 h-5" />
                {saving ? "جاري التوثيق والحفظ..." : "حفظ بيانات السيارة"}
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

function FieldNum({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">{label}</label>
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F] focus:border-transparent transition-all" />
    </div>
  );
}
