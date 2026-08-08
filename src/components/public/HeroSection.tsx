// @ts-nocheck
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Calendar, Award, Star, Quote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function HeroSection() {
  const supabase = await createClient();

  const [
    { count: memberCount },
    { count: eventCount },
    { count: committeeCount },
    { data: foundedSetting },
    { data: president },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("membership_status", "active"),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("committees").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("settings").select("value").eq("key", "founded_year").single(),
    supabase
      .from("leadership")
      .select("bio, profiles(full_name, profile_photo_url)")
      .eq("position", "President")
      .eq("is_current", true)
      .single(),
  ]);

  const foundedYear = foundedSetting ? String(foundedSetting.value).replace(/^"|"$/g, "") : "—";

  const STATS = [
    { icon: Users,    value: memberCount    ?? 0, label: "Active Members"    },
    { icon: Calendar, value: eventCount     ?? 0, label: "Events Published"  },
    { icon: Award,    value: committeeCount ?? 0, label: "Committees"        },
    { icon: Star,     value: foundedYear,          label: "Year Founded"     },
  ];

  const profile = Array.isArray(president?.profiles)
    ? president.profiles[0]
    : president?.profiles;

  const presidentName: string | null  = profile?.full_name ?? null;
  const presidentPhoto: string | null = profile?.profile_photo_url ?? null;
  const presidentBio: string | null   = president?.bio ?? null;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0F2347] min-h-[92vh] flex items-center">
        {/* Background orbs + dot grid */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#C8102E]/15 blur-[120px] animate-pulse" />
          <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#2E5DA8]/30 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-accent/10 blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
              backgroundSize: "36px 36px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 sm:py-36 lg:px-8 lg:py-44 w-full">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">

            {/* ── Left: text content ── */}
            <div className="max-w-xl">
              {/* Floating badge */}
              <div className="animate-fade-in mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-5 py-2 text-sm text-white/80 backdrop-blur-md shadow-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                Liberians in Rwanda — United, Empowered, Thriving
              </div>

              <h1 className="animate-fade-up font-display text-5xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
                Welcome to{" "}
                <span className="relative inline-block">
                  <span className="text-accent">LIBSAR</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 6C50 2 100 2 198 6"
                      stroke="#C8102E"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="animate-fade-up delay-200 mt-8 max-w-xl text-lg text-white/65 leading-relaxed">
                The official community platform for Liberian students in Nyanza Rwanda. Connect,
                collaborate, and celebrate our shared heritage while building a brighter
                future together.
              </p>

              <div className="animate-fade-up delay-300 mt-10 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-accent/30 transition-all duration-300 hover:bg-accent-light hover:-translate-y-1 hover:shadow-accent/40"
                >
                  Join LIBSAR
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:-translate-y-1"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* ── Right: President's Message Card ── */}
            {presidentName && (
              <div className="w-full sm:max-w-md lg:w-[420px] xl:w-[460px] shrink-0 animate-fade-in delay-400 mx-auto lg:mx-0">
                <div className="animate-float relative">

                  {/* Glow ring behind card */}
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-accent/30 via-transparent to-primary-light/30 blur-xl opacity-70" />

                  <div className="relative rounded-3xl border border-white/20 bg-white/6 backdrop-blur-xl shadow-2xl overflow-hidden">

                    {/* Shimmer sweep */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                      <div className="animate-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                    </div>

                    {/* Liberian flag top bar */}
                    <div className="flex h-1.5 w-full overflow-hidden">
                      {[...Array(11)].map((_, i) => (
                        <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-[#C8102E]" : "bg-white"}`} />
                      ))}
                    </div>

                    {/* Photo + name header */}
                    <div className="relative px-6 pt-6 pb-4">
                      <div className="flex items-center gap-5">
                        {/* Photo with animated glow ring */}
                        <div className="relative shrink-0">
                          <div className="animate-glow h-40 w-40 rounded-full" />
                          <div className="absolute inset-0 h-40 w-40 rounded-full overflow-hidden ring-2 ring-white/30">
                            {presidentPhoto ? (
                              <Image
                                src={presidentPhoto}
                                alt={presidentName}
                                fill
                                className="object-cover"
                                sizes="160px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent to-accent-light text-white font-bold text-4xl">
                                {presidentName.charAt(0)}
                              </div>
                            )}
                          </div>
                          {/* Online indicator */}
                          <span className="absolute bottom-1.5 right-1.5 h-4.5 w-4.5 h-[18px] w-[18px] rounded-full border-2 border-[#0F2347] bg-success" />
                        </div>

                        <div className="min-w-0">
                          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            President
                          </div>
                          <p className="font-display text-xl font-bold leading-tight text-white">{presidentName}</p>
                          <p className="mt-0.5 text-sm text-white/50">LIBSAR Community Rwanda</p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    {/* Quote body */}
                    <div className="px-6 py-6">
                      <Quote size={32} className="mb-3 text-accent/60" />
                      <p className="text-[15px] leading-relaxed text-white/80">
                        {presidentBio ?? "Leading our community with dedication, unity, and a shared vision for a brighter future for all Liberians in Rwanda."}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-white/8 px-6 py-3">
                      <p className="text-[10px] uppercase tracking-widest text-white/30">A message from the president</p>
                      <Link
                        href="/leadership"
                        className="group flex items-center gap-1 text-xs font-semibold text-accent transition-all hover:text-accent-light"
                      >
                        Full profile
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 70L1440 70L1440 0C1200 55 960 70 720 45C480 20 240 0 0 35L0 70Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className="animate-fade-up flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 ring-1 ring-primary/10">
                  <Icon size={22} className="text-primary" />
                </div>
                <p className="text-3xl font-extrabold text-primary tracking-tight">{value}</p>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
