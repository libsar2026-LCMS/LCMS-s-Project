// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { broadcastNotification, sendNotification } from "@/actions/admin";
import { Bell, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notifications — Admin" };

const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

export default async function AdminNotificationsPage() {
  const supabase = await createClient();

  const [{ data: members }, { data: recent }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, membership_id").eq("membership_status", "active").order("full_name"),
    supabase
      .from("notifications")
      .select("id, title, message, link, created_at, profiles:profile_id(full_name)")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Notifications</h1>
        <p className="mt-1 text-sm text-text-secondary">Send notifications to members or admin staff.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Broadcast */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-text-primary flex items-center gap-2">
            <Send size={16} className="text-primary" /> Broadcast to Group
          </h2>
          <form
            action={async (fd: FormData) => {
              "use server";
              await broadcastNotification(
                fd.get("title") as string,
                fd.get("message") as string,
                (fd.get("link") as string) || undefined,
                fd.get("audience") as "all" | "admins",
              );
              redirect("/admin/notifications");
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Audience</label>
              <select name="audience" className={inputCls}>
                <option value="all">All active members</option>
                <option value="admins">Admins only</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Title <span className="text-accent">*</span></label>
              <input name="title" required placeholder="e.g. Upcoming General Meeting" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Message</label>
              <textarea name="message" rows={3} placeholder="Notification body…" className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Link <span className="text-text-secondary text-xs">(optional)</span></label>
              <input name="link" placeholder="/events/some-event" className={inputCls} />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5">
              <Send size={14} /> Send Broadcast
            </button>
          </form>
        </div>

        {/* Send to individual */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-text-primary flex items-center gap-2">
            <Bell size={16} className="text-accent" /> Send to Member
          </h2>
          <form
            action={async (fd: FormData) => {
              "use server";
              await sendNotification(
                fd.get("profile_id") as string,
                fd.get("title") as string,
                fd.get("message") as string,
                (fd.get("link") as string) || undefined,
              );
              redirect("/admin/notifications");
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Member <span className="text-accent">*</span></label>
              <select name="profile_id" required className={inputCls}>
                <option value="">Select a member…</option>
                {(members ?? []).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name} {m.membership_id ? `(${m.membership_id})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Title <span className="text-accent">*</span></label>
              <input name="title" required placeholder="e.g. Action Required" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Message</label>
              <textarea name="message" rows={3} placeholder="Notification body…" className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">Link <span className="text-text-secondary text-xs">(optional)</span></label>
              <input name="link" placeholder="/profile" className={inputCls} />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-all hover:opacity-90 hover:-translate-y-0.5">
              <Send size={14} /> Send Notification
            </button>
          </form>
        </div>
      </div>

      {/* Recent sent */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-text-primary">Recent Notifications</h2>
          <p className="mt-0.5 text-xs text-text-secondary">Last 50 sent</p>
        </div>
        <div className="divide-y divide-border">
          {(recent ?? []).length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-text-secondary">No notifications sent yet.</p>
          ) : (
            (recent ?? []).map((n) => {
              const recipient = Array.isArray(n.profiles) ? n.profiles[0] : n.profiles;
              return (
                <div key={n.id} className="flex items-start gap-4 px-6 py-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/8">
                    <Bell size={14} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary">{n.title}</p>
                      <span className="rounded-full bg-border px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                        → {recipient?.full_name ?? "Unknown"}
                      </span>
                    </div>
                    {n.message && <p className="mt-0.5 text-xs text-text-secondary line-clamp-1">{n.message}</p>}
                    <p className="mt-1 text-[10px] text-text-secondary/60">{formatDate(n.created_at)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
