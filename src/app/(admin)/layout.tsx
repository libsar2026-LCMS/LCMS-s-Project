import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

const ADMIN_ROLES = ["secretary", "president", "super_admin"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [userRowResult, profileResult] = await Promise.all([
    supabase.from("users").select("role").eq("id", user.id).single(),
    supabase.from("profiles").select("full_name, profile_photo_url").eq("id", user.id).single(),
  ]);

  const role = (userRowResult.data as { role: string } | null)?.role ?? "member";
  if (!ADMIN_ROLES.includes(role)) redirect("/unauthorized");

  const profile = profileResult.data;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-background">
      <AdminSidebar
        fullName={profile?.full_name ?? "Admin"}
        role={role}
        photoUrl={profile?.profile_photo_url ?? null}
      />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

