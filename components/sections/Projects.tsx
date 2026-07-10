"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Github, Trophy, ImageIcon } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/lib/data";
import { fadeUp } from "@/lib/animations";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Each project is a poster — one idea, one visual focus, revealed
 * one at a time as the visitor scrolls. Layouts alternate sides and
 * each row carries its own atmosphere.
 */
function FeatureProject({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-15% 0px" });
  const flip = index % 2 === 1;

  const isEmerald = project.accent === "emerald";
  const accentRGB = isEmerald ? "var(--emerald)" : "var(--indigo)";

  // Gentle parallax — media drifts slightly slower than the page
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], [28, -28]);

  const playDemo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };
  const stopDemo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    // Isolation comes from generous vertical space + each row's own light —
    // no divider lines.
    <div ref={rowRef} className="relative py-20 md:py-36">
      {/* Row atmosphere — each project enters its own world */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 65% at ${flip ? "85%" : "15%"} 50%, rgb(${accentRGB} / 0.05) 0%, transparent 65%)`,
        }}
      />

      <div
        className={`relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
          flip ? "" : ""
        }`}
      >
        {/* ── Media ───────────────────────────────────────────────────── */}
        <motion.div
          className={`lg:col-span-5 flex justify-center ${flip ? "lg:order-2" : ""}`}
          style={{ y: mediaY }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div
            className="group relative w-full max-w-[300px] aspect-[10/17] rounded-3xl overflow-hidden border shadow-2xl shadow-black/10"
            style={{
              background: "rgb(0 0 0 / 0.85)",
              borderColor: `rgb(${accentRGB} / 0.15)`,
            }}
            onMouseEnter={playDemo}
            onMouseLeave={stopDemo}
          >
            {project.image || project.demo ? (
              <div className="absolute -top-[5.56%] -bottom-[5.56%] inset-x-0">
                {project.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.name}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                      project.demo ? "group-hover:opacity-0" : ""
                    }`}
                  />
                )}
                {project.demo && (
                  <video
                    ref={videoRef}
                    src={project.demo}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    // With a preview image the video stays hidden until hover;
                    // without one, its first frame IS the preview.
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                      project.image ? "opacity-0 group-hover:opacity-100" : ""
                    }`}
                  />
                )}
              </div>
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{
                  background: `linear-gradient(160deg, rgb(${accentRGB} / 0.08) 0%, rgb(0 0 0 / 0.9) 70%)`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `rgb(${accentRGB} / 0.08)`,
                    borderColor: `rgb(${accentRGB} / 0.2)`,
                    color: `rgb(${accentRGB} / 0.5)`,
                  }}
                >
                  <ImageIcon size={24} />
                </div>
                <p className="text-[11px] font-mono text-white/25">
                  Preview coming soon
                </p>
              </div>
            )}

            {/* Glass edge highlight */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
            />
          </div>
        </motion.div>

        {/* ── Story ───────────────────────────────────────────────────── */}
        <motion.div
          className={`lg:col-span-7 flex flex-col gap-5 text-center lg:text-left ${
            flip ? "lg:order-1 lg:text-right lg:items-end" : "lg:items-start"
          } items-center`}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
        >
          {/* Index */}
          <span
            className="font-mono text-xs font-semibold tracking-[0.25em]"
            style={{ color: `rgb(${accentRGB} / 0.6)` }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Name */}
          <h3
            className="font-display font-bold text-text-primary leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
          >
            {project.name}
          </h3>

          {/* Tagline */}
          <p
            className="text-sm font-mono font-medium"
            style={{ color: `rgb(${accentRGB})` }}
          >
            {project.tagline}
          </p>

          {/* Award */}
          {project.award && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold"
              style={{
                background: `rgb(${accentRGB} / 0.08)`,
                color: `rgb(${accentRGB})`,
                border: `1px solid rgb(${accentRGB} / 0.2)`,
              }}
            >
              <Trophy size={10} />
              {project.award}
            </span>
          )}

          {/* Description — kept short, the poster speaks */}
          <p className="text-text-secondary leading-relaxed max-w-lg">
            {project.description}
          </p>

          {/* Stack */}
          <div className={`flex flex-wrap gap-1.5 justify-center ${flip ? "lg:justify-end" : "lg:justify-start"}`}>
            {project.stack.slice(0, 5).map((tech) => (
              <Badge key={tech} variant="default" size="sm">
                {tech}
              </Badge>
            ))}
            {project.stack.length > 5 && (
              <Badge variant="ghost" size="sm">
                +{project.stack.length - 5}
              </Badge>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 pt-2">
            {project.links.live && (
              <motion.a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium"
                style={{
                  background: `rgb(${accentRGB} / 0.09)`,
                  color: `rgb(${accentRGB})`,
                  border: `1px solid rgb(${accentRGB} / 0.22)`,
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <ExternalLink size={13} />
                Live Demo
              </motion.a>
            )}
            {project.links.github && (
              <motion.a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} on GitHub`}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-alt/60 border border-border/50 text-text-secondary hover:text-text-primary hover:border-border transition-colors"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
              >
                <Github size={15} />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <SectionWrapper id="projects" atmosphere="dual">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-8 text-center">
        <p className="section-label mb-3">03 · What I&apos;ve Shipped</p>
        <h2
          className="font-display font-bold text-text-primary leading-tight"
          style={{ fontSize: "clamp(2rem, 3.8vw, 3.2rem)" }}
        >
          Selected{" "}
          <span className="gradient-text">work.</span>
        </h2>
      </motion.div>

      {/* One project at a time */}
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <FeatureProject key={project.id} project={project} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
