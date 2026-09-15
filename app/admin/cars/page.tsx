"use client";

import { useState, useEffect } from "react";
import type { Car } from "@/lib/types";
import { 
  FiPlus, FiEdit2, FiTrash2, FiUsers, FiTag, FiX, FiSave, 
  FiAlertTriangle, FiRefreshCw, FiMove, FiCheckSquare, FiSquare, FiLayers, FiChevronDown, FiChevronUp, FiImage 
} from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/admin/ToastProvider";
import ImageUploader from "@/components/admin/ImageUploader";

const emptyForm: Omit<Car, "id" | "slug"> = {
  categoryName: "",
  vehicleType: "",
  subtitle: "",
  models: [],
  year: new Date().getFullYear().toString(),
  seats: 4,
  price: 50,
  priceUnit: "per_trip",
  images: [],
  status: "available",
  sortOrder: 99,
  tag: "",
  isMostBooked: false,
  notes: "",
  translations: {
    ar: { categoryName: "", vehicleType: "", subtitle: "", tag: "", notes: "" },
    en: { categoryName: "", vehicleType: "", subtitle: "", tag: "", notes: "" },
  }
};

interface FullBulkCarItem {
  id: string;
  expanded: boolean;
  categoryNameAr: string;
  categoryNameEn: string;
  vehicleTypeAr: string;
  vehicleTypeEn: string;
  subtitleAr: string;
  subtitleEn: string;
  tagAr: string;
  tagEn: string;
  notesAr: string;
  notesEn: string;
  year: string;
  seats: number;
  priceUSD: number;
  priceUnit: "per_trip" | "per_hour" | "per_person" | "per_day";
  status: "available" | "unavailable";
  modelsText: string;
  images: string[];
}

function createEmptyBulkItem(index: number): FullBulkCarItem {
  return {
    id: `bulk-${Date.now()}-${index}`,
    expanded: index === 0,
    categoryNameAr: "",
    categoryNameEn: "",
    vehicleTypeAr: "",
    vehicleTypeEn: "",
    subtitleAr: "",
    subtitleEn: "",
    tagAr: "",
    tagEn: "",
    notesAr: "",
    notesEn: "",
    year: new Date().getFullYear().toString(),
    seats: 4,
    priceUSD: index === 0 ? 55 : 65,
    priceUnit: "per_trip",
    status: "available",
    modelsText: "",
    images: [],
  };
}

export default function CarsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Car | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [modelsText, setModelsText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState(false);

  // Bulk Selection & Mass Delete state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drag & Drop State
  const [items, setItems] = useState<Car[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Bulk Add Modal state (Full capability)
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkItems, setBulkItems] = useState<FullBulkCarItem[]>([
    createEmptyBulkItem(0),
    createEmptyBulkItem(1)
  ]);
  const [bulkSaving, setBulkSaving] = useState(false);

  const { data: cars = [], isLoading: loading } = useQuery<Car[]>({
    queryKey: ["cars"],
    queryFn: async () => {
      const res = await fetch("/api/admin/cars");
      if (!res.ok) throw new Error("فشل في جلب البيانات");
      return res.json();
    }
  });

  // Keep local draggable items synced with query data
  useEffect(() => {
    if (cars && cars.length > 0) {
      const sorted = [...cars].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setItems(sorted);
    } else {
      setItems([]);
    }
  }, [cars]);

  async function fetchExchangeRate() {
    setRateLoading(true);
    setRateError(false);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      if (data?.rates?.EGP) {
        setExchangeRate(data.rates.EGP);
      } else {
        setRateError(true);
      }
    } catch {
      setRateError(true);
    } finally {
      setRateLoading(false);
    }
  }

  function openAdd() {
    setForm({
      ...emptyForm,
      price: 55,
      translations: {
        ar: { categoryName: "", vehicleType: "", subtitle: "", tag: "", notes: "" },
        en: { categoryName: "", vehicleType: "", subtitle: "", tag: "", notes: "" },
      }
    });
    setModelsText("");
    setEditing(null);
    setModal("add");
    fetchExchangeRate();
  }

  function openEdit(car: Car) {
    setForm({
      ...car,
      translations: {
        ar: {
          categoryName: car.translations?.ar?.categoryName || car.categoryName || "",
          vehicleType: car.translations?.ar?.vehicleType || car.vehicleType || "",
          subtitle: car.translations?.ar?.subtitle || car.subtitle || "",
          tag: car.translations?.ar?.tag || car.tag || "",
          notes: car.translations?.ar?.notes || car.notes || "",
        },
        en: {
          categoryName: car.translations?.en?.categoryName || "",
          vehicleType: car.translations?.en?.vehicleType || "",
          subtitle: car.translations?.en?.subtitle || "",
          tag: car.translations?.en?.tag || "",
          notes: car.translations?.en?.notes || "",
        }
      }
    });
    setModelsText(car.models ? car.models.join("\n") : "");
    setEditing(car);
    setModal("edit");
    fetchExchangeRate();
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
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      setSelectedIds(prev => prev.filter(id => id !== deletedId));
      toast.success("تم حذف السيارة بنجاح");
    },
    onError: (err: any) => {
      toast.error(err.message || "فشل الحذف");
    }
  });

  const batchDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await fetch("/api/admin/cars", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error("حدث خطأ أثناء الحذف الجماعي");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      setSelectedIds([]);
      setBatchDeleteConfirm(false);
      toast.success("تم حذف السيارات المحددة بنجاح");
    },
    onError: (err: any) => {
      toast.error(err.message || "فشل الحذف الجماعي");
    }
  });

  const reorderMutation = useMutation({
    mutationFn: async (updatedList: Car[]) => {
      const payload = {
        items: updatedList.map((item, idx) => ({
          id: item.id,
          sortOrder: idx + 1
        }))
      };
      const res = await fetch("/api/admin/cars", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("فشل حفظ الترتيب الجديد");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success("تم حفظ الترتيب الجديد للسيارات بنجاح");
    },
    onError: (err: any) => {
      toast.error(err.message || "فشل تحديث الترتيب");
    }
  });

  async function save() {
    setSaving(true);
    
    const arName = form.translations?.ar?.categoryName || form.categoryName || "سيارة جديدة";
    const arType = form.translations?.ar?.vehicleType || form.vehicleType || "";
    const arSubtitle = form.translations?.ar?.subtitle || form.subtitle || "";
    const arTag = form.translations?.ar?.tag || form.tag || "";
    const arNotes = form.translations?.ar?.notes || form.notes || "";

    const enName = form.translations?.en?.categoryName || arName;
    const enType = form.translations?.en?.vehicleType || arType;
    const enSubtitle = form.translations?.en?.subtitle || arSubtitle;
    const enTag = form.translations?.en?.tag || arTag;
    const enNotes = form.translations?.en?.notes || arNotes;

    const data: Car = {
      ...form,
      price: Number(form.price) || 0, // Stored strictly in USD
      categoryName: arName,
      vehicleType: arType,
      subtitle: arSubtitle,
      tag: arTag,
      notes: arNotes,
      id: editing?.id ?? `car-${Date.now()}`,
      slug: editing?.slug ?? arName.replace(/\s+/g, "-").toLowerCase(),
      models: modelsText.split("\n").map(s => s.trim()).filter(Boolean),
      images: form.images,
      translations: {
        ar: { categoryName: arName, vehicleType: arType, subtitle: arSubtitle, tag: arTag, notes: arNotes },
        en: { categoryName: enName, vehicleType: enType, subtitle: enSubtitle, tag: enTag, notes: enNotes }
      }
    };

    saveMutation.mutate(data);
  }

  // Bulk Selection Handlers
  function toggleSelectAll() {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(c => c.id));
    }
  }

  function toggleSelectCar(id: string) {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }

  function deleteCar(id: string) {
    setDeleteConfirm(id);
  }

  function confirmDelete() {
    if (!deleteConfirm) return;
    deleteMutation.mutate(deleteConfirm);
    setDeleteConfirm(null);
  }

  function confirmBatchDelete() {
    if (selectedIds.length === 0) return;
    batchDeleteMutation.mutate(selectedIds);
  }

  // Drag and Drop Logic
  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    setDragOverIdx(index);
  }

  function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIndex) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const updated = [...items];
    const [movedItem] = updated.splice(draggedIdx, 1);
    updated.splice(dropIndex, 0, movedItem);

    // Update local state immediately
    setItems(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);

    // Persist reorder to database
    reorderMutation.mutate(updated);
  }

  // Bulk Add Handlers with Full Fields
  function openBulkModal() {
    setBulkItems([createEmptyBulkItem(0), createEmptyBulkItem(1)]);
    setBulkModalOpen(true);
    fetchExchangeRate();
  }

  function addBulkItem() {
    setBulkItems(prev => [...prev, createEmptyBulkItem(prev.length)]);
  }

  function removeBulkItem(id: string) {
    setBulkItems(prev => prev.filter(item => item.id !== id));
  }

  function toggleExpandBulkItem(id: string) {
    setBulkItems(prev => prev.map(item => item.id === id ? { ...item, expanded: !item.expanded } : item));
  }

  function updateBulkItem(id: string, key: keyof FullBulkCarItem, val: any) {
    setBulkItems(prev => prev.map(item => item.id === id ? { ...item, [key]: val } : item));
  }

  async function saveBulkCars() {
    const validItems = bulkItems.filter(b => b.categoryNameAr.trim().length > 0 || b.categoryNameEn.trim().length > 0);
    if (validItems.length === 0) {
      toast.error("يرجى كتابة اسم لسيارة واحدة على الأقل في القائمة");
      return;
    }

    setBulkSaving(true);

    const carsToInsert: Car[] = validItems.map((b, idx) => {
      const arName = b.categoryNameAr.trim() || b.categoryNameEn.trim() || "سيارة جديدة";
      const enName = b.categoryNameEn.trim() || arName;
      const arType = b.vehicleTypeAr.trim() || b.vehicleTypeEn.trim() || "";
      const enType = b.vehicleTypeEn.trim() || arType;
      const arSubtitle = b.subtitleAr.trim() || b.subtitleEn.trim() || "";
      const enSubtitle = b.subtitleEn.trim() || arSubtitle;
      const arTag = b.tagAr.trim() || b.tagEn.trim() || "";
      const enTag = b.tagEn.trim() || arTag;
      const arNotes = b.notesAr.trim() || b.notesEn.trim() || "";
      const enNotes = b.notesEn.trim() || arNotes;

      return {
        id: `car-${Date.now()}-${idx}`,
        slug: arName.replace(/\s+/g, "-").toLowerCase(),
        categoryName: arName,
        vehicleType: arType,
        subtitle: arSubtitle,
        models: b.modelsText.split("\n").map(s => s.trim()).filter(Boolean),
        year: b.year || new Date().getFullYear().toString(),
        seats: Number(b.seats) || 4,
        price: Number(b.priceUSD) || 50, // Stored strictly in USD ($)
        priceUnit: b.priceUnit || "per_trip",
        images: b.images && b.images.length > 0 ? b.images : [],
        status: b.status || "available",
        sortOrder: items.length + idx + 1,
        tag: arTag,
        notes: arNotes,
        translations: {
          ar: { categoryName: arName, vehicleType: arType, subtitle: arSubtitle, tag: arTag, notes: arNotes },
          en: { categoryName: enName, vehicleType: enType, subtitle: enSubtitle, tag: enTag, notes: enNotes }
        }
      };
    });

    try {
      const res = await fetch("/api/admin/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carsToInsert),
      });

      if (!res.ok) throw new Error("فشل حفظ السيارات دفعة واحدة");

      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success(`تمت إضافة ${carsToInsert.length} سيارات بكافة بياناتها بنجاح`);
      setBulkModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "فشلت عملية الإضافة الجماعية");
    } finally {
      setBulkSaving(false);
    }
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
      {/* Header & Controls */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0F1115] tracking-tight flex items-center gap-3">
            <span>إدارة الأسطول</span>
            <span className="text-xs bg-[#BCA37F]/15 text-[#BCA37F] px-3 py-1 rounded-full font-bold">
              USD Base Currency 💵
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {items.length} سيارة مسجلة • التسعير الأساسي مخزن بالدولار ($) ويتم التحويل للعملات ديناميكياً
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Select All Button */}
          {items.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 bg-slate-100 text-slate-700 text-sm font-bold px-4 py-3 rounded-xl hover:bg-slate-200 transition-all shadow-xs"
            >
              {selectedIds.length === items.length ? <FiCheckSquare className="w-4 h-4 text-[#BCA37F]" /> : <FiSquare className="w-4 h-4" />}
              {selectedIds.length === items.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
            </button>
          )}

          {/* Bulk Add Button */}
          <button
            onClick={openBulkModal}
            className="flex items-center gap-2 bg-slate-900 text-white text-sm font-black px-5 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-md"
          >
            <FiLayers className="w-4 h-4 text-[#BCA37F]" />
            إضافة سيارات متعددة (بالدولار $)
          </button>

          {/* Single Add Button */}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#BCA37F] text-white text-sm font-black px-6 py-3 rounded-xl hover:bg-[#A88F6A] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <FiPlus className="w-5 h-5" strokeWidth={3} />
            إضافة سيارة واحدة
          </button>
        </div>
      </div>

      {/* Bulk Delete Bar */}
      {selectedIds.length > 0 && (
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="font-black text-rose-900 text-sm">
              تم تحديد <span className="underline text-rose-700 font-extrabold">{selectedIds.length}</span> سيارة
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              إلغاء التحديد
            </button>
            <button
              onClick={() => setBatchDeleteConfirm(true)}
              className="flex items-center gap-2 px-5 py-2 text-xs font-black text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
            >
              <FiTrash2 className="w-4 h-4" />
              حذف المحدد ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Drag & Drop Instruction Badge */}
      <div className="mb-4 text-xs font-bold text-slate-400 flex items-center gap-1.5">
        <FiMove className="w-4 h-4 text-[#BCA37F]" />
        إعادة الترتيب: اسحب البطاقة من مقبض السحب (✋) وأسقطها في المكان المطلوب
      </div>

      {/* Cards Grid with HTML5 Drag & Drop */}
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
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center">
          <p className="text-slate-400 font-bold mb-4">لا توجد سيارات مضافة حالياً</p>
          <button onClick={openAdd} className="bg-[#BCA37F] text-white font-black px-6 py-3 rounded-xl hover:bg-[#A88F6A] transition-colors">
            إضافة أول سيارة
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((car, idx) => {
            const isSelected = selectedIds.includes(car.id);
            const isDragging = draggedIdx === idx;
            const isDragOver = dragOverIdx === idx;

            return (
              <div
                key={car.id}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                className={`bg-white rounded-3xl border transition-all duration-300 group flex flex-col relative overflow-hidden ${
                  isSelected ? "border-[#BCA37F] ring-2 ring-[#BCA37F]/20 shadow-md" : "border-slate-100 shadow-sm hover:shadow-xl"
                } ${isDragging ? "opacity-40 scale-95 border-amber-400 border-dashed" : ""} ${
                  isDragOver ? "ring-4 ring-[#BCA37F]/40 scale-[1.02] border-[#BCA37F]" : ""
                }`}
              >
                {/* Drag Handle & Checkbox Top Overlay */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectCar(car.id);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
                      isSelected 
                        ? "bg-[#BCA37F] text-white" 
                        : "bg-white/80 text-slate-600 hover:bg-white border border-slate-200"
                    }`}
                  >
                    {isSelected ? <FiCheckSquare className="w-5 h-5" /> : <FiSquare className="w-5 h-5" />}
                  </button>

                  <div
                    title="اسحب لتغيير الترتيب"
                    className="w-9 h-9 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-black/80 transition-colors shadow-md"
                  >
                    <FiMove className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-black tracking-widest shadow">
                    #{idx + 1}
                  </span>
                </div>

                {/* Image */}
                <div className="h-48 bg-slate-50 overflow-hidden relative cursor-grab active:cursor-grabbing">
                  {car.images && car.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={car.images[0]} alt={car.categoryName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200 text-5xl">🚗</div>
                  )}
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black shadow-sm backdrop-blur-md ${car.status === "available" ? "bg-emerald-500/90 text-white" : "bg-rose-500/90 text-white"}`}>
                    {car.status === "available" ? "متاح للحجز" : "غير متاح"}
                  </span>
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
                    <span className="flex items-center gap-1.5 font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                      <FiTag className="w-4 h-4 text-emerald-600" /> {car.price} $
                    </span>
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
            );
          })}
        </div>
      )}

      {/* Single Delete Confirmation Modal */}
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

      {/* Batch Delete Confirmation Modal */}
      {batchDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-5">
                <FiTrash2 className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-[#0F1115] mb-2">تأكيد الحذف الجماعي</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium">
                هل أنت متأكد من رغبتك في حذف <span className="font-black text-rose-600">{selectedIds.length} سيارات</span> دفعة واحدة؟ سيتم حذف بياناتها وصورها نهائياً.
              </p>
              
              <div className="flex gap-3 w-full">
                <button onClick={() => setBatchDeleteConfirm(false)} className="flex-1 py-3.5 rounded-xl font-black text-[#0F1115] bg-slate-100 hover:bg-slate-200 transition-colors">
                  إلغاء
                </button>
                <button onClick={confirmBatchDelete} className="flex-1 py-3.5 rounded-xl font-black text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-all">
                  حذف الكل ({selectedIds.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Cars Modal with USD PRIMARY */}
      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="font-black text-[#0F1115] text-xl tracking-tight flex items-center gap-2">
                  <FiLayers className="text-[#BCA37F]" />
                  <span>إضافة مجموعة سيارات دفعة واحدة (تسعير بالدولار $)</span>
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-1">
                  أدخل السعر الصافي بالدولار (مثل 55$ أو 65$) وسيتم حفظه كما هو وتحويله للجنيه ديناميكياً
                </p>
              </div>
              <button onClick={() => setBulkModalOpen(false)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors shadow-sm border border-slate-100">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {bulkItems.map((bItem, bIndex) => (
                <div key={bItem.id} className="bg-slate-50/80 border border-slate-200 rounded-3xl overflow-hidden transition-all duration-300 shadow-xs">
                  {/* Summary Bar */}
                  <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-8 h-8 rounded-full bg-[#BCA37F] text-white text-xs font-black flex items-center justify-center shrink-0">
                        #{bIndex + 1}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                        <input
                          type="text"
                          placeholder="اسم السيارة (عربي) *"
                          value={bItem.categoryNameAr}
                          onChange={(e) => updateBulkItem(bItem.id, "categoryNameAr", e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F]"
                        />
                        <input
                          type="text"
                          placeholder="Car Name (English)"
                          value={bItem.categoryNameEn}
                          onChange={(e) => updateBulkItem(bItem.id, "categoryNameEn", e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F]"
                        />
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-600">$</span>
                          <input
                            type="number"
                            placeholder="السعر بالدولار (55$)"
                            value={bItem.priceUSD || ""}
                            onChange={(e) => updateBulkItem(bItem.id, "priceUSD", Number(e.target.value))}
                            className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-black text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F] w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleExpandBulkItem(bItem.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                          bItem.expanded 
                            ? "bg-[#BCA37F] text-white" 
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {bItem.expanded ? <FiChevronUp /> : <FiChevronDown />}
                        <span>{bItem.expanded ? "إخفاء التفاصيل" : "تعديل التفاصيل والصور ⚙️"}</span>
                        {bItem.images.length > 0 && (
                          <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black flex items-center gap-1">
                            <FiImage className="w-3 h-3" /> {bItem.images.length}
                          </span>
                        )}
                      </button>

                      {bulkItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBulkItem(bItem.id)}
                          className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors shrink-0"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body / Full Expanded Form */}
                  {bItem.expanded && (
                    <div className="p-6 space-y-6 bg-slate-50/50 animate-in fade-in duration-200 border-t border-slate-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="اسم السيارة (عربي)" value={bItem.categoryNameAr} onChange={(v) => updateBulkItem(bItem.id, "categoryNameAr", v)} />
                        <Field label="اسم السيارة (إنجليزي)" value={bItem.categoryNameEn} onChange={(v) => updateBulkItem(bItem.id, "categoryNameEn", v)} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="فئة السيارة (عربي) مثل سيدان، SUV" value={bItem.vehicleTypeAr} onChange={(v) => updateBulkItem(bItem.id, "vehicleTypeAr", v)} />
                        <Field label="فئة السيارة (إنجليزي) e.g. Sedan, SUV" value={bItem.vehicleTypeEn} onChange={(v) => updateBulkItem(bItem.id, "vehicleTypeEn", v)} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="العنوان الفرعي (عربي)" value={bItem.subtitleAr} onChange={(v) => updateBulkItem(bItem.id, "subtitleAr", v)} />
                        <Field label="العنوان الفرعي (إنجليزي)" value={bItem.subtitleEn} onChange={(v) => updateBulkItem(bItem.id, "subtitleEn", v)} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="الوسم (عربي)" value={bItem.tagAr} onChange={(v) => updateBulkItem(bItem.id, "tagAr", v)} placeholder="مثال: الأكثر حجزاً" />
                        <Field label="الوسم (إنجليزي)" value={bItem.tagEn} onChange={(v) => updateBulkItem(bItem.id, "tagEn", v)} placeholder="e.g. Most Booked" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="ملاحظات (عربي)" value={bItem.notesAr} onChange={(v) => updateBulkItem(bItem.id, "notesAr", v)} />
                        <Field label="ملاحظات (إنجليزي)" value={bItem.notesEn} onChange={(v) => updateBulkItem(bItem.id, "notesEn", v)} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
                        <Field label="سنة الصنع" value={bItem.year} onChange={(v) => updateBulkItem(bItem.id, "year", v)} />
                        <FieldNum label="عدد المقاعد" value={bItem.seats} onChange={(v) => updateBulkItem(bItem.id, "seats", v)} />
                      </div>

                      {/* USD Primary Box */}
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-black text-emerald-800 uppercase tracking-widest">
                          <span>التسعير الأساسي الثابت (USD $)</span>
                          {exchangeRate && <span className="text-slate-500 font-bold">1 $ = {exchangeRate.toFixed(2)} ج.م</span>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 mb-1">السعر بالدولار ($) *</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="55"
                              value={bItem.priceUSD || ""}
                              onChange={(e) => updateBulkItem(bItem.id, "priceUSD", Number(e.target.value))}
                              className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-sm font-black text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <span className="block text-[10px] font-black text-slate-400 mb-1">المقابل بالجنيه المصري (تقريبي):</span>
                            <span className="text-sm font-black text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 block">
                              {exchangeRate && bItem.priceUSD ? Math.round(bItem.priceUSD * exchangeRate).toLocaleString("ar-EG") : "0"} ج.م
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">وحدة التسعير</label>
                          <select
                            value={bItem.priceUnit}
                            onChange={(e) => updateBulkItem(bItem.id, "priceUnit", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1115] outline-none"
                          >
                            <option value="per_trip">لكل رحلة المطار</option>
                            <option value="per_hour">تسعير بالساعة</option>
                            <option value="per_person">لكل راكب</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">حالة السيارة</label>
                          <select
                            value={bItem.status}
                            onChange={(e) => updateBulkItem(bItem.id, "status", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1115] outline-none"
                          >
                            <option value="available">متاح للحجز المباشر</option>
                            <option value="unavailable">غير متاحة للحجز</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">الطرازات المتاحة (طراز في كل سطر)</label>
                        <textarea
                          rows={2}
                          placeholder="Mercedes S-Class&#10;BMW 7 Series"
                          value={bItem.modelsText}
                          onChange={(e) => updateBulkItem(bItem.id, "modelsText", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1115] outline-none resize-none"
                        />
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-slate-200">
                        <label className="block text-[11px] font-black text-[#0F1115] mb-3 flex items-center gap-2">
                          <FiImage className="text-[#BCA37F]" />
                          <span>رفع صور السيارة #{bIndex + 1} (Cloudinary)</span>
                        </label>
                        <ImageUploader
                          images={bItem.images}
                          onChange={(newImgs) => updateBulkItem(bItem.id, "images", newImgs)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addBulkItem}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-[#BCA37F] text-[#BCA37F] text-xs font-black hover:bg-[#BCA37F]/10 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <FiPlus className="w-5 h-5" /> إضافة سيارة جديدة للدفعة (+1)
              </button>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setBulkModalOpen(false)}
                className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={saveBulkCars}
                disabled={bulkSaving}
                className="flex items-center gap-2 bg-[#0F1115] text-white font-black px-8 py-3.5 rounded-xl hover:bg-[#BCA37F] transition-colors shadow-lg disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                {bulkSaving ? "جاري الحفظ والتسجيل..." : `حفظ بكافة التفاصيل (${bulkItems.length} سيارات)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Add/Edit Modal */}
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
                <Field label="اسم السيارة (عربي)" value={form.translations?.ar?.categoryName || ""} onChange={v => fTrans("ar", "categoryName", v)} />
                <Field label="اسم السيارة (إنجليزي)" value={form.translations?.en?.categoryName || ""} onChange={v => fTrans("en", "categoryName", v)} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field label="فئة السيارة (عربي) مثل سيدان، SUV" value={form.translations?.ar?.vehicleType || ""} onChange={v => fTrans("ar", "vehicleType", v)} />
                <Field label="فئة السيارة (إنجليزي) e.g. Sedan, SUV" value={form.translations?.en?.vehicleType || ""} onChange={v => fTrans("en", "vehicleType", v)} />
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

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <Field label="سنة الصنع" value={form.year} onChange={v => f("year", v)} />
                <FieldNum label="عدد المقاعد" value={form.seats} onChange={v => f("seats", v)} />
              </div>

              {/* USD Primary Field */}
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-slate-50 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">التسعير الأساسي (USD $)</span>
                  <div className="flex items-center gap-2">
                    {rateLoading ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                        <FiRefreshCw className="w-3 h-3 animate-spin" /> جاري تحميل سعر الصرف...
                      </span>
                    ) : exchangeRate ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-100/60 px-2.5 py-1 rounded-lg">
                        1 $ = {exchangeRate.toFixed(2)} ج.م
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">السعر الصافي بالدولار ($) *</label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-black text-emerald-600">$</span>
                      <input
                        type="number"
                        min="0"
                        value={form.price || ""}
                        placeholder="55"
                        onChange={e => f("price", Number(e.target.value))}
                        className="w-full bg-white border border-emerald-300 rounded-xl pr-8 pl-4 py-3 text-base font-black text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">المقابل بالجنيه (تقريبي):</span>
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-700">
                      {exchangeRate && form.price ? Math.round(form.price * exchangeRate).toLocaleString("ar-EG") : "0"} ج.م
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">وحدة التسعير</label>
                  <select value={form.priceUnit} onChange={e => f("priceUnit", e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F] focus:border-transparent transition-all">
                    <option value="per_trip">لكل رحلة المطار</option>
                    <option value="per_hour">تسعير بالساعة</option>
                    <option value="per_person">لكل راكب</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">حالة السيارة</label>
                  <select value={form.status} onChange={e => f("status", e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-[#0F1115] outline-none focus:ring-2 focus:ring-[#BCA37F] focus:border-transparent transition-all">
                    <option value="available">متاح للحجز المباشر</option>
                    <option value="unavailable">غير متاحة للحجز</option>
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

              {/* Most Booked Toggle */}
              <div className="border border-amber-200 bg-amber-50/60 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-[#0F1115]">شارة "الأكثر حجزاً" Most Booked</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">تظهر على بطاقة السيارة في الموقع</p>
                </div>
                <button
                  type="button"
                  onClick={() => f("isMostBooked", !form.isMostBooked)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    form.isMostBooked ? "bg-[#d0a755]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                      form.isMostBooked ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
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
