import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { NotificationList } from "@/components/portal/NotificationList";
import type { Metadata } from "next";
import type { Database } from "@/types/database";

export const metadata: Metadata = { title: "Notifications" };
type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  const notifications = (data as Notification[] | null) ?? [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Notifications</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
        </p>
      </div>
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You'll see updates and announcements here." />
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
}
