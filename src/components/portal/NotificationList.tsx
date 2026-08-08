"use client";

import { useTransition } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { markNotificationRead, markAllNotificationsRead } from "@/actions/members";
import { CheckCheck } from "lucide-react";
import type { Database } from "@/types/database";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const [isPending, startTransition] = useTransition();
  const hasUnread = notifications.some((n) => !n.is_read);

  function handleMarkAll() {
    startTransition(() => markAllNotificationsRead());
  }

  function handleMarkOne(id: string) {
    startTransition(() => markNotificationRead(id));
  }

  return (
    <div className="space-y-4">
      {hasUnread && (
        <div className="flex justify-end">
          <button
            onClick={handleMarkAll}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-medium text-text-secondary shadow-sm transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
          >
            <CheckCheck size={14} /> Mark all as read
          </button>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`group relative rounded-2xl border p-5 transition-all ${
              n.is_read
                ? "border-border bg-surface"
                : "border-primary/15 bg-primary/4 shadow-sm"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${n.is_read ? "bg-border" : "bg-accent"}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${n.is_read ? "text-text-primary" : "text-text-primary"}`}>
                  {n.title}
                </p>
                {n.message && (
                  <p className="mt-1 text-sm text-text-secondary leading-relaxed">{n.message}</p>
                )}
                <div className="mt-2 flex items-center gap-3">
                  <p className="text-xs text-text-secondary/60">{formatDate(n.created_at)}</p>
                  {n.link && (
                    <Link href={n.link} className="text-xs font-medium text-primary hover:text-primary-light transition-colors">
                      View →
                    </Link>
                  )}
                </div>
              </div>
              {!n.is_read && (
                <button
                  onClick={() => handleMarkOne(n.id)}
                  disabled={isPending}
                  className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-text-secondary opacity-0 transition-all group-hover:opacity-100 hover:bg-border hover:text-text-primary disabled:opacity-50"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
