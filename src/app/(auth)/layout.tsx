import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-[#0F2347] p-12">
        {/* Orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary-light/25 blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent font-extrabold text-white shadow-lg shadow-accent/30">
            L
          </div>
          <div>
            <p className="font-bold text-white leading-none tracking-wide">LIBSAR</p>
            <p className="text-[10px] text-white/45 leading-none mt-0.5 tracking-widest uppercase">Community Rwanda</p>
          </div>
        </Link>

        {/* Center content */}
        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Member Portal
          </div>
          <h2 className="font-display text-4xl font-bold text-white leading-tight">
            United,<br />Empowered,<br />
            <span className="text-accent">Thriving.</span>
          </h2>
          <p className="mt-5 text-base text-white/55 leading-relaxed max-w-sm">
            Your gateway to the LIBSAR community — connect with fellow Liberians, manage your
            membership, and stay informed.
          </p>

          {/* Testimonial card */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/70 leading-relaxed italic">
              &ldquo;LIBSAR has been my home away from home. The community support here is
              incredible.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center text-xs font-bold text-white">
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-white/80">LIBSAR Member</p>
                <p className="text-[10px] text-white/45"></p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-xs text-white/30">
          © {new Date().getFullYear()} LIBSAR. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 sm:px-12">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-extrabold text-white text-sm">
            L
          </div>
          <div>
            <p className="font-bold text-primary leading-none">LIBSAR</p>
            <p className="text-[10px] text-text-secondary leading-none mt-0.5 tracking-widest uppercase">Community Rwanda</p>
          </div>
        </Link>

        <div className="w-full max-w-md">
          {children}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
