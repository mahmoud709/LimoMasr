"use client";

import { useState, useEffect } from "react";
import type { HotelOption } from "@/lib/types";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiMapPin } from "react-icons/fi";

const empty: Omit<HotelOption, "id"> = {
  city: "",
  name: "",
  description: "",
  status: "available",
  translations: {
    ar: { city: "", name: "", description: "" },
    en: { city: "", name: "", description: "" },
  }
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<HotelOption | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/hotels", { cache: "no-store" });
    setHotels(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({
      ...empty,
      translations: {
        ar: { city: "", name: "", description: "" },
        en: { city: "", name: "", description: "" },
      }
    });
    setEditing(null);
    setModal("add");
  }

  function openEdit(h: HotelOption) {
    setForm({
      ...h,
      translations: {
        ar: {
          city: h.translations?.ar?.city || h.city || "",
          name: h.translations?.ar?.name || h.name || "",
          description: h.translations?.ar?.description || h.description || "",
        },
        en: {
          city: h.translations?.en?.city || "",
          name: h.translations?.en?.name || "",
          description: h.translations?.en?.description || "",
        }
      }
    });
    setEditing(h);
    setModal("edit");
  }

  async function save() {
    setSaving(true);

    const arCity = form.translations?.ar?.city || form.city || "وجهة جديدة";
    const arName = form.translations?.ar?.name || form.name || "";
    const arDescription = form.translations?.ar?.description || form.description || "";

    const enCity = form.translations?.en?.city || arCity;
    const enName = form.translations?.en?.name || arName;
    const enDescription = form.translations?.en?.description || arDescription;

    const data: HotelOption = {
      ...form,
      city: arCity,
      name: arName,
      description: arDescription,
      id: editing?.id ?? `hotel-${Date.now()}`,
      translations: {
        ar: {
          city: arCity,
          name: arName,
          description: arDescription,
        },
        en: {
          city: enCity,
          name: enName,
          description: enDescription,
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

  async function del(id: string) {
    if (!confirm("هل تريد الحذف؟")) return;
    await fetch(`/api/admin/hotels/${id}`, {
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

  return (
    <div className="flex-1 p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a2b3c]">الفنادق والمدن</h1>
          <p className="text-sm text-[#1a2b3c]/50 mt-1">{hotels.length} وجهة</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#d0a755] text-[#1a2b3c] text-sm font-black px-4 py-2.5 rounded-xl hover:bg-[#b89040] transition-colors shadow-sm">
          <FiPlus className="w-4 h-4" /> إضافة وجهة
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#1a2b3c]/30">جاري التحميل…</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels.map(hotel => (
            <div key={hotel.id} className="bg-white rounded-2xl border border-black/5 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                    <FiMapPin className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#1a2b3c] text-base">
                      {hotel.city}
                      {hotel.translations?.en?.city && (
                        <span className="block text-[10px] text-gray-400 font-bold">{hotel.translations.en.city}</span>
                      )}
                    </h3>
                    {hotel.name && <p className="text-xs text-[#1a2b3c]/50">{hotel.name}</p>}
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border shrink-0 ${hotel.status === "available" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                  {hotel.status === "available" ? "متاح" : "غير متاح"}
                </span>
              </div>
              <p className="text-sm text-[#1a2b3c]/60 mb-4 line-clamp-2">{hotel.description}</p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(hotel)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-[#1a2b3c]/10 text-xs font-bold text-[#1a2b3c] hover:bg-[#f0f2f5] transition-colors">
                  <FiEdit2 className="w-3.5 h-3.5" /> تعديل
                </button>
                <button onClick={() => del(hotel.id)} className="w-9 h-9 rounded-xl border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-black/5 flex items-center justify-between">
              <h2 className="font-black text-[#1a2b3c] text-lg">{modal === "add" ? "إضافة وجهة" : "تعديل الوجهة"}</h2>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-[#f0f2f5] flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              
              {/* City Translation */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="المدينة (عربي)" value={form.translations?.ar?.city || ""} onChange={v => fTrans("ar", "city", v)} />
                <Field label="المدينة (إنجليزي)" value={form.translations?.en?.city || ""} onChange={v => fTrans("en", "city", v)} />
              </div>

              {/* Name Translation (Optional) */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="اسم الفندق (عربي - اختياري)" value={form.translations?.ar?.name || ""} onChange={v => fTrans("ar", "name", v)} />
                <Field label="اسم الفندق (إنجليزي - اختياري)" value={form.translations?.en?.name || ""} onChange={v => fTrans("en", "name", v)} />
              </div>

              {/* Description Translation */}
              <div className="space-y-4 border-t border-black/5 pt-4">
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">الوصف (عربي)</label>
                  <textarea value={form.translations?.ar?.description || ""} onChange={e => fTrans("ar", "description", e.target.value)} rows={3} className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none resize-none focus:ring-2 focus:ring-[#d0a755]/50" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">الوصف (إنجليزي)</label>
                  <textarea value={form.translations?.en?.description || ""} onChange={e => fTrans("en", "description", e.target.value)} rows={3} className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none resize-none focus:ring-2 focus:ring-[#d0a755]/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">الحالة</label>
                <select value={form.status} onChange={e => f("status", e.target.value)} className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none">
                  <option value="available">متاح</option>
                  <option value="unavailable">غير متاح</option>
                </select>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-black/5">
              <button onClick={save} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-[#d0a755] text-[#1a2b3c] font-black py-3 rounded-xl hover:bg-[#b89040] transition-colors disabled:opacity-50">
                <FiSave className="w-4 h-4" />
                {saving ? "جاري الحفظ…" : "حفظ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none focus:ring-2 focus:ring-[#d0a755]/50" />
    </div>
  );
}
