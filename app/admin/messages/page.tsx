"use client";

import { useState } from "react";
import type { ContactMessage } from "@/lib/types";
import { FiTrash2, FiCheckCircle, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/admin/ToastProvider";

function formatDateTime(val: string) {
  try {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(d);
  } catch (e) {
    return val;
  }
}

export default function MessagesPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery<{ messages: ContactMessage[], total: number }>({
    queryKey: ["messages", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/messages?page=${page}&limit=${limit}`, { cache: "no-store" });
      if (!res.ok) throw new Error("فشل في جلب الرسائل");
      return res.json();
    }
  });

  const messages = data?.messages || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      const res = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      });
      if (!res.ok) throw new Error("فشل في تحديث حالة الرسالة");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("تم التحديث بنجاح");
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("فشل في حذف الرسالة");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("تم الحذف بنجاح");
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a2b3c]">رسائل اتصل بنا</h1>
          <p className="text-sm text-[#1a2b3c]/50 mt-1">{total} رسالة إجمالاً</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right min-w-[900px]">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-black/5">
                {["المرسل", "البريد الإلكتروني", "الهاتف", "الرسالة", "التاريخ", "الحالة", "إجراء"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-black text-[#1a2b3c]/40 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center text-[#1a2b3c]/30 text-sm">جاري التحميل…</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center text-[#1a2b3c]/30 text-sm">لا توجد رسائل</td></tr>
              ) : messages.map(msg => (
                <tr key={msg.id} className={`border-t border-black/5 hover:bg-[#f8f9fa] transition-colors ${!msg.read ? "bg-blue-50/30" : ""}`}>
                  <td className="px-5 py-4 font-bold text-[#1a2b3c]">{msg.name}</td>
                  <td className="px-5 py-4 text-[#1a2b3c]/60 font-mono text-left" dir="ltr">{msg.email}</td>
                  <td className="px-5 py-4 text-[#1a2b3c]/60 font-mono text-left" dir="ltr">{msg.phone || "-"}</td>
                  <td className="px-5 py-4 text-[#1a2b3c]/70 max-w-xs truncate" title={msg.message}>{msg.message}</td>
                  <td className="px-5 py-4 text-[#1a2b3c]/50" dir="ltr">{formatDateTime(msg.createdAt)}</td>
                  <td className="px-5 py-4">
                    {msg.read ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black border bg-gray-50 text-gray-600 border-gray-200">
                        مقروءة
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-black border bg-blue-50 text-blue-700 border-blue-200">
                        جديدة
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 flex items-center gap-2">
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: msg.id, read: !msg.read })}
                      disabled={updateStatusMutation.isPending}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${msg.read ? "text-gray-400 hover:text-blue-600 hover:bg-blue-50" : "text-blue-600 bg-blue-50 hover:bg-blue-100"}`}
                      title={msg.read ? "تحديد كغير مقروءة" : "تحديد كمقروءة"}
                    >
                      <FiCheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
                          deleteMutation.mutate(msg.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="حذف"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="border-t border-black/5 p-4 flex items-center justify-between bg-[#f8f9fa]">
            <p className="text-sm text-[#1a2b3c]/60 font-medium">
              صفحة {page} من {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-black/10 text-[#1a2b3c] hover:bg-[#d0a755] hover:border-[#d0a755] disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-black/10 transition-colors"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-black/10 text-[#1a2b3c] hover:bg-[#d0a755] hover:border-[#d0a755] disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-black/10 transition-colors"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
