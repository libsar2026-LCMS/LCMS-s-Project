import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "accent" | "success" | "warning";
}

const COLOR_MAP = {
  primary: "bg-primary/8  text-primary",
  accent:  "bg-accent/8   text-accent",
  success: "bg-success/8  text-success",
  warning: "bg-warning/8  text-warning",
};

export function StatsCard({ label, value, icon: Icon, trend, color = "primary" }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", COLOR_MAP[color])}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-extrabold text-text-primary tracking-tight">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
    </div>
  );
}
