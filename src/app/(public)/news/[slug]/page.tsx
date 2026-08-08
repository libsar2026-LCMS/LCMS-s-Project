import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

type News = Database["public"]["Tables"]["news"]["Row"];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("news").select("title").eq("slug", slug).single();
  const row = data as Pick<News, "title"> | null;
  return { title: row?.title ?? "News" };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  const article = data as News | null;
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/news"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft size={15} /> Back to News
      </Link>

      {article.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="mb-8 h-72 w-full rounded-2xl object-cover shadow-lg"
        />
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent capitalize">
          <Tag size={11} /> {article.category}
        </span>
        {article.published_at && (
          <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary">
            <Calendar size={11} /> {formatDate(article.published_at)}
          </span>
        )}
      </div>

      <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl leading-tight">
        {article.title}
      </h1>

      {article.content && (
        <div className="mt-8 prose prose-slate max-w-none text-text-secondary leading-relaxed">
          {article.content.split("\n").map((para: string, i: number) =>
            para.trim() ? <p key={i}>{para}</p> : null
          )}
        </div>
      )}
    </div>
  );
}
