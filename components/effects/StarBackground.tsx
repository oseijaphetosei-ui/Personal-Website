"use client";

import { useEffect, useRef } from "react";

// Pre-generate star data at module load — stable positions across re-renders
// and theme switches.
const N_STARS = 200;
type Star = {
  x: number;     // normalized [0, 1]
  y: number;
  r: number;     // radius in px
  base: number;  // base opacity
  phase: number; // twinkle phase offset
  freq: number;  // twinkle frequency (rad/s)
};

const STARS: Star[] = Array.from({ length: N_STARS }, () => ({
  x:     Math.random(),
  y:     Math.random(),
  r:     0.35 + Math.random() * 1.15,
  base:  0.20 + Math.random() * 0.55,
  phase: Math.random() * Math.PI * 2,
  freq:  0.25 + Math.random() * 1.0,
}));

export function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();
    let rafId: number;

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      const t = (performance.now() - t0) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      for (const s of STARS) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.freq + s.phase);
        const alpha   = s.base * (0.4 + 0.6 * twinkle);
        const px = s.x * w;
        const py = s.y * h;

        // Soft diffuse glow on the brighter stars
        if (s.r > 1.0) {
          const g = ctx.createRadialGradient(px, py, 0, px, py, s.r * 4.5);
          g.addColorStop(0, `rgba(200, 215, 255, ${alpha * 0.5})`);
          g.addColorStop(1, `rgba(200, 215, 255, 0)`);
          ctx.beginPath();
          ctx.arc(px, py, s.r * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        // Star dot
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 225, 255, ${alpha})`;
        ctx.fill();
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // Visible only in dark mode — CSS transition provides a smooth fade
      // when the user toggles the theme.
      className="fixed inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700"
      style={{ zIndex: 0 }}
    />
  );
}
