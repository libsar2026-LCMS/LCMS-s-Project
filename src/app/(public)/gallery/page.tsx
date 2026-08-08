import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Images } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Gallery" };

type Album = Database["public"]["Tables"]["gallery_albums"]["Row"] & { photo_count?: number };

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("gallery_albums")
    .select("id, title, description, cover_photo_url, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const albums = (data as Album[] | null) ?? [];

  // Fetch photo counts + first photo (fallback cover) per album
  const [counts, firstPhotos] = await Promise.all([
    Promise.all(
      albums.map((a) =>
        supabase
          .from("gallery_photos")
          .select("id", { count: "exact", head: true })
          .eq("album_id", a.id)
          .then(({ count }) => ({ id: a.id, count: count ?? 0 }))
      )
    ),
    Promise.all(
      albums.map((a) =>
        supabase
          .from("gallery_photos")
          .select("url")
          .eq("album_id", a.id)
          .order("created_at")
          .limit(1)
          .single()
          .then(({ data }) => ({ id: a.id, url: data?.url ?? null }))
      )
    ),
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [c.id, c.count]));
  const firstPhotoMap = Object.fromEntries(firstPhotos.map((p) => [p.id, p.url]));

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="A visual journey through LIBSAR events, milestones, and community moments."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {albums.length === 0 ? (
          <EmptyState icon={Images} title="No albums yet" description="Photos will appear here once albums are published." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.id}`}
                className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/8"
              >
                <div className="relative h-56 bg-gradient-to-br from-primary/80 to-primary-light/80 overflow-hidden">
                  {(album.cover_photo_url ?? firstPhotoMap[album.id] ?? undefined) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={album.cover_photo_url ?? firstPhotoMap[album.id] ?? undefined}
                      alt={album.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Images size={40} className="text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-semibold text-white text-lg leading-snug">{album.title}</h3>
                    <p className="mt-0.5 text-xs text-white/60">{countMap[album.id] ?? 0} photos</p>
                  </div>
                </div>
                {album.description && (
                  <div className="p-4">
                    <p className="text-sm text-text-secondary line-clamp-2">{album.description}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
