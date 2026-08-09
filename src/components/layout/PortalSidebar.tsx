"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, CreditCard, Calendar,
  Bell, LogOut, Menu, X, ChevronRight, ShieldCheck, Images,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth";

const NAV = [
  { href: "/dashboard",       icon: LayoutDashboard, label: "Dashboard"       },
  { href: "/profile",         icon: User,            label: "My Profile"      },
  { href: "/membership-card", icon: CreditCard,      label: "Membership Card" },
  { href: "/my-events",       icon: Calendar,        label: "My Events"       },
  { href: "/gallery",         icon: Images,          label: "Gallery"         },
  { href: "/notifications",   icon: Bell,            label: "Notifications"   },
];

interface Props {
  fullName: string;
  membershipId: string | null;
  photoUrl: string | null;
  notificationCount?: number;
  isAdmin?: boolean;
}

interface NavContentProps extends Props {
  pathname: string;
  pending: boolean;
  onClose: () => void;
  onLogout: () => void;
}

function NavContent({ fullName, membershipId, photoUrl, notificationCount = 0, isAdmin = false, pathname, pending, onClose, onLogout }: NavContentProps) {
  return (
    <>
      {/* User info */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/10">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={fullName} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-primary">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">{fullName}</p>
          <p className="truncate text-xs text-text-secondary">{membershipId ?? "Member"}</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          const isBell = href === "/notifications";
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text-secondary hover:bg-border/60 hover:text-text-primary"
              )}
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {isBell && notificationCount > 0 && (
                <span className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                  active ? "bg-white text-primary" : "bg-accent text-white"
                )}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
              {active && <ChevronRight size={14} className="shrink-0 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-border space-y-1">
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-accent transition-all hover:bg-accent/8"
          >
            <ShieldCheck size={17} /> Admin Panel
          </Link>
        )}
        <button
          onClick={onLogout}
          disabled={pending}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-all hover:bg-accent/8 hover:text-accent disabled:opacity-50"
        >
          <LogOut size={17} />
          {pending ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </>
  );
}

export function PortalSidebar({ fullName, membershipId, photoUrl, notificationCount = 0, isAdmin = false }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();

  function handleLogout() {
    startTransition(async () => {
      const result = await logout();
      window.location.href = result.redirect ?? "/login";
    });
  }

  const navProps = { fullName, membershipId, photoUrl, notificationCount, isAdmin, pathname, pending, onClose: () => setOpen(false), onLogout: handleLogout };

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-extrabold text-white">L</div>
          <span className="font-bold text-primary text-sm">LIBSAR</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-text-secondary hover:bg-border/60 hover:text-text-primary transition-colors"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface p-5 flex flex-col shadow-2xl">
            <NavContent {...navProps} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface p-5">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-extrabold text-white text-sm shadow-md shadow-accent/25">L</div>
          <div>
            <p className="font-bold text-primary leading-none text-sm">LIBSAR</p>
            <p className="text-[10px] text-text-secondary leading-none mt-0.5 tracking-widest uppercase">Member Portal</p>
          </div>
        </Link>
        <NavContent {...navProps} />
      </aside>
    </>
  );
}
