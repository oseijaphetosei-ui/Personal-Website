"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { siteConfig } from "@/lib/data";

const HeroScene = dynamic(
  () =>
    import("@/components/3d/HeroScene").then((m) => ({
      default: m.HeroScene,
    })),
  { ssr: false }
);

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Cinematic hero — two scenes staged across 220vh of scroll,
 * pinned to the viewport. Each scroll earns the next reveal:
 *
 *   Scene 1 · "👋 Hello."                              — just a greeting
 *   Scene 2 · "I'm Osei." + the statement + CTAs        — the introduction
 */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scene 1 — greeting
  const greetOpacity = useTransform(scrollYProgress, [0, 0.18, 0.32], [1, 1, 0]);
  const greetScale   = useTransform(scrollYProgress, [0, 0.32], [1, 0.92]);
  const greetY       = useTransform(scrollYProgress, [0, 0.32], [0, -40]);

  // Scene 2 — the introduction (stays)
  const introOpacity = useTransform(scrollYProgress, [0.30, 0.46], [0, 1]);
  const introY       = useTransform(scrollYProgress, [0.30, 0.48], [48, 0]);

  // 3D scene breathes in slowly and dims slightly behind text
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9], [0.65, 0.85, 0.85]);

  // Scroll cue — visible until the final scene lands
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06, 0.28, 0.46], [0, 1, 1, 0]);

  return (
    <section id="home" ref={containerRef} className="relative h-[220vh]">
      {/* Pinned stage */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center justify-center">
        {/* Living aurora light field */}
        <AuroraBackground />

        {/* Dot grid — dark mode texture */}
        <div className="absolute inset-0 dot-grid opacity-0 dark:opacity-[0.8]" />

        {/* 3D glass sphere — ambient depth behind every scene (desktop) */}
        <motion.div
          className="absolute inset-0 hidden lg:block pointer-events-none"
          style={{ opacity: sceneOpacity }}
        >
          <HeroScene mouseRef={mouseRef} className="w-full h-full" />
        </motion.div>

        {/* ── Scene 1 · Hello ─────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
          style={{ opacity: greetOpacity, scale: greetScale, y: greetY }}
        >
          {/* Whisper label — sets the stage before the greeting lands */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
            className="font-mono text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-text-secondary/45 mb-8"
          >
            Osei Japhet Acquah · Digital Portfolio
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.4, duration: 0.9, ease: EASE }}
            className="font-display font-bold tracking-tight text-text-primary text-center"
            style={{ fontSize: "clamp(3.2rem, 9vw, 8rem)" }}
          >
            <span className="wave-hand mr-4">👋</span>
            Hello.
          </motion.h1>
        </motion.div>

        {/* ── Scene 2 · The introduction ──────────────────────────────── */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity: introOpacity, y: introY }}
        >
          <h2
            className="font-display font-bold tracking-tight text-text-primary mb-5"
            style={{ fontSize: "clamp(2.6rem, 7vw, 6rem)" }}
          >
            I&apos;m <span className="gradient-text">Osei</span>.
          </h2>

          <p
            className="text-text-secondary text-balance leading-relaxed max-w-md mb-4"
            style={{ fontSize: "clamp(1rem, 1.9vw, 1.2rem)" }}
          >
            A Computer Science student at Pomona College crafting intelligent, full-stack
            digital experiences with a focus on AI, design, and real-world impact.
          </p>

          <div className="flex items-center justify-center gap-1.5 mb-10 text-text-secondary text-sm">
            <MapPin size={13} className="text-accent-emerald" />
            <span>Pomona College · Claremont, CA</span>
            <span className="w-1 h-1 rounded-full bg-border mx-1" />
            <span>Kumasi, Ghana</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              href="#about"
              size="lg"
              variant="primary"
              iconRight={<ArrowRight size={16} />}
            >
              Discover My Story
            </Button>
            <Button
              href={siteConfig.resume}
              size="lg"
              variant="ghost"
              external
              icon={<Download size={15} />}
            >
              Resume
            </Button>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: cueOpacity }}
        >
          <span className="text-text-secondary/40 text-[10px] font-mono tracking-[0.2em] uppercase">
            keep scrolling
          </span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-accent-emerald/60 to-transparent"
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
