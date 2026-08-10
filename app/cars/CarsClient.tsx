"use client";

import { useState, useMemo, useDeferredValue } from "react";
import { CarCard } from "@/components/CarCard";
import type { Car, Locale } from "@/lib/types";
import { FiGrid, FiList, FiFilter, FiChevronDown } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";

export function CarsClient({ cars, locale, currency, exchangeRate }: { cars: Car[], locale: Locale, currency: string, exchangeRate: number }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "recommended">("recommended");
  const [minSeats, setMinSeats] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const minPricePossible = 500;
  const maxPriceRaw = cars.length > 0 ? Math.max(...cars.map(c => c.price)) : 10000;
  const maxPricePossible = 50000;
  const [maxPrice, setMaxPrice] = useState<number>(maxPricePossible);
  const deferredMaxPrice = useDeferredValue(maxPrice);

  const categories = useMemo(() => {
    const catsMap = new Map<string, string>();
    cars.forEach(c => {
      const locName = c.translations?.[locale]?.categoryName || c.categoryName;
      catsMap.set(c.categoryName, locName);
    });
    const result = [{ id: "all", name: locale === "en" ? "All Cars" : "كل السيارات" }];
    catsMap.forEach((name, id) => {
      result.push({ id, name });
    });
    return result;
  }, [cars, locale]);

  const faqs = [
    {
      q: locale === "en" ? "Is fuel and driver included in the price?" : "هل السعر يشمل الوقود والسائق؟",
      a: locale === "en" ? "Yes, all our trip prices include VAT, fuel, toll gates, and your dedicated professional driver." : "نعم، جميع أسعار رحلاتنا شاملة ضريبة القيمة المضافة، الوقود، ورسوم الكارتة، بالإضافة إلى تكلفة السائق المخصص لك."
    },
    {
      q: locale === "en" ? "Can I modify or cancel my booking?" : "هل يمكنني تعديل أو إلغاء الحجز؟",
      a: locale === "en" ? "Yes, you can modify or cancel your booking for free up to 24 hours before your scheduled trip." : "نعم بكل تأكيد، يمكنك تعديل تفاصيل رحلتك أو إلغاء الحجز مجاناً قبل موعد الرحلة بـ 24 ساعة على الأقل."
    },
    {
      q: locale === "en" ? "What payment methods do you accept?" : "ما هي طرق الدفع المتاحة؟",
      a: locale === "en" ? "We offer flexible payment methods including cash to the driver, online credit card payment, and bank transfers (InstaPay, Vodafone Cash)." : "نوفر طرق دفع مرنة لراحتك تشمل الدفع نقداً للسائق، الدفع بالبطاقة الائتمانية عبر الإنترنت، أو التحويل البنكي ومحافظ الموبايل (انستا باي، فودافون كاش)."
    }
  ];

  const filteredCars = useMemo(() => {
    let result = [...cars];
    
    if (minSeats > 0) {
      result = result.filter(c => c.seats >= minSeats);
    }
    
    if (activeCategory !== "all") {
      result = result.filter(c => c.categoryName === activeCategory);
    }

    result = result.filter(c => c.price <= deferredMaxPrice);
    
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    
    return result;
  }, [cars, sortBy, minSeats, activeCategory, deferredMaxPrice]);

  return (
    <div className="w-full flex flex-col gap-8">

      {/* Filters Bar */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col lg:flex-row items-center justify-between gap-6 animate-reveal-2">
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2">
             <FiFilter className="text-[#d0a755]" />
             <span className="font-bold text-sm text-[#1a2b3c]">{locale === "en" ? "Filter & Sort:" : "تصفية وترتيب:"}</span>
          </div>
          
          <select 
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="bg-[#F9F8F6] border-none text-sm font-medium rounded-lg px-4 py-2 text-[#1a2b3c] focus:ring-2 focus:ring-[#d0a755] outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#F9F8F6] border-none text-sm font-medium rounded-lg px-4 py-2 text-[#1a2b3c] focus:ring-2 focus:ring-[#d0a755] outline-none cursor-pointer"
          >
            <option value="recommended">{locale === "en" ? "Recommended" : "المقترح"}</option>
            <option value="price_asc">{locale === "en" ? "Price: Low to High" : "السعر: من الأقل للأعلى"}</option>
            <option value="price_desc">{locale === "en" ? "Price: High to Low" : "السعر: من الأعلى للأقل"}</option>
          </select>
          
          <div className="hidden md:block w-px h-6 bg-black/10 mx-2"></div>
          
          <select 
            value={minSeats}
            onChange={(e) => setMinSeats(Number(e.target.value))}
            className="bg-[#F9F8F6] border-none text-sm font-medium rounded-lg px-4 py-2 text-[#1a2b3c] focus:ring-2 focus:ring-[#d0a755] outline-none cursor-pointer"
          >
            <option value="0">{locale === "en" ? "All Seats" : "جميع المقاعد"}</option>
            <option value="4">{locale === "en" ? "4+ Seats" : "+4 مقاعد"}</option>
            <option value="7">{locale === "en" ? "7+ Seats" : "+7 مقاعد"}</option>
            <option value="12">{locale === "en" ? "12+ Seats" : "+12 مقعد"}</option>
            <option value="20">{locale === "en" ? "20+ Seats" : "+20 مقعد"}</option>
          </select>

          <div className="hidden md:block w-px h-6 bg-black/10 mx-2"></div>
          
          <div className="flex flex-col w-full md:w-48 gap-1.5 shrink-0">
            <div className="flex justify-between items-center text-xs font-bold text-[#1a2b3c]">
              <span>{locale === "en" ? "Max Price" : "الحد الأقصى للسعر"}</span>
              <span className="text-[#d0a755]">{formatCurrency(maxPrice, "EGP", locale, currency, exchangeRate)}</span>
            </div>
            <input 
              type="range" 
              min={minPricePossible} 
              max={maxPricePossible} 
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#d0a755] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#F9F8F6] p-1 rounded-lg shrink-0 w-full lg:w-auto justify-center">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all flex items-center justify-center ${viewMode === "grid" ? "bg-white shadow-sm text-[#d0a755]" : "text-gray-400 hover:text-[#1a2b3c]"}`}
            title={locale === "en" ? "Grid View" : "عرض شبكي"}
          >
            <FiGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all flex items-center justify-center ${viewMode === "list" ? "bg-white shadow-sm text-[#d0a755]" : "text-gray-400 hover:text-[#1a2b3c]"}`}
            title={locale === "en" ? "List View" : "عرض قائمة"}
          >
            <FiList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results */}
      <div className={`grid gap-6 animate-reveal-3 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto w-full"}`}>
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} locale={locale} currency={currency} exchangeRate={exchangeRate} viewMode={viewMode} />
        ))}
      </div>
      
      {filteredCars.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-black/5 shadow-sm animate-reveal-2">
          <div className="w-20 h-20 mx-auto bg-[#F9F8F6] rounded-full flex items-center justify-center mb-6">
             <FiFilter className="w-8 h-8 text-[#1a2b3c]/20" />
          </div>
          <h3 className="text-xl font-black text-[#1a2b3c] mb-2">{locale === "en" ? "No cars match your filters" : "لا توجد سيارات تطابق الفلتر"}</h3>
          <button onClick={() => { setMinSeats(0); setSortBy("recommended"); setActiveCategory("all"); setMaxPrice(maxPricePossible); }} className="mt-4 text-[#d0a755] font-bold hover:underline">
            {locale === "en" ? "Clear Filters" : "مسح الفلاتر"}
          </button>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 border border-black/5 shadow-sm animate-reveal-4">
        <div className="text-center mb-10">
          <span className="flex items-center justify-center gap-4 mb-4">
            <span className="w-8 h-[1px] bg-[#d0a755]"></span>
            <span className="text-[#d0a755] font-bold tracking-widest text-xs uppercase">{locale === "en" ? "FAQ" : "الأسئلة الشائعة"}</span>
            <span className="w-8 h-[1px] bg-[#d0a755]"></span>
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#1a2b3c]">{locale === "en" ? "Frequently Asked Questions" : "أسئلة تهمك قبل الحجز"}</h2>
        </div>
        
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-black/5 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className={`w-full flex items-center justify-between p-6 text-start transition-colors ${faqOpen === idx ? "bg-[#F9F8F6]" : "bg-white hover:bg-[#F9F8F6]/50"}`}
              >
                <span className="font-bold text-[#1a2b3c]">{faq.q}</span>
                <FiChevronDown className={`w-5 h-5 text-[#d0a755] transition-transform duration-300 shrink-0 ${faqOpen === idx ? "rotate-180" : ""}`} />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 bg-[#F9F8F6] ${faqOpen === idx ? "max-h-[200px]" : "max-h-0"}`}
              >
                <div className="p-6 border-t border-black/5 text-[#1a2b3c]/70 text-sm md:text-base leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
