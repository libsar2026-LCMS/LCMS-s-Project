import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { EventCard } from "@/components/public/EventCard";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Calendar } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Events" };

type Event = Database["public"]["Tables"]["events"]["Row"];

export default async function EventsPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const [{ data: upcoming }, { data: past }] = await Promise.all([
    supabase.from("events").select("*").eq("status", "published").gte("start_datetime", now).order("start_datetime", { ascending: true }),
    supabase.from("events").select("*").eq("status", "published").lt("start_datetime", now).order("start_datetime", { ascending: false }).limit(6),
  ]);

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Stay up to date with everything happening in the LIBSAR community."
      />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-20">

        {/* Upcoming */}
        <section>
          <AnimateIn variant="fade-up" className="mb-10 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Calendar size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">What&apos;s On</p>
              <h2 className="text-2xl font-bold text-text-primary">Upcoming Events</h2>
            </div>
          </AnimateIn>

          {upcoming && upcoming.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(upcoming as Event[]).map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
            </div>
          ) : (
            <AnimateIn variant="fade-in">
              <div className="rounded-3xl border-2 border-dashed border-border py-20 text-center">
                <p className="text-5xl mb-4">📅</p>
                <p className="font-bold text-text-primary">No upcoming events</p>
                <p className="mt-1.5 text-sm text-text-secondary">Check back soon — new events are added regularly.</p>
              </div>
            </AnimateIn>
          )}
        </section>

        {/* Past */}
        {past && past.length > 0 && (
          <section>
            <AnimateIn variant="fade-up" className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-border" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">Archive</span>
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Past Events</h2>
            </AnimateIn>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-80">
              {(past as Event[]).map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
