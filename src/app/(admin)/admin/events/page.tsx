// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Events — Admin" };

const STATUS_STYLES: Record<string, string> = {
  published: "bg-success/10 text-success",
  draft:     "bg-border     text-text-secondary",
  archived:  "bg-warning/10 text-warning",
};

const TYPE_STYLES: Record<string, string> = {
  meeting:           "bg-blue-50   text-blue-700",
  sports:            "bg-green-50  text-green-700",
  cultural:          "bg-purple-50 text-purple-700",
  community_service: "bg-orange-50 text-orange-700",
  social:            "bg-pink-50   text-pink-700",
  other:             "bg-gray-50   text-gray-700",
};

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: events, count } = await supabase
    .from("events")
    .select("id, title, slug, event_type, status, start_datetime, location", { count: "exact" })
    .order("start_datetime", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Events</h1>
          <p className="mt-1 text-sm text-text-secondary">{count ?? 0} total events</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
        >
          <Plus size={15} /> New Event
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Event</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary sm:table-cell">Type</th>
                <th className="hidden px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary md:table-cell">Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(events ?? []).map((e) => (
                <tr key={e.id} className="transition-colors hover:bg-background/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                        <Calendar size={15} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{e.title}</p>
                        {e.location && <p className="text-xs text-text-secondary">{e.location}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 sm:table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${TYPE_STYLES[e.event_type] ?? TYPE_STYLES.other}`}>
                      {e.event_type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-text-secondary md:table-cell">{formatDate(e.start_datetime)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[e.status] ?? STATUS_STYLES.draft}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/events/${e.id}`} className="text-xs font-medium text-primary hover:text-primary-light transition-colors">
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
              {(events ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-text-secondary">
                    <Calendar size={32} className="mx-auto mb-3 text-border" />
                    No events yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

