"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "emerald" | "indigo" | "outline" | "ghost";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-mono font-medium transition-colors",
        size === "sm" && "px-2.5 py-0.5 text-[11px] tracking-wide",
        size === "md" && "px-3 py-1 text-xs tracking-wide",
        variant === "default" &&
          "bg-surface-alt text-text-secondary border border-border",
        variant === "emerald" &&
          "bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20",
        variant === "indigo" &&
          "bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20",
        variant === "outline" &&
          "border border-border text-text-secondary bg-transparent",
        variant === "ghost" &&
          "bg-surface-alt/60 text-text-secondary border-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}
