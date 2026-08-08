"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileInput } from "@/lib/validations/member";

export async function updateProfile(input: ProfileInput) {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  // Treat empty string as null; normalize enum fields to lowercase
  const payload = {
    ...parsed.data,
    profile_photo_url: parsed.data.profile_photo_url || null,
    gender:            parsed.data.gender?.toLowerCase().replace("prefer not to say", "other") || null,
    academic_level:    parsed.data.academic_level?.toLowerCase().replace("phd", "phd") || null,
    rwanda_province:   parsed.data.rwanda_province || null,
    rwanda_district:   parsed.data.rwanda_district || null,
    rwanda_sector:     parsed.data.rwanda_sector || null,
  };

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id);

  if (error) return { error: "Failed to update profile." };

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return { success: "Profile updated successfully." };
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient();
  await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  revalidatePath("/notifications");
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("notifications").update({ is_read: true }).eq("profile_id", user.id);
  revalidatePath("/notifications");
}

