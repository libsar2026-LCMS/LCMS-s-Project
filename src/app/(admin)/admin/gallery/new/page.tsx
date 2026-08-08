// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Images } from "lucide-react";
import Link from "next/link";

export default function NewAlbumPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error: dbError } = await supabase.from("gallery_albums").insert({
      title:        fd.get("title") as string,
      description:  (fd.get("description") as string) || null,
      is_published: fd.get("is_published") === "on",
    });

    if (dbError) { setError(dbError.message); setPending(false); return; }
    router.push("/admin/gallery");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/gallery" className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">New Album</h1>
          <p className="mt-0.5 text-sm text-text-secondary">Create a new gallery album</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Album Title <span className="text-accent">*</span></label>
            <input
              name="title"
              required
              placeholder="e.g. Annual Dinner 2024"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Brief description of this album…"
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input name="is_published" type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
            <span className="text-sm text-text-primary">Publish album immediately</span>
          </label>

          {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Link href="/admin/gallery" className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary">
              Cancel
            </Link>
            <button type="submit" disabled={pending} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
              <Images size={15} />
              {pending ? "Creating…" : "Create Album"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
