"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, MapPin, Users, TrendingUp, DollarSign, GraduationCap } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { leadership } from "@/lib/data";
import { fadeUp, fadeLeft, fadeRight, staggerContainer, counterVariant } from "@/lib/animations";

const statIcons = [GraduationCap, TrendingUp, Users, DollarSign];

export function Leadership() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });

  return (
    <SectionWrapper id="leadership" className="bg-surface-alt/30" atmosphere="emerald">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-14">
        <p className="section-label mb-3">06 · Beyond the Code</p>
        <h2
          className="font-display font-bold text-text-primary leading-tight"
          style={{ fontSize: "clamp(2rem, 3.6vw, 3.2rem)" }}
        >
          Beyond the{" "}
          <span className="gradient-text">code.</span>
        </h2>
      </motion.div>

      {/* Main card */}
      <motion.div
        variants={staggerContainer}
        className="relative rounded-3xl overflow-hidden border border-border bg-surface"
      >
        {/* Accent gradient bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent-emerald via-accent-indigo to-accent-emerald" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: content */}
          <motion.div
            variants={fadeLeft}
            className="p-8 sm:p-10 flex flex-col gap-6"
          >
            {/* Org header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/25 flex items-center justify-center shrink-0">
                <Heart size={20} className="text-accent-emerald" />
              </div>
              <div>
                <h3 className="font-display font-bold text-text-primary text-xl leading-tight">
                  {leadership.org}
                </h3>
                <p className="text-text-secondary text-sm font-medium mt-0.5">
                  {leadership.role}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-text-secondary/60 font-mono">
                  <MapPin size={11} />
                  {leadership.location} · {leadership.period}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed">
              {leadership.description}
            </p>

            {/* Bullets */}
            <div className="space-y-3">
              {leadership.bullets.map((bullet, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex gap-3 text-sm text-text-secondary leading-relaxed"
                >
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-accent-emerald/70 shrink-0" />
                  <span>{bullet}</span>
                </motion.div>
              ))}
            </div>

            {/* Personal note */}
            <motion.blockquote
              variants={fadeUp}
              className="pl-4 border-l-2 border-accent-emerald/40 italic text-text-secondary/80 text-sm leading-relaxed"
            >
              &ldquo;I know what it means to have someone open a door for you. This is me
              opening doors for others.&rdquo;
            </motion.blockquote>
          </motion.div>

          {/* Right: stats */}
          <motion.div
            ref={statsRef}
            variants={fadeRight}
            className="lg:border-l border-t lg:border-t-0 border-border p-8 sm:p-10 flex flex-col justify-center"
          >
            <p className="section-label mb-8">Impact Numbers</p>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 gap-6"
            >
              {leadership.stats.map((stat, i) => {
                const Icon = statIcons[i];
                return (
                  <motion.div
                    key={stat.label}
                    variants={counterVariant}
                    className="flex flex-col gap-2 p-5 rounded-2xl bg-surface-alt border border-border hover:border-accent-emerald/25 transition-colors"
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <div className="w-8 h-8 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center">
                      <Icon size={14} className="text-accent-emerald" />
                    </div>
                    <motion.span
                      className="font-display font-bold text-3xl gradient-text leading-none"
                      initial={{ opacity: 0 }}
                      animate={statsInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    >
                      {stat.value}
                    </motion.span>
                    <span className="text-text-secondary text-xs leading-tight">
                      {stat.label}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
