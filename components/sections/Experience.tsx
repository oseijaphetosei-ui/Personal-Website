"use client";

import { motion } from "framer-motion";
import { Trophy, Briefcase, BarChart2 } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { experiences } from "@/lib/data";
import { fadeUp, fadeLeft, staggerContainer } from "@/lib/animations";

const typeConfig = {
  work: { icon: Briefcase, label: "Full-time", accent: "emerald" as const },
  hackathon: { icon: Trophy, label: "Hackathon", accent: "indigo" as const },
  competition: { icon: BarChart2, label: "Competition", accent: "indigo" as const },
};

export function Experience() {
  return (
    <SectionWrapper id="experience" className="bg-surface-alt/30">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-14">
        <p className="section-label mb-3">Experience</p>
        <h2 className="font-display font-bold text-text-primary leading-tight"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
        >
          Where I&apos;ve built &{" "}
          <span className="gradient-text">shipped.</span>
        </h2>
      </motion.div>

      {/* Timeline */}
      <motion.div
        variants={staggerContainer}
        className="relative"
      >
        {/* Timeline line */}
        <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-emerald/60 via-border to-transparent hidden sm:block" />

        <div className="space-y-8">
          {experiences.map((exp, index) => {
            const { icon: TypeIcon, accent } = typeConfig[exp.type];

            return (
              <motion.div
                key={exp.id}
                variants={fadeLeft}
                custom={index}
              >
                <div className="relative flex gap-6">
                  {/* Timeline node */}
                  <div className="relative shrink-0 hidden sm:flex flex-col items-center">
                    <motion.div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border z-10 ${
                        accent === "emerald"
                          ? "bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald"
                          : "bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo"
                      }`}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <TypeIcon size={16} />
                    </motion.div>
                  </div>

                  {/* Card */}
                  <motion.div
                    className="flex-1 bg-surface border border-border rounded-2xl p-6 hover:border-border/80 hover:shadow-sm transition-all duration-200"
                    whileHover={{ y: -1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
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
                        <Badge
                          variant={accent === "emerald" ? "emerald" : "indigo"}
                          size="sm"
                        >
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
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
