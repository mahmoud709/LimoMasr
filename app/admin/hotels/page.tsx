"use client";

import { useState, useEffect } from "react";
import type { HotelItem } from "@/lib/types";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiMapPin, FiStar, FiCheck, FiAlertTriangle } from "react-icons/fi";
import ImageUploader from "@/components/admin/ImageUploader";

const empty: Omit<HotelItem, "id"> = {
  name: "",
  city: "",
  rating: 5,
  price: 3500,
  image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  images: [],
  tag: "",
  features: [],
  description: "",
  status: "available",
  sortOrder: 0,
  translations: {
    ar: { name: "", city: "", tag: "", features: [], description: "" },
    en: { name: "", city: "", tag: "", features: [], description: "" },
  }
};

export default function HotelsAdminPage() {
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<HotelItem | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Features temp strings for easy textarea line-by-line editing
  const [featuresArText, setFeaturesArText] = useState("");
  const [featuresEnText, setFeaturesEnText] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/hotels", { cache: "no-store" });
    if (res.ok) {
      setHotels(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setForm({
      ...empty,
      sortOrder: hotels.length + 1,
      translations: {
        ar: { name: "", city: "", tag: "", features: [], description: "" },
        en: { name: "", city: "", tag: "", features: [], description: "" },
      }
    });
    setFeaturesArText("");
    setFeaturesEnText("");
    setEditing(null);
    setModal("add");
  }

  function openEdit(h: HotelItem) {
    const arFeatures = h.translations?.ar?.features || h.features || [];
    const enFeatures = h.translations?.en?.features || [];

    setForm({
      ...h,
      translations: {
        ar: {
          name: h.translations?.ar?.name || h.name || "",
          city: h.translations?.ar?.city || h.city || "",
          tag: h.translations?.ar?.tag || h.tag || "",
          features: arFeatures,
          description: h.translations?.ar?.description || h.description || "",
        },
        en: {
          name: h.translations?.en?.name || "",
          city: h.translations?.en?.city || "",
          tag: h.translations?.en?.tag || "",
          features: enFeatures,
          description: h.translations?.en?.description || "",
        }
      }
    });
    setFeaturesArText(arFeatures.join("\n"));
    setFeaturesEnText(enFeatures.join("\n"));
    setEditing(h);
    setModal("edit");
  }

  async function save() {
    setSaving(true);

    const arName = form.translations?.ar?.name || form.name || "فندق فاخر";
    const arCity = form.translations?.ar?.city || form.city || "القاهرة";
    const arTag = form.translations?.ar?.tag || form.tag || "";
    const arDesc = form.translations?.ar?.description || form.description || "";
    const arFeatures = featuresArText.split("\n").map(s => s.trim()).filter(Boolean);

    const enName = form.translations?.en?.name || arName;
    const enCity = form.translations?.en?.city || arCity;
    const enTag = form.translations?.en?.tag || arTag;
    const enDesc = form.translations?.en?.description || arDesc;
    const enFeatures = featuresEnText.split("\n").map(s => s.trim()).filter(Boolean);

    const primaryImage = form.images && form.images.length > 0 ? form.images[0] : (form.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80");

    const data: HotelItem = {
      ...form,
      id: editing?.id ?? `hotel-${Date.now()}`,
      name: arName,
      city: arCity,
      tag: arTag,
      description: arDesc,
      features: arFeatures.length > 0 ? arFeatures : ["خدمة 5 نجوم", "إطلالة بانورامية"],
      image: primaryImage,
      rating: Number(form.rating) || 5,
      price: Number(form.price) || 0,
      sortOrder: Number(form.sortOrder) || 0,
      translations: {
        ar: {
          name: arName,
          city: arCity,
          tag: arTag,
          features: arFeatures,
          description: arDesc,
        },
        en: {
          name: enName,
          city: enCity,
          tag: enTag,
          features: enFeatures.length > 0 ? enFeatures : arFeatures,
          description: enDesc,
        }
      }
    };

    if (modal === "edit") {
      await fetch(`/api/admin/hotels/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setSaving(false);
    setModal(null);
    load();
  }

  function del(id: string) {
    setDeleteConfirm(id);
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    await fetch(`/api/admin/hotels/${deleteConfirm}`, { method: "DELETE" });
    setDeleteConfirm(null);
    load();
  }

  const f = (key: keyof typeof form, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));

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

  const imagesList = form.images && form.images.length > 0 ? form.images : (form.image ? [form.image] : []);

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1a2b3c] flex items-center gap-3">
            <span className="w-3 h-8 bg-[#d0a755] rounded-full" />
            إدارة الفنادق والمنتجعات الفاخرة
          </h1>
          <p className="text-sm text-[#1a2b3c]/60 mt-1">التحكم في عروض الفنادق، الصور على Cloudinary، الأسعار، والميزات باللغتين</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#d0a755] text-[#1a2b3c] text-sm font-black px-5 py-3 rounded-xl hover:bg-[#b89040] transition-colors shadow-md"
        >
          <FiPlus className="w-5 h-5" /> إضافة فندق / وجهة
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#1a2b3c]/40 font-bold">جاري تحميل الفنادق...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
              {/* Hotel Image with Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-[#d0a755] text-white text-[10px] font-black shadow flex items-center gap-1">
                    <FiStar className="w-3 h-3 fill-current" />
                    {hotel.rating} نجوم
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shadow ${hotel.status === "available" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {hotel.status === "available" ? "متاح" : "غير متاح"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs text-[#d0a755] font-black uppercase mb-1">
                  <FiMapPin className="w-3.5 h-3.5" />
                  <span>{hotel.city}</span>
                  {hotel.translations?.en?.city && (
                    <span className="text-gray-400 font-bold">({hotel.translations.en.city})</span>
                  )}
                </div>

                <h3 className="font-black text-[#1a2b3c] text-lg mb-1">{hotel.name}</h3>
                {hotel.translations?.en?.name && (
                  <p className="text-xs text-[#1a2b3c]/50 font-bold mb-3">{hotel.translations.en.name}</p>
                )}

                {/* Features Snippet */}
                <div className="space-y-1 mb-4 flex-1">
                  {(hotel.features || []).slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-[#1a2b3c]/70 font-medium">
                      <FiCheck className="w-3 h-3 text-[#d0a755] shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#1a2b3c]/50 font-bold">يبدأ من: </span>
                    <span className="text-base font-black text-[#d0a755]">{hotel.price} ج.م</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(hotel)}
                      className="p-2 rounded-xl border border-black/10 text-xs font-bold text-[#1a2b3c] hover:bg-[#d0a755] hover:text-white transition-colors"
                      title="تعديل"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => del(hotel.id)}
                      className="p-2 rounded-xl border border-red-200 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="حذف"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-5">
                <FiAlertTriangle className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-[#1a2b3c] mb-2">تأكيد الحذف</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium">هل أنت متأكد من رغبتك في حذف هذا الفندق بشكل نهائي؟ لا يمكن التراجع عن هذه الخطوة.</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3.5 rounded-xl font-black text-[#1a2b3c] bg-slate-100 hover:bg-slate-200 transition-colors">
                  إلغاء
                </button>
                <button onClick={confirmDelete} className="flex-1 py-3.5 rounded-xl font-black text-white bg-rose-500 hover:bg-rose-600 shadow-md transition-all">
                  نعم، احذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-black/10 flex items-center justify-between z-20">
              <h2 className="font-black text-[#1a2b3c] text-xl">
                {modal === "add" ? "إضافة فندق / منتجع جديد" : "تعديل بيانات الفندق"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Cloudinary Image Uploader */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-black/5">
                <label className="block text-xs font-black text-[#1a2b3c] mb-3 uppercase tracking-wider">
                  صور الفندق / المنتجع (مرفوعة على Cloudinary)
                </label>
                <ImageUploader
                  images={imagesList}
                  onChange={(newImages) => {
                    setForm(prev => ({
                      ...prev,
                      images: newImages,
                      image: newImages[0] || prev.image
                    }));
                  }}
                />
              </div>

              {/* Names (AR / EN) */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="اسم الفندق / الباقة (عربي)"
                  value={form.translations?.ar?.name || form.name || ""}
                  onChange={v => fTrans("ar", "name", v)}
                  placeholder="مثال: فنادق القاهرة والنيل 5 نجوم"
                />
                <Field
                  label="اسم الفندق / الباقة (إنجليزي)"
                  value={form.translations?.en?.name || ""}
                  onChange={v => fTrans("en", "name", v)}
                  placeholder="e.g. Cairo & Nile 5-Star Hotels"
                />
              </div>

              {/* City / Location (AR / EN) */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="المدينة / المنطقة (عربي)"
                  value={form.translations?.ar?.city || form.city || ""}
                  onChange={v => fTrans("ar", "city", v)}
                  placeholder="مثال: القاهرة الكبرى"
                />
                <Field
                  label="المدينة / المنطقة (إنجليزي)"
                  value={form.translations?.en?.city || ""}
                  onChange={v => fTrans("en", "city", v)}
                  placeholder="e.g. Greater Cairo"
                />
              </div>

              {/* Badges / Tags (AR / EN) */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="الشارة الترويجية (عربي)"
                  value={form.translations?.ar?.tag || form.tag || ""}
                  onChange={v => fTrans("ar", "tag", v)}
                  placeholder="مثال: إطلالة نيلية ساحرة"
                />
                <Field
                  label="الشارة الترويجية (إنجليزي)"
                  value={form.translations?.en?.tag || ""}
                  onChange={v => fTrans("en", "tag", v)}
                  placeholder="e.g. Stunning Nile View"
                />
              </div>

              {/* Rating, Price, Status, SortOrder */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-2xl border border-black/5">
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/70 mb-1.5">التقييم (النجوم)</label>
                  <select
                    value={form.rating}
                    onChange={e => f("rating", Number(e.target.value))}
                    className="w-full bg-white border border-black/10 rounded-xl px-3 py-2.5 text-sm font-bold text-[#1a2b3c] outline-none"
                  >
                    <option value={5}>5 نجوم</option>
                    <option value={4}>4 نجوم</option>
                    <option value={3}>3 نجوم</option>
                    <option value={7}>7 نجوم (فاخر جداً)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/70 mb-1.5">يبدأ السعر من (ج.م)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => f("price", Number(e.target.value))}
                    className="w-full bg-white border border-black/10 rounded-xl px-3 py-2.5 text-sm font-bold text-[#1a2b3c] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/70 mb-1.5">الحالة</label>
                  <select
                    value={form.status}
                    onChange={e => f("status", e.target.value)}
                    className="w-full bg-white border border-black/10 rounded-xl px-3 py-2.5 text-sm font-bold text-[#1a2b3c] outline-none"
                  >
                    <option value="available">متاح</option>
                    <option value="unavailable">غير متاح</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/70 mb-1.5">ترتيب الظهور</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={e => f("sortOrder", Number(e.target.value))}
                    className="w-full bg-white border border-black/10 rounded-xl px-3 py-2.5 text-sm font-bold text-[#1a2b3c] outline-none"
                  />
                </div>
              </div>

              {/* Features (One per line) */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c] mb-1.5">
                    المزايا والخدمات (عربي - سطر لكل ميزة)
                  </label>
                  <textarea
                    value={featuresArText}
                    onChange={e => setFeaturesArText(e.target.value)}
                    rows={4}
                    placeholder="إطلالة مباشرة على النيل&#10;إفطار بوفيه فاخر مفتوح&#10;سبا ونادي صحي متكامل"
                    className="w-full bg-[#f0f2f5] rounded-xl p-3 text-sm font-medium text-[#1a2b3c] outline-none focus:ring-2 focus:ring-[#d0a755]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#1a2b3c] mb-1.5">
                    المزايا والخدمات (إنجليزي - سطر لكل ميزة)
                  </label>
                  <textarea
                    value={featuresEnText}
                    onChange={e => setFeaturesEnText(e.target.value)}
                    rows={4}
                    placeholder="Direct Nile view&#10;Luxury open buffet breakfast&#10;Full wellness spa & club"
                    className="w-full bg-[#f0f2f5] rounded-xl p-3 text-sm font-medium text-[#1a2b3c] outline-none focus:ring-2 focus:ring-[#d0a755]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c] mb-1.5">الوصف الترويجي (عربي)</label>
                  <textarea
                    value={form.translations?.ar?.description || form.description || ""}
                    onChange={e => fTrans("ar", "description", e.target.value)}
                    rows={2}
                    className="w-full bg-[#f0f2f5] rounded-xl p-3 text-sm font-medium text-[#1a2b3c] outline-none focus:ring-2 focus:ring-[#d0a755]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c] mb-1.5">الوصف الترويجي (إنجليزي)</label>
                  <textarea
                    value={form.translations?.en?.description || ""}
                    onChange={e => fTrans("en", "description", e.target.value)}
                    rows={2}
                    className="w-full bg-[#f0f2f5] rounded-xl p-3 text-sm font-medium text-[#1a2b3c] outline-none focus:ring-2 focus:ring-[#d0a755]"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-black/10 flex items-center justify-end gap-3 z-20">
              <button
                onClick={() => setModal(null)}
                className="px-5 py-2.5 rounded-xl border border-black/10 font-bold text-sm text-[#1a2b3c] hover:bg-gray-100 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 bg-[#d0a755] text-[#1a2b3c] font-black px-6 py-2.5 rounded-xl hover:bg-[#b89040] transition-colors disabled:opacity-50 shadow-md"
              >
                <FiSave className="w-4 h-4" />
                {saving ? "جاري الحفظ..." : "حفظ الفندق"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-black text-[#1a2b3c] mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#f0f2f5] rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none focus:ring-2 focus:ring-[#d0a755]"
      />
    </div>
  );
}
