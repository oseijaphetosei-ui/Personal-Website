"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Download, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig, roles } from "@/lib/data";
import { fadeUp, fadeIn, staggerContainer } from "@/lib/animations";

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

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
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-x-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 dot-grid opacity-[0.6] dark:opacity-100" />

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-40 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "rgb(var(--emerald) / 0.08)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-40 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "rgb(var(--indigo) / 0.08)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.13, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Content */}
      <motion.div
        className="container-tight text-center z-10 pt-20 pb-8"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Available badge */}
        <motion.div variants={fadeIn} className="flex justify-center mb-8">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-emerald/25 bg-accent-emerald/8 text-accent-emerald text-xs font-mono font-medium"
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
          <h1 className="font-display font-bold tracking-tight text-text-primary leading-[1.05]"
            style={{ fontSize: "clamp(2.4rem, 7vw, 5.5rem)" }}
          >
            {siteConfig.name}
          </h1>
        </motion.div>

        {/* Animated role */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center mb-6"
          style={{ minHeight: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currentRole}
              className="gradient-text font-display font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}
              initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              {roles[currentRole]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Location + Education pill */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-1.5 mb-8 text-text-secondary text-sm">
          <MapPin size={13} className="text-accent-emerald" />
          <span>Pomona College · Claremont, CA</span>
          <span className="w-1 h-1 rounded-full bg-border mx-1" />
          <span>Class of 2028</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="text-text-secondary text-balance leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
        >
          {siteConfig.tagline}
          <br className="hidden sm:block" />
          <span className="text-text-primary/80"> From Kumasi to Claremont — shipping products that create real-world impact.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
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
          className="mt-8 sm:mt-16 pt-8 sm:pt-10 border-t border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto"
        >
          {[
            { value: "3+", label: "Products Shipped" },
            { value: "1K+", label: "Events/sec" },
            { value: "35+", label: "Students Mentored" },
            { value: "40%", label: "False Alarm Reduction" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <span className="font-display font-bold text-2xl gradient-text leading-none">
                {stat.value}
              </span>
              <span className="text-text-secondary text-xs font-mono tracking-wide text-center">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="text-text-secondary/50 text-[10px] font-mono tracking-[0.2em] uppercase">
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
