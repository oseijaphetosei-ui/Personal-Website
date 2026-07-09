"use client";

import { useRef, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { Trophy, Briefcase, BarChart2 } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { experiences } from "@/lib/data";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

type Exp = typeof experiences[number];

const typeConfig = {
  work:        { icon: Briefcase, label: "Full-time",   accent: "emerald" as const },
  hackathon:   { icon: Trophy,    label: "Hackathon",   accent: "indigo"  as const },
  competition: { icon: BarChart2, label: "Competition", accent: "indigo"  as const },
};

const ENTER_SPRING = { type: "spring", stiffness: 55, damping: 20 } as const;
const HOVER_SPRING  = { type: "spring", stiffness: 320, damping: 30 } as const;
const REFL_SPRING   = { stiffness: 140, damping: 20 } as const;

const HOVER_SHADOW =
  "0 20px 56px -10px rgba(0,0,0,0.20), 0 6px 20px -6px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.05)";
const DEFAULT_SHADOW = "0 2px 8px rgba(0,0,0,0.04)";

/**
 * Milestones alternate sides of a central spine on desktop — the two most
 * significant roles (the current flagship position and the award-winning
 * build) get a larger, richer treatment; the rest stay compact. All three
 * bullets are always shown for every role — only size/emphasis differ.
 */
function ExperienceCard({
  exp,
  side,
  featured,
}: {
  exp: Exp;
  side: "left" | "right";
  featured: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px 0px" });

  const rawX = useMotionValue(50);
  const rawY = useMotionValue(50);
  const reflX = useSpring(rawX, REFL_SPRING);
  const reflY = useSpring(rawY, REFL_SPRING);
  const reflOpRaw = useMotionValue(0);
  const reflOp = useSpring(reflOpRaw, { stiffness: 200, damping: 28 });
  const reflBg = useMotionTemplate`radial-gradient(circle at ${reflX}% ${reflY}%, rgba(255,255,255,0.055) 0%, transparent 52%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = cardRef.current?.getBoundingClientRect();
      if (!r) return;
      rawX.set(((e.clientX - r.left) / r.width) * 100);
      rawY.set(((e.clientY - r.top) / r.height) * 100);
    },
    [rawX, rawY],
  );

  const { icon: Icon, accent } = typeConfig[exp.type];
  const isEmerald = accent === "emerald";
  const accentRGB = isEmerald ? "var(--emerald)" : "var(--indigo)";
  const isLeft = side === "left";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isLeft ? -36 : 36, y: 16 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={ENTER_SPRING}
      style={{ boxShadow: DEFAULT_SHADOW }}
      whileHover={{ scale: 1.012, y: -2, boxShadow: HOVER_SHADOW, transition: HOVER_SPRING }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => reflOpRaw.set(1)}
      onMouseLeave={() => reflOpRaw.set(0)}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-surface border transition-colors duration-300",
        "border-border/40 dark:border-white/[0.05] hover:border-border/65 dark:hover:border-white/[0.09]",
        featured ? "p-6 sm:p-7 lg:max-w-[440px]" : "p-5 lg:max-w-[380px]",
        // On the left column the card hugs the spine on its right edge;
        // on the right column it hugs the spine on its left edge.
        isLeft ? "lg:ml-auto" : "lg:mr-auto",
      )}
    >
      {/* Accent top bar — thicker + brighter for featured roles */}
      <div
        className="absolute top-0 inset-x-0"
        style={{
          height: featured ? 3 : 2,
          background: `linear-gradient(90deg, rgb(${accentRGB} / ${featured ? 0.85 : 0.6}), transparent 70%)`,
        }}
      />

      {/* Glass reflection overlay */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: reflBg, opacity: reflOp }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
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

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={cn(
                  "font-display font-bold text-text-primary leading-tight",
                  featured ? "text-xl" : "text-base",
                )}
              >
                {exp.company}
              </h3>
              <Badge variant={isEmerald ? "emerald" : "indigo"} size="sm">
                {typeConfig[exp.type].label}
              </Badge>
            </div>
            <p className={cn("text-text-secondary font-medium mt-0.5", featured ? "text-sm" : "text-xs")}>
              {exp.role}
            </p>
            <p className="text-text-secondary/55 text-xs font-mono mt-1">{exp.period}</p>
          </div>
        </div>

        {/* Award */}
        {exp.award && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold mb-4"
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

        {/* Bullets — all three, always */}
        <ul className={cn("space-y-2 mb-4", featured ? "text-sm" : "text-[13px]")}>
          {exp.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2.5 text-text-secondary leading-snug">
              <span
                className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: `rgb(${accentRGB} / 0.6)` }}
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-1.5">
          {exp.stack.map((tech) => (
            <Badge key={tech} variant="default" size="sm">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/** One milestone row: the fixed-center dot + connector, and the card on its side. */
function ExperienceRow({ exp, index }: { exp: Exp; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-80px 0px" });
  const isLeft = index % 2 === 0;
  const featured = index === 0 || !!exp.award;
  const { accent } = typeConfig[exp.type];
  const isEmerald = accent === "emerald";
  const accentRGB = isEmerald ? "var(--emerald)" : "var(--indigo)";

  return (
    <div ref={rowRef} className="relative">
      {/* Center node — desktop only, sits exactly on the spine */}
      <motion.div
        className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 z-10 w-3 h-3 rounded-full items-center justify-center"
        style={{ background: `rgb(${accentRGB})` }}
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
      >
        <span
          className="absolute w-6 h-6 rounded-full"
          style={{ background: `rgb(${accentRGB} / 0.18)` }}
        />
      </motion.div>

      {/* Connector line from spine to the card's edge */}
      <div
        className={cn(
          "hidden lg:block absolute top-8 -translate-y-1/2 h-px w-8",
          isLeft ? "right-1/2 mr-1.5" : "left-1/2 ml-1.5",
        )}
        style={{ background: `rgb(${accentRGB} / 0.35)` }}
      />

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
        <div className={isLeft ? "lg:col-start-1" : "lg:col-start-2"}>
          <ExperienceCard exp={exp} side={isLeft ? "left" : "right"} featured={featured} />
        </div>
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <SectionWrapper id="experience" className="bg-surface-alt/30" atmosphere="indigo">

      <motion.div variants={fadeUp} className="mb-14">
        <p className="section-label mb-3">02 · Where I&apos;ve Built</p>
        <h2
          className="font-display font-bold text-text-primary leading-tight"
          style={{ fontSize: "clamp(2rem, 3.6vw, 3.2rem)" }}
        >
          Where I&apos;ve built &{" "}
          <span className="gradient-text">shipped.</span>
        </h2>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        {/* Central spine — desktop only */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-accent-emerald/50 via-border to-accent-indigo/30" />

        <div className="space-y-10 lg:space-y-16">
          {experiences.map((exp, index) => (
            <ExperienceRow key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>

    </SectionWrapper>
  );
}
