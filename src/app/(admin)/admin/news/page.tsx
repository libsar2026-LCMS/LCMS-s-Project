// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Newspaper, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "News — Admin" };

const STATUS_STYLES: Record<string, string> = {
  published: "bg-success/10 text-success",
  draft:     "bg-border     text-text-secondary",
  archived:  "bg-warning/10 text-warning",
};

const CATEGORY_STYLES: Record<string, string> = {
  announcement: "bg-blue-50   text-blue-700",
  scholarship:  "bg-yellow-50 text-yellow-700",
  community:    "bg-green-50  text-green-700",
  graduation:   "bg-purple-50 text-purple-700",
  achievement:  "bg-orange-50 text-orange-700",
};

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const { data: articles, count } = await supabase
    .from("news")
    .select("id, title, category, status, published_at, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">News</h1>
          <p className="mt-1 text-sm text-text-secondary">{count ?? 0} total articles</p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
        >
          <Plus size={15} /> New Article
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Title</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:table-cell">Category</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary md:table-cell">Published</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(articles ?? []).map((a) => (
                <tr key={a.id} className="transition-colors hover:bg-background/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                        <Newspaper size={15} className="text-primary" />
                      </div>
                      <p className="font-medium text-text-primary line-clamp-1">{a.title}</p>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 sm:table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${CATEGORY_STYLES[a.category] ?? "bg-gray-50 text-gray-700"}`}>
                      {a.category}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-text-secondary md:table-cell">
                    {a.published_at ? formatDate(a.published_at) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[a.status] ?? STATUS_STYLES.draft}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/news/${a.id}`} className="text-xs font-medium text-primary hover:text-primary-light transition-colors">
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
              {(articles ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-text-secondary">
                    <Newspaper size={32} className="mx-auto mb-3 text-border" />
                    No articles yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

