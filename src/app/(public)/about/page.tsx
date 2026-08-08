import { AnimateIn } from "@/components/shared/AnimateIn";
import { PageHeader } from "@/components/shared/PageHeader";
import { Target, Eye, Heart, Users, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

const VALUES = [
  { icon: Users,  title: "Unity",     color: "bg-blue-500/10 text-blue-600 border-blue-100",   desc: "We stand together as one Liberian family, supporting each other through every challenge and celebrating every success." },
  { icon: Heart,  title: "Welfare",   color: "bg-rose-500/10 text-rose-600 border-rose-100",    desc: "The well-being of every member is our priority. We provide support systems for academic, social, and personal needs." },
  { icon: Target, title: "Excellence",color: "bg-amber-500/10 text-amber-600 border-amber-100", desc: "We strive for academic and professional excellence, pushing each other to reach our highest potential." },
  { icon: Eye,    title: "Heritage",  color: "bg-emerald-500/10 text-emerald-600 border-emerald-100", desc: "We proudly preserve and celebrate Liberian culture, traditions, and identity while embracing our Rwandan home." },
];

const MILESTONES = [
  { year: "2021", title: "LIBSAR Founded", desc: "A small group of Liberian students established LIBSAR as a chapter under LIBCOR in Rwanda." },
  { year: "2022", title: "Five Committees Formed", desc: "Academic, Sports, Cultural, Welfare, and ICT committees were officially constituted." },
  { year: "2023", title: "Embassy Recognition", desc: "LIBSAR was formally recognized by the Liberian Embassy as the official student body in Rwanda." },
  { year: "2026", title: "Digital Platform", desc: "Launched the LCMS digital platform to better serve and connect our growing membership." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About LIBSAR"
        subtitle="Learn about our mission, vision, and the values that drive our community forward."
      />

      {/* ── Mission & Vision ── */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <AnimateIn variant="fade-right" duration={700}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-white p-10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-primary-light" />
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                  <Target size={26} className="text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">Our Mission</h2>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  To unite Liberian students and residents in Rwanda by fostering a strong sense of
                  community, providing academic and social support, preserving our cultural heritage,
                  and advocating for the welfare of our members.
                </p>
                <ul className="mt-6 space-y-2.5">
                  {["Foster unity among Liberians in Rwanda", "Provide academic & social support", "Preserve Liberian cultural heritage"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
                      <CheckCircle size={15} className="shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>

            <AnimateIn variant="fade-left" duration={700}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-white p-10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent to-accent-light" />
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/15">
                  <Eye size={26} className="text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">Our Vision</h2>
                <p className="mt-4 text-text-secondary leading-relaxed">
                  To be the leading Liberian diaspora organization in East Africa — a thriving,
                  empowered community that bridges the gap between Liberia and Rwanda while
                  contributing meaningfully to both nations.
                </p>
                <ul className="mt-6 space-y-2.5">
                  {["Leading diaspora org in East Africa", "Bridge Liberia and Rwanda", "Empower every member to thrive"].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
                      <CheckCircle size={15} className="shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(27,58,107,0.04),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn variant="fade-up">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our Story</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent" />
            </div>
            <h2 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">From Humble Beginnings</h2>
            <p className="mt-8 text-base text-text-secondary leading-relaxed">
              LIBSAR was founded in 2021 as a chapter under LIBCOR by a small group of Liberian
              students who recognized the need for a formal community structure to support their fellow
              Liberians in Rwanda. What began as informal gatherings has grown into a structured
              organization with five active committees and a rich calendar of events throughout the year.
            </p>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Today, LIBSAR serves as the official voice of the Liberian community in Rwanda,
              maintaining relationships with the Liberian Embassy, Rwandan institutions, and
              international diaspora organizations.
            </p>
          </AnimateIn>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-border via-primary/20 to-transparent hidden sm:block" />
          <div className="space-y-10">
            {MILESTONES.map((m, i) => (
              <AnimateIn key={m.year} variant={i % 2 === 0 ? "fade-right" : "fade-left"} delay={i * 100}>
                <div className={`flex items-start gap-6 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-2">{m.year}</span>
                      <h3 className="font-bold text-text-primary">{m.title}</h3>
                      <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex shrink-0 h-4 w-4 rounded-full bg-accent ring-4 ring-accent/20 mt-8 relative z-10" />
                  <div className="flex-1 hidden sm:block" />
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimateIn variant="fade-up" className="mb-14 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">What We Stand For</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-accent" />
            </div>
            <h2 className="font-display text-4xl font-bold text-text-primary sm:text-5xl">Our Core Values</h2>
          </AnimateIn>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
              <AnimateIn key={title} variant="zoom-in" delay={i * 80}>
                <div className="group h-full rounded-3xl border border-border bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default">
                  <div className={`mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">{title}</h3>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-[#0B1E3D] py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary-light/20 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <AnimateIn variant="fade-up">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Be Part of Our Story</h2>
            <p className="mt-4 text-base text-white/55 leading-relaxed">
              Join hundreds of Liberians building community, preserving heritage, and thriving together in Rwanda.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-accent/30 transition-all hover:bg-accent-light hover:-translate-y-0.5"
              >
                Join LIBSAR <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:-translate-y-0.5"
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
