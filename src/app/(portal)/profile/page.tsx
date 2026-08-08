import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/portal/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">My Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage your personal information and settings.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-7 shadow-sm">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
