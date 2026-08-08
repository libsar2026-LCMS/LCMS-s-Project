// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { notifyAllOnNewsPublish } from "@/actions/admin";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Article — Admin" };

const CATEGORIES = ["announcement", "scholarship", "community", "graduation", "achievement"];

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase.from("news").select("*").eq("id", id).single();
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/news" className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Edit Article</h1>
          <p className="mt-0.5 text-sm text-text-secondary truncate max-w-xs">{article.title}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <form
          action={async (fd: FormData) => {
            "use server";
            const supabase = await createClient();
            const status = fd.get("status") as string;
            const wasPublished = article.status !== "published" && status === "published";
            await supabase.from("news").update({
              title:        fd.get("title") as string,
              content:      (fd.get("content") as string) || null,
              category:     fd.get("category") as string,
              status,
              published_at: wasPublished ? new Date().toISOString() : article.published_at,
            }).eq("id", id);
            if (wasPublished) {
              await notifyAllOnNewsPublish(fd.get("title") as string, article.slug);
            }
            redirect("/admin/news");
          }}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Title <span className="text-accent">*</span></label>
            <input
              name="title"
              required
              defaultValue={article.title}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Content</label>
            <textarea
              name="content"
              rows={8}
              defaultValue={article.content ?? ""}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Category</label>
              <select name="category" defaultValue={article.category} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Status</label>
              <select name="status" defaultValue={article.status} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Link href="/admin/news" className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary">
              Cancel
            </Link>
            <button type="submit" className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
