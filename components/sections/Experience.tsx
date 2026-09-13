import { Trophy, Briefcase, GraduationCap, ExternalLink } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { experiences } from "@/lib/data";

const typeConfig = {
  work: { icon: Briefcase, label: "Full-time" },
  hackathon: { icon: Trophy, label: "Hackathon" },
  teaching: { icon: GraduationCap, label: "Teaching" },
};

export function Experience() {
  return (
    <SectionWrapper id="experience">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Experience</h2>
        <p className="text-muted-foreground max-w-2xl">
          Where I&apos;ve built and shipped, from production systems to hackathons.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-border border-t border-border">
        {experiences.map((exp) => {
          const { icon: Icon, label } = typeConfig[exp.type];
          return (
            <article key={exp.id} className="grid md:grid-cols-[220px_1fr] gap-4 py-8">
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Icon size={13} aria-hidden />
                  {label}
                </span>
                <span className="text-sm text-muted-foreground">{exp.period}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                  <h3 className="text-lg font-semibold tracking-tight">{exp.company}</h3>
                  <span className="text-sm text-accent font-medium">{exp.role}</span>
                  {"link" in exp && exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={12} aria-hidden />
                      Project link
                    </a>
                  )}
                </div>

                {exp.award && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent mb-3">
                    <Trophy size={12} aria-hidden />
                    {exp.award}
                  </span>
                )}

                <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed mb-4 mt-2 list-disc list-inside marker:text-border">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {exp.stack.map((tech) => (
                    <Badge key={tech}>{tech}</Badge>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
