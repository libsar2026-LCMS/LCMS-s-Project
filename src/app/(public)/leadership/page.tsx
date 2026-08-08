import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { LeadershipCard } from "@/components/public/LeadershipCard";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Users } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Leadership" };

type Leadership = Database["public"]["Tables"]["leadership"]["Row"] & {
  profiles: { full_name: string; profile_photo_url: string | null } | null;
};

const FEATURED_POSITIONS = ["President", "Vice President"];

export default async function LeadershipPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("leadership")
    .select("*, profiles(full_name, profile_photo_url)")
    .order("is_current", { ascending: false })
    .order("academic_year", { ascending: false });

  const leaders = (data as Leadership[] | null) ?? [];
  const current = leaders.filter((l) => l.is_current);
  const past    = leaders.filter((l) => !l.is_current);

  const featured = current.filter((l) => FEATURED_POSITIONS.includes(l.position));
  const board    = current.filter((l) => !FEATURED_POSITIONS.includes(l.position));

  return (
    <>
      <PageHeader
        title="Leadership"
        subtitle="Meet the dedicated individuals who lead and serve our community."
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-20">

        {current.length === 0 ? (
          <AnimateIn variant="fade-in">
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border py-24 text-center">
              <Users size={40} className="mb-4 text-border" />
              <p className="font-semibold text-text-primary">No current leadership listed</p>
              <p className="mt-1 text-sm text-text-secondary">Check back soon.</p>
            </div>
          </AnimateIn>
        ) : (
          <>
            {/* ── Current term header ── */}
            <AnimateIn variant="fade-up" className="text-center">
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Current Term</span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent" />
              </div>
              <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">Executive Board</h2>
              <p className="mt-3 text-sm text-text-secondary max-w-xl mx-auto">
                Elected leaders serving the LIBSAR community with dedication and purpose.
              </p>
            </AnimateIn>

            {/* ── Featured: President & VP ── */}
            {featured.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                {featured.map((leader, i) => (
                  <LeadershipCard key={leader.id} leader={leader} index={i} featured />
                ))}
              </div>
            )}

            {/* ── Rest of board ── */}
            {board.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {board.map((leader, i) => (
                  <LeadershipCard key={leader.id} leader={leader} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Past leaders ── */}
        {past.length > 0 && (
          <section>
            <AnimateIn variant="fade-up" className="mb-10 text-center">
              <div className="flex items-center justify-center gap-2.5 mb-3">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-text-secondary/40" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">Alumni</span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-text-secondary/40" />
              </div>
              <h2 className="font-display text-2xl font-bold text-text-primary">Past Leaders</h2>
              <p className="mt-2 text-sm text-text-secondary">Those who shaped LIBSAR before us.</p>
            </AnimateIn>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 opacity-80">
              {past.map((leader, i) => (
                <LeadershipCard key={leader.id} leader={leader} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
