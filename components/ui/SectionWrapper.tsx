"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/lib/animations";

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  tight?: boolean;
  /** Ambient light wash giving each act of the story its own atmosphere */
  atmosphere?: "emerald" | "indigo" | "dual";
}

export function SectionWrapper({
  id,
  children,
  className,
  innerClassName,
  tight = false,
  atmosphere,
}: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      id={id}
      ref={ref}
      className={cn("relative section-padding", className)}
    >
      {atmosphere && (
        <div aria-hidden className={cn("atmosphere", `atmosphere-${atmosphere}`)} />
      )}
      <motion.div
        className={cn(
          "relative",
          tight ? "container-tight" : "container-wide",
          innerClassName
        )}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
    </section>
  );
}
