import { Images } from "lucide-react";
import type { Database } from "@/types/database";

type Album = Database["public"]["Tables"]["gallery_albums"]["Row"];

interface GalleryGridProps {
  albums: Album[];
}

export function GalleryGrid({ albums }: GalleryGridProps) {
  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Images size={40} className="mb-3 text-text-secondary/40" />
        <p className="text-text-secondary">No albums yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {albums.map((album) => (
        <div
          key={album.id}
          className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="relative h-52 bg-gradient-to-br from-primary/80 to-primary-light/80">
            {album.cover_photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={album.cover_photo_url}
                alt={album.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Images size={40} className="text-white/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-text-primary">{album.title}</h3>
            {album.description && (
              <p className="mt-1 text-sm text-text-secondary line-clamp-2">{album.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
