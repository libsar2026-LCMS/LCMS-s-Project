import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Users, User, GraduationCap, Trophy, Music2, HeartHandshake, Laptop, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Committees" };

type Committee = Database["public"]["Tables"]["committees"]["Row"] & {
  profiles: { full_name: string; profile_photo_url: string | null } | null;
  member_count?: number;
};

const COMMITTEE_META: Record<string, { icon: React.ElementType; color: string; bg: string; bar: string }> = {
  "Academic Committee":  { icon: GraduationCap,  color: "text-blue-600",    bg: "bg-blue-500/10 border-blue-100",    bar: "from-blue-500 to-blue-400"    },
  "Sports Committee":    { icon: Trophy,          color: "text-green-600",   bg: "bg-green-500/10 border-green-100",  bar: "from-green-500 to-green-400"  },
  "Cultural Committee":  { icon: Music2,          color: "text-purple-600",  bg: "bg-purple-500/10 border-purple-100",bar: "from-purple-500 to-purple-400"},
  "Welfare Committee":   { icon: HeartHandshake,  color: "text-rose-600",    bg: "bg-rose-500/10 border-rose-100",    bar: "from-rose-500 to-rose-400"    },
  "ICT Committee":       { icon: Laptop,          color: "text-amber-600",   bg: "bg-amber-500/10 border-amber-100",  bar: "from-amber-500 to-amber-400"  },
};

const DEFAULT_META = { icon: Users, color: "text-primary", bg: "bg-primary/10 border-primary/15", bar: "from-primary to-primary-light" };

export default async function CommitteesPage() {
  const supabase = await createClient();

  const [{ data: committeesData }, { data: memberCounts }] = await Promise.all([
    supabase
      .from("committees")
      .select("*, profiles:head_id(full_name, profile_photo_url)")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("profiles")
      .select("committee_id")
      .not("committee_id", "is", null),
  ]);

  const committees = (committeesData as Committee[] | null) ?? [];

  // Count members per committee
  const countMap: Record<string, number> = {};
  (memberCounts ?? []).forEach((p: { committee_id: string | null }) => {
    if (p.committee_id) countMap[p.committee_id] = (countMap[p.committee_id] ?? 0) + 1;
  });

  return (
    <>
      <PageHeader
        title="Committees"
        subtitle="Our committees drive the work of LIBSAR across academic, cultural, sports, and welfare areas."
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

        {/* Section header */}
        <AnimateIn variant="fade-up" className="mb-14 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Active Committees</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent" />
          </div>
          <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">How We Operate</h2>
          <p className="mt-3 text-sm text-text-secondary max-w-xl mx-auto">
            Each committee is led by a dedicated head and focuses on a specific area of community life.
          </p>
        </AnimateIn>

        {committees.length === 0 ? (
          <AnimateIn variant="fade-in">
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border py-24 text-center">
              <Users size={40} className="mb-4 text-border" />
              <p className="font-semibold text-text-primary">No committees listed</p>
              <p className="mt-1 text-sm text-text-secondary">Check back soon.</p>
            </div>
          </AnimateIn>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {committees.map((committee, i) => {
              const meta  = COMMITTEE_META[committee.name] ?? DEFAULT_META;
              const Icon  = meta.icon;
              const count = countMap[committee.id] ?? 0;

              return (
                <AnimateIn key={committee.id} variant="fade-up" delay={i * 80}>
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/8 cursor-default">

                    {/* Gradient top bar */}
                    <div className={`h-1 w-full bg-gradient-to-r ${meta.bar} scale-x-0 transition-transform duration-500 group-hover:scale-x-100`} />

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-7">

                      {/* Icon + member count row */}
                      <div className="mb-5 flex items-start justify-between">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${meta.bg} transition-transform duration-300 group-hover:scale-110`}>
                          <Icon size={24} className={meta.color} />
                        </div>
                        {count > 0 && (
                          <div className="flex flex-col items-end">
                            <span className="text-2xl font-extrabold text-text-primary leading-none">{count}</span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mt-0.5">Members</span>
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className={`text-lg font-bold text-text-primary transition-colors duration-300 group-hover:${meta.color}`}>
                        {committee.name}
                      </h3>

                      {/* Description */}
                      {committee.description && (
                        <p className="mt-2.5 text-sm text-text-secondary leading-relaxed flex-1">
                          {committee.description}
                        </p>
                      )}

                      {/* Head */}
                      {committee.profiles ? (
                        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-primary/8 ring-2 ring-white shadow-sm">
                            {committee.profiles.profile_photo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={committee.profiles.profile_photo_url}
                                alt={committee.profiles.full_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <User size={14} className="text-primary/40" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Committee Head</p>
                            <p className="truncate text-sm font-semibold text-text-primary">{committee.profiles.full_name}</p>
                          </div>
                          <ChevronRight size={14} className="shrink-0 text-text-secondary/40 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </div>
                      ) : (
                        <div className="mt-6 flex items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-3">
                          <User size={14} className="text-text-secondary/40" />
                          <p className="text-xs text-text-secondary">No head assigned</p>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        )}

        {/* Bottom stats strip */}
        {committees.length > 0 && (
          <AnimateIn variant="fade-up" className="mt-16">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-8">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
                {[
                  { value: committees.length,                                    label: "Active Committees" },
                  { value: Object.values(countMap).reduce((a, b) => a + b, 0),  label: "Members Assigned"  },
                  { value: committees.filter((c) => c.profiles).length,          label: "Committees with Head" },
                  { value: "2021",                                                label: "Est. Year"         },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-3xl font-extrabold text-primary">{value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-text-secondary">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        )}
      </div>
    </>
  );
}
