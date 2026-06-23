"use client";

import { useRef, useCallback } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard({ children, className, intensity = 10 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // All transforms are pure spring motion values — no React state, no `animate` prop.
  // This avoids any conflict with the parent's variant system (scaleUp / staggerContainer)
  // which previously caused opacity to freeze at 0 after rapid hover/unhover.
  const rawX   = useSpring(0, { stiffness: 280, damping: 28 });
  const rawY   = useSpring(0, { stiffness: 280, damping: 28 });
  const scale  = useSpring(1, { stiffness: 280, damping: 28 });
  const glare  = useMotionValue(0);

  const rotateX = useTransform(rawY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(rawX, [-0.5, 0.5], [-intensity, intensity]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set((e.clientX - rect.left) / rect.width  - 0.5);
      rawY.set((e.clientY - rect.top)  / rect.height - 0.5);
    },
    [rawX, rawY]
  );

  const handleMouseEnter = useCallback(() => {
    scale.set(1.025);
    glare.set(1);
  }, [scale, glare]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
    glare.set(0);
  }, [rawX, rawY, scale, glare]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // No `animate` or `variants` — purely motion-value driven.
      // `initial` is set explicitly so Framer Motion never inherits opacity from a parent variant.
      initial={{ opacity: 1 }}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        perspective: 1200,
        position: "relative",
        // Explicit z-index keeps the card above the fixed z-0 WebGL canvas
        zIndex: 1,
      }}
      className={className}
    >
      {/* Specular glare overlay — opacity driven by motion value, never by state */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10 overflow-hidden"
        style={{
          opacity: glare,
          background:
            "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.07) 0%, transparent 55%)",
        }}
      />
      {children}
    </motion.div>
  );
}
