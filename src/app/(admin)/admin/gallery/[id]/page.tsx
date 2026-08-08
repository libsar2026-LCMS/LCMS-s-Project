// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Images, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Album — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: album }, { data: photos }] = await Promise.all([
    supabase.from("gallery_albums").select("*").eq("id", id).single(),
    supabase.from("gallery_photos").select("id, url, caption").eq("album_id", id).order("created_at"),
  ]);

  if (!album) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/gallery" className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Edit Album</h1>
          <p className="mt-0.5 text-sm text-text-secondary truncate max-w-xs">{album.title}</p>
        </div>
      </div>

      {/* Album details */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Album Details</h2>
        <form
          action={async (fd: FormData) => {
            "use server";
            const supabase = await createClient();
            await supabase.from("gallery_albums").update({
              title:        fd.get("title") as string,
              description:  (fd.get("description") as string) || null,
              is_published: fd.get("is_published") === "on",
            }).eq("id", id);
            redirect("/admin/gallery");
          }}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Title <span className="text-accent">*</span></label>
            <input
              name="title"
              required
              defaultValue={album.title}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={album.description ?? ""}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input name="is_published" type="checkbox" defaultChecked={album.is_published} className="h-4 w-4 rounded border-border accent-primary" />
            <span className="text-sm text-text-primary">Published</span>
          </label>

          <div className="flex gap-3 pt-1">
            <Link href="/admin/gallery" className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary">
              Cancel
            </Link>
            <button type="submit" className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Photos */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-text-primary">Photos ({photos?.length ?? 0})</h2>

        {/* Add photo by URL */}
        <form
          action={async (fd: FormData) => {
            "use server";
            const supabase = await createClient();
            const { data: { user } } = await supabase.auth.getUser();
            const url = fd.get("url") as string;
            await supabase.from("gallery_photos").insert({
              album_id:    id,
              url,
              caption:     (fd.get("caption") as string) || null,
              uploaded_by: user?.id ?? null,
            });
            // Auto-set as cover if album has no cover yet
            const { data: albumRow } = await supabase
              .from("gallery_albums")
              .select("cover_photo_url")
              .eq("id", id)
              .single();
            if (!albumRow?.cover_photo_url) {
              await supabase.from("gallery_albums").update({ cover_photo_url: url }).eq("id", id);
            }
            redirect(`/admin/gallery/${id}`);
          }}
          className="mb-5 flex flex-col gap-3 sm:flex-row"
        >
          <input
            name="url"
            required
            placeholder="Photo URL"
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          <input
            name="caption"
            placeholder="Caption (optional)"
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light">
            Add Photo
          </button>
        </form>

        {(photos ?? []).length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
            <Images size={28} className="mb-2 text-border" />
            <p className="text-sm text-text-secondary">No photos yet. Add a photo URL above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(photos ?? []).map((photo) => (
              <div key={photo.id} className="group relative overflow-hidden rounded-xl border border-border bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.caption ?? ""} className="h-32 w-full object-cover" />
                {photo.caption && (
                  <p className="px-2 py-1.5 text-xs text-text-secondary truncate">{photo.caption}</p>
                )}
                {/* Set as cover */}
                <form
                  action={async () => {
                    "use server";
                    const supabase = await createClient();
                    await supabase.from("gallery_albums").update({ cover_photo_url: photo.url }).eq("id", id);
                    redirect(`/admin/gallery/${id}`);
                  }}
                  className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button type="submit" className="rounded-lg bg-black/60 px-2 py-1 text-[10px] font-semibold text-white hover:bg-primary transition-colors">
                    Cover
                  </button>
                </form>
                {/* Delete */}
                <form
                  action={async () => {
                    "use server";
                    const supabase = await createClient();
                    await supabase.from("gallery_photos").delete().eq("id", photo.id);
                    // If deleted photo was the cover, set cover to new first photo
                    const { data: albumRow } = await supabase
                      .from("gallery_albums")
                      .select("cover_photo_url")
                      .eq("id", id)
                      .single();
                    if (albumRow?.cover_photo_url === photo.url) {
                      const { data: remaining } = await supabase
                        .from("gallery_photos")
                        .select("url")
                        .eq("album_id", id)
                        .order("created_at")
                        .limit(1)
                        .single();
                      await supabase.from("gallery_albums")
                        .update({ cover_photo_url: remaining?.url ?? null })
                        .eq("id", id);
                    }
                    redirect(`/admin/gallery/${id}`);
                  }}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button type="submit" className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-accent transition-colors">
                    <Trash2 size={13} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
