"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Trophy, ImageIcon } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { TiltCard } from "@/components/ui/TiltCard";
import { projects } from "@/lib/data";
import { fadeUp, scaleUp, staggerContainer } from "@/lib/animations";

export function Projects() {
  return (
    <SectionWrapper id="projects" atmosphere="dual">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-14">
        <p className="section-label mb-3">03 · What I&apos;ve Shipped</p>
        <h2
          className="font-display font-bold text-text-primary leading-tight"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
        >
          Products I&apos;ve{" "}
          <span className="gradient-text">designed & built.</span>
        </h2>
      </motion.div>

      {/* Projects grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isEmerald = project.accent === "emerald";
  const accentRGB = isEmerald ? "var(--emerald)" : "var(--indigo)";

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div variants={scaleUp} custom={index} className="relative">
      <TiltCard className="relative flex flex-col h-full" intensity={8}>
        <article
          className="group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-500"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            background: "rgb(var(--surface) / 0.55)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgb(var(--border) / 0.5)",
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Accent top bar */}
          <div
            className="absolute top-0 inset-x-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, rgb(${accentRGB} / 0.7), transparent)`,
            }}
          />

          {/* Hover glow overlay */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 1px rgb(${accentRGB} / 0.22)`,
              background: `radial-gradient(ellipse at top center, rgb(${accentRGB} / 0.04) 0%, transparent 60%)`,
            }}
          />

          {/* Preview / video area
              aspect-[10/17] = aspect-[9/17] × 0.9 → exactly 10% shorter.
              The inner media wrapper extends 5.56% past the container on both
              sides so the phone renders at its original 9:17 size; overflow-
              hidden clips the top/bottom bezels symmetrically (5% each). */}
          <div
            className="relative aspect-[10/17] overflow-hidden border-b border-border/40"
            style={{ background: "rgb(0 0 0 / 0.85)" }}
          >
            {/* Inner wrapper: taller than container by 11.12% total (5.56% each side)
                so media fills the original 9:17 frame before clipping */}
            <div className="absolute -top-[5.56%] -bottom-[5.56%] inset-x-0">
              {project.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.name}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${project.demo ? "group-hover:opacity-0" : ""}`}
                  />
                  {project.demo && (
                    <video
                      ref={videoRef}
                      src={project.demo}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}
                </>
              ) : (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{
                    background: `linear-gradient(160deg, rgb(${accentRGB} / 0.05) 0%, transparent 70%)`,
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `rgb(${accentRGB} / 0.07)`,
                      borderColor: `rgb(${accentRGB} / 0.18)`,
                      color: `rgb(${accentRGB} / 0.45)`,
                    }}
                  >
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-[11px] font-mono text-text-secondary/25">
                    Preview coming soon
                  </p>
                </div>
              )}
            </div>

            {/* Bottom gradient — blends into content section */}
            <div
              className="absolute inset-x-0 bottom-0 h-10 pointer-events-none z-10"
              style={{
                background: `linear-gradient(to top, rgb(var(--surface) / 0.18), transparent)`,
              }}
            />
          </div>

          {/* Content — compact so the video gets the real estate */}
          <div className="flex flex-col flex-1 p-4 gap-2.5">
            {/* Award badge */}
            {project.award && (
              <div
                className="flex items-center gap-1.5 text-[11px] font-mono font-medium"
                style={{ color: `rgb(${accentRGB})` }}
              >
                <Trophy size={11} />
                {project.award}
              </div>
            )}

            {/* Title + tagline */}
            <div>
              <h3 className="font-display font-bold text-text-primary text-lg leading-tight mb-1">
                {project.name}
              </h3>
              <p
                className="text-xs font-mono font-medium"
                style={{ color: `rgb(${accentRGB})` }}
              >
                {project.tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed flex-1 line-clamp-3">
              {project.description}
            </p>

            {/* Stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="default" size="sm">
                  {tech}
                </Badge>
              ))}
              {project.stack.length > 4 && (
                <Badge variant="ghost" size="sm">
                  +{project.stack.length - 4}
                </Badge>
              )}
            </div>

            {/* Links */}
            <div className="flex items-center gap-2 pt-1.5 border-t border-border/40">
              {project.links.live ? (
                <motion.a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background: `rgb(${accentRGB} / 0.09)`,
                    color: `rgb(${accentRGB})`,
                    border: `1px solid rgb(${accentRGB} / 0.2)`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ExternalLink size={12} />
                  Live Demo
                </motion.a>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-text-secondary/35 bg-surface-alt/60 border border-border/35 cursor-not-allowed select-none">
                  <ExternalLink size={12} />
                  Demo Soon
                </div>
              )}

              {project.links.github ? (
                <motion.a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-alt/60 border border-border/50 text-text-secondary hover:text-text-primary hover:border-border/80 transition-colors"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                >
                  <Github size={14} />
                </motion.a>
              ) : (
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-alt/60 border border-border/35 text-text-secondary/30 cursor-not-allowed">
                  <Github size={14} />
                </div>
              )}
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}
