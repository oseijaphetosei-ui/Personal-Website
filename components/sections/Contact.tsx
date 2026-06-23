"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowUpRight, Download, Copy, Check } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <SectionWrapper id="contact">
      {/* Centered CTA */}
      <motion.div
        variants={staggerContainer}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <motion.p variants={fadeUp} className="section-label mb-4">
          Get In Touch
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="font-display font-bold text-text-primary leading-tight mb-6 text-balance"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          Let&apos;s build something{" "}
          <span className="gradient-text">remarkable.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-text-secondary leading-relaxed mb-8 text-balance"
        >
          I&apos;m actively seeking{" "}
          <span className="text-text-primary font-medium">
            Software Engineering and Data Science internships
          </span>{" "}
          for {siteConfig.availableFor}. Whether you&apos;re a recruiter, founder, or
          researcher — I&apos;d love to hear from you.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            href={`mailto:${siteConfig.email}`}
            size="lg"
            variant="primary"
            icon={<Mail size={16} />}
          >
            Send Me an Email
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
      </motion.div>

      {/* Contact cards */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
      >
        {/* Email card — plain <a> for guaranteed mailto behavior + copy fallback */}
        <motion.div variants={fadeUp} className="group flex flex-col gap-3 p-5 rounded-2xl bg-surface border border-border transition-all duration-200 hover:shadow-sm hover:border-accent-emerald/30">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald">
              <Mail size={16} />
            </div>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-text-secondary/30 hover:text-text-secondary/70 transition-colors"
              aria-label="Open email client"
            >
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            <p className="font-medium text-sm text-text-primary">Email</p>
            <p className="text-text-secondary text-xs mt-0.5 break-all">{siteConfig.email}</p>
          </div>
          <button
            onClick={copyEmail}
            className="flex items-center gap-1.5 text-xs text-accent-emerald/70 hover:text-accent-emerald transition-colors mt-auto"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy address"}
          </button>
        </motion.div>

        {/* LinkedIn card */}
        <motion.a
          variants={fadeUp}
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-3 p-5 rounded-2xl bg-surface border border-border hover:shadow-sm hover:border-accent-indigo/30 transition-all duration-200"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-accent-indigo/10 border border-accent-indigo/20 text-accent-indigo">
              <Linkedin size={16} />
            </div>
            <ArrowUpRight size={14} className="text-text-secondary/30 group-hover:text-text-secondary/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <div>
            <p className="font-medium text-sm text-text-primary">LinkedIn</p>
            <p className="text-text-secondary text-xs mt-0.5">Connect with me</p>
          </div>
        </motion.a>

        {/* GitHub card */}
        <motion.a
          variants={fadeUp}
          href={siteConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-3 p-5 rounded-2xl bg-surface border border-border hover:shadow-sm hover:border-accent-emerald/30 transition-all duration-200"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald">
              <Github size={16} />
            </div>
            <ArrowUpRight size={14} className="text-text-secondary/30 group-hover:text-text-secondary/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <div>
            <p className="font-medium text-sm text-text-primary">GitHub</p>
            <p className="text-text-secondary text-xs mt-0.5">View my code</p>
          </div>
        </motion.a>
      </motion.div>

      {/* Availability indicator */}
      <motion.div
        variants={fadeUp}
        className="mt-12 flex items-center justify-center gap-2 text-sm text-text-secondary"
      >
        <motion.span
          className="w-2 h-2 rounded-full bg-accent-emerald"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        Currently available for {siteConfig.availableFor} internships
      </motion.div>
    </SectionWrapper>
  );
}
