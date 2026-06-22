"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowUpRight, Download } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data";
import { fadeUp, staggerContainer } from "@/lib/animations";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    description: "Best for opportunities",
    accent: "emerald" as const,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Connect with me",
    href: siteConfig.social.linkedin,
    description: "Professional network",
    accent: "indigo" as const,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "View my code",
    href: siteConfig.social.github,
    description: "Open source work",
    accent: "emerald" as const,
  },
];

export function Contact() {
  return (
    <SectionWrapper id="contact">
      {/* Centered hero-style CTA */}
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

      {/* Contact links */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
      >
        {contactLinks.map((link) => {
          const Icon = link.icon;
          const isEmerald = link.accent === "emerald";

          return (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              variants={fadeUp}
              className="group flex flex-col gap-3 p-5 rounded-2xl bg-surface border border-border hover:shadow-sm transition-all duration-200"
              whileHover={{ y: -2, borderColor: isEmerald ? "rgb(var(--emerald) / 0.3)" : "rgb(var(--indigo) / 0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isEmerald
                      ? "bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald"
                      : "bg-accent-indigo/10 border border-accent-indigo/20 text-accent-indigo"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <ArrowUpRight
                  size={14}
                  className="text-text-secondary/30 group-hover:text-text-secondary/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
              <div>
                <p className="font-medium text-sm text-text-primary">{link.label}</p>
                <p className="text-text-secondary text-xs mt-0.5">{link.description}</p>
              </div>
            </motion.a>
          );
        })}
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
