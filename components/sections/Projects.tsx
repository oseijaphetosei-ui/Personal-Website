import { ArrowUpRight, Github, Trophy, Code2 } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/lib/data";

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-card overflow-hidden hover:border-foreground/20 transition-colors">
      <div className="relative aspect-video bg-muted flex items-center justify-center overflow-hidden">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.name} preview`}
            className="w-full h-full object-cover"
          />
        ) : project.demo ? (
          <video
            src={project.demo}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label={`${project.name} demo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <Code2 size={28} className="text-muted-foreground" aria-hidden />
        )}
      </div>

      <div className="flex flex-col gap-2.5 p-6">
        <span className="text-xs font-mono text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3 className="text-lg font-semibold tracking-tight">{project.name}</h3>
        <p className="text-sm text-accent font-medium">{project.tagline}</p>

        {project.award && (
          <span className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-accent">
            <Trophy size={12} aria-hidden />
            {project.award}
          </span>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-1">
          {project.stack.slice(0, 6).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
          {project.stack.length > 6 && (
            <Badge variant="outline">+{project.stack.length - 6}</Badge>
          )}
        </div>

        <div className="flex items-center gap-4 pt-3 mt-1 border-t border-border">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors"
            >
              Live Demo
              <ArrowUpRight size={14} aria-hidden />
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors"
            >
              <Github size={14} aria-hidden />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <SectionWrapper id="projects" border={false}>
      <div className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Selected Work</h2>
        <p className="text-muted-foreground max-w-2xl">
          A few things I&apos;ve designed, built, and shipped end to end.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
