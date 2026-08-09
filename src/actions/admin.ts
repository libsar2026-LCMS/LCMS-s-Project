"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeCredentials } from "@/lib/email";
import type { Database } from "@/types/database";

const ADMIN_ROLES = ["secretary", "president", "super_admin"];

async function assertSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", supabase: null };
  const { data } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (data?.role !== "super_admin") return { error: "Unauthorized", supabase: null };
  return { error: null, supabase };
}

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", supabase: null };
  const { data } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (!ADMIN_ROLES.includes(data?.role ?? "")) return { error: "Unauthorized", supabase: null };
  return { error: null, supabase };
}

export async function approveMember(profileId: string) {
  const { error, supabase } = await assertAdmin();
  if (error || !supabase) return { error };

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", profileId)
    .single();

  const fullName = profile?.full_name ?? "member";

  const { error: dbError } = await supabase
    .from("profiles")
    .update({ membership_status: "active" })
    .eq("id", profileId);

  if (dbError) return { error: "Failed to approve member." };

  await supabase.from("notifications").insert({
    profile_id: profileId,
    title: "Account Approved!",
    message: `Welcome to LIBSAR, ${fullName}! Your account has been approved. You can now access the Member Portal.`,
    link: "/dashboard",
  });

  revalidatePath("/admin/members");
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRole(userId: string, role: string) {
  const { error, supabase } = await assertSuperAdmin();
  if (error || !supabase) return { error };

  const VALID_ROLES = ["member", "committee_head", "secretary", "president", "super_admin"];
  if (!VALID_ROLES.includes(role)) return { error: "Invalid role" };

  const { error: dbError } = await supabase.from("users").update({ role }).eq("id", userId);
  if (dbError) return { error: "Failed to update role." };
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateMemberStatus(profileId: string, status: string) {
  const { error, supabase } = await assertAdmin();
  if (error || !supabase) return { error };

  const VALID_STATUSES = ["active", "inactive", "suspended", "alumni"];
  if (!VALID_STATUSES.includes(status)) return { error: "Invalid status" };

  const { error: dbError } = await supabase
    .from("profiles")
    .update({ membership_status: status })
    .eq("id", profileId);

  if (dbError) return { error: "Failed to update status." };
  revalidatePath("/admin/users");
  revalidatePath("/admin/members");
  return { success: true };
}

type CreateUserOptions = {
  phone?: string;
  university?: string;
  committeeId?: string;
};

export async function createUserByAdmin(
  email: string,
  fullName: string,
  role: string,
  options: CreateUserOptions = {},
) {
  const { error, supabase } = await assertSuperAdmin();
  if (error || !supabase) return { error };

  const VALID_ROLES = ["member", "committee_head", "secretary", "president", "super_admin"];
  if (!VALID_ROLES.includes(role)) return { error: "Invalid role" };
  if (!email || !fullName) return { error: "Email and name are required." };

  const words = ["Libsar", "Member", "Welcome", "Access"];
  const word = words[Math.floor(Math.random() * words.length)];
  const tempPassword = `${word}${Math.floor(1000 + Math.random() * 9000)}!`;

  const adminClient = createAdminClient();
  const { data, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError) return { error: createError.message };

  if (data?.user?.id) {
    const profileUpdate: Database["public"]["Tables"]["profiles"]["Update"] = {
      membership_status: "active",
      full_name: fullName,
      must_change_password: true,
    };
    if (options.phone)       profileUpdate.phone        = options.phone;
    if (options.university)  profileUpdate.university   = options.university;
    if (options.committeeId) profileUpdate.committee_id = options.committeeId;

    await adminClient.from("profiles").update(profileUpdate).eq("id", data.user.id);

    if (role !== "member") {
      await adminClient.from("users").update({ role }).eq("id", data.user.id);
    }

    await adminClient.from("notifications").insert({
      profile_id: data.user.id,
      title: "Welcome to LIBSAR!",
      message: `Hi ${fullName}, your account has been created. Use the temporary password shared by the admin to sign in, then change it immediately.`,
      link: "/reset-password",
    });

    await sendWelcomeCredentials(email, fullName, tempPassword).catch(() => null);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/members");
  return { success: true, tempPassword, email };
}

export async function sendNotification(profileId: string, title: string, message: string, link?: string) {
  const { error, supabase } = await assertAdmin();
  if (error || !supabase) return { error };

  const { error: dbError } = await supabase.from("notifications").insert({
    profile_id: profileId, title, message: message || null, link: link || null,
  });
  if (dbError) return { error: "Failed to send notification." };
  revalidatePath("/admin/notifications");
  return { success: true };
}

export async function broadcastNotification(title: string, message: string, link?: string, audience: "all" | "admins" = "all") {
  const { error, supabase } = await assertAdmin();
  if (error || !supabase) return { error };

  let profileIds: string[] = [];

  if (audience === "admins") {
    const { data } = await supabase.from("users").select("id").in("role", ADMIN_ROLES);
    profileIds = (data ?? []).map((u) => u.id);
  } else {
    const { data } = await supabase.from("profiles").select("id").eq("membership_status", "active");
    profileIds = (data ?? []).map((p) => p.id);
  }

  if (profileIds.length === 0) return { success: true };

  const rows = profileIds.map((profile_id) => ({
    profile_id, title, message: message || null, link: link || null,
  }));

  const { error: dbError } = await supabase.from("notifications").insert(rows);
  if (dbError) return { error: "Failed to broadcast notification." };
  revalidatePath("/admin/notifications");
  return { success: true };
}

export async function notifyAllOnEventPublish(eventId: string, eventTitle: string, eventSlug: string) {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("id").eq("membership_status", "active");
  if (!profiles?.length) return;

  const rows = profiles.map((p) => ({
    profile_id: p.id,
    title: "New Event: " + eventTitle,
    message: "A new event has been published. Check it out!",
    link: `/events/${eventSlug}`,
  }));
  await supabase.from("notifications").insert(rows);
}

export async function notifyAllOnNewsPublish(newsTitle: string, newsSlug: string) {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("id").eq("membership_status", "active");
  if (!profiles?.length) return;

  const rows = profiles.map((p) => ({
    profile_id: p.id,
    title: "New Article: " + newsTitle,
    message: "A new article has been published. Read it now!",
    link: `/news/${newsSlug}`,
  }));
  await supabase.from("notifications").insert(rows);
}

export async function deleteUser(userId: string) {
  const { error, supabase } = await assertSuperAdmin();
  if (error || !supabase) return { error };

  // Prevent deleting yourself
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.id === userId) return { error: "You cannot delete your own account." };

  const adminClient = createAdminClient();

  // Delete from profiles and users tables first, then auth
  await supabase.from("notifications").delete().eq("profile_id", userId);
  await supabase.from("profiles").delete().eq("id", userId);
  await supabase.from("users").delete().eq("id", userId);
  const { error: authError } = await adminClient.auth.admin.deleteUser(userId);

  if (authError) return { error: authError.message };

  revalidatePath("/admin/users");
  revalidatePath("/admin/members");
  return { success: true };
}

export async function getUsers() {
  const { error, supabase } = await assertSuperAdmin();
  if (error || !supabase) return { error, data: null };

  const adminClient = createAdminClient();
  const [{ data: authList }, { data: userRows }, { data: profiles }] = await Promise.all([
    adminClient.auth.admin.listUsers({ perPage: 1000 }),
    supabase.from("users").select("id, role, created_at").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, membership_status"),
  ]);

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  const authMap = Object.fromEntries((authList?.users ?? []).map((u) => [u.id, u]));

  const merged = (userRows ?? []).map((u) => ({
    id: u.id,
    role: u.role,
    created_at: u.created_at,
    email: authMap[u.id]?.email ?? null,
    full_name: profileMap[u.id]?.full_name ?? null,
    membership_status: profileMap[u.id]?.membership_status ?? null,
  }));

  return { error: null, data: merged };
}

export async function assignMemberToCommittee(profileId: string, committeeId: string | null) {
  const { error, supabase } = await assertAdmin();
  if (error || !supabase) return { error };

  const { error: dbError } = await supabase
    .from("profiles")
    .update({ committee_id: committeeId })
    .eq("id", profileId);

  if (dbError) return { error: "Failed to update committee assignment." };
  revalidatePath("/admin/committees");
  revalidatePath("/admin/members");
  return { success: true };
}

export async function updateSetting(key: string, value: string) {
  const { error, supabase } = await assertSuperAdmin();
  if (error || !supabase) return { error };

  const { data: { user } } = await supabase.auth.getUser();
  const { error: dbError } = await supabase
    .from("settings")
    .upsert({ key, value, updated_by: user!.id }, { onConflict: "key" });

  if (dbError) return { error: "Failed to save setting." };
  revalidatePath("/admin/settings");
  return { success: true };
}
