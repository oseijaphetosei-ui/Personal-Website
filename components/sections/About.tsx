"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { siteConfig, education } from "@/lib/data";
import { fadeUp, staggerContainer } from "@/lib/animations";

const metaFacts = [
  { label: "Studying", value: "CS & Data Science, Pomona College" },
  { label: "Building", value: "AI products with real-world impact" },
  { label: "From", value: "Kumasi, Ghana" },
];

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * The floating glass portrait — same visual family as the hero's Liquid
 * Aurora sphere: soft cyan/violet ambient light, glass layering, a cursor-
 * tracked specular sweep, and a restrained 3D tilt. Entrance and continuous
 * motion are independently guarded by prefers-reduced-motion.
 */
function FloatingPortrait() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapRef, { once: true, margin: "-80px 0px" });
  const reduceMotion = useReducedMotion();

  const rawRotX = useMotionValue(0);
  const rawRotY = useMotionValue(0);
  const rotX = useSpring(rawRotX, { stiffness: 150, damping: 20 });
  const rotY = useSpring(rawRotY, { stiffness: 150, damping: 20 });

  const rawGlowX = useMotionValue(50);
  const rawGlowY = useMotionValue(50);
  const glowX = useSpring(rawGlowX, { stiffness: 140, damping: 20 });
  const glowY = useSpring(rawGlowY, { stiffness: 140, damping: 20 });
  const glowOpacityRaw = useMotionValue(0);
  const glowOpacity = useSpring(glowOpacityRaw, { stiffness: 180, damping: 25 });
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.12) 0%, transparent 55%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rawRotY.set((px - 0.5) * 9);
    rawRotX.set((0.5 - py) * 7);
    rawGlowX.set(px * 100);
    rawGlowY.set(py * 100);
  };
  const handleEnter = () => {
    if (!reduceMotion) glowOpacityRaw.set(1);
  };
  const handleLeave = () => {
    rawRotX.set(0);
    rawRotY.set(0);
    glowOpacityRaw.set(0);
  };

  return (
    <motion.div
      ref={wrapRef}
      className="relative w-full max-w-[340px] mx-auto lg:mx-0"
      initial={{ opacity: 0, y: 36, scale: 0.96, filter: "blur(14px)" }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {/* Ambient aurora — same palette family as the hero sphere */}
      <div aria-hidden className="absolute -inset-16 pointer-events-none overflow-visible -z-10">
        <div
          className="aurora-blob aurora-1 opacity-70 dark:opacity-50"
          style={{
            top: "-8%",
            left: "-18%",
            width: "70%",
            height: "70%",
            background: "radial-gradient(circle, rgb(56 189 248 / 0.16) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-blob aurora-2 opacity-60 dark:opacity-45"
          style={{
            bottom: "-14%",
            right: "-12%",
            width: "65%",
            height: "65%",
            background: "radial-gradient(circle, rgb(167 139 250 / 0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="aurora-blob aurora-3 opacity-45 dark:opacity-35"
          style={{
            top: "35%",
            left: "20%",
            width: "50%",
            height: "50%",
            background: "radial-gradient(circle, rgb(217 70 239 / 0.10) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Idle float — extremely slow, disabled entirely under reduced motion */}
      <motion.div
        className="relative"
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Glass echo — a second pane offset behind, the "stacked glass" cue */}
        <div
          aria-hidden
          className="absolute inset-0 translate-x-3 translate-y-4 rounded-[2rem] glass opacity-40 dark:opacity-25"
        />

        {/* The portrait itself — floating glass frame */}
        <motion.div
          onMouseMove={handleMove}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="group relative rounded-[2rem] overflow-hidden transition-shadow duration-500"
          style={{
            rotateX: rotX,
            rotateY: rotY,
            transformStyle: "preserve-3d",
            transformPerspective: 900,
            boxShadow:
              "0 30px 70px -20px rgba(0,0,0,0.35), 0 12px 30px -10px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          <div className="relative aspect-[4/5] bg-surface-alt">
            <Image
              src="/profile.jpeg"
              alt="Osei Japhet Acquah"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 320px, 340px"
              priority
            />
            {/* Depth scrim — top shadow, bottom hint of light */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/[0.04] pointer-events-none" />
          </div>

          {/* Cursor-tracked specular sweep */}
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ background: glowBg, opacity: glowOpacity }}
          />

          {/* Glass edge highlight */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-[2rem] pointer-events-none"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)" }}
          />
        </motion.div>

        {/* Floating location chip */}
        <motion.div
          className="absolute -bottom-4 -right-4 px-3 py-2 rounded-full glass border border-white/10 shadow-lg flex items-center gap-1.5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
        >
          <MapPin size={11} className="text-accent-emerald" />
          <span className="text-xs font-mono text-text-primary font-medium">Claremont, CA</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function About() {
  return (
    <SectionWrapper id="about" atmosphere="emerald">
      <motion.p variants={fadeUp} className="section-label mb-3">
        01 · Who I Am
      </motion.p>

      {/* Editorial grid — asymmetric, staggered vertically like a magazine spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-14 items-start">
        <div className="lg:col-span-5 lg:pt-4">
          <FloatingPortrait />
        </div>

        <motion.div
          variants={staggerContainer}
          className="lg:col-span-7 lg:pt-20 flex flex-col gap-7"
        >
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-text-primary leading-[1.05] text-balance"
            style={{ fontSize: "clamp(2.4rem, 4.6vw, 4rem)" }}
          >
            Engineer. Builder.
            <br />
            <span className="gradient-text">Impact-driven.</span>
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="space-y-4 text-text-secondary leading-relaxed max-w-xl"
            style={{ fontSize: "1.05rem" }}
          >
            <p>
              I&apos;m{" "}
              <span className="text-text-primary font-medium">{siteConfig.name}</span> — a CS
              & Data Science student at{" "}
              <span className="text-text-primary font-medium">Pomona College</span>, class of{" "}
              {education.expected}. I build across the full stack and into AI — wherever the
              most interesting problems live.
            </p>
            <p>
              From edge AI systems processing 1K+ events per second to hackathon-winning
              accessibility apps, I care about the craft:{" "}
              <span className="text-text-primary font-medium">
                clean code, real tests, products people actually use.
              </span>{" "}
              And through The Ckedon Foundation, I mentor students in Ghana — opening doors the
              way they were opened for me.
            </p>
          </motion.div>

          {/* Meta facts — editorial masthead line, not boxed icons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap divide-x divide-border/50"
          >
            {metaFacts.map((f) => (
              <div key={f.label} className="flex flex-col gap-0.5 px-5 first:pl-0">
                <span className="text-text-secondary/50 font-mono text-[10px] uppercase tracking-[0.15em]">
                  {f.label}
                </span>
                <span className="text-text-primary text-sm font-medium">{f.value}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-2">
            <Button href="#contact" variant="primary" size="sm">
              Let&apos;s Connect
            </Button>
            <div className="flex items-center gap-1">
              {[
                { icon: Github, href: siteConfig.social.github, label: "GitHub" },
                { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
                { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
                  whileHover={{ scale: 1.1, y: -1 }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
