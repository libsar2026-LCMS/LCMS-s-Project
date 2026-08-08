import { createClient } from "@/lib/supabase/server";
import ContactForm from "./ContactForm";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("settings").select("key, value").in("key", ["contact_email", "contact_phone"]);
  const map = Object.fromEntries((settings ?? []).map((s) => [s.key, String(s.value).replace(/^"|"$/g, "")]));
  const email = map["contact_email"] || "libsar2026@gmail.com";
  const phone = map["contact_phone"] || "+250 000 000 000";

  const contactItems = [
    { icon: Mail,   label: "Email Us",    value: email,           sub: "We reply within 24 hours",    href: `mailto:${email}`, color: "bg-blue-500/10 text-blue-600 border-blue-100"    },
    { icon: Phone,  label: "Call Us",     value: phone,           sub: "Mon–Fri, 9 AM–5 PM CAT",      href: `tel:${phone}`,    color: "bg-green-500/10 text-green-600 border-green-100"  },
    { icon: MapPin, label: "Find Us",     value: "Nyanza, Rwanda",sub: "Southern Province, Rwanda",   href: null,              color: "bg-accent/10 text-accent border-accent/20"        },
    { icon: Clock,  label: "Office Hours",value: "Mon – Fri",     sub: "9:00 AM – 5:00 PM (CAT)",     href: null,              color: "bg-amber-500/10 text-amber-600 border-amber-100"  },
  ];

  return (
    <>
      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-[#0B1E3D] py-24 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary-light/20 blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-right mb-5 flex items-center gap-3">
            <div className="h-px w-10 bg-accent" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent/80">Contact</span>
          </div>
          <h1 className="animate-fade-up font-display text-5xl font-bold sm:text-6xl leading-tight">
            Get in Touch
          </h1>
          <p className="animate-fade-up delay-200 mt-5 max-w-xl text-lg text-white/55 leading-relaxed">
            Have a question or want to connect? We&apos;d love to hear from you.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 40L1440 40L1440 0C1200 30 960 40 720 25C480 10 240 0 0 20L0 40Z" fill="#F8FAFC" />
          </svg>
        </div>
      </div>

      {/* ── Contact cards ── */}
      <section className="bg-background pt-16 pb-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactItems.map(({ icon: Icon, label, value, sub, href, color }, i) => (
              <AnimateIn key={label} variant="fade-up" delay={i * 80}>
                {href ? (
                  <a href={href} className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${color} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">{label}</p>
                      <p className="mt-1 font-semibold text-text-primary">{value}</p>
                      <p className="mt-0.5 text-xs text-text-secondary">{sub}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">{label}</p>
                      <p className="mt-1 font-semibold text-text-primary">{value}</p>
                      <p className="mt-0.5 text-xs text-text-secondary">{sub}</p>
                    </div>
                  </div>
                )}
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">

            {/* Form — 3 cols */}
            <AnimateIn variant="fade-right" className="lg:col-span-3">
              <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-text-primary">Send us a Message</h2>
                <p className="mt-2 text-sm text-text-secondary">Fill in the form and we&apos;ll get back to you as soon as possible.</p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </AnimateIn>

            {/* Map / info — 2 cols */}
            <AnimateIn variant="fade-left" className="lg:col-span-2 flex flex-col gap-6">
              {/* Map placeholder */}
              <div className="relative flex-1 min-h-[260px] overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
                    <MapPin size={28} className="text-accent" />
                  </div>
                  <p className="font-bold text-text-primary text-lg">Nyanza District</p>
                  <p className="mt-1 text-sm text-text-secondary">Southern Province, Rwanda</p>
                  <a
                    href="https://maps.google.com/?q=Nyanza,Rwanda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-light hover:-translate-y-0.5"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>

              {/* Quick info card */}
              <div className="rounded-3xl border border-border bg-white p-7 shadow-sm">
                <h3 className="font-bold text-text-primary mb-5">Quick Info</h3>
                <div className="space-y-4">
                  {[
                    { label: "Response Time", value: "Within 24 hours" },
                    { label: "Language",       value: "English" },
                    { label: "Community",      value: "Liberians in Rwanda" },
                    { label: "Founded",        value: "2021" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                      <span className="text-sm text-text-secondary">{label}</span>
                      <span className="text-sm font-semibold text-text-primary">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </>
  );
}
