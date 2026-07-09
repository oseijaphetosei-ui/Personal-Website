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

type Exp = typeof experiences[number];

const typeConfig = {
  work:        { icon: Briefcase, label: "Full-time",   accent: "emerald" as const },
  hackathon:   { icon: Trophy,    label: "Hackathon",   accent: "indigo"  as const },
  competition: { icon: BarChart2, label: "Competition", accent: "indigo"  as const },
};

// Entrance spring — slow settle, no bounce. Apple-quality feel.
const ENTER_SPRING = { type: "spring", stiffness: 55, damping: 20 } as const;
// Hover spring — snappy but not aggressive.
const HOVER_SPRING = { type: "spring", stiffness: 320, damping: 30 } as const;
// Reflection tracking — slightly lagged for an organic glass feel.
const REFL_SPRING  = { stiffness: 140, damping: 20 } as const;

// Hover shadow: the final rgba(255,255,255,0.03) inset ring adds the dark-mode
// elevation effect that makes the card feel like it physically lifts off the surface.
const HOVER_SHADOW =
  "0 16px 48px -8px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.04)";
const DEFAULT_SHADOW = "0 2px 8px rgba(0,0,0,0.04)";

function ExperienceCard({ exp, index }: { exp: Exp; index: number }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px 0px" });

  // ── Glass reflection ──────────────────────────────────────────────────────
  // Raw cursor position as % of card dimensions, spring-smoothed for the gradient.
  const rawX = useMotionValue(50);
  const rawY = useMotionValue(50);
  const reflX = useSpring(rawX, REFL_SPRING);
  const reflY = useSpring(rawY, REFL_SPRING);

  // Reflection visibility: springs to 1 on enter, back to 0 on leave.
  const reflOpRaw = useMotionValue(0);
  const reflOp    = useSpring(reflOpRaw, { stiffness: 200, damping: 28 });

  // A reactive gradient string that updates every frame without string allocation overhead.
  const reflBg = useMotionTemplate`radial-gradient(circle at ${reflX}% ${reflY}%, rgba(255,255,255,0.055) 0%, transparent 52%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = cardRef.current?.getBoundingClientRect();
      if (!r) return;
      rawX.set(((e.clientX - r.left) / r.width)  * 100);
      rawY.set(((e.clientY - r.top)  / r.height) * 100);
    },
    [rawX, rawY],
  );

  const { icon: Icon, accent } = typeConfig[exp.type];
  const isEmerald = accent === "emerald";

  return (
    // Entrance wrapper — uses direct initial/animate (not variants) so it's
    // fully decoupled from SectionWrapper's stagger cascade. Per-card delay
    // provides the stagger manually.
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1, transition: { ...ENTER_SPRING, delay: index * 0.09 } }
          : {}
      }
    >
      <div className="relative flex gap-6">

        {/* ── Timeline node ─────────────────────────────────────────────── */}
        <div className="relative shrink-0 hidden sm:flex flex-col items-center">
          <motion.div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border z-10 ${
              isEmerald
                ? "bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald"
                : "bg-accent-indigo/10  border-accent-indigo/30  text-accent-indigo"
            }`}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Icon size={16} />
          </motion.div>
        </div>

        {/* ── Card ──────────────────────────────────────────────────────── */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => reflOpRaw.set(1)}
          onMouseLeave={() => reflOpRaw.set(0)}
          // Border colour changes are handled by Tailwind hover classes so they
          // respect CSS variables (dark / light mode) without any JS.
          className="
            relative flex-1 overflow-hidden rounded-2xl p-6 bg-surface
            border border-border/40 dark:border-white/[0.05]
            hover:border-border/65 dark:hover:border-white/[0.09]
            transition-colors duration-300
          "
          // Scale + y translate + shadow are all spring-animated by Framer Motion.
          animate={{ boxShadow: DEFAULT_SHADOW }}
          whileHover={{ scale: 1.015, y: -2, boxShadow: HOVER_SHADOW }}
          transition={HOVER_SPRING}
        >
          {/* Glass reflection overlay — sits above background, below text content.
              DOM order (first child) ensures it renders beneath sibling text nodes. */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: reflBg, opacity: reflOp }}
          />

          {/* All content sits in a relative container so it stacks above the
              absolute reflection div without needing explicit z-index. */}
          <div className="relative">

            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-text-primary text-lg leading-tight">
                    {exp.company}
                  </h3>
                  {exp.award && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 text-accent-indigo text-[11px] font-mono font-medium">
                      <Trophy size={10} />
                      {exp.award}
                    </span>
                  )}
                </div>
                <p className="text-text-secondary text-sm font-medium">{exp.role}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Badge variant={isEmerald ? "emerald" : "indigo"} size="sm">
                  {typeConfig[exp.type].label}
                </Badge>
                <span className="text-text-secondary/60 text-xs font-mono whitespace-nowrap">
                  {exp.period}
                </span>
              </div>
            </div>

            {/* Bullets */}
            <ul className="space-y-2.5 mb-5">
              {exp.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-accent-emerald/60 shrink-0" />
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

      </div>
    </motion.div>
  );
}

export function Experience() {
  return (
    <SectionWrapper id="experience" className="bg-surface-alt/30" atmosphere="indigo">

      {/* Header — still participates in SectionWrapper's stagger cascade */}
      <motion.div variants={fadeUp} className="mb-14">
        <p className="section-label mb-3">02 · Where I&apos;ve Built</p>
        <h2
          className="font-display font-bold text-text-primary leading-tight"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
        >
          Where I&apos;ve built &{" "}
          <span className="gradient-text">shipped.</span>
        </h2>
      </motion.div>

      {/* Timeline — plain div; cards manage their own entrance animations */}
      <div className="relative">
        <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-emerald/60 via-border to-transparent hidden sm:block" />

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>

    </SectionWrapper>
  );
}
