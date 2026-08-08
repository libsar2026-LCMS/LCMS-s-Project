"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Images } from "lucide-react";

type Photo = { id: string; url: string; caption: string | null };
type Album = { id: string; title: string; description: string | null };

export default function PublicAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("gallery_albums").select("id, title, description").eq("id", id).eq("is_published", true).single(),
      supabase.from("gallery_photos").select("id, url, caption").eq("album_id", id).order("created_at"),
    ]).then(([{ data: a }, { data: p }]) => {
      if (!a) { router.replace("/gallery"); return; }
      setAlbum(a as Album);
      setPhotos((p as Photo[]) ?? []);
      setLoading(false);
    });
  }, [id, router]);

  const prev = useCallback(() => setLightbox((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null)), [photos.length]);
  const next = useCallback(() => setLightbox((i) => (i !== null ? (i + 1) % photos.length : null)), [photos.length]);

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-border/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">{album?.title}</h1>
            {album?.description && (
              <p className="mt-1.5 text-sm text-text-secondary">{album.description}</p>
            )}
            <p className="mt-1 text-xs text-text-secondary">{photos.length} photo{photos.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Photo grid */}
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
            <Images size={36} className="mb-3 text-border" />
            <p className="text-sm text-text-secondary">No photos in this album yet.</p>
          </div>
        ) : (
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className="mb-3 break-inside-avoid overflow-hidden rounded-xl cursor-pointer group relative"
                onClick={() => setLightbox(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption ?? ""}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Image */}
          <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightbox].url}
              alt={photos[lightbox].caption ?? ""}
              className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain shadow-2xl"
            />
            {photos[lightbox].caption && (
              <p className="mt-3 text-center text-sm text-white/70">{photos[lightbox].caption}</p>
            )}
            <p className="mt-1 text-center text-xs text-white/40">{lightbox + 1} / {photos.length}</p>
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
