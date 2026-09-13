import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className,
  border = true,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-20", border && "border-t border-border", className)}
    >
      <div className="max-w-content mx-auto px-6">{children}</div>
    </section>
  );
}
