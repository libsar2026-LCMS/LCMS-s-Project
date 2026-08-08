// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Newspaper } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["announcement", "scholarship", "community", "graduation", "achievement"];

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") + "-" + Date.now();
}

export default function NewArticlePage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    const status = fd.get("status") as string;
    const supabase = createClient();

    const { error: dbError } = await supabase.from("news").insert({
      title,
      slug: slugify(title),
      content:      (fd.get("content") as string) || null,
      category:     fd.get("category") as string,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    if (dbError) { setError(dbError.message); setPending(false); return; }
    router.push("/admin/news");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/news" className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">New Article</h1>
          <p className="mt-0.5 text-sm text-text-secondary">Write a new news article</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Title <span className="text-accent">*</span></label>
            <input
              name="title"
              required
              placeholder="e.g. LIBSAR Annual Scholarship Announcement"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Content</label>
            <textarea
              name="content"
              rows={8}
              placeholder="Write the article content here…"
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Category</label>
              <select name="category" defaultValue="announcement" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Status</label>
              <select name="status" defaultValue="draft" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Link href="/admin/news" className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary">
              Cancel
            </Link>
            <button type="submit" disabled={pending} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
              <Newspaper size={15} />
              {pending ? "Creating…" : "Create Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
