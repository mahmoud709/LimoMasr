"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons = {
  success: FiCheckCircle,
  error: FiXCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
};

const styles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error:   "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info:    "bg-blue-50 border-blue-200 text-blue-800",
};

const iconStyles = {
  success: "text-green-500",
  error:   "text-red-500",
  warning: "text-amber-500",
  info:    "text-blue-500",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const ctx: ToastContextValue = {
    success: (msg) => add("success", msg),
    error:   (msg) => add("error", msg),
    warning: (msg) => add("warning", msg),
    info:    (msg) => add("info", msg),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Toast container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none" dir="rtl">
        {toasts.map(toast => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-lg text-sm font-bold pointer-events-auto animate-in slide-in-from-top-2 duration-300 ${styles[toast.type]}`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${iconStyles[toast.type]}`} />
              <span className="flex-1">{toast.message}</span>
              <button onClick={() => remove(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
