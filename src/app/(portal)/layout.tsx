import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortalSidebar } from "@/components/layout/PortalSidebar";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileResult, userRowResult, notifResult] = await Promise.all([
    supabase.from("profiles").select("full_name, membership_id, profile_photo_url, membership_status").eq("id", user.id).single(),
    supabase.from("users").select("role").eq("id", user.id).single(),
    supabase.from("notifications").select("*", { count: "exact", head: true }).eq("profile_id", user.id).eq("is_read", false),
  ]);

  const profile = profileResult.data;
  const unreadCount = notifResult.count;

  if ((profile as { membership_status: string } | null)?.membership_status === "pending") {
    redirect("/pending-approval");
  }

  const role = (userRowResult.data as { role: string } | null)?.role ?? "member";
  const isAdmin = ["secretary", "president", "super_admin"].includes(role);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      <PortalSidebar
        fullName={profile?.full_name ?? "Member"}
        membershipId={profile?.membership_id ?? null}
        photoUrl={profile?.profile_photo_url ?? null}
        notificationCount={unreadCount ?? 0}
        isAdmin={isAdmin}
      />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

