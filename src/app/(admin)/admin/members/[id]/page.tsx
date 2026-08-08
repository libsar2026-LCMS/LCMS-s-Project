import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { updateMemberStatus, sendNotification, assignMemberToCommittee } from "@/actions/admin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Member Detail — Admin" };

const STATUSES = ["active", "inactive", "suspended", "alumni"];

const STATUS_STYLES: Record<string, string> = {
  active:    "bg-success/10 text-success",
  pending:   "bg-warning/10 text-warning",
  inactive:  "bg-border text-text-secondary",
  suspended: "bg-accent/10 text-accent",
  alumni:    "bg-blue-50 text-blue-700",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MemberDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const { data: userRow } = await supabase
    .from("users")
    .select("role, created_at")
    .eq("id", id)
    .single();

  const { data: committees } = await supabase
    .from("committees")
    .select("id, name");

  const fields = [
    { label: "Membership ID",   value: profile.membership_id ?? "—" },
    { label: "Gender",          value: profile.gender ?? "—" },
    { label: "Phone",           value: profile.phone ?? "—" },
    { label: "County",          value: profile.county ?? "—" },
    { label: "University",      value: profile.university ?? "—" },
    { label: "Department",      value: profile.department ?? "—" },
    { label: "Academic Level",  value: profile.academic_level ?? "—" },
    { label: "Date Joined",     value: profile.date_joined ? formatDate(profile.date_joined) : "—" },
    { label: "Role",            value: userRow?.role ?? "member" },
    { label: "Emergency Contact", value: profile.emergency_contact_name ?? "—" },
    { label: "Emergency Phone", value: profile.emergency_contact_phone ?? "—" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/members"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-text-secondary transition hover:border-primary/30 hover:text-primary"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">{profile.full_name}</h1>
          <p className="mt-0.5 text-sm text-text-secondary">Member profile</p>
        </div>
        <span className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[profile.membership_status] ?? STATUS_STYLES.active}`}>
          {profile.membership_status}
        </span>
      </div>

      {/* Profile details */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Profile Information</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-text-secondary">{label}</dt>
              <dd className="mt-0.5 text-sm font-medium text-text-primary capitalize">{value}</dd>
            </div>
          ))}
          {(profile.skills ?? []).length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-text-secondary">Skills</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {(profile.skills ?? []).map((s: string) => (
                  <span key={s} className="rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary">{s}</span>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Update status */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Update Status</h2>
        <form
          action={async (fd: FormData) => {
            "use server";
            await updateMemberStatus(id, fd.get("status") as string);
          }}
          className="flex items-end gap-3"
        >
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Membership Status</label>
            <select
              name="status"
              defaultValue={profile.membership_status}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
          >
            Save
          </button>
        </form>
      </div>

      {/* Send notification */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">Send Notification</h2>
        <form
          action={async (fd: FormData) => {
            "use server";
            await sendNotification(
              id,
              fd.get("title") as string,
              fd.get("message") as string,
            );
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Title</label>
            <input
              name="title"
              required
              placeholder="Notification title"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-primary">Message</label>
            <textarea
              name="message"
              rows={3}
              required
              placeholder="Notification message"
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
