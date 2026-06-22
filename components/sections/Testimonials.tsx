"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { testimonials } from "@/lib/data";
import { fadeUp, scaleUp, staggerContainer } from "@/lib/animations";

export function Testimonials() {
  return (
    <SectionWrapper id="testimonials" className="bg-surface-alt/30">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-14">
        <p className="section-label mb-3">Testimonials</p>
        <h2
          className="font-display font-bold text-text-primary leading-tight"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
        >
          What people{" "}
          <span className="gradient-text">say.</span>
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.id}
            variants={scaleUp}
            className="group relative flex flex-col gap-4 p-6 rounded-2xl bg-surface border border-border hover:border-border/80 hover:shadow-sm transition-all duration-200"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Quote icon */}
            <div className="w-8 h-8 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center">
              <Quote size={14} className="text-accent-emerald" />
            </div>

            {/* Quote text */}
            <p className="text-text-secondary text-sm leading-relaxed flex-1 italic">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3 border-t border-border/50">
              {/* Avatar placeholder */}
              <div className="w-9 h-9 rounded-full bg-surface-alt border border-border flex items-center justify-center shrink-0">
                <span className="text-xs font-display font-bold text-text-secondary/50">
                  {t.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary leading-none mb-0.5">
                  {t.name}
                </p>
                <p className="text-xs text-text-secondary">{t.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        variants={fadeUp}
        className="mt-8 text-center text-xs font-mono text-text-secondary/40 tracking-wide"
      >
        Testimonials are illustrative placeholders · Real quotes coming soon
      </motion.p>
    </SectionWrapper>
  );
}
