"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { Trophy, Briefcase, BarChart2, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { experiences } from "@/lib/data";
import { cn } from "@/lib/utils";

type Exp = (typeof experiences)[number];

const typeConfig = {
  work:        { icon: Briefcase, label: "Full-time",   accent: "emerald" as const },
  hackathon:   { icon: Trophy,    label: "Hackathon",   accent: "indigo"  as const },
  competition: { icon: BarChart2, label: "Competition", accent: "indigo"  as const },
};

const N = experiences.length;
const SEG = 1 / N;
// The shared scroll window where the current page yields to the next.
const BLEND = 0.45 * SEG;

const isFeatured = (exp: Exp, index: number) => index === 0 || !!exp.award;

/* ── Shared page content — used by both the cinematic and static paths ──── */
function PageContent({ exp, index }: { exp: Exp; index: number }) {
  const { icon: Icon, accent } = typeConfig[exp.type];
  const isEmerald = accent === "emerald";
  const accentRGB = isEmerald ? "var(--emerald)" : "var(--indigo)";
  const featured = isFeatured(exp, index);

  return (
    <div className={cn("relative", featured ? "p-7 sm:p-10" : "p-6 sm:p-8")}>
      {/* Ghost chapter numeral — editorial watermark */}
      <span
        aria-hidden
        className="absolute -top-2 right-4 font-display font-bold text-text-primary opacity-[0.045] select-none pointer-events-none leading-none"
        style={{ fontSize: "clamp(5rem, 10vw, 8rem)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Masthead */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={cn(
            "shrink-0 rounded-xl flex items-center justify-center border",
            featured ? "w-11 h-11" : "w-9 h-9",
            isEmerald
              ? "bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald"
              : "bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo",
          )}
        >
          <Icon size={featured ? 18 : 15} />
        </div>
        <Badge variant={isEmerald ? "emerald" : "indigo"} size="sm">
          {typeConfig[exp.type].label}
        </Badge>
        <span className="text-text-secondary/55 text-xs font-mono ml-auto pr-1">
          {exp.period}
        </span>
      </div>

      {/* Title block */}
      <h3
        className={cn(
          "font-display font-bold text-text-primary leading-tight",
          featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
        )}
      >
        {exp.company}
      </h3>
      <p
        className={cn("font-medium mt-1 mb-5", featured ? "text-sm sm:text-base" : "text-sm")}
        style={{ color: `rgb(${accentRGB})` }}
      >
        {exp.role}
      </p>

      {/* Award */}
      {exp.award && (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold mb-5"
          style={{
            background: `rgb(${accentRGB} / 0.08)`,
            color: `rgb(${accentRGB})`,
            border: `1px solid rgb(${accentRGB} / 0.2)`,
          }}
        >
          <Trophy size={10} />
          {exp.award}
        </span>
      )}

      {/* Achievements */}
      <ul className={cn("space-y-2.5 mb-6", featured ? "text-sm sm:text-[15px]" : "text-sm")}>
        {exp.bullets.map((bullet, i) => (
          <li key={i} className="flex gap-2.5 text-text-secondary leading-snug">
            <span
              className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: `rgb(${accentRGB} / 0.12)` }}
            >
              <Check size={10} style={{ color: `rgb(${accentRGB})` }} strokeWidth={3} />
            </span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Stack */}
      <div className="flex flex-wrap gap-1.5">
        {exp.stack.map((tech) => (
          <Badge key={tech} variant="default" size="sm">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/** The floating glass shell shared by both render paths. */
const GLASS_CLASS =
  "relative w-full max-w-2xl rounded-3xl overflow-hidden border border-border/50 dark:border-white/[0.08]";
const GLASS_STYLE: React.CSSProperties = {
  background: "rgb(var(--surface) / 0.72)",
  backdropFilter: "blur(18px) saturate(1.4)",
  WebkitBackdropFilter: "blur(18px) saturate(1.4)",
  boxShadow:
    "0 24px 70px -16px rgba(0,0,0,0.28), 0 6px 24px -8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
};

/* ── Cinematic path — one glass page per chapter, driven by scroll ───────── */
function BookPage({
  exp,
  index,
  progress,
}: {
  exp: Exp;
  index: number;
  progress: MotionValue<number>;
}) {
  const { accent } = typeConfig[exp.type];
  const accentRGB = accent === "emerald" ? "var(--emerald)" : "var(--indigo)";
  const isFirst = index === 0;
  const isLast = index === N - 1;

  const start = index * SEG;
  const end = (index + 1) * SEG;
  const inputs = [start - BLEND, start, end - BLEND, end];

  // Enter: rise from beneath, tilted back, gaining clarity.
  // Exit: tilt away (~12°), drift upward, recede. First never enters; last never exits.
  const y = useTransform(progress, inputs, [isFirst ? 0 : 110, 0, 0, isLast ? 0 : -90]);
  const rotateX = useTransform(progress, inputs, [isFirst ? 0 : -12, 0, 0, isLast ? 0 : 12]);
  const scale = useTransform(progress, inputs, [isFirst ? 1 : 0.94, 1, 1, isLast ? 1 : 0.95]);
  const opacity = useTransform(progress, inputs, [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]);
  // Invisible pages must not intercept the pointer from the active one.
  const pointerEvents = useTransform(opacity, (o) => (o > 0.6 ? "auto" : "none"));

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-4 sm:px-6"
      style={{ zIndex: index, y, rotateX, scale, opacity, pointerEvents, transformPerspective: 1200 }}
    >
      <motion.div
        className={GLASS_CLASS}
        style={GLASS_STYLE}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {/* Ambient aurora behind the page — inherits the page's fade */}
        <div
          aria-hidden
          className="absolute -inset-x-24 -inset-y-16 -z-10 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 55% at 50% 45%, rgb(${accentRGB} / 0.10) 0%, transparent 70%)`,
          }}
        />
        {/* Accent hairline */}
        <div
          className="absolute top-0 inset-x-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, rgb(${accentRGB} / 0.75), transparent 70%)` }}
        />
        <PageContent exp={exp} index={index} />
      </motion.div>
    </motion.div>
  );
}

function CinematicBook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(N - 1, Math.max(0, Math.floor(v / SEG))));
  });

  return (
    <div ref={containerRef} className="relative" style={{ height: `${N * 115}vh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col">
        {/* Header — stays with the stage */}
        <div className="container-wide pt-24 pb-2 relative z-20">
          <p className="section-label mb-3">02 · Where I&apos;ve Built</p>
          <h2
            className="font-display font-bold text-text-primary leading-tight"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3.2rem)" }}
          >
            Where I&apos;ve built &{" "}
            <span className="gradient-text">shipped.</span>
          </h2>
        </div>

        {/* Page stage */}
        <div className="relative flex-1" style={{ perspective: 1200 }}>
          {experiences.map((exp, index) => (
            <BookPage key={exp.id} exp={exp} index={index} progress={scrollYProgress} />
          ))}
        </div>

        {/* Chapter indicator */}
        <div
          aria-hidden
          className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2.5 z-20"
        >
          {experiences.map((exp, i) => {
            const { accent } = typeConfig[exp.type];
            const accentRGB = accent === "emerald" ? "var(--emerald)" : "var(--indigo)";
            return (
              <span
                key={exp.id}
                className="rounded-full transition-all duration-500"
                style={{
                  width: 6,
                  height: i === active ? 22 : 6,
                  background:
                    i === active ? `rgb(${accentRGB})` : "rgb(var(--text-secondary) / 0.25)",
                }}
              />
            );
          })}
          <span className="mt-2 font-mono text-[10px] text-text-secondary/40 tracking-widest [writing-mode:vertical-rl]">
            {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Reduced-motion path — same pages, calm vertical flow ────────────────── */
function StaticBook() {
  return (
    <div className="container-wide py-24">
      <div className="mb-14">
        <p className="section-label mb-3">02 · Where I&apos;ve Built</p>
        <h2
          className="font-display font-bold text-text-primary leading-tight"
          style={{ fontSize: "clamp(2rem, 3.6vw, 3.2rem)" }}
        >
          Where I&apos;ve built &{" "}
          <span className="gradient-text">shipped.</span>
        </h2>
      </div>
      <div className="space-y-10 max-w-2xl mx-auto">
        {experiences.map((exp, index) => (
          <div key={exp.id} className={GLASS_CLASS} style={GLASS_STYLE}>
            <PageContent exp={exp} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Experience() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="experience" className="relative bg-surface-alt/30">
      <div aria-hidden className="atmosphere atmosphere-indigo" />
      <div className="relative">
        {reduceMotion ? <StaticBook /> : <CinematicBook />}
      </div>
    </section>
  );
}
