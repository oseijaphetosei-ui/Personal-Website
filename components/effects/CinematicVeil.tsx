"use client";

/**
 * The cinematic veil — two fixed layers that sit over the whole experience:
 *
 * 1. Living film grain, screening every surface (including the glass nav)
 *    the way grain sits over a film frame. Barely-there in light mode,
 *    slightly more present in dark. The jitter animation is transform-only
 *    and frozen automatically under prefers-reduced-motion.
 *
 * 2. A volumetric vignette (dark mode only) that lets the edges of the
 *    viewport fall away into darkness — the screen reads as a lit space
 *    rather than a flat page.
 *
 * Both layers are static DOM with CSS animation: zero JS per frame.
 */
export function CinematicVeil() {
  return (
    <>
      {/* Volumetric vignette — beneath the grain, above the content */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700 z-[60]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, transparent 52%, rgb(0 0 0 / 0.30) 100%)",
        }}
      />

      {/* Living grain */}
      <div
        aria-hidden
        className="film-grain z-[70] opacity-[0.025] dark:opacity-[0.05]"
      />
    </>
  );
}
