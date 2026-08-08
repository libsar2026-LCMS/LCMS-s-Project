// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Award } from "lucide-react";
import Link from "next/link";

export default function NewLeadershipPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<{ id: string; full_name: string }[]>([]);

  useEffect(() => {
    createClient()
      .from("profiles")
      .select("id, full_name")
      .eq("membership_status", "active")
      .order("full_name")
      .then(({ data }) => setProfiles(data ?? []));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error: dbError } = await supabase.from("leadership").insert({
      profile_id:    (fd.get("profile_id") as string) || null,
      position:      fd.get("position") as string,
      academic_year: fd.get("academic_year") as string,
      is_current:    fd.get("is_current") === "true",
      photo_url:     (fd.get("photo_url") as string) || null,
      bio:           (fd.get("bio") as string) || null,
    });

    if (dbError) { setError(dbError.message); setPending(false); return; }
    router.push("/admin/leadership");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/leadership" className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Add Leader</h1>
          <p className="mt-0.5 text-sm text-text-secondary">Add a new leadership entry</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Member</label>
            <select name="profile_id" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
              <option value="">— Select member —</option>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Position <span className="text-accent">*</span></label>
            <input
              name="position"
              required
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
                placeholder="e.g. 2024/2025"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Status</label>
              <select name="is_current" defaultValue="true" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10">
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
              placeholder="https://…"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Bio</label>
            <textarea
              name="bio"
              rows={3}
              placeholder="Short biography…"
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {error && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</p>}

          <div className="flex gap-3 pt-1">
            <Link href="/admin/leadership" className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary">
              Cancel
            </Link>
            <button type="submit" disabled={pending} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
              <Award size={15} />
              {pending ? "Saving…" : "Add Leader"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
