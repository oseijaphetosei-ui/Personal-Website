"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, BookOpen, Code2, Globe2, MapPin } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { siteConfig, education } from "@/lib/data";
import { fadeUp, fadeLeft, fadeRight, staggerContainer } from "@/lib/animations";

const quickFacts = [
  { icon: BookOpen, label: "Studying", value: "CS & Data Science, Pomona College" },
  { icon: Code2, label: "Building", value: "AI-powered products with real-world impact" },
  { icon: Globe2, label: "Originally from", value: "Kumasi, Ghana" },
];

export function About() {
  return (
    <SectionWrapper id="about" atmosphere="emerald">
      {/* Section label */}
      <motion.p variants={fadeUp} className="section-label mb-3">
        01 · Who I Am
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
        {/* Photo placeholder — left */}
        <motion.div
          variants={fadeLeft}
          className="lg:col-span-2 flex justify-center lg:justify-start"
        >
          <div className="relative group">
            {/* Glow ring */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-accent-emerald/30 to-accent-indigo/30 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Photo frame */}
            <div className="relative w-64 h-72 sm:w-72 sm:h-80 lg:w-64 lg:h-72 rounded-2xl bg-surface-alt border border-border overflow-hidden">
              <Image
                src="/profile.jpeg"
                alt="Osei Japhet Acquah"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 256px"
                priority
              />

              {/* Corner accents overlay */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent-emerald/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-accent-indigo/10 to-transparent pointer-events-none" />
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-4 -right-4 px-3 py-2 rounded-xl glass border border-border shadow-lg"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-xs font-mono text-text-primary font-medium flex items-center gap-1.5">
                <MapPin size={11} className="text-accent-emerald" />
                Claremont, CA
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Content — right */}
        <motion.div
          variants={staggerContainer}
          className="lg:col-span-3 flex flex-col gap-6"
        >
          <motion.h2
            variants={fadeUp}
            className="font-display font-bold text-text-primary leading-tight text-balance"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
          >
            Engineer. Builder.{" "}
            <span className="gradient-text">Impact-driven.</span>
          </motion.h2>

          <motion.div variants={fadeUp} className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              I&apos;m{" "}
              <span className="text-text-primary font-medium">{siteConfig.name}</span> — a
              Computer Science and Data Science student at{" "}
              <span className="text-text-primary font-medium">Pomona College</span>, class of{" "}
              {education.expected}. I build across the full stack and into AI/ML — wherever the
              most interesting problems live.
            </p>
            <p>
              My work spans from edge AI security systems processing 1K+ events per second, to
              hackathon-winning accessibility apps, to mobile products that make Scripture
              interactive. I care deeply about the craft:{" "}
              <span className="text-text-primary font-medium">clean code, real tests, and products
              people actually use.</span>
            </p>
            <p>
              Outside of engineering, I mentor students in Ghana through{" "}
              <span className="text-text-primary font-medium">The Ckedon Foundation</span> — because
              I know what it means to have someone open a door for you. I want to do that for
              others.
            </p>
          </motion.div>

          {/* Quick facts */}
          <motion.div variants={fadeUp} className="space-y-2.5 pt-1">
            {quickFacts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <div className="w-7 h-7 rounded-lg bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-accent-emerald" />
                </div>
                <span className="text-text-secondary">
                  <span className="text-text-primary font-medium">{label}:</span>{" "}
                  {value}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-2">
            <Button href="#contact" variant="primary" size="sm">
              Let&apos;s Connect
            </Button>
            <div className="flex items-center gap-2">
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
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-alt border border-border text-text-secondary hover:text-text-primary hover:border-accent-emerald/30 transition-colors"
                  whileHover={{ scale: 1.1, y: -1 }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
