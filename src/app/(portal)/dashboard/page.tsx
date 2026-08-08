import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, Bell, CreditCard, ArrowRight, MapPin, Clock } from "lucide-react";
import type { Database } from "@/types/database";

type Event        = Database["public"]["Tables"]["events"]["Row"];
type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: events }, { data: notifications }, { data: registrations }] =
    await Promise.all([
      supabase.from("profiles").select("full_name, membership_id, membership_status, date_joined, phone").eq("id", user.id).single(),
      supabase.from("events").select("*").eq("status", "published").gte("start_datetime", new Date().toISOString()).order("start_datetime", { ascending: true }).limit(3),
      supabase.from("notifications").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("event_registrations").select("event_id").eq("profile_id", user.id),
    ]);

  const registeredIds = new Set((registrations ?? []).map((r) => r.event_id));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const STATUS_STYLES: Record<string, string> = {
    active:   "bg-success/10 text-success",
    pending:  "bg-warning/10 text-warning",
    inactive: "bg-border text-text-secondary",
  };

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0F2347] p-7 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-light/20 blur-3xl" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-white/60">{greeting} 👋</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              {profile?.full_name ?? "Member"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {profile?.membership_id && (
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  ID: {profile.membership_id}
                </span>
              )}
              {profile?.phone && (
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  {profile.phone}
                </span>
              )}
              <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[profile?.membership_status ?? "active"] ?? STATUS_STYLES.active}`}>
                {profile?.membership_status ?? "active"}
              </span>
            </div>
          </div>
          <Link
            href="/membership-card"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 whitespace-nowrap"
          >
            <CreditCard size={16} /> View Card
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Events Registered", value: registeredIds.size, icon: Calendar, color: "bg-primary/8 text-primary" },
          { label: "Notifications",     value: (notifications ?? []).filter(n => !n.is_read).length, icon: Bell, color: "bg-accent/8 text-accent" },
          { label: "Member Since",      value: profile?.date_joined ? new Date(profile.date_joined).getFullYear() : "—", icon: CreditCard, color: "bg-success/8 text-success" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-extrabold text-text-primary">{value}</p>
            <p className="mt-0.5 text-xs text-text-secondary">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming events */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">Upcoming Events</h2>
            <Link href="/my-events" className="text-xs font-medium text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {events && events.length > 0 ? (
            <div className="space-y-3">
              {(events as Event[]).map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group flex items-start gap-3 rounded-xl border border-border p-3.5 transition-all hover:border-primary/30 hover:bg-primary/3"
                >
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/8 text-center">
                    <span className="text-sm font-extrabold text-primary leading-none">
                      {new Date(event.start_datetime).getDate()}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-accent">
                      {new Date(event.start_datetime).toLocaleString("en-US", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {event.title}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span className="flex items-center gap-1 text-xs text-text-secondary">
                        <Clock size={10} /> {formatDate(event.start_datetime)}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1 text-xs text-text-secondary">
                          <MapPin size={10} /> {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  {registeredIds.has(event.id) && (
                    <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                      Registered
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-text-secondary">No upcoming events.</p>
          )}
        </div>

        {/* Recent notifications */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">Notifications</h2>
            <Link href="/notifications" className="text-xs font-medium text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {notifications && notifications.length > 0 ? (
            <div className="space-y-2">
              {(notifications as Notification[]).map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl p-3.5 transition-colors ${n.is_read ? "bg-background" : "bg-primary/5 border border-primary/10"}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${n.is_read ? "bg-border" : "bg-accent"}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">{n.title}</p>
                      {n.message && <p className="mt-0.5 text-xs text-text-secondary line-clamp-1">{n.message}</p>}
                      <p className="mt-1 text-[10px] text-text-secondary/60">{formatDate(n.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-text-secondary">No notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

