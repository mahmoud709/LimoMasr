import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { getArticles } from "@/lib/data";
import type { Locale } from "@/lib/types";
import { ArticlesCarousel } from "./ArticlesCarousel";

export async function ArticlesSection({ locale = "ar" }: { locale?: Locale }) {
  const isEn = locale === 'en';
  const articles = await getArticles();

  return (
    <section className="relative w-full py-24 bg-[#F9F8F6] overflow-hidden border-t border-black/5">
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 relative z-10">

        <ArticlesCarousel articles={articles.slice(0, 9)} isEn={isEn} />

      </div>
    </section>
  );
}
