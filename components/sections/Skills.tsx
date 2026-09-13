import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { skillCategories } from "@/lib/data";

export function Skills() {
  return (
    <SectionWrapper id="skills">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Technical Skills</h2>
        <p className="text-muted-foreground max-w-2xl">
          Languages, frameworks, and tools I use day to day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillCategories.map((cat) => (
          <div key={cat.id} className="p-6 rounded-lg border border-border bg-card">
            <h3 className="font-semibold mb-4">{cat.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
