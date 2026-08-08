import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UsersRound, Plus, User } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Committees — Admin" };

type Committee = Database["public"]["Tables"]["committees"]["Row"] & {
  profiles: { full_name: string; profile_photo_url: string | null } | null;
};

export default async function AdminCommitteesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("committees")
    .select("*, profiles:head_id(full_name, profile_photo_url)")
    .order("name");

  const committees = (data as Committee[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Committees</h1>
          <p className="mt-1 text-sm text-text-secondary">{committees.length} committees</p>
        </div>
        <Link
          href="/admin/committees/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
        >
          <Plus size={15} /> New Committee
        </Link>
      </div>

      {committees.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <UsersRound size={36} className="mb-3 text-border" />
          <p className="text-sm text-text-secondary">No committees yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {committees.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8">
                  <UsersRound size={20} className="text-primary" />
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.is_active ? "bg-success/10 text-success" : "bg-border text-text-secondary"}`}>
                  {c.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <h3 className="font-bold text-text-primary">{c.name}</h3>
              {c.description && <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">{c.description}</p>}
              {c.profiles && (
                <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-4">
                  <div className="h-7 w-7 overflow-hidden rounded-full bg-primary/8">
                    {c.profiles.profile_photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.profiles.profile_photo_url} alt={c.profiles.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center"><User size={12} className="text-primary/40" /></div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-text-secondary">Head</p>
                    <p className="text-xs font-medium text-text-primary">{c.profiles.full_name}</p>
                  </div>
                </div>
              )}
              <Link href={`/admin/committees/${c.id}`} className="mt-4 block text-xs font-medium text-primary hover:text-primary-light transition-colors">
                Edit →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
