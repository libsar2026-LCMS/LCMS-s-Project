import Link from "next/link";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AnimateIn } from "@/components/shared/AnimateIn";
import type { Database } from "@/types/database";

type Event = Database["public"]["Tables"]["events"]["Row"];

const TYPE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  meeting:           { bg: "bg-blue-500/20",   text: "text-blue-200",   dot: "bg-blue-400"   },
  sports:            { bg: "bg-green-500/20",  text: "text-green-200",  dot: "bg-green-400"  },
  cultural:          { bg: "bg-purple-500/20", text: "text-purple-200", dot: "bg-purple-400" },
  community_service: { bg: "bg-orange-500/20", text: "text-orange-200", dot: "bg-orange-400" },
  social:            { bg: "bg-pink-500/20",   text: "text-pink-200",   dot: "bg-pink-400"   },
  other:             { bg: "bg-white/15",       text: "text-white/70",   dot: "bg-white/50"   },
};

export function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const date  = new Date(event.start_datetime);
  const day   = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const style = TYPE_STYLES[event.event_type] ?? TYPE_STYLES.other;

  return (
    <AnimateIn variant="fade-up" delay={index * 100}>
      <Link href={`/events/${event.slug}`} className="group block h-full">
        <div className="h-full overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/15">

          {/* Cover image */}
          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary to-primary-light">
            {event.cover_image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.cover_image_url}
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Date badge */}
            <div className="absolute top-4 left-4 flex flex-col items-center rounded-2xl bg-white px-3.5 py-2.5 text-center shadow-lg min-w-[52px] transition-transform duration-300 group-hover:scale-105">
              <span className="text-2xl font-extrabold text-primary leading-none">{day}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-accent mt-0.5">{month}</span>
            </div>

            {/* Type badge */}
            <div className={`absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text} backdrop-blur-sm`}>
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {event.event_type.replace("_", " ")}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors leading-snug text-base">
              {event.title}
            </h3>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Clock size={13} className="shrink-0 text-primary/50" />
                {formatDate(event.start_datetime)}
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <MapPin size={13} className="shrink-0 text-primary/50" />
                  {event.location}
                </div>
              )}
            </div>
            <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2">
              View details <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </Link>
    </AnimateIn>
  );
}
