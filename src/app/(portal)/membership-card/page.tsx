// @ts-nocheck
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { PrintCardButton } from "@/components/portal/PrintCardButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Membership Card" };

export default async function MembershipCardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, membership_id, membership_status, university, academic_level, date_joined, profile_photo_url, committee_id")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  const joinYear = profile.date_joined ? new Date(profile.date_joined).getFullYear() : new Date().getFullYear();
  const expiryYear = joinYear + 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Membership Card</h1>
          <p className="mt-1 text-sm text-text-secondary">Your official LIBSAR digital membership card.</p>
        </div>
        <PrintCardButton />
      </div>

      {/* Card */}
      <div className="mx-auto max-w-md" id="membership-card">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2347] via-[#112952] to-[#0a1a35] shadow-2xl shadow-primary/30 print:shadow-none">
          {/* Top stripe — Liberian flag colors */}
          <div className="flex h-2">
            {["#BF0A30", "#FFFFFF", "#BF0A30", "#FFFFFF", "#BF0A30", "#FFFFFF", "#BF0A30", "#FFFFFF", "#BF0A30", "#FFFFFF", "#BF0A30"].map((c, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>

          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div className="relative p-6">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent font-extrabold text-white text-base shadow-lg shadow-accent/40">
                  L
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white leading-none tracking-widest">LIBSAR</p>
                  <p className="text-[9px] text-white/50 leading-none mt-1 tracking-[0.2em] uppercase">Community Rwanda</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                profile.membership_status === "active"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
              }`}>
                {profile.membership_status}
              </span>
            </div>

            {/* Member info */}
            <div className="flex items-center gap-4">
              <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-white/10 ring-2 ring-white/25 shadow-lg">
                {profile.profile_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.profile_photo_url} alt={profile.full_name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5">
                    <User size={28} className="text-white/40" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-display text-[22px] font-bold text-white leading-tight tracking-tight">{profile.full_name}</p>
                {profile.university && (
                  <p className="mt-1 text-[11px] text-white/55 font-medium">{profile.university}</p>
                )}
                {profile.academic_level && (
                  <p className="text-[10px] text-white/40">{profile.academic_level}</p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {/* Footer details */}
            <div className="flex items-end justify-between">
              <div className="space-y-2.5">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/35">Member ID</p>
                  <p className="text-[13px] font-bold text-white font-mono tracking-wider mt-0.5">
                    {profile.membership_id ?? "PENDING"}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/35">Valid Through</p>
                  <p className="text-[13px] font-bold text-white mt-0.5">{expiryYear}</p>
                </div>
              </div>

              {/* QR placeholder */}
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-xl bg-white/10 border border-white/15 shadow-inner">
                <div className="grid grid-cols-3 gap-[3px]">
                  {[1,0,1,0,1,0,1,1,0].map((v, i) => (
                    <div key={i} className={`h-3.5 w-3.5 rounded-[3px] ${v ? "bg-white/60" : "bg-transparent"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stripe */}
          <div className="flex h-1.5">
            {["#BF0A30", "#FFFFFF", "#BF0A30", "#FFFFFF", "#BF0A30", "#FFFFFF", "#BF0A30"].map((c, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-text-secondary">
        This is your official LIBSAR digital membership card. Present it at events and community activities.
      </p>
    </div>
  );
}

