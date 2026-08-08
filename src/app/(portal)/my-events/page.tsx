// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, Clock } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "My Events" };

type Event = Database["public"]["Tables"]["events"]["Row"];

export default async function MyEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("event_id, registered_at, attended, events(*)")
    .eq("profile_id", user.id)
    .order("registered_at", { ascending: false });

  const now = new Date();
  const upcoming = (registrations ?? []).filter(
    (r) => r.events && new Date((r.events as Event).start_datetime) >= now
  );
  const past = (registrations ?? []).filter(
    (r) => r.events && new Date((r.events as Event).start_datetime) < now
  );

  function EventRow({ reg }: { reg: typeof registrations extends (infer T)[] | null ? T : never }) {
    const event = reg.events as Event | null;
    if (!event) return null;
    return (
      <Link
        href={`/events/${event.slug}`}
        className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20"
      >
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/8">
          <span className="text-base font-extrabold text-primary leading-none">
            {new Date(event.start_datetime).getDate()}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-accent">
            {new Date(event.start_datetime).toLocaleString("en-US", { month: "short" })}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">{event.title}</p>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Clock size={11} /> {formatDate(event.start_datetime)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                <MapPin size={11} /> {event.location}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
            Registered
          </span>
          {reg.attended && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Attended
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">My Events</h1>
        <p className="mt-1 text-sm text-text-secondary">Events you&apos;ve registered for.</p>
      </div>

      {(registrations ?? []).length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events registered"
          description="Browse upcoming events and register to see them here."
        />
      ) : (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Upcoming</h2>
              <div className="space-y-3">
                {upcoming.map((reg) => <EventRow key={reg.event_id} reg={reg} />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Past</h2>
              <div className="space-y-3">
                {past.map((reg) => <EventRow key={reg.event_id} reg={reg} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

