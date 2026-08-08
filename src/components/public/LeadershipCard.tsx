import { User, Quote } from "lucide-react";
import { AnimateIn } from "@/components/shared/AnimateIn";
import type { Database } from "@/types/database";

type Leadership = Database["public"]["Tables"]["leadership"]["Row"] & {
  profiles: { full_name: string; profile_photo_url: string | null } | null;
};

const POSITION_COLORS: Record<string, { pill: string; bar: string }> = {
  President:         { pill: "bg-accent/15 text-accent border-accent/20",           bar: "from-accent to-accent-light"           },
  "Vice President":  { pill: "bg-primary/15 text-primary border-primary/20",        bar: "from-primary to-primary-light"         },
  Secretary:         { pill: "bg-emerald-500/15 text-emerald-700 border-emerald-200", bar: "from-emerald-500 to-emerald-400"      },
  Treasurer:         { pill: "bg-amber-500/15 text-amber-700 border-amber-200",      bar: "from-amber-500 to-amber-400"          },
  "PRO":             { pill: "bg-purple-500/15 text-purple-700 border-purple-200",   bar: "from-purple-500 to-purple-400"        },
};

function getStyle(position: string) {
  return POSITION_COLORS[position] ?? { pill: "bg-primary/10 text-primary border-primary/15", bar: "from-primary to-primary-light" };
}

export function LeadershipCard({ leader, index = 0, featured = false }: { leader: Leadership; index?: number; featured?: boolean }) {
  const style = getStyle(leader.position);

  if (featured) {
    return (
      <AnimateIn variant="fade-up" delay={index * 80}>
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 cursor-default">
          {/* Gradient top bar */}
          <div className={`h-1 w-full bg-gradient-to-r ${style.bar}`} />

          <div className="flex flex-col sm:flex-row items-center gap-6 p-7">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={`absolute -inset-1 rounded-full bg-gradient-to-br ${style.bar} opacity-20 blur-md transition-opacity duration-500 group-hover:opacity-50`} />
              <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-border bg-primary/5">
                {leader.profiles?.profile_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={leader.profiles.profile_photo_url}
                    alt={leader.profiles?.full_name ?? ""}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <User size={38} className="text-primary/30" />
                  </div>
                )}
              </div>
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-success shadow-sm" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${style.pill}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                {leader.position}
              </span>
              <h3 className="mt-2 text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                {leader.profiles?.full_name ?? "—"}
              </h3>
              <p className="mt-0.5 text-xs text-text-secondary">{leader.academic_year}</p>
              {leader.bio && (
                <div className="mt-4 flex gap-2">
                  <Quote size={14} className="shrink-0 text-accent/40 mt-0.5" />
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">{leader.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimateIn>
    );
  }

  return (
    <AnimateIn variant="zoom-in" delay={index * 80}>
      <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 cursor-default">

        {/* Gradient top bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${style.bar} scale-x-0 transition-transform duration-500 group-hover:scale-x-100`} />

        {/* Photo area with gradient bg */}
        <div className="relative w-full bg-gradient-to-b from-background to-white px-8 pt-8 pb-4 flex flex-col items-center">
          {/* Glow ring */}
          <div className={`absolute top-6 left-1/2 -translate-x-1/2 h-28 w-28 rounded-full bg-gradient-to-br ${style.bar} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20`} />

          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-white shadow-md bg-primary/5 transition-all duration-300 group-hover:shadow-xl">
              {leader.profiles?.profile_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={leader.profiles.profile_photo_url}
                  alt={leader.profiles?.full_name ?? ""}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <User size={32} className="text-primary/30" />
                </div>
              )}
            </div>
            <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white bg-success opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-sm" />
          </div>
        </div>

        {/* Content */}
        <div className="w-full px-6 pb-7 text-center">
          <h3 className="font-bold text-text-primary transition-colors group-hover:text-primary text-base">
            {leader.profiles?.full_name ?? "—"}
          </h3>
          <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${style.pill}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {leader.position}
          </span>
          <p className="mt-2 text-xs text-text-secondary">{leader.academic_year}</p>

          {leader.bio && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">{leader.bio}</p>
            </div>
          )}
        </div>
      </div>
    </AnimateIn>
  );
}
