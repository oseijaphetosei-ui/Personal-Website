"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
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

/**
 * Gentle magnetic pull — the button drifts a few px toward the cursor while
 * hovered and springs back on leave. Factors are small (≤ ~7px on a large
 * button) so it reads as responsiveness, not a gimmick. Fully disabled for
 * reduced-motion users.
 */
function useMagnetic(active: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 320, damping: 22 });
  const y = useSpring(rawY, { stiffness: 320, damping: 22 });
  const reduceMotion = useReducedMotion();

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!active || reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width / 2)) * 0.1);
    rawY.set((e.clientY - (r.top + r.height / 2)) * 0.15);
  };
  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { x, y, onMouseMove, onMouseLeave };
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
  const magnetic = useMagnetic(!disabled);

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
    // Plain <a> for protocol links — no framework routing, guaranteed browser-native behavior
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a href={href} className={classes}>
          {content}
        </a>
      );
    }

    return (
      <motion.a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        style={{ x: magnetic.x, y: magnetic.y }}
        onMouseMove={magnetic.onMouseMove}
        onMouseLeave={magnetic.onMouseLeave}
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
      style={{ x: magnetic.x, y: magnetic.y }}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {content}
    </motion.button>
  );
}
