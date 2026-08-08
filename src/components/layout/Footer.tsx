import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight, ExternalLink } from "lucide-react";

const QUICK_LINKS = [
  { href: "/about",      label: "About Us"   },
  { href: "/leadership", label: "Leadership" },
  { href: "/committees", label: "Committees" },
  { href: "/events",     label: "Events"     },
  { href: "/news",       label: "News"       },
  { href: "/gallery",    label: "Gallery"    },
];

const MEMBER_LINKS = [
  { href: "/login",     label: "Member Login" },
  { href: "/register",  label: "Join LIBSAR"  },
  { href: "/documents", label: "Documents"    },
  { href: "/contact",   label: "Contact Us"   },
];

const CONTACT_ITEMS = [
  { icon: Mail,   label: "Email",    value: "libsar2026@gmail.com", href: "mailto:libsar2026@gmail.com" },
  { icon: Phone,  label: "Phone",    value: "+250 000 000 000",     href: "tel:+250000000000"           },
  { icon: MapPin, label: "Location", value: "Nyanza, Rwanda",       href: null                          },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
    filled: true,
  },
  {
    label: "Instagram",
    href: "#",
    path: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M2 6.5A4.5 4.5 0 0 1 6.5 2h11A4.5 4.5 0 0 1 22 6.5v11a4.5 4.5 0 0 1-4.5 4.5h-11A4.5 4.5 0 0 1 2 17.5z",
    filled: false,
  },
  {
    label: "X / Twitter",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    filled: true,
  },
  {
    label: "WhatsApp",
    href: "#",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.859L.054 23.25l5.535-1.453A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z",
    filled: true,
  },
];

export function Footer() {
  return (
    <footer className="relative bg-[#060F1E] text-white overflow-hidden">

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[800px] rounded-full bg-primary-light/10 blur-[80px]" />
      </div>

      {/* Top accent line */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60" />

      {/* CTA strip */}
      <div className="relative border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <p className="text-lg font-bold text-white">Ready to join our community?</p>
              <p className="mt-1 text-sm text-white/50">Connect with Liberians across Rwanda — become a member today.</p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:-translate-y-0.5"
              >
                Join LIBSAR <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">

          {/* Brand — spans 4 cols */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-light font-extrabold text-lg text-white shadow-xl shadow-accent/30 transition-transform group-hover:scale-105">
                L
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
              </div>
              <div>
                <p className="text-base font-extrabold text-white tracking-wide leading-none">LIBSAR</p>
                <p className="text-[10px] text-white/40 leading-none mt-1 tracking-[0.2em] uppercase">Community · Rwanda</p>
              </div>
            </Link>

            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Liberians in Rwanda — United, Empowered, Thriving. Supporting Liberian students
              and residents across Rwanda since 2021.
            </p>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { value: "2021", label: "Founded" },
                { value: "5+",   label: "Committees" },
                { value: "RW",   label: "Rwanda" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3 text-center">
                  <p className="text-base font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/35 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="mt-7 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/50 transition-all hover:border-accent/40 hover:bg-accent/15 hover:text-accent hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={s.filled ? "currentColor" : "none"} stroke={s.filled ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links — spans 2 cols */}
          <div className="lg:col-span-2">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Explore</p>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/55 transition-all hover:text-white"
                  >
                    <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Member Links — spans 2 cols */}
          <div className="lg:col-span-2">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Members</p>
            <ul className="space-y-2.5">
              {MEMBER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/55 transition-all hover:text-white"
                  >
                    <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — spans 4 cols */}
          <div className="lg:col-span-4">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Get in Touch</p>

            <ul className="space-y-3">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      className="group flex items-center gap-3.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 transition-all hover:border-accent/25 hover:bg-accent/8"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-white/30">{label}</p>
                        <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors truncate">{value}</p>
                      </div>
                      <ExternalLink size={12} className="ml-auto shrink-0 text-white/20 group-hover:text-accent transition-colors" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-3.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/30">{label}</p>
                        <p className="text-sm font-medium text-white/70">{value}</p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Office hours badge */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
              <div className="flex h-2 w-2 shrink-0 rounded-full bg-success shadow-[0_0_6px_2px_rgba(22,163,74,0.5)]" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">Office Hours</p>
                <p className="text-sm font-medium text-white/70">Mon – Fri &nbsp;·&nbsp; 9 AM – 5 PM CAT</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} LIBSAR — Liberians in Rwanda. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-white/20">
              <span>Built with</span>
              <span className="text-accent">♥</span>
              <span>for the Liberian community in Rwanda</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
