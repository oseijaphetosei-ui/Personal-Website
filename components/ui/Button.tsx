"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  external?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className,
  external = false,
  disabled = false,
  type = "button",
  icon,
  iconRight,
}: ButtonProps) {
  const classes = cn(
    "relative inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald/50 disabled:opacity-50 disabled:cursor-not-allowed",
    size === "sm" && "px-4 py-2 text-sm",
    size === "md" && "px-5 py-2.5 text-sm",
    size === "lg" && "px-7 py-3.5 text-base",
    variant === "primary" && [
      "bg-accent-emerald text-white shadow-sm",
      "hover:brightness-110 hover:shadow-md hover:shadow-accent-emerald/20",
      "active:scale-[0.98]",
    ],
    variant === "secondary" && [
      "bg-accent-indigo text-white shadow-sm",
      "hover:brightness-110 hover:shadow-md hover:shadow-accent-indigo/20",
      "active:scale-[0.98]",
    ],
    variant === "ghost" && [
      "bg-surface-alt text-text-primary border border-border",
      "hover:bg-surface hover:border-border/80",
      "active:scale-[0.98]",
    ],
    variant === "outline" && [
      "bg-transparent text-text-primary border border-border",
      "hover:bg-surface-alt hover:border-accent-emerald/40",
      "active:scale-[0.98]",
    ],
    className
  );

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {content}
    </motion.button>
  );
}
