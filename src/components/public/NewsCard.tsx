import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AnimateIn } from "@/components/shared/AnimateIn";
import type { Database } from "@/types/database";

type News = Database["public"]["Tables"]["news"]["Row"];

const CATEGORY_STYLES: Record<string, string> = {
  announcement: "bg-blue-50   text-blue-700   border-blue-100",
  scholarship:  "bg-amber-50  text-amber-700  border-amber-100",
  community:    "bg-emerald-50 text-emerald-700 border-emerald-100",
  graduation:   "bg-purple-50 text-purple-700 border-purple-100",
  achievement:  "bg-orange-50 text-orange-700 border-orange-100",
};

export function NewsCard({ news, featured = false, index = 0 }: { news: News; featured?: boolean; index?: number }) {
  if (featured) {
    return (
      <AnimateIn variant="fade-up" delay={index * 100}>
        <Link href={`/news/${news.slug}`} className="group block">
          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
            <div className="grid md:grid-cols-5">
              <div className="relative md:col-span-2 h-64 md:h-auto overflow-hidden bg-gradient-to-br from-primary to-primary-light">
                {news.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={news.cover_image_url}
                    alt={news.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                <div className="absolute top-4 left-4 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                  Featured
                </div>
              </div>
              <div className="md:col-span-3 flex flex-col justify-center p-8 lg:p-10">
                <span className={`mb-4 inline-block w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${CATEGORY_STYLES[news.category] ?? "bg-gray-50 text-gray-700 border-gray-100"}`}>
                  {news.category}
                </span>
                <h2 className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-3 leading-snug lg:text-3xl">
                  {news.title}
                </h2>
                {news.published_at && (
                  <p className="mt-4 text-xs text-text-secondary">{formatDate(news.published_at)}</p>
                )}
                <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2.5">
                  Read article <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </AnimateIn>
    );
  }

  return (
    <AnimateIn variant="fade-up" delay={index * 100}>
      <Link href={`/news/${news.slug}`} className="group block h-full">
        <div className="h-full overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/15">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary to-primary-light">
            {news.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={news.cover_image_url}
                alt={news.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="p-6">
            <span className={`mb-3 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${CATEGORY_STYLES[news.category] ?? "bg-gray-50 text-gray-700 border-gray-100"}`}>
              {news.category}
            </span>
            <h3 className="font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {news.title}
            </h3>
            {news.published_at && (
              <p className="mt-3 text-xs text-text-secondary">{formatDate(news.published_at)}</p>
            )}
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2">
              Read more <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </Link>
    </AnimateIn>
  );
}
