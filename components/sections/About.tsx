import { Heart } from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { siteConfig, education, leadership } from "@/lib/data";

export function About() {
  return (
    <SectionWrapper id="about">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">About</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed max-w-xl">
            <p>
              I&apos;m <span className="text-foreground font-medium">{siteConfig.name}</span>, a{" "}
              {education.degree} student at {education.school}, expected {education.expected}. I
              build across the full stack and into AI, from production systems to
              hackathon-winning apps.
            </p>
            <p>
              I care about the craft: clean code, real tests, and products people actually use.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {education.coursework.map((course) => (
              <span
                key={course}
                className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
              >
                {course}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={16} className="text-accent" aria-hidden />
            <h3 className="font-semibold">{leadership.org}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {leadership.role} · {leadership.period}. {leadership.description}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {leadership.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-semibold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
