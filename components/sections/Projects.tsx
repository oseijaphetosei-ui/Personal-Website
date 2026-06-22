"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Trophy, ImageIcon, ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/lib/data";
import { fadeUp, scaleUp, staggerContainer } from "@/lib/animations";

export function Projects() {
  return (
    <SectionWrapper id="projects">
      {/* Header */}
      <motion.div variants={fadeUp} className="mb-14">
        <p className="section-label mb-3">Selected Work</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2
            className="font-display font-bold text-text-primary leading-tight"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
          >
            Products I&apos;ve{" "}
            <span className="gradient-text">designed & built.</span>
          </h2>
          <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
            Media, links, and demos are being added — check back soon.
          </p>
        </div>
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
  const isEmerald = project.accent === "emerald";

  return (
    <motion.article
      variants={scaleUp}
      custom={index}
      className="group relative flex flex-col rounded-2xl bg-surface border border-border overflow-hidden transition-all duration-300 hover:shadow-lg"
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Glow on hover */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
          isEmerald
            ? "shadow-[inset_0_0_0_1px_rgb(var(--emerald)/0.3)]"
            : "shadow-[inset_0_0_0_1px_rgb(var(--indigo)/0.3)]"
        }`}
      />

      {/* Image / preview area */}
      <div className="relative aspect-[16/9] bg-surface-alt border-b border-border overflow-hidden">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-secondary/30">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                isEmerald
                  ? "bg-accent-emerald/5 border-accent-emerald/15 text-accent-emerald/40"
                  : "bg-accent-indigo/5 border-accent-indigo/15 text-accent-indigo/40"
              }`}
            >
              <ImageIcon size={22} />
            </div>
            <p className="text-[11px] font-mono">Preview coming soon</p>
          </div>
        )}

        {/* Accent gradient overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 h-16 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
            isEmerald
              ? "bg-gradient-to-t from-accent-emerald/8 to-transparent"
              : "bg-gradient-to-t from-accent-indigo/8 to-transparent"
          }`}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Award badge */}
        {project.award && (
          <div className="flex items-center gap-1.5 text-accent-indigo text-[11px] font-mono font-medium">
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
            className={`text-xs font-mono font-medium ${
              isEmerald ? "text-accent-emerald" : "text-accent-indigo"
            }`}
          >
            {project.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5 pt-1">
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
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          {project.links.live ? (
            <motion.a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                isEmerald
                  ? "bg-accent-emerald/10 text-accent-emerald hover:bg-accent-emerald/15 border border-accent-emerald/20"
                  : "bg-accent-indigo/10 text-accent-indigo hover:bg-accent-indigo/15 border border-accent-indigo/20"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <ExternalLink size={12} />
              Live Demo
            </motion.a>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-text-secondary/40 bg-surface-alt border border-border/40 cursor-not-allowed select-none">
              <ExternalLink size={12} />
              Demo Soon
            </div>
          )}

          {project.links.github ? (
            <motion.a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-alt border border-border text-text-secondary hover:text-text-primary hover:border-border/80 transition-colors"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
            >
              <Github size={14} />
            </motion.a>
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface-alt border border-border/40 text-text-secondary/30 cursor-not-allowed">
              <Github size={14} />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
