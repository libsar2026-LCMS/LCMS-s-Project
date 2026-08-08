import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Award, Plus, User } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Leadership — Admin" };

type Leadership = Database["public"]["Tables"]["leadership"]["Row"] & {
  profiles: { full_name: string; profile_photo_url: string | null } | null;
};

export default async function AdminLeadershipPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leadership")
    .select("*, profiles(full_name, profile_photo_url)")
    .order("is_current", { ascending: false })
    .order("academic_year", { ascending: false });

  const leaders = (data as Leadership[] | null) ?? [];
  const current = leaders.filter((l) => l.is_current);
  const past    = leaders.filter((l) => !l.is_current);

  function LeaderRow({ leader }: { leader: Leadership }) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary/8 ring-2 ring-border">
          {leader.profiles?.profile_photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={leader.profiles.profile_photo_url} alt={leader.profiles.full_name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center"><User size={20} className="text-primary/30" /></div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text-primary">{leader.profiles?.full_name ?? "—"}</p>
          <p className="text-sm text-accent font-medium">{leader.position}</p>
          <p className="text-xs text-text-secondary">{leader.academic_year}</p>
        </div>
        <Link href={`/admin/leadership/${leader.id}`} className="shrink-0 text-xs font-medium text-primary hover:text-primary-light transition-colors">
          Edit →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Leadership</h1>
          <p className="mt-1 text-sm text-text-secondary">{leaders.length} total entries</p>
        </div>
        <Link
          href="/admin/leadership/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
        >
          <Plus size={15} /> Add Leader
        </Link>
      </div>

      {leaders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <Award size={36} className="mb-3 text-border" />
          <p className="text-sm text-text-secondary">No leadership entries yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {current.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Current Board</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {current.map((l) => <LeaderRow key={l.id} leader={l} />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Past Leaders</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {past.map((l) => <LeaderRow key={l.id} leader={l} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
