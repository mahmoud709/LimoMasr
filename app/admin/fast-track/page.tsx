"use client";

import { useState, useEffect } from "react";
import type { FastTrackPackage } from "@/lib/types";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from "react-icons/fi";
import ImageUploader from "@/components/admin/ImageUploader";

const empty: Omit<FastTrackPackage, "id"> = {
  name: "",
  airport: "",
  price: 0,
  currency: "EGP",
  description: "",
  status: "available",
  sortOrder: 99,
  translations: {
    ar: { name: "", airport: "", description: "" },
    en: { name: "", airport: "", description: "" },
  }
};

export default function FastTrackPage() {
  const [packages, setPackages] = useState<FastTrackPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<FastTrackPackage | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/fast-track", { cache: "no-store" });
    setPackages(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({
      ...empty,
      translations: {
        ar: { name: "", airport: "", description: "" },
        en: { name: "", airport: "", description: "" },
      }
    });
    setEditing(null);
    setModal("add");
  }

  function openEdit(pkg: FastTrackPackage) {
    setForm({
      ...pkg,
      translations: {
        ar: {
          name: pkg.translations?.ar?.name || pkg.name || "",
          airport: pkg.translations?.ar?.airport || pkg.airport || "",
          description: pkg.translations?.ar?.description || pkg.description || "",
        },
        en: {
          name: pkg.translations?.en?.name || "",
          airport: pkg.translations?.en?.airport || "",
          description: pkg.translations?.en?.description || "",
        }
      }
    });
    setEditing(pkg);
    setModal("edit");
  }

  async function save() {
    setSaving(true);

    const arName = form.translations?.ar?.name || form.name || "باقة جديدة";
    const arAirport = form.translations?.ar?.airport || form.airport || "";
    const arDescription = form.translations?.ar?.description || form.description || "";

    const enName = form.translations?.en?.name || arName;
    const enAirport = form.translations?.en?.airport || arAirport;
    const enDescription = form.translations?.en?.description || arDescription;

    const data: FastTrackPackage = {
      ...form,
      name: arName,
      airport: arAirport,
      description: arDescription,
      id: editing?.id ?? `ft-${Date.now()}`,
      translations: {
        ar: {
          name: arName,
          airport: arAirport,
          description: arDescription,
        },
        en: {
          name: enName,
          airport: enAirport,
          description: enDescription,
        }
      }
    };

    if (modal === "edit") {
      await fetch(`/api/admin/fast-track/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/fast-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setSaving(false);
    setModal(null);
    load();
  }

  async function deletePkg(id: string) {
    if (!confirm("هل تريد حذف هذه الباقة؟")) return;
    await fetch(`/api/admin/fast-track/${id}`, {
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a2b3c]">المسار السريع (فاست تراك)</h1>
          <p className="text-sm text-[#1a2b3c]/50 mt-1">{packages.length} باقة متاحة</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#d0a755] text-[#1a2b3c] text-sm font-black px-4 py-2.5 rounded-xl hover:bg-[#b89040] transition-colors shadow-sm">
          <FiPlus className="w-4 h-4" />
          إضافة باقة
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-[#1a2b3c]/30">جاري التحميل…</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right min-w-[700px]">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-black/5">
                  {["الاسم", "المطار", "السعر", "العملة", "الحالة", "الترتيب", ""].map(h => (
                    <th key={h} className="px-5 py-3.5 text-xs font-black text-[#1a2b3c]/40 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {packages.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-16 text-center text-[#1a2b3c]/30">لا توجد باقات</td></tr>
                ) : packages.map(pkg => (
                  <tr key={pkg.id} className="border-t border-black/5 hover:bg-[#f8f9fa] transition-colors">
                    <td className="px-5 py-4 font-bold text-[#1a2b3c]">
                      {pkg.name}
                      {pkg.translations?.en?.name && (
                        <span className="block text-[10px] text-gray-400 font-bold">{pkg.translations.en.name}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#1a2b3c]/70">{pkg.airport}</td>
                    <td className="px-5 py-4 font-bold text-[#d0a755]">{pkg.price.toLocaleString("ar-EG")}</td>
                    <td className="px-5 py-4 text-[#1a2b3c]/60">{pkg.currency}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${pkg.status === "available" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {pkg.status === "available" ? "متاح" : "غير متاح"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#1a2b3c]/50">{pkg.sortOrder}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(pkg)} className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center text-[#1a2b3c]/60 hover:bg-[#f0f2f5] transition-colors">
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deletePkg(pkg.id)} className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-black/5 flex items-center justify-between">
              <h2 className="font-black text-[#1a2b3c] text-lg">{modal === "add" ? "إضافة باقة" : "تعديل الباقة"}</h2>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-[#f0f2f5] flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              
              {/* Name Translation */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="اسم الباقة (عربي)" value={form.translations?.ar?.name || ""} onChange={v => fTrans("ar", "name", v)} />
                <Field label="اسم الباقة (إنجليزي)" value={form.translations?.en?.name || ""} onChange={v => fTrans("en", "name", v)} />
              </div>

              {/* Airport Translation */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="المطار (عربي)" value={form.translations?.ar?.airport || ""} onChange={v => fTrans("ar", "airport", v)} />
                <Field label="المطار (إنجليزي)" value={form.translations?.en?.airport || ""} onChange={v => fTrans("en", "airport", v)} />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <FieldNum label="السعر" value={form.price} onChange={v => f("price", v)} />
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">العملة</label>
                  <select value={form.currency} onChange={e => f("currency", e.target.value)} className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none">
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="USD">دولار (USD)</option>
                  </select>
                </div>
              </div>

              {/* Description Translation */}
              <div className="space-y-4 border-t border-black/5 pt-4">
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">الوصف (عربي)</label>
                  <textarea value={form.translations?.ar?.description || ""} onChange={e => fTrans("ar", "description", e.target.value)} rows={3} className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">الوصف (إنجليزي)</label>
                  <textarea value={form.translations?.en?.description || ""} onChange={e => fTrans("en", "description", e.target.value)} rows={3} className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none resize-none" />
                </div>
              </div>

              <div className="border-t border-black/5 pt-4">
                <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">صورة الباقة</label>
                <ImageUploader 
                  images={form.image ? [form.image] : []}
                  onChange={(imgs) => f("image", imgs.length > 0 ? imgs[imgs.length - 1] : undefined)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">الحالة</label>
                <select value={form.status} onChange={e => f("status", e.target.value)} className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none">
                  <option value="available">متاح</option>
                  <option value="unavailable">غير متاح</option>
                </select>
              </div>
              <FieldNum label="ترتيب العرض" value={form.sortOrder} onChange={v => f("sortOrder", v)} />
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

function FieldNum({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">{label}</label>
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none focus:ring-2 focus:ring-[#d0a755]/50" />
    </div>
  );
}
