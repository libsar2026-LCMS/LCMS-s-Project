import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/public/HeroSection";
import { EventCard } from "@/components/public/EventCard";
import { NewsCard } from "@/components/public/NewsCard";
import { LeadershipCard } from "@/components/public/LeadershipCard";
import { AnimateIn } from "@/components/shared/AnimateIn";
import type { Database } from "@/types/database";

type Event = Database["public"]["Tables"]["events"]["Row"];
type News  = Database["public"]["Tables"]["news"]["Row"];

function SectionHeader({ eyebrow, title, href, linkLabel = "View all" }: {
  eyebrow: string; title: string; href?: string; linkLabel?: string;
}) {
  return (
    <AnimateIn variant="fade-up" className="mb-12 flex items-end justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-accent to-accent-light" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition-colors group">
          {linkLabel}
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </AnimateIn>
  );
}

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: events }, { data: news }, { data: leadership }] = await Promise.all([
    supabase.from("events").select("*").eq("status", "published").gte("start_datetime", new Date().toISOString()).order("start_datetime", { ascending: true }).limit(3),
    supabase.from("news").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(3),
    supabase.from("leadership").select("*, profiles(full_name, profile_photo_url)").eq("is_current", true).limit(4),
  ]);

  const leadershipData = leadership;

  return (
    <>
      <HeroSection />

      {/* ── About snippet ── */}
      <section className="relative py-28 bg-white overflow-hidden">
        {/* Subtle background shape */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-background to-transparent" />
        <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/4 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <AnimateIn variant="fade-right" duration={700}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-px w-8 bg-gradient-to-r from-accent to-accent-light" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Who We Are</span>
              </div>
              <h2 className="font-display text-4xl font-bold text-text-primary sm:text-5xl leading-[1.1]">
                Building Community,<br />
                <span className="text-primary">Preserving Heritage</span>
              </h2>
              <p className="mt-6 text-base text-text-secondary leading-relaxed max-w-lg">
                LIBSAR (Liberians in Rwanda) is the official association of Liberian students and
                residents in Rwanda. We foster unity, provide academic support, celebrate Liberian
                culture, and advocate for the welfare of our community members.
              </p>
              <p className="mt-4 text-base text-text-secondary leading-relaxed max-w-lg">
                Founded in 2021 as a chapter under LIBCOR, we have grown into a vibrant community
                across universities and institutions throughout Rwanda.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:-translate-y-0.5"
                >
                  Learn More About Us
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:border-primary hover:text-primary hover:-translate-y-0.5"
                >
                  Get in Touch
                </Link>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Academic Support",  desc: "Scholarships, study groups, and mentorship programs",       icon: "🎓", color: "from-blue-500/10 to-blue-500/5",   border: "hover:border-blue-200"   },
                { label: "Cultural Events",   desc: "Celebrating Liberian heritage through music, food, and art", icon: "🎭", color: "from-purple-500/10 to-purple-500/5", border: "hover:border-purple-200" },
                { label: "Sports & Wellness", desc: "Tournaments, fitness activities, and team building",         icon: "⚽", color: "from-green-500/10 to-green-500/5",  border: "hover:border-green-200"  },
                { label: "Community Welfare", desc: "Emergency support and member assistance programs",           icon: "🤝", color: "from-orange-500/10 to-orange-500/5", border: "hover:border-orange-200" },
              ].map((item, i) => (
                <AnimateIn key={item.label} variant="zoom-in" delay={i * 80}>
                  <div className={`group h-full rounded-2xl border border-border bg-gradient-to-br ${item.color} p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${item.border} cursor-default`}>
                    <div className="mb-4 text-3xl">{item.icon}</div>
                    <div className="mb-3 h-0.5 w-8 rounded-full bg-accent/40 transition-all duration-300 group-hover:w-14 group-hover:bg-accent" />
                    <h4 className="text-sm font-bold text-text-primary">{item.label}</h4>
                    <p className="mt-2 text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="What's On" title="Upcoming Events" href="/events" />
          {events && events.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(events as Event[]).map((event, i) => <EventCard key={event.id} event={event} index={i} />)}
            </div>
          ) : (
            <AnimateIn variant="fade-in">
              <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center">
                <p className="text-4xl mb-4">📅</p>
                <p className="font-semibold text-text-primary">No upcoming events</p>
                <p className="mt-1 text-sm text-text-secondary">Check back soon for new events.</p>
              </div>
            </AnimateIn>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link href="/events" className="text-sm font-semibold text-primary hover:text-primary-light">View all events →</Link>
          </div>
        </div>
      </section>

      {/* ── Latest News ── */}
      <section className="relative py-28 bg-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(27,58,107,0.04),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Stay Informed" title="Latest News" href="/news" />
          {news && news.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(news as News[]).map((item, i) => <NewsCard key={item.id} news={item} index={i} />)}
            </div>
          ) : (
            <AnimateIn variant="fade-in">
              <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center">
                <p className="text-4xl mb-4">📰</p>
                <p className="font-semibold text-text-primary">No news published yet</p>
                <p className="mt-1 text-sm text-text-secondary">Check back soon for updates.</p>
              </div>
            </AnimateIn>
          )}
        </div>
      </section>

      {/* ── Leadership preview ── */}
      {leadershipData && leadershipData.length > 0 && (
        <section className="py-28 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="Our Team" title="Current Leadership" href="/leadership" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {leadershipData.map((leader, i) => <LeadershipCard key={leader.id} leader={leader} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      <section className="relative overflow-hidden bg-[#0B1E3D] py-32">
        {/* Layered glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-primary-light/25 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-[600px] rounded-full bg-accent/8 blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <AnimateIn variant="fade-up" duration={700}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Join Us Today
            </div>
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              Ready to Join Our<br />
              <span className="text-accent">Community?</span>
            </h2>
            <p className="mt-6 text-lg text-white/55 leading-relaxed max-w-xl mx-auto">
              Become a member of LIBSAR and connect with Liberians across Rwanda.
              Together we are stronger.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-accent px-9 py-4 text-sm font-bold text-white shadow-2xl shadow-accent/30 transition-all hover:bg-accent-light hover:-translate-y-1 hover:shadow-accent/40"
              >
                Become a Member
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-9 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:-translate-y-1"
              >
                Contact Us
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
