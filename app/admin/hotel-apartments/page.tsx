"use client";

import { useState, useEffect } from "react";
import type { ApartmentItem } from "@/lib/types";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiMapPin, FiCheck, FiUsers, FiAlertTriangle } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";
import ImageUploader from "@/components/admin/ImageUploader";

const empty: Omit<ApartmentItem, "id"> = {
  name: "",
  location: "",
  rooms: "2 إلى 4 غرف نوم",
  capacity: "مناسب للعائلات",
  price: 3200,
  image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  images: [],
  tag: "تشطيب فندقي فاخر",
  features: [],
  description: "",
  status: "available",
  sortOrder: 0,
  translations: {
    ar: { name: "", location: "", rooms: "", capacity: "", tag: "", features: [], description: "" },
    en: { name: "", location: "", rooms: "", capacity: "", tag: "", features: [], description: "" },
  }
};

export default function HotelApartmentsAdminPage() {
  const [apartments, setApartments] = useState<ApartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<ApartmentItem | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [featuresArText, setFeaturesArText] = useState("");
  const [featuresEnText, setFeaturesEnText] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/hotel-apartments", { cache: "no-store" });
    if (res.ok) {
      setApartments(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setForm({
      ...empty,
      sortOrder: apartments.length + 1,
      translations: {
        ar: { name: "", location: "", rooms: "", capacity: "", tag: "", features: [], description: "" },
        en: { name: "", location: "", rooms: "", capacity: "", tag: "", features: [], description: "" },
      }
    });
    setFeaturesArText("");
    setFeaturesEnText("");
    setEditing(null);
    setModal("add");
  }

  function openEdit(apt: ApartmentItem) {
    const arFeatures = apt.translations?.ar?.features || apt.features || [];
    const enFeatures = apt.translations?.en?.features || [];

    setForm({
      ...apt,
      translations: {
        ar: {
          name: apt.translations?.ar?.name || apt.name || "",
          location: apt.translations?.ar?.location || apt.location || "",
          rooms: apt.translations?.ar?.rooms || apt.rooms || "",
          capacity: apt.translations?.ar?.capacity || apt.capacity || "",
          tag: apt.translations?.ar?.tag || apt.tag || "",
          features: arFeatures,
          description: apt.translations?.ar?.description || apt.description || "",
        },
        en: {
          name: apt.translations?.en?.name || "",
          location: apt.translations?.en?.location || "",
          rooms: apt.translations?.en?.rooms || "",
          capacity: apt.translations?.en?.capacity || "",
          tag: apt.translations?.en?.tag || "",
          features: enFeatures,
          description: apt.translations?.en?.description || "",
        }
      }
    });
    setFeaturesArText(arFeatures.join("\n"));
    setFeaturesEnText(enFeatures.join("\n"));
    setEditing(apt);
    setModal("edit");
  }

  async function save() {
    setSaving(true);

    const arName = form.translations?.ar?.name || form.name || "شقة فندقية فاخرة";
    const arLocation = form.translations?.ar?.location || form.location || "القاهرة";
    const arRooms = form.translations?.ar?.rooms || form.rooms || "2 غرف نوم";
    const arCapacity = form.translations?.ar?.capacity || form.capacity || "عائلات";
    const arTag = form.translations?.ar?.tag || form.tag || "";
    const arDesc = form.translations?.ar?.description || form.description || "";
    const arFeatures = featuresArText.split("\n").map(s => s.trim()).filter(Boolean);

    const enName = form.translations?.en?.name || arName;
    const enLocation = form.translations?.en?.location || arLocation;
    const enRooms = form.translations?.en?.rooms || arRooms;
    const enCapacity = form.translations?.en?.capacity || arCapacity;
    const enTag = form.translations?.en?.tag || arTag;
    const enDesc = form.translations?.en?.description || arDesc;
    const enFeatures = featuresEnText.split("\n").map(s => s.trim()).filter(Boolean);

    const primaryImage = form.images && form.images.length > 0 ? form.images[0] : (form.image || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80");

    const data: ApartmentItem = {
      ...form,
      id: editing?.id ?? `apt-${Date.now()}`,
      name: arName,
      location: arLocation,
      rooms: arRooms,
      capacity: arCapacity,
      tag: arTag,
      description: arDesc,
      features: arFeatures.length > 0 ? arFeatures : ["فرش فندقي راقي", "خدمة تنظيف 24/7"],
      image: primaryImage,
      price: Number(form.price) || 0,
      sortOrder: Number(form.sortOrder) || 0,
      translations: {
        ar: {
          name: arName,
          location: arLocation,
          rooms: arRooms,
          capacity: arCapacity,
          tag: arTag,
          features: arFeatures,
          description: arDesc,
        },
        en: {
          name: enName,
          location: enLocation,
          rooms: enRooms,
          capacity: enCapacity,
          tag: enTag,
          features: enFeatures.length > 0 ? enFeatures : arFeatures,
          description: enDesc,
        }
      }
    };

    if (modal === "edit") {
      await fetch(`/api/admin/hotel-apartments/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/hotel-apartments", {
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
    await fetch(`/api/admin/hotel-apartments/${deleteConfirm}`, { method: "DELETE" });
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
            إدارة الشقق والأجنحة الفندقية
          </h1>
          <p className="text-sm text-[#1a2b3c]/60 mt-1">التحكم في الشقق الفاخرة، الصور على Cloudinary، الأسعار، والمواصفات باللغتين</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#d0a755] text-[#1a2b3c] text-sm font-black px-5 py-3 rounded-xl hover:bg-[#b89040] transition-colors shadow-md"
        >
          <FiPlus className="w-5 h-5" /> إضافة شقة فندقية
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#1a2b3c]/40 font-bold">جاري تحميل الشقق الفندقية...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apartments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
              {/* Image with Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={apt.image}
                  alt={apt.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-[#d0a755] text-white text-[10px] font-black shadow flex items-center gap-1">
                    <FaBuilding className="w-2.5 h-2.5" />
                    {apt.tag || "فاخر"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shadow ${apt.status === "available" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {apt.status === "available" ? "متاح" : "غير متاح"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs text-[#d0a755] font-black uppercase mb-1">
                  <FiMapPin className="w-3.5 h-3.5" />
                  <span>{apt.location}</span>
                </div>

                <h3 className="font-black text-[#1a2b3c] text-lg mb-1">{apt.name}</h3>
                {apt.translations?.en?.name && (
                  <p className="text-xs text-[#1a2b3c]/50 font-bold mb-2">{apt.translations.en.name}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500 font-bold mb-3">
                  <span>🛏️ {apt.rooms}</span>
                  <span>👥 {apt.capacity}</span>
                </div>

                {/* Features Snippet */}
                <div className="space-y-1 mb-4 flex-1">
                  {(apt.features || []).slice(0, 3).map((f, i) => (
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
                    <span className="text-base font-black text-[#d0a755]">{apt.price} ج.م/ليلة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(apt)}
                      className="p-2 rounded-xl border border-black/10 text-xs font-bold text-[#1a2b3c] hover:bg-[#d0a755] hover:text-white transition-colors"
                      title="تعديل"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => del(apt.id)}
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
              <p className="text-sm text-slate-500 mb-8 font-medium">هل أنت متأكد من رغبتك في حذف هذه الشقة الفندقية بشكل نهائي؟ لا يمكن التراجع عن هذه الخطوة.</p>
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
                {modal === "add" ? "إضافة شقة فندقية جديدة" : "تعديل بيانات الشقة الفندقية"}
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
                  صور الشقة الفندقية (مرفوعة على Cloudinary)
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
                  label="عنوان / اسم الشقة (عربي)"
                  value={form.translations?.ar?.name || form.name || ""}
                  onChange={v => fTrans("ar", "name", v)}
                  placeholder="مثال: أجنحة وشقق فندقية بالتجمع الخامس"
                />
                <Field
                  label="عنوان / اسم الشقة (إنجليزي)"
                  value={form.translations?.en?.name || ""}
                  onChange={v => fTrans("en", "name", v)}
                  placeholder="e.g. Luxury Suites in 5th Settlement"
                />
              </div>

              {/* Location (AR / EN) */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="الموقع / المنطقة (عربي)"
                  value={form.translations?.ar?.location || form.location || ""}
                  onChange={v => fTrans("ar", "location", v)}
                  placeholder="مثال: القاهرة الجديدة"
                />
                <Field
                  label="الموقع / المنطقة (إنجليزي)"
                  value={form.translations?.en?.location || ""}
                  onChange={v => fTrans("en", "location", v)}
                  placeholder="e.g. New Cairo"
                />
              </div>

              {/* Rooms & Capacity */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="عدد الغرف (عربي / إنجليزي)"
                  value={form.translations?.ar?.rooms || form.rooms || ""}
                  onChange={v => {
                    f("rooms", v);
                    fTrans("ar", "rooms", v);
                  }}
                  placeholder="مثال: 2 إلى 4 غرف نوم"
                />
                <Field
                  label="السعة والملائمة"
                  value={form.translations?.ar?.capacity || form.capacity || ""}
                  onChange={v => {
                    f("capacity", v);
                    fTrans("ar", "capacity", v);
                  }}
                  placeholder="مثال: مناسب للعائلات الكبيرة"
                />
              </div>

              {/* Badges / Tags (AR / EN) */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="الشارة الترويجية (عربي)"
                  value={form.translations?.ar?.tag || form.tag || ""}
                  onChange={v => fTrans("ar", "tag", v)}
                  placeholder="مثال: تشطيب فندقي فاخر"
                />
                <Field
                  label="الشارة الترويجية (إنجليزي)"
                  value={form.translations?.en?.tag || ""}
                  onChange={v => fTrans("en", "tag", v)}
                  placeholder="e.g. Ultra Luxury Finish"
                />
              </div>

              {/* Price, Status, SortOrder */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-black/5">
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/70 mb-1.5">السعر في الليلة (ج.م)</label>
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
                    placeholder="فرش فندقي الترا مودرن ومكيف بالكامل&#10;مطبخ مجهز بجميع الأجهزة الكهربائية&#10;خدمة تنظيف دورية وأمن 24/7"
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
                    placeholder="Ultra-modern luxury furnishings & AC&#10;Fully equipped modern kitchen&#10;Regular housekeeping & 24/7 security"
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
                {saving ? "جاري الحفظ..." : "حفظ الشقة"}
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
