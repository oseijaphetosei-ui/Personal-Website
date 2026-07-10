"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Github, Trophy, Cpu, ArrowUpRight } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { aiShowcase } from "@/lib/data";
import { fadeUp, staggerContainer } from "@/lib/animations";

const ENTER_SPRING = { type: "spring", stiffness: 55, damping: 20 } as const;
const HOVER_SPRING = { type: "spring", stiffness: 320, damping: 30 } as const;

function AICard({
  product,
  index,
}: {
  product: (typeof aiShowcase)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" });
  const isEmerald = product.accent === "emerald";
  const accentRGB = isEmerald ? "var(--emerald)" : "var(--indigo)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1, transition: { ...ENTER_SPRING, delay: index * 0.1 } }
          : {}
      }
    >
      <motion.article
        ref={ref}
        className="group relative flex flex-col h-full rounded-2xl overflow-hidden border transition-colors duration-300"
        style={{
          background: "rgb(var(--surface) / 0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "rgb(var(--border) / 0.5)",
        }}
        animate={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        whileHover={{
          scale: 1.012,
          y: -3,
          boxShadow: "0 16px 48px -8px rgba(0,0,0,0.16), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
        transition={HOVER_SPRING}
      >
        {/* Accent top bar */}
        <div
          className="absolute top-0 inset-x-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, rgb(${accentRGB} / 0.8), transparent 70%)` }}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top left, rgb(${accentRGB} / 0.05) 0%, transparent 60%)` }}
        />

        <div className="relative flex flex-col flex-1 p-6 gap-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
                style={{
                  background: `rgb(${accentRGB} / 0.08)`,
                  borderColor: `rgb(${accentRGB} / 0.2)`,
                }}
              >
                <Cpu size={16} style={{ color: `rgb(${accentRGB})` }} />
              </div>
              <div>
                <p
                  className="text-[10px] font-mono font-semibold tracking-[0.18em] uppercase mb-0.5"
                  style={{ color: `rgb(${accentRGB})` }}
                >
                  {product.category}
                </p>
                <h3 className="font-display font-bold text-text-primary text-lg leading-none">
                  {product.name}
                </h3>
              </div>
            </div>

            {(product.live || product.github) && (
              <a
                href={product.live ?? product.github ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${product.name}`}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ArrowUpRight
                  size={16}
                  className="text-text-secondary/50 hover:text-text-primary transition-colors"
                />
              </a>
            )}
          </div>

          {/* Award */}
          {product.award && (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold w-fit"
              style={{
                background: `rgb(${accentRGB} / 0.08)`,
                color: `rgb(${accentRGB})`,
                border: `1px solid rgb(${accentRGB} / 0.2)`,
              }}
            >
              <Trophy size={9} />
              {product.award}
            </div>
          )}

          {/* Tagline */}
          <p
            className="text-sm font-medium leading-snug"
            style={{ color: `rgb(${accentRGB} / 0.85)` }}
          >
            {product.tagline}
          </p>

          {/* Description */}
          <p className="text-text-secondary text-sm leading-relaxed flex-1">
            {product.description}
          </p>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/40">
            {product.metrics.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-0.5">
                <span
                  className="font-display font-bold text-lg leading-none"
                  style={{ color: `rgb(${accentRGB})` }}
                >
                  {m.value}
                </span>
                <span className="text-[10px] text-text-secondary/60 font-mono text-center leading-tight">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5">
            {product.tech.map((t) => (
              <Badge key={t} variant="default" size="sm">
                {t}
              </Badge>
            ))}
          </div>

          {/* Links */}
          {(product.live || product.github) && (
            <div className="flex items-center gap-2 pt-1">
              {product.live && (
                <motion.a
                  href={product.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium"
                  style={{
                    background: `rgb(${accentRGB} / 0.09)`,
                    color: `rgb(${accentRGB})`,
                    border: `1px solid rgb(${accentRGB} / 0.2)`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ExternalLink size={11} />
                  Live App
                </motion.a>
              )}
              {product.github && (
                <motion.a
                  href={product.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-alt/60 border border-border/50 text-text-secondary hover:text-text-primary hover:border-border/80 transition-colors"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Github size={13} />
                </motion.a>
              )}
            </div>
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}

export function AIShowcase() {
  return (
    <SectionWrapper id="ai" atmosphere="emerald">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-14">
        <p className="section-label mb-3">04 · AI Products</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2
            className="font-display font-bold text-text-primary leading-tight"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3.2rem)" }}
          >
            Building with{" "}
            <span className="gradient-text">intelligence.</span>
          </h2>
          <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
            Production AI systems, award-winning apps, and consumer tools — built end to end.
          </p>
        </div>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {aiShowcase.map((product, i) => (
          <AICard key={product.id} product={product} index={i} />
        ))}
      </motion.div>

      {/* Bottom signal */}
      <motion.div
        variants={fadeUp}
        className="mt-10 flex items-center justify-center gap-3 text-xs font-mono text-text-secondary/40 tracking-wide"
      >
        <span>Gemini · Edge AI · LLMs · Real-world deployment</span>
      </motion.div>
    </SectionWrapper>
  );
}
