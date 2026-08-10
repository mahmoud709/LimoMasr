"use client";

import { useState, useEffect } from "react";
import type { SiteSettings } from "@/lib/types";
import { FiSave, FiCheck, FiUploadCloud, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import ImageUploader from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/ToastProvider";

export default function SettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Cloudinary migration state
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

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

  async function startCloudinaryMigration() {
    setMigrating(true);
    setMigrationResult(null);
    try {
      const res = await fetch("/api/admin/cloudinary/migrate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMigrationResult(data.summary);
        toast.success(`تم تحويل ${data.summary.totalImagesUploaded} صورة بنجاح إلى Cloudinary!`);
      } else {
        toast.error(data.error || "فشلت عملية المزامنة");
      }
    } catch (err: any) {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setMigrating(false);
    }
  }

  async function changePassword() {
    if (!newPassword || newPassword.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        setNewPassword("");
      } else {
        toast.error(data.error || "فشلت عملية تغيير كلمة المرور");
      }
    } catch (err) {
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setChangingPassword(false);
    }
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
    <div className="flex-1 p-8 max-w-3xl space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a2b3c]">الإعدادات العامة والميديا</h1>
          <p className="text-sm text-[#1a2b3c]/50 mt-1">إعدادات الموقع، خوادم الصور السحابية، والتواصل</p>
        </div>
        <button onClick={save} disabled={saving} className={`flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-xl transition-all shadow-sm ${saved ? "bg-green-500 text-white" : "bg-[#d0a755] text-[#1a2b3c] hover:bg-[#b89040]"}`}>
          {saved ? <><FiCheck className="w-4 h-4" /> تم الحفظ</> : <><FiSave className="w-4 h-4" /> {saving ? "جاري الحفظ…" : "حفظ الإعدادات"}</>}
        </button>
      </div>

      <div className="space-y-6">

        {/* Security / Change Password */}
        <Card title="أمان الحساب">
          <div className="space-y-4">
            <p className="text-xs text-[#1a2b3c]/60 font-medium">قم بتحديث كلمة مرور الإدارة الخاصة بك بانتظام لضمان حماية النظام بنسبة 100%.</p>
            <div className="flex items-end gap-4 max-w-sm">
              <div className="flex-1">
                <Field 
                  label="كلمة المرور الجديدة" 
                  value={newPassword} 
                  onChange={setNewPassword} 
                  type="password" 
                  dir="ltr" 
                />
              </div>
              <button
                onClick={changePassword}
                disabled={changingPassword || newPassword.length < 6}
                className="px-5 py-2.5 rounded-xl bg-[#1a2b3c] hover:bg-[#1a2b3c]/90 text-white text-sm font-black transition-all shadow-sm disabled:opacity-50 h-[42px]"
              >
                {changingPassword ? "جاري التغيير..." : "تحديث كلمة المرور"}
              </button>
            </div>
          </div>
        </Card>

        {/* Cloudinary Automatic Migration Section */}
        <Card title="مزامنة ميديا الخادم إلى Cloudinary">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#1a2b3c] to-[#0F1115] text-white shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#d0a755] text-[#1a2b3c] flex items-center justify-center font-black shrink-0">
                <FiUploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-sm text-[#d0a755]">تحويل كافة صور الموقع وقاعدة البيانات إلى Cloudinary</h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  يقوم هذا الأداة بفحص كامل قاعدة البيانات (السيارات، المقالات، الفنادق، الباقات، والهيرو) ونقل كل الصور المخزنة محلياً إلى Cloudinary وتحديث الروابط دائمياً.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={startCloudinaryMigration}
                disabled={migrating}
                className="px-5 py-3 rounded-xl bg-[#1a2b3c] hover:bg-[#d0a755] hover:text-[#1a2b3c] text-white text-xs font-black transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 text-[#d0a755] ${migrating ? "animate-spin" : ""}`} />
                {migrating ? "جاري رفع ونقل الصور إلى Cloudinary..." : "بدء مزامنة كافة الصور إلى Cloudinary الآن"}
              </button>
            </div>

            {migrationResult && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-2">
                <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
                  <FiCheckCircle className="w-4 h-4 text-emerald-600" /> تمت المزامنة بنجاح!
                </div>
                <p>إجمالي الصور التي تم رفعها وتحديث روابطها: <strong>{migrationResult.totalImagesUploaded} صورة</strong></p>
                <ul className="list-disc list-inside text-[11px] space-y-1 text-emerald-700">
                  <li>السيارات المحدثة: {migrationResult.carsMigrated}</li>
                  <li>المقالات المحدثة: {migrationResult.articlesMigrated}</li>
                  <li>الفنادق المحدثة: {migrationResult.hotelsMigrated}</li>
                  <li>فاست تراك المحدثة: {migrationResult.fastTrackMigrated}</li>
                  <li>إعدادات الموقع: {migrationResult.settingsMigrated}</li>
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Currency Rates */}
        <Card title="الأسعار والعملات">
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl border border-blue-100 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            يتم تحديث أسعار الصرف تلقائياً من الإنترنت، ولا يمكن تعديلها يدوياً.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="سعر صرف الدولار (USD to EGP)" value={settings.usdRate?.toString() || "50"} onChange={v => f("usdRate", parseFloat(v) || 50 as any)} dir="ltr" type="number" readOnly />
            <Field label="سعر صرف اليورو (EUR to EGP)" value={settings.eurRate?.toString() || "55"} onChange={v => f("eurRate", parseFloat(v) || 55 as any)} dir="ltr" type="number" readOnly />
            <Field label="سعر صرف الريال السعودي (SAR to EGP)" value={settings.sarRate?.toString() || "13"} onChange={v => f("sarRate", parseFloat(v) || 13 as any)} dir="ltr" type="number" readOnly />
            <Field label="سعر صرف الريال القطري (QAR to EGP)" value={settings.qarRate?.toString() || "13"} onChange={v => f("qarRate", parseFloat(v) || 13 as any)} dir="ltr" type="number" readOnly />
            <Field label="سعر صرف الدينار الكويتي (KWD to EGP)" value={settings.kwdRate?.toString() || "160"} onChange={v => f("kwdRate", parseFloat(v) || 160 as any)} dir="ltr" type="number" readOnly />
            <Field label="سعر صرف الدينار البحريني (BHD to EGP)" value={settings.bhdRate?.toString() || "130"} onChange={v => f("bhdRate", parseFloat(v) || 130 as any)} dir="ltr" type="number" readOnly />
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
