"use client";

import { useState, useEffect } from "react";
import type { SiteSettings } from "@/lib/types";
import { FiSave, FiCheck } from "react-icons/fi";
import ImageUploader from "@/components/admin/ImageUploader";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then(r => r.json())
      .then(setSettings);
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const f = (path: string, value: string) => {
    setSettings(prev => {
      if (!prev) return prev;
      const keys = path.split(".");
      const next = { ...prev } as Record<string, unknown>;
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...(cur[keys[i]] as Record<string, unknown>) };
        cur = cur[keys[i]] as Record<string, unknown>;
      }
      cur[keys[keys.length - 1]] = value;
      return next as SiteSettings;
    });
  };

  if (!settings) {
    return <div className="flex-1 p-8 text-center text-[#1a2b3c]/30 py-20">جاري التحميل…</div>;
  }

  return (
    <div className="flex-1 p-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a2b3c]">الإعدادات</h1>
          <p className="text-sm text-[#1a2b3c]/50 mt-1">إعدادات الموقع والتواصل</p>
        </div>
        <button onClick={save} disabled={saving} className={`flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-xl transition-all shadow-sm ${saved ? "bg-green-500 text-white" : "bg-[#d0a755] text-[#1a2b3c] hover:bg-[#b89040]"}`}>
          {saved ? <><FiCheck className="w-4 h-4" /> تم الحفظ</> : <><FiSave className="w-4 h-4" /> {saving ? "جاري الحفظ…" : "حفظ الإعدادات"}</>}
        </button>
      </div>

      <div className="space-y-5">
        <Card title="الأسعار والعملات">
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl border border-blue-100 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            يتم تحديث أسعار الصرف تلقائياً من الإنترنت، ولا يمكن تعديلها يدوياً.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field 
              label="سعر صرف الدولار (USD to EGP)" 
              value={settings.usdRate?.toString() || "50"} 
              onChange={v => f("usdRate", parseFloat(v) || 50 as any)} 
              dir="ltr" 
              type="number"
              readOnly
            />
            <Field 
              label="سعر صرف اليورو (EUR to EGP)" 
              value={settings.eurRate?.toString() || "55"} 
              onChange={v => f("eurRate", parseFloat(v) || 55 as any)} 
              dir="ltr" 
              type="number"
              readOnly
            />
            <Field 
              label="سعر صرف الريال السعودي (SAR to EGP)" 
              value={settings.sarRate?.toString() || "13"} 
              onChange={v => f("sarRate", parseFloat(v) || 13 as any)} 
              dir="ltr" 
              type="number"
              readOnly
            />
            <Field 
              label="سعر صرف الريال القطري (QAR to EGP)" 
              value={settings.qarRate?.toString() || "13"} 
              onChange={v => f("qarRate", parseFloat(v) || 13 as any)} 
              dir="ltr" 
              type="number"
              readOnly
            />
            <Field 
              label="سعر صرف الدينار الكويتي (KWD to EGP)" 
              value={settings.kwdRate?.toString() || "160"} 
              onChange={v => f("kwdRate", parseFloat(v) || 160 as any)} 
              dir="ltr" 
              type="number"
              readOnly
            />
            <Field 
              label="سعر صرف الدينار البحريني (BHD to EGP)" 
              value={settings.bhdRate?.toString() || "130"} 
              onChange={v => f("bhdRate", parseFloat(v) || 130 as any)} 
              dir="ltr" 
              type="number"
              readOnly
            />
          </div>
        </Card>

        {/* Contact */}
        <Card title="معلومات التواصل">
          <Field label="رقم واتساب السيارات" value={settings.whatsappCarNumber} onChange={v => f("whatsappCarNumber", v)} dir="ltr" />
          <Field label="رقم واتساب الخدمات" value={settings.whatsappServiceNumber} onChange={v => f("whatsappServiceNumber", v)} dir="ltr" />
          <Field label="العنوان" value={settings.address} onChange={v => f("address", v)} />
        </Card>

        {/* Hero */}
        <Card title="محتوى الصفحة الرئيسية">
          <Field label="عنوان الهيرو (عربي)" value={settings.translations?.ar?.heroTitle ?? settings.heroTitle} onChange={v => f("translations.ar.heroTitle", v)} />
          <Textarea label="النص التعريفي (عربي)" value={settings.translations?.ar?.heroSubtitle ?? settings.heroSubtitle} onChange={v => f("translations.ar.heroSubtitle", v)} />
          <Field label="عنوان الهيرو (إنجليزي)" value={settings.translations?.en?.heroTitle ?? ""} onChange={v => f("translations.en.heroTitle", v)} />
          <Textarea label="النص التعريفي (إنجليزي)" value={settings.translations?.en?.heroSubtitle ?? ""} onChange={v => f("translations.en.heroSubtitle", v)} />
          <div className="pt-2">
            <h3 className="block text-xs font-black text-[#1a2b3c]/60 mb-3 uppercase tracking-wide">صور معرض الهيرو</h3>
            <ImageUploader 
               images={settings.heroImages || (settings.heroImage ? [settings.heroImage] : [])} 
               onChange={imgs => f("heroImages", imgs as any)} 
            />
          </div>
        </Card>

        {/* Social */}
        <Card title="حسابات التواصل الاجتماعي">
          {["facebook", "instagram", "tiktok", "snapchat", "telegram", "youtube", "x", "linkedin", "whatsapp"].map(platform => (
            <Field key={platform} label={platform} value={settings.socialLinks?.[platform] ?? ""} onChange={v => f(`socialLinks.${platform}`, v)} dir="ltr" />
          ))}
        </Card>

        {/* Legal */}
        <Card title="السياسات والخصوصية">
          <Textarea label="سياسة الحجز (عربي)" value={settings.translations?.ar?.policies ?? settings.policies ?? ""} onChange={v => f("translations.ar.policies", v)} rows={4} />
          <Textarea label="سياسة الخصوصية (عربي)" value={settings.translations?.ar?.privacy ?? settings.privacy ?? ""} onChange={v => f("translations.ar.privacy", v)} rows={4} />
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-black/5 bg-[#f8f9fa]">
        <h2 className="font-black text-[#1a2b3c] text-sm uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, dir, type = "text", readOnly = false }: { label: string; value: string; onChange: (v: string) => void; dir?: string; type?: string; readOnly?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">{label}</label>
      <input type={type} value={value} onChange={e => !readOnly && onChange(e.target.value)} dir={dir} readOnly={readOnly} className={`w-full rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#d0a755]/50 ${readOnly ? 'bg-[#e9ecef] text-[#1a2b3c]/50 cursor-not-allowed' : 'bg-[#f0f2f5] text-[#1a2b3c]'}`} />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-black text-[#1a2b3c]/60 mb-1.5 uppercase tracking-wide">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} className="w-full bg-[#f0f2f5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1a2b3c] outline-none resize-none focus:ring-2 focus:ring-[#d0a755]/50" />
    </div>
  );
}
