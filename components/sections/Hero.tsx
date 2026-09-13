import { ArrowRight, Download, MapPin, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/data";

export function Hero() {
  return (
    <section id="home" className="border-b border-border">
      <div className="max-w-content mx-auto px-6 py-20 md:py-28">
        <p className="text-sm font-medium text-accent mb-4">
          Software Engineering Intern, Summer {new Date().getFullYear() + 1}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 max-w-2xl">
          {siteConfig.name}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-6">
          {siteConfig.description}
        </p>
        <div className="flex items-center gap-1.5 mb-8 text-sm text-muted-foreground">
          <MapPin size={14} aria-hidden />
          <span>{siteConfig.location}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button href="#projects" iconRight={<ArrowRight size={16} aria-hidden />}>
            View Projects
          </Button>
          <Button href={siteConfig.resume} variant="secondary" icon={<Download size={15} aria-hidden />}>
            Resume
          </Button>
          <Button
            href={siteConfig.social.github}
            variant="outline"
            external
            icon={<Github size={15} aria-hidden />}
          >
            GitHub
          </Button>
          <Button
            href={siteConfig.social.linkedin}
            variant="outline"
            external
            icon={<Linkedin size={15} aria-hidden />}
          >
            LinkedIn
          </Button>
          <Button
            href={`mailto:${siteConfig.email}`}
            variant="outline"
            icon={<Mail size={15} aria-hidden />}
          >
            Email
          </Button>
        </div>
      </div>
    </section>
  );
}
