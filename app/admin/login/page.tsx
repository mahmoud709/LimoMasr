"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!password) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "كلمة المرور غير صحيحة");
      }
    } catch {
      setError("حدث خطأ. حاول مرة أخرى.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#1a2b3c] flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#d0a755]/5 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#d0a755]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#d0a755] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#d0a755]/20">
            <span className="text-[#1a2b3c] font-black text-2xl">L</span>
          </div>
          <h1 className="text-white font-black text-2xl">ليمو مصر</h1>
          <p className="text-white/40 text-sm mt-1">لوحة التحكم</p>
        </div>

        <div className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white font-black text-xl mb-1">تسجيل الدخول</h2>
          <p className="text-white/40 text-sm mb-7">أدخل كلمة المرور للمتابعة</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-white/50 mb-2 uppercase tracking-wide">كلمة المرور</label>
              <div className="relative">
                <FiLock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && login()}
                  placeholder="••••••••"
                  className="w-full bg-white/8 border border-white/10 rounded-xl py-3 pr-10 pl-10 text-white placeholder:text-white/20 text-sm font-medium outline-none focus:border-[#d0a755]/50 focus:ring-2 focus:ring-[#d0a755]/20 transition-all"
                  dir="ltr"
                />
                <button onClick={() => setShow(s => !s)} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {show ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm font-bold">{error}</p>
              </div>
            )}

            <button
              onClick={login}
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 bg-[#d0a755] text-[#1a2b3c] font-black py-3.5 rounded-xl hover:bg-[#b89040] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#d0a755]/20 hover:-translate-y-0.5 mt-2"
            >
              <FiLogIn className="w-4 h-4" />
              {loading ? "جاري الدخول…" : "دخول"}
            </button>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          كلمة المرور الافتراضية: <span className="font-mono text-white/40">admin123</span>
        </p>
      </div>
    </div>
  );
}
