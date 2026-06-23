"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard({ children, className, intensity = 10 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX = useSpring(0, { stiffness: 280, damping: 28 });
  const rawY = useSpring(0, { stiffness: 280, damping: 28 });

  const rotateX = useTransform(rawY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(rawX, [-0.5, 0.5], [-intensity, intensity]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      animate={{ scale: hovered ? 1.025 : 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={className}
    >
      {/* Specular glare */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10 overflow-hidden transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.07) 0%, transparent 55%)",
        }}
      />
      {children}
    </motion.div>
  );
}
