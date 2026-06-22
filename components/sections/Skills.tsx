"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { skills } from "@/lib/data";
import { fadeUp, staggerFast, staggerContainer } from "@/lib/animations";

const categoryAccent: Record<string, string> = {
  Languages: "emerald",
  Frontend: "indigo",
  "Backend & APIs": "emerald",
  "AI & Data": "indigo",
  Tools: "emerald",
};

export function Skills() {
  return (
    <SectionWrapper id="skills" className="bg-surface-alt/30">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-14">
        <p className="section-label mb-3">Technical Skills</p>
        <h2
          className="font-display font-bold text-text-primary leading-tight"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
        >
          Tools of the{" "}
          <span className="gradient-text">trade.</span>
        </h2>
      </motion.div>

      {/* Skills grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {Object.entries(skills).map(([category, items], catIndex) => {
          const accent = categoryAccent[category] ?? "emerald";
          const isEmerald = accent === "emerald";

          return (
            <motion.div
              key={category}
              variants={fadeUp}
              custom={catIndex}
              className="bg-surface border border-border rounded-2xl p-5 hover:border-border/80 hover:shadow-sm transition-all duration-200"
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Category header */}
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isEmerald ? "bg-accent-emerald" : "bg-accent-indigo"
                  }`}
                />
                <h3
                  className={`font-mono text-xs font-semibold tracking-widest uppercase ${
                    isEmerald ? "text-accent-emerald" : "text-accent-indigo"
                  }`}
                >
                  {category}
                </h3>
              </div>

              {/* Skill chips */}
              <motion.div
                variants={staggerFast}
                className="flex flex-wrap gap-2"
              >
                {items.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={{
                      hidden: { opacity: 0, scale: 0.85 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { type: "spring", stiffness: 300, damping: 20 },
                      },
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-alt text-text-secondary border border-border hover:text-text-primary hover:border-border/80 transition-colors cursor-default"
                    whileHover={{
                      scale: 1.04,
                      backgroundColor: isEmerald
                        ? "rgb(var(--emerald) / 0.08)"
                        : "rgb(var(--indigo) / 0.08)",
                      color: isEmerald
                        ? "rgb(var(--emerald))"
                        : "rgb(var(--indigo))",
                      borderColor: isEmerald
                        ? "rgb(var(--emerald) / 0.25)"
                        : "rgb(var(--indigo) / 0.25)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom note */}
      <motion.p
        variants={fadeUp}
        className="mt-10 text-center text-xs font-mono text-text-secondary/50 tracking-wide"
      >
        Always learning · always building
      </motion.p>
    </SectionWrapper>
  );
}
