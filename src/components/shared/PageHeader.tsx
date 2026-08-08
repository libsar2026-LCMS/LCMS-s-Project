import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn("relative overflow-hidden bg-[#0B1E3D] pb-16 pt-20 text-white", className)}>
      {/* Layered glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary-light/25 blur-[70px]" />
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
          <div className="h-px w-10 bg-gradient-to-r from-accent to-accent-light" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent/80">LIBSAR</span>
        </div>
        <h1 className="animate-fade-up font-display text-5xl font-bold leading-tight sm:text-6xl">{title}</h1>
        {subtitle && (
          <p className="animate-fade-up delay-200 mt-5 max-w-2xl text-lg text-white/55 leading-relaxed">{subtitle}</p>
        )}
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 40L1440 40L1440 0C1200 30 960 40 720 25C480 10 240 0 0 20L0 40Z" fill="#F8FAFC" />
        </svg>
      </div>
    </div>
  );
}
