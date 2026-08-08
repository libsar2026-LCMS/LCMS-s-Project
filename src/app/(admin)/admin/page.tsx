import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { StatsCard } from "@/components/admin/StatsCard";
import { Users, Calendar, Newspaper, FileText, ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    { count: memberCount },
    { count: eventCount },
    { count: newsCount },
    { count: docCount },
    { data: recentMembers },
    { data: recentEvents },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("news").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("documents").select("*", { count: "exact", head: true }).eq("is_public", true),
    supabase.from("profiles").select("full_name, membership_id, membership_status, university, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("events").select("title, slug, start_datetime, status, event_type").order("created_at", { ascending: false }).limit(5),
  ]);

  const STATUS_STYLES: Record<string, string> = {
    active:   "bg-success/10 text-success",
    pending:  "bg-warning/10 text-warning",
    inactive: "bg-border     text-text-secondary",
  };

  const EVENT_STATUS: Record<string, string> = {
    published: "bg-success/10 text-success",
    draft:     "bg-border     text-text-secondary",
    archived:  "bg-warning/10 text-warning",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Overview</h1>
        <p className="mt-1 text-sm text-text-secondary">Welcome to the LIBSAR admin panel.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Members"      value={memberCount ?? 0} icon={Users}     color="primary" />
        <StatsCard label="Published Events"   value={eventCount  ?? 0} icon={Calendar}  color="accent"  />
        <StatsCard label="Published Articles" value={newsCount   ?? 0} icon={Newspaper} color="success" />
        <StatsCard label="Public Documents"   value={docCount    ?? 0} icon={FileText}  color="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent members */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold text-text-primary">Recent Members</h2>
            <Link href="/admin/members" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-light transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {(recentMembers ?? []).map((m) => (
              <div key={m.membership_id} className="flex items-center gap-3 px-6 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/8 text-sm font-bold text-primary">
                  {m.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{m.full_name}</p>
                  <p className="truncate text-xs text-text-secondary">{m.university ?? "—"}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[m.membership_status] ?? STATUS_STYLES.active}`}>
                  {m.membership_status}
                </span>
              </div>
            ))}
            {(recentMembers ?? []).length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-text-secondary">No members yet.</p>
            )}
          </div>
        </div>

        {/* Recent events */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-semibold text-text-primary">Recent Events</h2>
            <Link href="/admin/events" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-light transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {(recentEvents ?? []).map((e) => (
              <div key={e.slug} className="flex items-center gap-3 px-6 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                  <Calendar size={16} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{e.title}</p>
                  <p className="flex items-center gap-1 text-xs text-text-secondary">
                    <Clock size={10} /> {formatDate(e.start_datetime)}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${EVENT_STATUS[e.status] ?? EVENT_STATUS.draft}`}>
                  {e.status}
                </span>
              </div>
            ))}
            {(recentEvents ?? []).length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-text-secondary">No events yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

