"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Calendar, Newspaper, Images,
  FileText, Award, UsersRound, ShieldCheck, Settings,
  LogOut, Menu, X, ChevronRight, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth";

const NAV = [
  { href: "/admin",            icon: LayoutDashboard, label: "Overview",      superAdminOnly: false },
  { href: "/admin/members",    icon: Users,           label: "Members",       superAdminOnly: false },
  { href: "/admin/events",     icon: Calendar,        label: "Events",        superAdminOnly: false },
  { href: "/admin/news",       icon: Newspaper,       label: "News",          superAdminOnly: false },
  { href: "/admin/gallery",    icon: Images,          label: "Gallery",       superAdminOnly: false },
  { href: "/admin/documents",  icon: FileText,        label: "Documents",     superAdminOnly: false },
  { href: "/admin/leadership", icon: Award,           label: "Leadership",    superAdminOnly: false },
  { href: "/admin/committees", icon: UsersRound,      label: "Committees",    superAdminOnly: false },
  { href: "/admin/notifications", icon: Bell,         label: "Notifications", superAdminOnly: false },
  { href: "/admin/users",      icon: ShieldCheck,     label: "Users",         superAdminOnly: true  },
  { href: "/admin/settings",   icon: Settings,        label: "Settings",      superAdminOnly: true  },
];

interface Props {
  fullName: string;
  role: string;
  photoUrl: string | null;
}

interface NavContentProps extends Props {
  pathname: string;
  pending: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function NavContent({ fullName, role, photoUrl, pathname, pending, onClose, onLogout }: NavContentProps) {
  return (
    <>
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10 ring-2 ring-white/15">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white/70">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{fullName}</p>
          <span className="inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold capitalize text-accent">
            {role.replace("_", " ")}
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.filter(({ superAdminOnly }) => !superAdminOnly || role === "super_admin").map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:bg-white/8 hover:text-white"
              )}
            >
              <Icon size={16} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="shrink-0 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <button
          onClick={onLogout}
          disabled={pending}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/45 transition-all hover:bg-white/8 hover:text-white disabled:opacity-50"
        >
          <LogOut size={16} /> {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </>
  );
}

export function AdminSidebar({ fullName, role, photoUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    startTransition(async () => {
      await logout();
      router.push("/login");
    });
  }

  const navProps = { fullName, role, photoUrl, pathname, pending, onClose: () => setOpen(false), onLogout: handleLogout };

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-[#0F2347] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-extrabold text-white">L</div>
          <span className="font-bold text-white text-sm">Admin</span>
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0F2347] p-5 flex flex-col shadow-2xl">
            <NavContent {...navProps} />
          </div>
        </div>
      )}

      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-[#0F2347] p-5">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-extrabold text-white text-sm shadow-md shadow-accent/30">L</div>
          <div>
            <p className="font-bold text-white leading-none text-sm tracking-wide">LIBSAR</p>
            <p className="text-[10px] text-white/40 leading-none mt-0.5 tracking-widest uppercase">Admin Panel</p>
          </div>
        </Link>
        <NavContent {...navProps} />
      </aside>
    </>
  );
}
