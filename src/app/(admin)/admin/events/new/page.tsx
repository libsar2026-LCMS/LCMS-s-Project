// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

const EVENT_TYPES = ["meeting", "sports", "cultural", "community_service", "social", "other"];
const STATUSES = ["draft", "published"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function NewEventPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    const supabase = createClient();

    const payload = {
      title,
      slug: slugify(title) + "-" + Date.now(),
      description: fd.get("description") as string || null,
      event_type: fd.get("event_type") as string,
      status: fd.get("status") as string,
      start_datetime: fd.get("start_datetime") as string,
      end_datetime: (fd.get("end_datetime") as string) || null,
      location: (fd.get("location") as string) || null,
      is_registration_required: fd.get("is_registration_required") === "on",
    };

    const { error: dbError } = await supabase.from("events").insert(payload);

    if (dbError) {
      setError(dbError.message);
      setPending(false);
      return;
    }

    router.push("/admin/events");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/events"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">New Event</h1>
          <p className="mt-0.5 text-sm text-text-secondary">Create a new community event</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Title <span className="text-accent">*</span></label>
            <input
              name="title"
              required
              placeholder="e.g. Annual General Meeting"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Event details…"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Type</label>
              <select
                name="event_type"
                defaultValue="other"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Status</label>
              <select
                name="status"
                defaultValue="draft"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Start Date & Time <span className="text-accent">*</span></label>
              <input
                name="start_datetime"
                type="datetime-local"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">End Date & Time</label>
              <input
                name="end_datetime"
                type="datetime-local"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Location</label>
            <input
              name="location"
              placeholder="e.g. Kigali Convention Centre"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              name="is_registration_required"
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-text-primary">Require registration to attend</span>
          </label>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Link
              href="/admin/events"
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={pending}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
            >
              <Calendar size={15} />
              {pending ? "Creating…" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
