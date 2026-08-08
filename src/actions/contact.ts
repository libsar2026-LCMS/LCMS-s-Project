"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";

export async function submitContact(input: ContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(parsed.data);
  if (error) return { error: "Failed to send message. Please try again." };

  return { success: "Your message has been sent. We'll get back to you soon!" };
}

