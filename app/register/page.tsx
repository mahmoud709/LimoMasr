"use client"
import Link from "next/link";
import Image from "next/image";
import { FiUser, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useToast } from "@/components/admin/ToastProvider";
import { useRouter, usePathname } from "next/navigation";
import { Suspense, useState } from "react";

function RegisterFormContent() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "ar";
  
  const toast = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const t = {
    ar: {
      title: "إنشاء حساب جديد",
      subtitle: "انضم إلى ليمو مصر وتمتع بتجربة حجز سهلة وسريعة",
      name: "الاسم الكامل",
      namePlaceholder: "ادخل اسمك الكامل",
      phone: "رقم الهاتف",
      phonePlaceholder: "مثال: 01012345678",
      password: "كلمة المرور",
      passwordPlaceholder: "••••••••",
      register: "إنشاء حساب",
      hasAccount: "لديك حساب بالفعل؟",
      login: "تسجيل الدخول",
      success: "تم إنشاء الحساب وتسجيل الدخول بنجاح",
      error: "حدث خطأ ما. الرجاء المحاولة مرة أخرى",
      back: "العودة للرئيسية",
      welcomeTitle1: "ابدأ رحلتك",
      welcomeTitle2: "معنا الآن",
      welcomeText: "انضم إلى آلاف العملاء المميزين الذين يثقون في ليمو مصر لتنقلاتهم اليومية ورحلاتهم الخاصة. الرفاهية والأمان على بعد نقرة واحدة.",
    },
    en: {
      title: "Create Account",
      subtitle: "Join Limo Masr and enjoy a seamless booking experience",
      name: "Full Name",
      namePlaceholder: "Enter your full name",
      phone: "Phone Number",
      phonePlaceholder: "e.g., 01012345678",
      password: "Password",
      passwordPlaceholder: "••••••••",
      register: "Create Account",
      hasAccount: "Already have an account?",
      login: "Log In",
      success: "Account created and logged in successfully",
      error: "An error occurred. Please try again",
      back: "Back to Home",
      welcomeTitle1: "Start Your Journey",
      welcomeTitle2: "With Us Now",
      welcomeText: "Join thousands of distinguished clients who trust Limo Masr for their daily commutes and special trips. Luxury and safety are just a click away.",
    }
  }[lang];

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone || !password) return;

    setLoading(true);
    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password }),
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

  const isRtl = lang === "ar";

  return (
    <div className="min-h-screen w-full flex bg-[#F9F8F6] font-sans">
      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col relative overflow-hidden bg-white shadow-[20px_0_50px_rgba(0,0,0,0.05)] z-10">
        {/* Subtle decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#d0a755]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1a2b3c]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 relative z-10">
          <div className="w-full max-w-md mx-auto" dir={isRtl ? "rtl" : "ltr"}>

            <Link
              href={`/${lang}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1a2b3c]/60 hover:text-[#d0a755] transition-colors mb-12 group"
            >
              {isRtl ? <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
              {t.back}
            </Link>

            <div className="mb-10">
              <h1 className="text-4xl font-black text-[#1a2b3c] mb-3 tracking-tight">{t.title}</h1>
              <p className="text-[#1a2b3c]/60 text-base leading-relaxed">{t.subtitle}</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-[#1a2b3c]/70 uppercase tracking-wider">
                  {t.name}
                </label>
                <div className="relative group">
                  <FiUser className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a2b3c]/40 group-focus-within:text-[#d0a755] transition-colors`} />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className={`w-full bg-white border-2 border-[#1a2b3c]/10 rounded-2xl py-3.5 ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} text-[#1a2b3c] placeholder:text-[#1a2b3c]/30 text-[15px] font-semibold outline-none focus:border-[#d0a755] focus:shadow-[0_0_0_4px_rgba(208,167,85,0.1)] transition-all`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-[#1a2b3c]/70 uppercase tracking-wider">
                  {t.phone}
                </label>
                <div className="relative group">
                  <FiPhone className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a2b3c]/40 group-focus-within:text-[#d0a755] transition-colors`} />
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className={`w-full bg-white border-2 border-[#1a2b3c]/10 rounded-2xl py-3.5 ${isRtl ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} text-[#1a2b3c] placeholder:text-[#1a2b3c]/30 text-[15px] font-semibold outline-none focus:border-[#d0a755] focus:shadow-[0_0_0_4px_rgba(208,167,85,0.1)] transition-all`}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-[#1a2b3c]/70 uppercase tracking-wider">
                  {t.password}
                </label>
                <div className="relative group">
                  <FiLock className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a2b3c]/40 group-focus-within:text-[#d0a755] transition-colors`} />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className={`w-full bg-white border-2 border-[#1a2b3c]/10 rounded-2xl py-3.5 ${isRtl ? "pr-12 pl-12 text-right" : "pl-12 pr-12 text-left"} text-[#1a2b3c] placeholder:text-[#1a2b3c]/30 text-[15px] font-semibold outline-none focus:border-[#d0a755] focus:shadow-[0_0_0_4px_rgba(208,167,85,0.1)] transition-all`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className={`absolute ${isRtl ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-[#1a2b3c]/40 hover:text-[#d0a755] focus:text-[#d0a755] transition-colors p-1`}
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#d0a755] text-[#1a2b3c] font-black py-4 rounded-2xl hover:bg-[#b89040] hover:shadow-[0_10px_30px_rgba(208,167,85,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-8 text-[15px]"
              >
                {loading ? (lang === "en" ? "Registering..." : "جاري إنشاء الحساب…") : (
                  <>
                    <span>{t.register}</span>
                    {isRtl ? <FiArrowLeft className="w-4 h-4" /> : <FiArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[#1a2b3c]/60 text-[15px] font-medium">
                {t.hasAccount}{" "}
                <Link
                  href={`/${lang}/login`}
                  className="text-[#1a2b3c] hover:text-[#d0a755] font-black transition-colors underline decoration-2 underline-offset-4"
                >
                  {t.login}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Side (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#1a2b3c] overflow-hidden items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/car1.AVIF"
            alt="Limo Masr Luxury Car"
            fill
            className="object-cover object-center opacity-50 scale-105 animate-slow-pan"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b3c] via-[#1a2b3c]/40 to-[#1a2b3c]/20"></div>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        </div>

        <div className="relative z-10 text-center text-white px-12 max-w-lg flex flex-col items-center">
          <Link href={`/${lang}`}>
            <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(255,255,255,0.1)] transform hover:scale-105 transition-transform duration-500 cursor-pointer">
              <span className="text-[#d0a755] font-black text-5xl">L</span>
            </div>
          </Link>
          <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-[1.2] drop-shadow-lg">
            {t.welcomeTitle1} <br />
            <span className="text-[#d0a755]">{t.welcomeTitle2}</span>
          </h2>
          <p className="text-white/80 text-lg leading-relaxed font-medium">
            {t.welcomeText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#d0a755] border-t-transparent rounded-full animate-spin"></div></div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
