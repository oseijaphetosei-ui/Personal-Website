"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Download, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig, roles } from "@/lib/data";
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

// Each word is wrapped in whitespace-nowrap so the browser only breaks at spaces,
// never mid-word regardless of viewport width.
function AnimatedName({ name }: { name: string }) {
  const words = name.split(" ");
  const wordOffsets = words.map((_, i) =>
    words.slice(0, i).reduce((sum, w) => sum + w.length + 1, 0)
  );

  return (
    <h1
      className="font-display font-bold tracking-tight text-text-primary leading-[1.05]"
      style={{ fontSize: "clamp(2.2rem, 6vw, 5.2rem)" }}
      aria-label={name}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          className="inline-block whitespace-nowrap"
          style={wi < words.length - 1 ? { marginRight: "0.28em" } : undefined}
        >
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.15 + (wordOffsets[wi] + ci) * 0.028,
                duration: 0.5,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100dvh] flex flex-col overflow-x-hidden"
    >
      {/* Background dot grid */}
      <div className="absolute inset-0 dot-grid opacity-[0.5] dark:opacity-[0.8]" />

      {/* Ambient gradient blobs */}
      <motion.div
        className="absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgb(var(--emerald) / 0.07)" }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.07, 0.13, 0.07] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 -right-48 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgb(var(--indigo) / 0.07)" }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.07, 0.12, 0.07] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
      />

      {/* Two-column layout */}
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 pt-20 pb-12 lg:py-0">

          {/* Left — text */}
          <motion.div
            className="flex flex-col justify-center z-10 text-center lg:text-left"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Available badge */}
            <motion.div
              variants={fadeIn}
              className="flex justify-center lg:justify-start mb-8"
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

            {/* Name */}
            <motion.div variants={fadeUp} className="mb-4">
              <AnimatedName name={siteConfig.name} />
            </motion.div>

            {/* Animated role */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center lg:justify-start mb-5"
              style={{ minHeight: "clamp(1.8rem, 4.5vw, 3.2rem)" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentRole}
                  className="gradient-text font-display font-semibold tracking-tight"
                  style={{ fontSize: "clamp(1.3rem, 3.5vw, 2.8rem)" }}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                  transition={{ duration: 0.42, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  {roles[currentRole]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Location */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center lg:justify-start gap-1.5 mb-7 text-text-secondary text-sm"
            >
              <MapPin size={13} className="text-accent-emerald" />
              <span>Pomona College · Claremont, CA</span>
              <span className="w-1 h-1 rounded-full bg-border mx-1" />
              <span>Class of 2028</span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={fadeUp}
              className="text-text-secondary text-balance leading-relaxed mb-9 max-w-xl mx-auto lg:mx-0"
              style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)" }}
            >
              {siteConfig.tagline}
              <br className="hidden sm:block" />
              <span className="text-text-primary/80">
                {" "}
                From Kumasi to Claremont — shipping products that create real-world impact.
              </span>
            </motion.p>

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
                View My Work
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
                  transition={{
                    delay: 0.85 + i * 0.1,
                    duration: 0.5,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
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
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              Full-Stack · AI · Data
            </motion.div>
            <motion.div
              className="absolute bottom-[22%] left-4 xl:left-2 glass rounded-xl px-3 py-2 text-xs font-mono text-accent-indigo border border-accent-indigo/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              React · Python · LLMs
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <span className="text-text-secondary/40 text-[10px] font-mono tracking-[0.2em] uppercase">
          scroll
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
