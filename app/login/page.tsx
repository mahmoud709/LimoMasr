"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FiPhone, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { useToast } from "@/components/admin/ToastProvider";

function LoginFormContent() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "ar";
  
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const t = {
    ar: {
      title: "تسجيل الدخول",
      subtitle: "مرحبًا بك مجددًا في ليمو مصر",
      phone: "رقم الهاتف",
      phonePlaceholder: "مثال: 01012345678",
      password: "كلمة المرور",
      passwordPlaceholder: "••••••••",
      login: "تسجيل الدخول",
      noAccount: "ليس لديك حساب؟",
      register: "إنشاء حساب جديد",
      success: "تم تسجيل الدخول بنجاح",
      error: "رقم الهاتف أو كلمة المرور غير صحيحة",
    },
    en: {
      title: "Login",
      subtitle: "Welcome back to Limo Masr",
      phone: "Phone Number",
      phonePlaceholder: "e.g., 01012345678",
      password: "Password",
      passwordPlaceholder: "••••••••",
      login: "Log In",
      noAccount: "Don't have an account?",
      register: "Create a new account",
      success: "Logged in successfully",
      error: "Invalid phone number or password",
    }
  }[lang];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || !password) return;

    setLoading(true);
    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t.success);
        router.push(`/${lang}/my-bookings`);
        router.refresh();
      } else {
        toast.error(data.error || t.error);
      }
    } catch {
      toast.error(lang === "en" ? "An error occurred" : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="text-center mb-8">
        <Link href={`/${lang}`} className="inline-block">
          <div className="w-16 h-16 rounded-2xl bg-[#d0a755] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#d0a755]/20">
            <span className="text-[#1a2b3c] font-black text-2xl">L</span>
          </div>
        </Link>
        <h1 className="text-white font-black text-3xl">{t.title}</h1>
        <p className="text-white/40 text-sm mt-1">{t.subtitle}</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-white/50 mb-2 uppercase tracking-wide">
              {t.phone}
            </label>
            <div className="relative">
              <FiPhone className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 w-4 h-4 text-white/30`} />
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className={`w-full bg-white/8 border border-white/10 rounded-xl py-3 ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} text-white placeholder:text-white/20 text-sm font-medium outline-none focus:border-[#d0a755]/50 focus:ring-2 focus:ring-[#d0a755]/20 transition-all`}
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-white/50 mb-2 uppercase tracking-wide">
              {t.password}
            </label>
            <div className="relative">
              <FiLock className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 w-4 h-4 text-white/30`} />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className={`w-full bg-white/8 border border-white/10 rounded-xl py-3 ${lang === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"} text-white placeholder:text-white/20 text-sm font-medium outline-none focus:border-[#d0a755]/50 focus:ring-2 focus:ring-[#d0a755]/20 transition-all`}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className={`absolute ${lang === "ar" ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors`}
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#d0a755] text-[#1a2b3c] font-black py-3.5 rounded-xl hover:bg-[#b89040] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#d0a755]/20 hover:-translate-y-0.5 mt-6"
          >
            <FiLogIn className="w-4 h-4" />
            {loading ? (lang === "en" ? "Loading..." : "جاري الدخول…") : t.login}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-white/10">
          <p className="text-white/40 text-sm">
            {t.noAccount}{" "}
            <Link
              href={`/${lang}/register`}
              className="text-[#d0a755] hover:text-[#b89040] font-black underline transition-colors"
            >
              {t.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1a2b3c] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#d0a755]/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#d0a755]/5 blur-3xl" />
      </div>
      <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
