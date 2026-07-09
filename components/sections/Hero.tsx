"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Download, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { siteConfig } from "@/lib/data";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/animations";

const HeroScene = dynamic(
  () =>
    import("@/components/3d/HeroScene").then((m) => ({
      default: m.HeroScene,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          className="w-24 h-24 rounded-full border border-accent-emerald/20"
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    ),
  }
);

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/** Headline words reveal one by one — each rises out of a blur. */
function StatementHeadline() {
  // "intelligent products" carries the gradient — the two words that matter most.
  const segments: { text: string; gradient?: boolean }[] = [
    { text: "I build" },
    { text: "intelligent", gradient: true },
    { text: "products", gradient: true },
    { text: "that matter." },
  ];

  let wordIndex = 0;

  return (
    <h1
      className="font-display font-bold tracking-tight text-text-primary leading-[1.06] text-balance"
      style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.4rem)" }}
    >
      {segments.map((seg, si) =>
        seg.text.split(" ").map((word) => {
          const delay = 0.55 + wordIndex * 0.11;
          wordIndex += 1;
          return (
            <motion.span
              key={`${si}-${word}`}
              className={`inline-block mr-[0.24em] ${seg.gradient ? "gradient-text" : ""}`}
              initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay, duration: 0.65, ease: EASE }}
            >
              {word}
            </motion.span>
          );
        })
      )}
    </h1>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100dvh] flex flex-col overflow-x-hidden"
    >
      {/* Living aurora light field */}
      <AuroraBackground />

      {/* Dot grid — dark mode texture */}
      <div className="absolute inset-0 dot-grid opacity-0 dark:opacity-[0.8]" />

      {/* Two-column layout */}
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 pt-24 pb-12 lg:py-0">

          {/* Left — the introduction */}
          <motion.div
            className="flex flex-col justify-center z-10 text-center lg:text-left"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Availability badge */}
            <motion.div
              variants={fadeIn}
              className="flex justify-center lg:justify-start mb-10"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-emerald/25 bg-accent-emerald/[0.07] text-accent-emerald text-xs font-mono font-medium"
                whileHover={{ scale: 1.03, borderColor: "rgb(var(--emerald) / 0.4)" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-accent-emerald"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <Sparkles size={11} />
                Available for {siteConfig.availableFor} opportunities
              </motion.div>
            </motion.div>

            {/* The greeting — warm, human, first thing that lands */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.55, ease: EASE }}
              className="font-display font-medium text-text-secondary mb-4"
              style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)" }}
            >
              <span className="wave-hand mr-2">👋</span>
              Hello, I&apos;m{" "}
              <span className="text-text-primary font-semibold">Osei</span>.
            </motion.p>

            {/* Statement headline — the mission, not the résumé */}
            <div className="mb-6">
              <StatementHeadline />
            </div>

            {/* Who — one calm supporting line */}
            <motion.p
              variants={fadeUp}
              className="text-text-secondary text-balance leading-relaxed mb-5 max-w-lg mx-auto lg:mx-0"
              style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)" }}
            >
              AI engineer & full-stack developer — from edge systems processing{" "}
              <span className="text-text-primary/85">1K+ events per second</span>{" "}
              to award-winning accessibility apps in production.
            </motion.p>

            {/* Location */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center lg:justify-start gap-1.5 mb-9 text-text-secondary text-sm"
            >
              <MapPin size={13} className="text-accent-emerald" />
              <span>Pomona College · Claremont, CA</span>
              <span className="w-1 h-1 rounded-full bg-border mx-1" />
              <span>Kumasi, Ghana</span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
            >
              <Button
                href="#projects"
                size="lg"
                variant="primary"
                iconRight={<ArrowRight size={16} />}
              >
                Explore My Work
              </Button>
              <Button
                href={siteConfig.resume}
                size="lg"
                variant="ghost"
                external
                icon={<Download size={15} />}
              >
                Download Resume
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              className="mt-10 pt-8 border-t border-border/40 grid grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0"
            >
              {[
                { value: "3+", label: "Products Shipped" },
                { value: "1K+", label: "Events/sec" },
                { value: "35+", label: "Students Mentored" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center lg:items-start gap-1"
                  initial={{ opacity: 0, y: 14 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.5 + i * 0.1, duration: 0.5, ease: EASE }}
                >
                  <span className="font-display font-bold text-2xl gradient-text leading-none">
                    {stat.value}
                  </span>
                  <span className="text-text-secondary text-xs font-mono tracking-wide text-center lg:text-left">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — 3D scene (desktop only) */}
          <div className="hidden lg:flex items-center justify-center relative">
            <motion.div
              className="w-full h-[560px] xl:h-[640px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.2 }}
            >
              <HeroScene mouseRef={mouseRef} className="w-full h-full" />
            </motion.div>

            <motion.div
              className="absolute top-[15%] right-4 xl:right-0 glass rounded-xl px-3 py-2 text-xs font-mono text-accent-emerald border border-accent-emerald/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              Full-Stack · AI · Data
            </motion.div>
            <motion.div
              className="absolute bottom-[22%] left-4 xl:left-2 glass rounded-xl px-3 py-2 text-xs font-mono text-accent-indigo border border-accent-indigo/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              React · Python · LLMs
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll invitation */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <span className="text-text-secondary/40 text-[10px] font-mono tracking-[0.2em] uppercase">
          the story
        </span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-accent-emerald/60 to-transparent"
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
