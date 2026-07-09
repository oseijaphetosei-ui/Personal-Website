"use client";

/**
 * Aurora — slow-drifting fields of blurred light behind the hero.
 * Pure CSS keyframe animation (transform-only, GPU composited),
 * so it costs nothing on the main thread and respects
 * prefers-reduced-motion via the global media query.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Emerald field — upper left */}
      <div
        className="aurora-blob aurora-1 opacity-60 dark:opacity-45"
        style={{
          top: "-12%",
          left: "-8%",
          width: "48vw",
          height: "48vw",
          maxWidth: "760px",
          maxHeight: "760px",
          background:
            "radial-gradient(circle, rgb(var(--emerald) / 0.10) 0%, rgb(var(--emerald) / 0.03) 45%, transparent 70%)",
        }}
      />

      {/* Indigo field — right center */}
      <div
        className="aurora-blob aurora-2 opacity-60 dark:opacity-50"
        style={{
          top: "18%",
          right: "-14%",
          width: "52vw",
          height: "52vw",
          maxWidth: "820px",
          maxHeight: "820px",
          background:
            "radial-gradient(circle, rgb(var(--indigo) / 0.09) 0%, rgb(var(--indigo) / 0.03) 45%, transparent 70%)",
        }}
      />

      {/* Teal bridge — lower center, ties the two fields together */}
      <div
        className="aurora-blob aurora-3 opacity-50 dark:opacity-35"
        style={{
          bottom: "-18%",
          left: "28%",
          width: "44vw",
          height: "36vw",
          maxWidth: "700px",
          maxHeight: "560px",
          background:
            "radial-gradient(ellipse, rgb(20 184 166 / 0.07) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}
