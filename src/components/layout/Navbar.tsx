"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",           label: "Home"       },
  { href: "/about",      label: "About"      },
  { href: "/leadership", label: "Leadership" },
  { href: "/committees", label: "Committees" },
  { href: "/events",     label: "Events"     },
  { href: "/news",       label: "News"       },
  { href: "/gallery",    label: "Gallery"    },
  { href: "/documents",  label: "Documents"  },
  { href: "/contact",    label: "Contact"    },
];

export function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname              = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-[#0F2347]/95 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "bg-[#0F2347]"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-extrabold text-white text-sm shadow-lg shadow-accent/30 transition-transform group-hover:scale-105">
            L
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-white leading-none tracking-wide">LIBSAR</p>
            <p className="text-[10px] text-white/50 leading-none mt-0.5 tracking-widest uppercase">Community Rwanda</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-white"
                    : "text-white/65 hover:text-white hover:bg-white/8"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-accent/25 transition-all hover:bg-accent-light hover:-translate-y-0.5"
          >
            Member Login
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-[#0F2347] px-4 pb-5 pt-3 animate-fade-in">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm font-medium transition-all animate-fade-up",
                  pathname === link.href
                    ? "bg-white/12 text-white"
                    : "text-white/70 hover:bg-white/8 hover:text-white"
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-lg bg-accent px-4 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-accent-light animate-fade-up"
              style={{ animationDelay: `${NAV_LINKS.length * 40}ms` }}
            >
              Member Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
