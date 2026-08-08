import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

type Event = Database["public"]["Tables"]["events"]["Row"];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("events").select("title").eq("slug", slug).single();
  const row = data as Pick<Event, "title"> | null;
  return { title: row?.title ?? "Event" };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  const event = data as Event | null;
  if (!event) notFound();

  const isUpcoming = new Date(event.start_datetime) > new Date();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/events"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft size={15} /> Back to Events
      </Link>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="relative h-72 bg-gradient-to-br from-primary to-primary-light">
          {event.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.cover_image_url} alt={event.title} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white capitalize mb-3">
              {event.event_type.replace("_", " ")}
            </span>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="p-8">
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <div className="flex items-center gap-3 rounded-xl bg-background p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calendar size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Date</p>
                <p className="text-sm font-semibold text-text-primary">{formatDate(event.start_datetime)}</p>
              </div>
            </div>
            {event.location && (
              <div className="flex items-center gap-3 rounded-xl bg-background p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Location</p>
                  <p className="text-sm font-semibold text-text-primary">{event.location}</p>
                </div>
              </div>
            )}
            {event.max_attendees && (
              <div className="flex items-center gap-3 rounded-xl bg-background p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Capacity</p>
                  <p className="text-sm font-semibold text-text-primary">{event.max_attendees} attendees</p>
                </div>
              </div>
            )}
          </div>

          {event.description && (
            <div className="prose prose-slate max-w-none text-text-secondary leading-relaxed mb-8">
              {event.description.split("\n").map((para: string, i: number) =>
                para.trim() ? <p key={i}>{para}</p> : null
              )}
            </div>
          )}

          {isUpcoming && event.is_registration_required && (
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-text-primary">Registration Required</p>
                <p className="text-sm text-text-secondary mt-0.5">Sign in to register for this event.</p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/25 hover:bg-accent-light transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                Register Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
