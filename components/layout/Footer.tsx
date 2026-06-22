"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

const socialLinks = [
  { icon: Github, href: siteConfig.social.github, label: "GitHub" },
  { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-border bg-surface-alt/40">
      <div className="container-wide py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left: branding */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="font-display font-semibold text-text-primary text-sm">
              {siteConfig.shortName}
            </span>
            <span className="text-xs text-text-secondary font-mono">
              {siteConfig.location} · {new Date().getFullYear()}
            </span>
          </div>

          {/* Center: social links */}
          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center",
                  "bg-surface border border-border text-text-secondary",
                  "hover:text-text-primary hover:border-accent-emerald/30 hover:bg-surface-alt",
                  "transition-colors"
                )}
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.93 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Icon size={15} />
              </motion.a>
            ))}
          </div>

          {/* Right: scroll to top */}
          <motion.button
            onClick={scrollToTop}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              "bg-surface border border-border text-text-secondary",
              "hover:text-text-primary hover:border-accent-emerald/30",
              "transition-colors"
            )}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            aria-label="Scroll to top"
          >
            <ArrowUp size={15} />
          </motion.button>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-[11px] text-text-secondary/60 font-mono tracking-wide">
            Designed & built by {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
