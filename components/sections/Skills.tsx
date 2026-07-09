"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Layout, Cpu, Server, Wrench, Telescope } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { skills, exploringSkills } from "@/lib/data";
import { fadeUp, staggerContainer } from "@/lib/animations";

const categories = [
  {
    key: "Languages",
    icon: Code2,
    accent: "emerald" as const,
    description: "What I write in daily",
  },
  {
    key: "Frontend",
    icon: Layout,
    accent: "indigo" as const,
    description: "How I build interfaces",
  },
  {
    key: "AI & Data",
    icon: Cpu,
    accent: "emerald" as const,
    description: "Where I'm most excited",
  },
  {
    key: "Backend & APIs",
    icon: Server,
    accent: "indigo" as const,
    description: "What powers the products",
  },
  {
    key: "Tools",
    icon: Wrench,
    accent: "emerald" as const,
    description: "How I ship and collaborate",
  },
] as const;

const ENTER_SPRING = { type: "spring", stiffness: 60, damping: 20 } as const;
const CHIP_SPRING  = { type: "spring", stiffness: 400, damping: 25 } as const;

function SkillCard({
  cat,
  items,
  index,
}: {
  cat: (typeof categories)[number];
  items: readonly string[];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });

  const isEmerald = cat.accent === "emerald";
  const accentRGB = isEmerald ? "var(--emerald)" : "var(--indigo)";
  const Icon = cat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1, transition: { ...ENTER_SPRING, delay: index * 0.08 } }
          : {}
      }
      className=""
    >
      <motion.div
        className="group relative h-full rounded-2xl p-5 border bg-surface transition-colors duration-300 hover:border-border/70"
        style={{ borderColor: "rgb(var(--border) / 0.5)" }}
        whileHover={{ y: -2, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12)" }}
        transition={CHIP_SPRING}
      >
        {/* Subtle accent top bar */}
        <div
          className="absolute top-0 inset-x-0 h-[1.5px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, rgb(${accentRGB} / 0.6), transparent 60%)` }}
        />

        {/* Category header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center border"
            style={{
              background: `rgb(${accentRGB} / 0.07)`,
              borderColor: `rgb(${accentRGB} / 0.18)`,
            }}
          >
            <Icon size={13} style={{ color: `rgb(${accentRGB})` }} />
          </div>
          <div>
            <h3
              className="text-[10px] font-mono font-semibold tracking-[0.18em] uppercase leading-none"
              style={{ color: `rgb(${accentRGB})` }}
            >
              {cat.key}
            </h3>
            <p className="text-[10px] text-text-secondary/45 font-mono mt-0.5 leading-none">
              {cat.description}
            </p>
          </div>
        </div>

        {/* Skill chips */}
        <div className="flex flex-wrap gap-1.5">
          {items.map((skill) => (
            <motion.span
              key={skill}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-surface-alt text-text-secondary border border-border/60 cursor-default select-none"
              whileHover={{
                scale: 1.05,
                backgroundColor: `rgb(${accentRGB} / 0.07)`,
                color: `rgb(${accentRGB})`,
                borderColor: `rgb(${accentRGB} / 0.22)`,
              }}
              transition={CHIP_SPRING}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Skills() {
  const exploringRef = useRef<HTMLDivElement>(null);
  const exploringInView = useInView(exploringRef, { once: true, margin: "-40px 0px" });

  return (
    <SectionWrapper id="skills" atmosphere="indigo">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-14">
        <p className="section-label mb-3">05 · The Toolkit</p>
        <h2
          className="font-display font-bold text-text-primary leading-tight"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
        >
          Tools of the{" "}
          <span className="gradient-text">craft.</span>
        </h2>
      </motion.div>

      {/* Skill cards — 2 cols sm, 3 cols lg */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
      >
        {categories.map((cat, i) => {
          const items = skills[cat.key as keyof typeof skills] ?? [];
          return (
            <SkillCard key={cat.key} cat={cat} items={items} index={i} />
          );
        })}
      </motion.div>

      {/* Currently Exploring — full-width banner */}
      <motion.div
        ref={exploringRef}
        initial={{ opacity: 0, y: 18 }}
        animate={exploringInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.15 }}
        className="relative rounded-2xl border border-accent-indigo/15 bg-accent-indigo/[0.03] p-5 overflow-hidden"
      >
        {/* Background pulse */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-accent-indigo/[0.04] blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-accent-indigo/08 border border-accent-indigo/20">
              <Telescope size={13} className="text-accent-indigo" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-semibold tracking-[0.18em] uppercase text-accent-indigo leading-none">
                Currently Exploring
              </p>
              <p className="text-[10px] text-text-secondary/45 font-mono mt-0.5 leading-none">
                What&apos;s next on my radar
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {exploringSkills.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={exploringInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: 0.2 + i * 0.06,
                  type: "spring",
                  stiffness: 350,
                  damping: 22,
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-accent-indigo/80 border border-accent-indigo/18 bg-accent-indigo/[0.05] cursor-default select-none"
                whileHover={{ scale: 1.05, backgroundColor: "rgb(var(--indigo) / 0.10)" }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
