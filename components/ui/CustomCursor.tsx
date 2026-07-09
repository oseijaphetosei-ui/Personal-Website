"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const HOVER_SELECTOR = "a, button, [data-cursor-hover]";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const visibleRef = useRef(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 500, damping: 36, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 36, mass: 0.5 });
  const dotX = useSpring(cursorX, { stiffness: 1000, damping: 50 });
  const dotY = useSpring(cursorY, { stiffness: 1000, damping: 50 });

  useEffect(() => {
    // Touch devices have no cursor to replace — never mount the layers there.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };
    const handleLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    // Event delegation: works for elements rendered after mount (mobile
    // drawer, lazy sections) — per-element listeners never could.
    const handleOver = (e: MouseEvent) => {
      if ((e.target as Element).closest?.(HOVER_SELECTOR)) setIsHovering(true);
    };
    const handleOut = (e: MouseEvent) => {
      const to = e.relatedTarget as Element | null;
      if (!to?.closest?.(HOVER_SELECTOR)) setIsHovering(false);
    };

    document.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mouseout", handleOut, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [enabled, cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <>
      {/* Outer ring — fixed box size, scale-only animation (GPU composited) */}
      <motion.div
        className="fixed top-0 left-0 w-7 h-7 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 2.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="w-full h-full rounded-full border border-white/70" />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-[5px] h-[5px] pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      >
        <div className="w-full h-full rounded-full bg-white" />
      </motion.div>
    </>
  );
}
