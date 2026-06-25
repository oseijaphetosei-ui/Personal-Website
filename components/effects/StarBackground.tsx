"use client";

import { useEffect, useRef } from "react";

// ── Three depth layers ────────────────────────────────────────────────────────
// Parallax emerges from different drift speeds per layer.
// Each layer has its own size range, opacity range, and drift speed range.
const LAYERS = [
  // Layer 0 — Distant: tiny, faint, barely moving
  { count: 130, rMin: 0.25, rMax: 0.62, opMin: 0.10, opMax: 0.28, sMin: 0.18, sMax: 0.42 },
  // Layer 1 — Mid: clearly visible, moderate drift
  { count:  65, rMin: 0.62, rMax: 1.28, opMin: 0.20, opMax: 0.52, sMin: 0.36, sMax: 0.70 },
  // Layer 2 — Close: larger, brighter, most movement
  { count:  18, rMin: 1.25, rMax: 2.05, opMin: 0.28, opMax: 0.66, sMin: 0.52, sMax: 1.00 },
] as const;

// Star: all fields derived at module load, never mutated.
// Pixel positions are tracked separately in the animation loop.
type Star = {
  // normalized seed position [0, 1] — used to re-seed after resize
  nx: number; ny: number;
  // base radius + size wave (r = r0 + rA·sin(rF·t + rP))
  r0: number; rA: number; rF: number; rP: number;
  // base opacity + brightness wave (same structure, independent phase)
  o0: number; oA: number; oF: number; oP: number;
  // drift: constant direction + speed (px/s)
  da: number; ds: number;
  layer: 0 | 1 | 2;
};

// Pre-generate all stars at module load — stable across React re-renders
// and dark/light theme switches.
const ALL_STARS: Star[] = [];
const TAU = Math.PI * 2;
for (let li = 0; li < LAYERS.length; li++) {
  const L = LAYERS[li];
  for (let i = 0; i < L.count; i++) {
    const r0 = L.rMin + Math.random() * (L.rMax - L.rMin);
    const o0 = L.opMin + Math.random() * (L.opMax - L.opMin);
    ALL_STARS.push({
      nx: Math.random(), ny: Math.random(),
      // Size wave: 12–32% of base radius, period 5–16 s
      r0, rA: r0 * (0.12 + Math.random() * 0.20),
      rF: 0.06 + Math.random() * 0.14, rP: Math.random() * TAU,
      // Brightness wave: 20–50% of base opacity, period 4–13 s
      o0, oA: o0 * (0.20 + Math.random() * 0.30),
      oF: 0.08 + Math.random() * 0.20, oP: Math.random() * TAU,
      // Random drift direction; speed varies by layer
      da: Math.random() * TAU,
      ds: L.sMin + Math.random() * (L.sMax - L.sMin),
      layer: li as 0 | 1 | 2,
    });
  }
}

export function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Canvas size + pixel positions ─────────────────────────────────────────
    // Pixel positions are mutable working state (Float32Array for cache locality).
    // On first call W/H are 0, so seed from normalized positions.
    // On resize, scale existing positions proportionally — no visual pop.
    let W = 0, H = 0;
    const px = new Float32Array(ALL_STARS.length);
    const py = new Float32Array(ALL_STARS.length);

    const resize = () => {
      const nW = window.innerWidth, nH = window.innerHeight;
      if (W > 0 && H > 0) {
        const sx = nW / W, sy = nH / H;
        for (let i = 0; i < ALL_STARS.length; i++) {
          px[i] *= sx; py[i] *= sy;
        }
      } else {
        for (let i = 0; i < ALL_STARS.length; i++) {
          px[i] = ALL_STARS[i].nx * nW;
          py[i] = ALL_STARS[i].ny * nH;
        }
      }
      W = canvas.width  = nW;
      H = canvas.height = nH;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Animation loop ────────────────────────────────────────────────────────
    let rafId: number;
    let prevTs = 0;

    const draw = (ts: number) => {
      rafId = requestAnimationFrame(draw);

      // dt: seconds since last frame, capped to avoid jumps on tab re-focus
      const dt = prevTs ? Math.min((ts - prevTs) / 1000, 0.05) : 0;
      prevTs = ts;
      const t = ts / 1000; // absolute time in seconds (for oscillators)

      ctx.clearRect(0, 0, W, H);

      // Only draw when dark mode is active — canvas is CSS opacity-0 in light
      // mode, but skipping drawing saves CPU on light-mode sessions.
      if (!document.documentElement.classList.contains("dark")) return;

      for (let i = 0; i < ALL_STARS.length; i++) {
        const s = ALL_STARS[i];

        // ── Drift ─────────────────────────────────────────────────────────────
        px[i] += Math.cos(s.da) * s.ds * dt;
        py[i] += Math.sin(s.da) * s.ds * dt;
        // Toroidal wrap: stars that exit one edge re-enter the opposite edge.
        // 4px buffer prevents a visible pop at the boundary.
        if (px[i] < -4)    px[i] = W + 4;
        if (px[i] > W + 4) px[i] = -4;
        if (py[i] < -4)    py[i] = H + 4;
        if (py[i] > H + 4) py[i] = -4;

        // ── Animated radius and opacity ───────────────────────────────────────
        const r  = Math.max(0.1, s.r0 + s.rA * Math.sin(t * s.rF * TAU + s.rP));
        const op = Math.max(0,   s.o0 + s.oA * Math.sin(t * s.oF * TAU + s.oP));

        // ── Soft glow halo (mid and close layers only) ────────────────────────
        // Drawn as a large, very transparent circle — avoids per-frame
        // createRadialGradient() allocation while still looking soft and diffuse.
        if (s.layer > 0) {
          const glowR  = r * (s.layer === 2 ? 5.5 : 4.2);
          const glowOp = op * (s.layer === 2 ? 0.11 : 0.08);
          ctx.beginPath();
          ctx.arc(px[i], py[i], glowR, 0, TAU);
          ctx.fillStyle = `rgba(200,215,255,${glowOp})`;
          ctx.fill();
        }

        // ── Star dot ──────────────────────────────────────────────────────────
        ctx.beginPath();
        ctx.arc(px[i], py[i], r, 0, TAU);
        ctx.fillStyle = `rgba(215,225,255,${op})`;
        ctx.fill();
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700"
      style={{ zIndex: 0 }}
    />
  );
}
