import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { NewsCard } from "@/components/public/NewsCard";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Newspaper } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "News & Updates" };

type News = Database["public"]["Tables"]["news"]["Row"];

export default async function NewsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const articles = (data as News[] | null) ?? [];
  const [featured, ...rest] = articles;

  return (
    <>
      <PageHeader
        title="News & Updates"
        subtitle="Stay informed with the latest announcements, achievements, and stories from the LIBSAR community."
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <AnimateIn variant="fade-in">
            <div className="rounded-3xl border-2 border-dashed border-border py-24 text-center">
              <p className="text-5xl mb-4">📰</p>
              <p className="font-bold text-text-primary text-lg">No news published yet</p>
              <p className="mt-1.5 text-sm text-text-secondary">Check back soon for updates from the community.</p>
            </div>
          </AnimateIn>
        ) : (
          <div className="space-y-12">
            {/* Featured */}
            {featured && (
              <div>
                <AnimateIn variant="fade-up" className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <Newspaper size={15} className="text-accent" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Featured Story</span>
                </AnimateIn>
                <NewsCard news={featured} featured />
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div>
                <AnimateIn variant="fade-up" className="mb-8 flex items-center gap-3">
                  <div className="h-px w-8 bg-gradient-to-r from-accent to-accent-light" />
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Latest Articles</span>
                </AnimateIn>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((item, i) => <NewsCard key={item.id} news={item} index={i} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
