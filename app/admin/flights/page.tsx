"use client";

import { useState, useEffect } from "react";
import type { FlightRoute } from "@/lib/types";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiCheck } from "react-icons/fi";
import { FaPlane, FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import ImageUploader from "@/components/admin/ImageUploader";

const empty: Omit<FlightRoute, "id"> = {
  fromCity: "القاهرة (CAI)",
  toCity: "الرياض (RUH)",
  flightType: "رحلات يومية مباشرة",
  price: 4500,
  image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80",
  tag: "الأكثر طلباً",
  features: [],
  status: "available",
  sortOrder: 0,
  translations: {
    ar: { fromCity: "", toCity: "", flightType: "", tag: "", features: [] },
    en: { fromCity: "", toCity: "", flightType: "", tag: "", features: [] },
  }
};

export default function FlightsAdminPage() {
  const [flights, setFlights] = useState<FlightRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<FlightRoute | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const [featuresArText, setFeaturesArText] = useState("");
  const [featuresEnText, setFeaturesEnText] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/flights", { cache: "no-store" });
    if (res.ok) {
      setFlights(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openAdd() {
    setForm({
      ...empty,
      sortOrder: flights.length + 1,
      translations: {
        ar: { fromCity: "", toCity: "", flightType: "", tag: "", features: [] },
        en: { fromCity: "", toCity: "", flightType: "", tag: "", features: [] },
      }
    });
    setFeaturesArText("");
    setFeaturesEnText("");
    setEditing(null);
    setModal("add");
  }

  function openEdit(fRoute: FlightRoute) {
    const arFeatures = fRoute.translations?.ar?.features || fRoute.features || [];
    const enFeatures = fRoute.translations?.en?.features || [];

    setForm({
      ...fRoute,
      translations: {
        ar: {
          fromCity: fRoute.translations?.ar?.fromCity || fRoute.fromCity || "",
          toCity: fRoute.translations?.ar?.toCity || fRoute.toCity || "",
          flightType: fRoute.translations?.ar?.flightType || fRoute.flightType || "",
          tag: fRoute.translations?.ar?.tag || fRoute.tag || "",
          features: arFeatures,
        },
        en: {
          fromCity: fRoute.translations?.en?.fromCity || "",
          toCity: fRoute.translations?.en?.toCity || "",
          flightType: fRoute.translations?.en?.flightType || "",
          tag: fRoute.translations?.en?.tag || "",
          features: enFeatures,
        }
      }
    });
    setFeaturesArText(arFeatures.join("\n"));
    setFeaturesEnText(enFeatures.join("\n"));
    setEditing(fRoute);
    setModal("edit");
  }

  async function save() {
    setSaving(true);

    const arFrom = form.translations?.ar?.fromCity || form.fromCity || "القاهرة";
    const arTo = form.translations?.ar?.toCity || form.toCity || "الرياض";
    const arType = form.translations?.ar?.flightType || form.flightType || "رحلات مباشرة";
    const arTag = form.translations?.ar?.tag || form.tag || "";
    const arFeatures = featuresArText.split("\n").map(s => s.trim()).filter(Boolean);

    const enFrom = form.translations?.en?.fromCity || arFrom;
    const enTo = form.translations?.en?.toCity || arTo;
    const enType = form.translations?.en?.flightType || arType;
    const enTag = form.translations?.en?.tag || arTag;
    const enFeatures = featuresEnText.split("\n").map(s => s.trim()).filter(Boolean);

    const data: FlightRoute = {
      ...form,
      id: editing?.id ?? `flight-${Date.now()}`,
      fromCity: arFrom,
      toCity: arTo,
      flightType: arType,
      tag: arTag,
      features: arFeatures.length > 0 ? arFeatures : ["رحلات مباشرة", "وزن أمتعة مجاني"],
      price: Number(form.price) || 0,
      sortOrder: Number(form.sortOrder) || 0,
      translations: {
        ar: {
          fromCity: arFrom,
          toCity: arTo,
          flightType: arType,
          tag: arTag,
          features: arFeatures,
        },
        en: {
          fromCity: enFrom,
          toCity: enTo,
          flightType: enType,
          tag: enTag,
          features: enFeatures.length > 0 ? enFeatures : arFeatures,
        }
      }
    };

    if (modal === "edit") {
      await fetch(`/api/admin/flights/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setSaving(false);
    setModal(null);
    load();
  }

  async function del(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المسار الجوي؟")) return;
    await fetch(`/api/admin/flights/${id}`, {
      method: "DELETE"
    });
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

  const imagesList = form.image ? [form.image] : [];

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1a2b3c] flex items-center gap-3">
            <span className="w-3 h-8 bg-[#d0a755] rounded-full" />
            إدارة مسارات وتذاكر الطيران
          </h1>
          <p className="text-sm text-[#1a2b3c]/60 mt-1">التحكم في وجهات السفر الجوي، الصور على Cloudinary، الأسعار، والمزايا باللغتين</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#d0a755] text-[#1a2b3c] text-sm font-black px-5 py-3 rounded-xl hover:bg-[#b89040] transition-colors shadow-md"
        >
          <FiPlus className="w-5 h-5" /> إضافة مسار جوي
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#1a2b3c]/40 font-bold">جاري تحميل مسارات الطيران...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight) => (
            <div key={flight.id} className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
              {/* Flight Image with Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={flight.image}
                  alt={`${flight.fromCity} - ${flight.toCity}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-[#d0a755] text-white text-[10px] font-black shadow flex items-center gap-1">
                    <FaPlane className="w-2.5 h-2.5" />
                    {flight.tag || "مباشر"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black shadow ${flight.status === "available" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    {flight.status === "available" ? "متاح" : "غير متاح"}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2 px-3 text-white text-xs font-black flex items-center justify-between">
                  <span className="truncate">{flight.fromCity}</span>
                  <span className="text-[#d0a755]">⇄</span>
                  <span className="truncate">{flight.toCity}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs font-bold text-[#d0a755] uppercase mb-1">{flight.flightType}</p>
                <h3 className="font-black text-[#1a2b3c] text-lg mb-2">
                  {flight.fromCity} ⇄ {flight.toCity}
                </h3>

                {/* Features Snippet */}
                <div className="space-y-1 mb-4 flex-1">
                  {(flight.features || []).slice(0, 3).map((f, i) => (
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
                    <span className="text-base font-black text-[#d0a755]">{flight.price} ج.م</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(flight)}
                      className="p-2 rounded-xl border border-black/10 text-xs font-bold text-[#1a2b3c] hover:bg-[#d0a755] hover:text-white transition-colors"
                      title="تعديل"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => del(flight.id)}
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

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-black/10 flex items-center justify-between z-20">
              <h2 className="font-black text-[#1a2b3c] text-xl">
                {modal === "add" ? "إضافة مسار طيران جديد" : "تعديل بيانات رحلة الطيران"}
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
                  صورة وجهة الطيران (مرفوعة على Cloudinary)
                </label>
                <ImageUploader
                  images={imagesList}
                  onChange={(newImages) => {
                    setForm(prev => ({
                      ...prev,
                      image: newImages[0] || prev.image
                    }));
                  }}
                />
              </div>

              {/* From City (AR / EN) */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="مدينة الإقلاع / المطار (عربي)"
                  value={form.translations?.ar?.fromCity || form.fromCity || ""}
                  onChange={v => fTrans("ar", "fromCity", v)}
                  placeholder="مثال: القاهرة (CAI)"
                />
                <Field
                  label="مدينة الإقلاع / المطار (إنجليزي)"
                  value={form.translations?.en?.fromCity || ""}
                  onChange={v => fTrans("en", "fromCity", v)}
                  placeholder="e.g. Cairo (CAI)"
                />
              </div>

              {/* To City (AR / EN) */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="مدينة الوصول / المطار (عربي)"
                  value={form.translations?.ar?.toCity || form.toCity || ""}
                  onChange={v => fTrans("ar", "toCity", v)}
                  placeholder="مثال: الرياض (RUH)"
                />
                <Field
                  label="مدينة الوصول / المطار (إنجليزي)"
                  value={form.translations?.en?.toCity || ""}
                  onChange={v => fTrans("en", "toCity", v)}
                  placeholder="e.g. Riyadh (RUH)"
                />
              </div>

              {/* Flight Type / Carrier (AR / EN) */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="نوع الرحلة / الطيران (عربي)"
                  value={form.translations?.ar?.flightType || form.flightType || ""}
                  onChange={v => fTrans("ar", "flightType", v)}
                  placeholder="مثال: رحلات يومية مباشرة"
                />
                <Field
                  label="نوع الرحلة / الطيران (إنجليزي)"
                  value={form.translations?.en?.flightType || ""}
                  onChange={v => fTrans("en", "flightType", v)}
                  placeholder="e.g. Daily Direct Flights"
                />
              </div>

              {/* Badges / Tags (AR / EN) */}
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="الشارة الترويجية (عربي)"
                  value={form.translations?.ar?.tag || form.tag || ""}
                  onChange={v => fTrans("ar", "tag", v)}
                  placeholder="مثال: الأكثر طلباً"
                />
                <Field
                  label="الشارة الترويجية (إنجليزي)"
                  value={form.translations?.en?.tag || ""}
                  onChange={v => fTrans("en", "tag", v)}
                  placeholder="e.g. Most Popular"
                />
              </div>

              {/* Price, Status, SortOrder */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-black/5">
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/70 mb-1.5">يبدأ سعر التذكرة من (ج.م)</label>
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
                    placeholder="رحلات مباشرة يومياً بدون ترانزيت&#10;وزن أمتعة مجاني حتى 46 كجم&#10;إمكانية اختيار المقعد والوجبة"
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
                    placeholder="Daily non-stop direct flights&#10;Free luggage allowance up to 46kg&#10;Instant confirmation & 24/7 support"
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
                {saving ? "جاري الحفظ..." : "حفظ مسار الطيران"}
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
