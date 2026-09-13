"use client";

import { useState } from "react";
import { Mail, Github, Linkedin, Download, Copy, Check } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data";

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
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Contact</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          I&apos;m actively seeking software engineering internships for{" "}
          {siteConfig.availableFor}. Reach out directly, or find me below.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Button href={`mailto:${siteConfig.email}`} icon={<Mail size={16} aria-hidden />}>
            Email Me
          </Button>
          <Button
            href={siteConfig.resume}
            variant="secondary"
            icon={<Download size={15} aria-hidden />}
          >
            Download Resume
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 p-5 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-accent" aria-hidden />
              <p className="font-medium text-sm">Email</p>
            </div>
            <p className="text-xs text-muted-foreground break-all">{siteConfig.email}</p>
            <button
              onClick={copyEmail}
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:opacity-80 transition-opacity mt-1"
            >
              {copied ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
              {copied ? "Copied" : "Copy address"}
            </button>
          </div>

          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 p-5 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Linkedin size={16} className="text-accent" aria-hidden />
              <p className="font-medium text-sm">LinkedIn</p>
            </div>
            <p className="text-xs text-muted-foreground">Connect with me</p>
          </a>

          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 p-5 rounded-lg border border-border bg-card hover:border-foreground/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Github size={16} className="text-accent" aria-hidden />
              <p className="font-medium text-sm">GitHub</p>
            </div>
            <p className="text-xs text-muted-foreground">View my code</p>
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}
