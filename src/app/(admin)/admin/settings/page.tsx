// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import type { Metadata } from "next";
import { updateSetting } from "@/actions/admin";

export const metadata: Metadata = { title: "Settings — Admin" };

const DEFAULT_KEYS = [
  { key: "site_name",     label: "Site Name",       placeholder: "LIBSAR" },
  { key: "contact_email", label: "Contact Email",   placeholder: "info@libsar.rw" },
  { key: "founded_year",  label: "Founded Year",    placeholder: "2015" },
  { key: "facebook_url",  label: "Facebook URL",    placeholder: "https://facebook.com/..." },
  { key: "instagram_url", label: "Instagram URL",   placeholder: "https://instagram.com/..." },
  { key: "twitter_url",   label: "Twitter/X URL",   placeholder: "https://x.com/..." },
];

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: currentUser } = await supabase.from("users").select("role").eq("id", user.id).single();
  const isSuperAdmin = (currentUser as { role: string } | null)?.role === "super_admin";
  if (!isSuperAdmin) redirect("/unauthorized");

  const { data: settings } = await supabase.from("settings").select("key, value, updated_at").order("key");
  const settingsMap = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Settings</h1>
        <p className="mt-1 text-sm text-text-secondary">System configuration. Super Admin only.</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface shadow-sm divide-y divide-border">
        {DEFAULT_KEYS.map(({ key, label, placeholder }) => (
          <form
            key={key}
            action={async (fd: FormData) => {
              "use server";
              await updateSetting(key, fd.get("value") as string);
            }}
            className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <label className="w-40 shrink-0 text-sm font-medium text-text-primary">{label}</label>
            <input
              name="value"
              defaultValue={settingsMap[key] != null ? String(settingsMap[key]) : ""}
              placeholder={placeholder}
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-light"
            >
              Save
            </button>
          </form>
        ))}
      </div>

      {/* Raw / extra settings */}
      {(settings ?? []).filter((s) => !DEFAULT_KEYS.find((d) => d.key === s.key)).length > 0 && (
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          <p className="border-b border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Other Settings
          </p>
          <div className="divide-y divide-border">
            {(settings ?? [])
              .filter((s) => !DEFAULT_KEYS.find((d) => d.key === s.key))
              .map((s) => (
                <form
                  key={s.key}
                  action={async (fd: FormData) => {
                    "use server";
                    await updateSetting(s.key, fd.get("value") as string);
                  }}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <p className="w-40 shrink-0 font-mono text-sm font-semibold text-text-primary">{s.key}</p>
                  <input
                    name="value"
                    defaultValue={typeof s.value === "object" ? JSON.stringify(s.value) : String(s.value)}
                    className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-light"
                  >
                    Save
                  </button>
                </form>
              ))}
          </div>
        </div>
      )}

      {(settings ?? []).length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-border bg-surface">
          <Settings size={36} className="mb-3 text-border" />
          <p className="text-sm text-text-secondary">No settings yet. Use the form above to add them.</p>
        </div>
      )}
    </div>
  );
}
