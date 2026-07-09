"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Telescope } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { capabilities, exploringSkills, type Capability } from "@/lib/data";
import { fadeUp } from "@/lib/animations";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const ENTER_SPRING = { type: "spring", stiffness: 60, damping: 20 } as const;

/**
 * One capability is one scene: a large title + description, then a row of
 * interactive tech chips. Nothing about project evidence is shown until a
 * visitor hovers, focuses, or taps a chip — progressive disclosure, not a
 * wall of badges.
 */
function CapabilityScene({ cap, index }: { cap: Capability; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
  const [active, setActive] = useState<string | null>(null);

  const isEmerald = cap.accent === "emerald";
  const accentRGB = isEmerald ? "var(--emerald)" : "var(--indigo)";
  const activeTech = cap.tech.find((t) => t.name === active) ?? null;

  const clear = (name: string) =>
    setActive((prev) => (prev === name ? null : prev));
  const toggle = (name: string) =>
    setActive((prev) => (prev === name ? null : name));

  return (
    <div
      ref={ref}
      className={`relative py-12 md:py-14 ${index > 0 ? "border-t border-border/40" : ""}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left — index, title, description */}
        <motion.div
          className="lg:col-span-4 flex gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...ENTER_SPRING, delay: 0.05 }}
        >
          <span
            className="font-mono text-xs font-semibold tracking-[0.2em] shrink-0 pt-1.5"
            style={{ color: `rgb(${accentRGB} / 0.55)` }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3
              className="font-display font-bold text-text-primary leading-tight mb-2"
              style={{ fontSize: "clamp(1.5rem, 2.4vw, 1.9rem)" }}
            >
              {cap.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              {cap.description}
            </p>
          </div>
        </motion.div>

        {/* Right — interactive tech chips + evidence reveal */}
        <motion.div
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...ENTER_SPRING, delay: 0.15 }}
        >
          <div className="flex flex-wrap gap-2">
            {cap.tech.map((t, ti) => (
              <motion.button
                key={t.name}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: 0.25 + ti * 0.05,
                  type: "spring",
                  stiffness: 350,
                  damping: 22,
                }}
                onMouseEnter={() => setActive(t.name)}
                onFocus={() => setActive(t.name)}
                onMouseLeave={() => clear(t.name)}
                onBlur={() => clear(t.name)}
                onClick={() => toggle(t.name)}
                aria-pressed={active === t.name}
                className="px-3.5 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer select-none min-h-[44px]"
                style={
                  active === t.name
                    ? {
                        background: `rgb(${accentRGB} / 0.1)`,
                        borderColor: `rgb(${accentRGB} / 0.35)`,
                        color: `rgb(${accentRGB})`,
                      }
                    : {
                        background: "rgb(var(--surface-alt))",
                        borderColor: "rgb(var(--border) / 0.6)",
                        color: "rgb(var(--text-secondary))",
                      }
                }
              >
                {t.name}
              </motion.button>
            ))}
          </div>

          {/* Evidence reveal — only appears once a chip is engaged */}
          <div className="min-h-[2.75rem] mt-3">
            <AnimatePresence mode="wait">
              {activeTech && (
                <motion.div
                  key={activeTech.name}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  role="status"
                  aria-live="polite"
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="text-text-secondary/45 font-mono text-[10px] uppercase tracking-wider shrink-0">
                    Used in
                  </span>
                  {activeTech.usedIn.map((u) => (
                    <span
                      key={u}
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: `rgb(${accentRGB} / 0.06)`,
                        color: `rgb(${accentRGB})`,
                      }}
                    >
                      {u}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function Skills() {
  const exploringRef = useRef<HTMLDivElement>(null);
  const exploringInView = useInView(exploringRef, { once: true, margin: "-40px 0px" });

  return (
    <SectionWrapper id="skills" atmosphere="indigo">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-6">
        <p className="section-label mb-3">05 · Capabilities</p>
        <h2
          className="font-display font-bold text-text-primary leading-tight mb-3"
          style={{ fontSize: "clamp(2rem, 3.6vw, 3.2rem)" }}
        >
          What I{" "}
          <span className="gradient-text">build.</span>
        </h2>
        <p className="text-text-secondary text-sm max-w-md">
          Five capabilities. Hover or tap any technology to see the real project behind it.
        </p>
      </motion.div>

      {/* Capability scenes — one at a time, each earning the next */}
      <div className="flex flex-col">
        {capabilities.map((cap, i) => (
          <CapabilityScene key={cap.id} cap={cap} index={i} />
        ))}
      </div>

      {/* Currently Exploring — quiet epilogue, not a boxed banner */}
      <motion.div
        ref={exploringRef}
        initial={{ opacity: 0, y: 14 }}
        animate={exploringInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
        className="pt-10 mt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <div className="flex items-center gap-2 shrink-0">
          <Telescope size={13} className="text-accent-indigo/70" />
          <span className="text-text-secondary/50 font-mono text-[10px] uppercase tracking-[0.15em]">
            Currently exploring
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {exploringSkills.map((skill) => (
            <span
              key={skill}
              className="text-xs text-text-secondary/60 font-medium after:content-['·'] after:ml-1.5 after:text-border last:after:content-none"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
