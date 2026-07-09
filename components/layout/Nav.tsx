"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "AI", href: "#ai" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      // Low threshold: tall pinned sections (Experience ≈ 460vh) can never
      // reach high visibility ratios, so 0.4 would never fire for them.
      { threshold: 0.15, rootMargin: "-80px 0px -40% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((s) => observer.observe(s));

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Floating glass pill — detached from the page edge, part of the experience */}
      <motion.header
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.15 }}
      >
        <div
          className={cn(
            "pointer-events-auto flex items-center gap-1 h-12 pl-2 pr-2 rounded-full border transition-all duration-300",
            scrolled
              ? "glass border-border/60 shadow-lg shadow-black/[0.06]"
              : "glass border-border/40 shadow-md shadow-black/[0.04]"
          )}
        >
          {/* Desktop links */}
          <nav className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 h-9 flex items-center rounded-full text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald/40",
                  activeSection === link.href.slice(1)
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {activeSection === link.href.slice(1) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-surface-alt border border-border/70"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Divider */}
          <div className="hidden md:block w-px h-5 bg-border/60 mx-1" />

          {/* Actions */}
          <ThemeToggle className="hidden sm:flex" />
          <motion.a
            href={siteConfig.resume}
            download
            className={cn(
              "hidden md:inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-medium",
              "bg-surface-alt border border-border text-text-secondary",
              "hover:text-text-primary hover:border-border/80",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald/40",
              "transition-colors duration-200"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Download size={13} />
            Resume
          </motion.a>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden w-9 h-9 rounded-full flex items-center justify-center",
              "bg-surface-alt border border-border text-text-secondary",
              "hover:text-text-primary transition-colors"
            )}
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -20 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 20 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <X size={17} /> : <Menu size={17} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-20 left-4 right-4 z-50 rounded-3xl glass border border-border p-4 shadow-xl"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            >
              <nav className="flex flex-col gap-1 mb-4">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      activeSection === link.href.slice(1)
                        ? "bg-surface-alt text-text-primary border border-border"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-alt/60"
                    )}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <ThemeToggle />
                <a
                  href={siteConfig.resume}
                  download
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium bg-surface-alt border border-border text-text-secondary hover:text-text-primary transition-colors"
                >
                  <Download size={13} />
                  Download Resume
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
