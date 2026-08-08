"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Variant = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "zoom-in" | "slide-up";

interface AnimateInProps {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;       // ms
  duration?: number;    // ms
  className?: string;
  once?: boolean;
}

const VARIANTS: Record<Variant, { hidden: string; visible: string }> = {
  "fade-up":    { hidden: "opacity-0 translate-y-8",  visible: "opacity-100 translate-y-0" },
  "fade-in":    { hidden: "opacity-0",                visible: "opacity-100"               },
  "fade-left":  { hidden: "opacity-0 translate-x-8",  visible: "opacity-100 translate-x-0" },
  "fade-right": { hidden: "opacity-0 -translate-x-8", visible: "opacity-100 translate-x-0" },
  "zoom-in":    { hidden: "opacity-0 scale-95",        visible: "opacity-100 scale-100"     },
  "slide-up":   { hidden: "opacity-0 translate-y-16", visible: "opacity-100 translate-y-0" },
};

export function AnimateIn({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 600,
  className,
  once = true,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const { hidden, visible: vis } = VARIANTS[variant];

  return (
    <div
      ref={ref}
      className={cn("transition-all ease-out", hidden, visible && vis, className)}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
