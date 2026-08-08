// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Images, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gallery — Admin" };

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: albums, count } = await supabase
    .from("gallery_albums")
    .select("id, title, description, cover_photo_url, is_published, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Gallery</h1>
          <p className="mt-1 text-sm text-text-secondary">{count ?? 0} albums</p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
        >
          <Plus size={15} /> New Album
        </Link>
      </div>

      {(albums ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <Images size={36} className="mb-3 text-border" />
          <p className="text-sm text-text-secondary">No albums yet. Create your first album.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(albums ?? []).map((album) => (
            <Link
              key={album.id}
              href={`/admin/gallery/${album.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-44 bg-gradient-to-br from-primary/70 to-primary-light/70 overflow-hidden">
                {album.cover_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={album.cover_photo_url} alt={album.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Images size={32} className="text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${album.is_published ? "bg-success/20 text-success" : "bg-white/20 text-white/80"}`}>
                  {album.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="p-4">
                <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">{album.title}</p>
                {album.description && <p className="mt-1 text-xs text-text-secondary line-clamp-2">{album.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

