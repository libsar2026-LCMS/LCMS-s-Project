// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { notifyAllOnEventPublish } from "@/actions/admin";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Event — Admin" };

const EVENT_TYPES = ["meeting", "sports", "cultural", "community_service", "social", "other"];
const STATUSES = ["draft", "published", "cancelled"];

// Format datetime for datetime-local input (YYYY-MM-DDTHH:MM)
function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) notFound();

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
          <h1 className="font-display text-2xl font-bold text-text-primary">Edit Event</h1>
          <p className="mt-0.5 text-sm text-text-secondary truncate max-w-xs">{event.title}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <form
          action={async (fd: FormData) => {
            "use server";
            const supabase = await createClient();
            const newStatus = fd.get("status") as string;
            const { data: prev } = await supabase.from("events").select("status, slug").eq("id", id).single();
            await supabase.from("events").update({
              title:                    fd.get("title") as string,
              description:              (fd.get("description") as string) || null,
              event_type:               fd.get("event_type") as string,
              status:                   newStatus,
              start_datetime:           fd.get("start_datetime") as string,
              end_datetime:             (fd.get("end_datetime") as string) || null,
              location:                 (fd.get("location") as string) || null,
              is_registration_required: fd.get("is_registration_required") === "on",
            }).eq("id", id);
            if (prev?.status !== "published" && newStatus === "published") {
              await notifyAllOnEventPublish(id, fd.get("title") as string, prev?.slug ?? "");
            }
            redirect("/admin/events");
          }}
          className="space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Title <span className="text-accent">*</span></label>
            <input
              name="title"
              required
              defaultValue={event.title}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={event.description ?? ""}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">Type</label>
              <select
                name="event_type"
                defaultValue={event.event_type}
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
                defaultValue={event.status}
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
                defaultValue={toDatetimeLocal(event.start_datetime)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-primary">End Date & Time</label>
              <input
                name="end_datetime"
                type="datetime-local"
                defaultValue={toDatetimeLocal(event.end_datetime)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Location</label>
            <input
              name="location"
              defaultValue={event.location ?? ""}
              placeholder="e.g. Kigali Convention Centre"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              name="is_registration_required"
              type="checkbox"
              defaultChecked={event.is_registration_required}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-sm text-text-primary">Require registration to attend</span>
          </label>

          <div className="flex gap-3 pt-1">
            <Link
              href="/admin/events"
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary transition hover:border-primary/30 hover:text-primary"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
