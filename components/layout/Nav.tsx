"use client";

import { useState } from "react";
import { Menu, X, Github, Linkedin, Download } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-content mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-semibold tracking-tight">
          {siteConfig.shortName}
        </a>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 h-9 flex items-center rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Github size={17} />
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Linkedin size={17} />
          </a>
          <a
            href={siteConfig.resume}
            download
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Download size={14} />
            Resume
          </a>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-md text-foreground hover:bg-muted transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-6 py-2" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm text-muted-foreground hover:text-foreground border-b border-border last:border-b-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div
            className={cn(
              "flex items-center gap-3 px-6 py-4 border-t border-border"
            )}
          >
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={17} />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin size={17} />
            </a>
            <a
              href={siteConfig.resume}
              download
              onClick={() => setMobileOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Download size={14} />
              Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
