// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Leader — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLeadershipPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: leader }, { data: profiles }] = await Promise.all([
    supabase.from("leadership").select("*").eq("id", id).single(),
    supabase.from("profiles").select("id, full_name").eq("membership_status", "active").order("full_name"),
  ]);

  if (!leader) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/leadership"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Edit Leader</h1>
          <p className="mt-0.5 text-sm text-text-secondary">{leader.position} — {leader.academic_year}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <form
          action={async (fd: FormData) => {
            "use server";
            const supabase = await createClient();
            await supabase.from("leadership").update({
              profile_id:    (fd.get("profile_id") as string) || null,
              position:      fd.get("position") as string,
              academic_year: fd.get("academic_year") as string,
              is_current:    fd.get("is_current") === "true",
              photo_url:     (fd.get("photo_url") as string) || null,
              bio:           (fd.get("bio") as string) || null,
            }).eq("id", id);
            redirect("/admin/leadership");
          }}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Member</label>
            <select
              name="profile_id"
              defaultValue={leader.profile_id ?? ""}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              <option value="">— Select member —</option>
              {(profiles ?? []).map((p) => (
                <option key={p.id} value={p.id}>{p.full_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Position <span className="text-accent">*</span></label>
            <input
              name="position"
              required
              defaultValue={leader.position}
              placeholder="e.g. President"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Academic Year <span className="text-accent">*</span></label>
              <input
                name="academic_year"
                required
                defaultValue={leader.academic_year}
                placeholder="e.g. 2024/2025"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Status</label>
              <select
                name="is_current"
                defaultValue={leader.is_current ? "true" : "false"}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="true">Current</option>
                <option value="false">Past</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Photo URL</label>
            <input
              name="photo_url"
              type="url"
              defaultValue={leader.photo_url ?? ""}
              placeholder="https://…"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Bio</label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={leader.bio ?? ""}
              placeholder="Short biography…"
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Link
              href="/admin/leadership"
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Delete */}
        <form
          action={async () => {
            "use server";
            const supabase = await createClient();
            await supabase.from("leadership").delete().eq("id", id);
            redirect("/admin/leadership");
          }}
          className="mt-4 border-t border-border pt-4"
        >
          <button
            type="submit"
            className="w-full rounded-xl border border-accent/30 px-4 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/8"
          >
            Delete Entry
          </button>
        </form>
      </div>
    </div>
  );
}
