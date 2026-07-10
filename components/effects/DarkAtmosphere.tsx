"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-evolving dark environment. One fixed layer per "room", each painted
 * with its own ambient light; as the visitor moves between sections, rooms
 * crossfade over ~1.8s — slow enough to be felt rather than noticed.
 *
 * Dark mode only (opacity-0 in light). Pure opacity transitions on
 * pre-painted gradient layers: zero per-frame JS, GPU-composited.
 */

type Zone = {
  /** Section ids that belong to this room */
  ids: string[];
  /** The room's ambient light */
  background: string;
};

// Contact deliberately returns to the hero's atmosphere — the story closes
// where it opened.
const HERO_LIGHT =
  "radial-gradient(55% 45% at 50% 30%, rgb(56 189 248 / 0.075) 0%, transparent 70%)," +
  "radial-gradient(45% 40% at 82% 72%, rgb(109 112 245 / 0.068) 0%, transparent 70%)";

const ZONES: Zone[] = [
  { ids: ["home"], background: HERO_LIGHT },
  {
    ids: ["about"],
    // Charcoal with a soft blue glow, low on the left near the portrait
    background:
      "radial-gradient(50% 45% at 18% 40%, rgb(59 130 246 / 0.075) 0%, transparent 70%)," +
      "radial-gradient(40% 35% at 85% 80%, rgb(167 139 250 / 0.055) 0%, transparent 70%)",
  },
  {
    ids: ["experience"],
    // Rich midnight with indigo reflections around the book stage
    background:
      "radial-gradient(55% 50% at 70% 35%, rgb(109 112 245 / 0.08) 0%, transparent 70%)," +
      "radial-gradient(45% 40% at 15% 75%, rgb(56 189 248 / 0.048) 0%, transparent 70%)",
  },
  {
    ids: ["projects"],
    // Deep navy with restrained aurora highlights
    background:
      "radial-gradient(55% 45% at 25% 30%, rgb(37 99 235 / 0.075) 0%, transparent 70%)," +
      "radial-gradient(45% 40% at 80% 70%, rgb(16 185 129 / 0.048) 0%, transparent 70%)",
  },
  {
    ids: ["ai"],
    // Violet intelligence — the AI room glows warmer
    background:
      "radial-gradient(55% 45% at 75% 30%, rgb(168 85 247 / 0.068) 0%, transparent 70%)," +
      "radial-gradient(45% 40% at 20% 75%, rgb(56 189 248 / 0.06) 0%, transparent 70%)",
  },
  {
    ids: ["skills"],
    // Dark graphite with gentle cyan lighting
    background:
      "radial-gradient(55% 45% at 30% 35%, rgb(34 211 238 / 0.06) 0%, transparent 70%)," +
      "radial-gradient(45% 40% at 85% 65%, rgb(109 112 245 / 0.055) 0%, transparent 70%)",
  },
  {
    ids: ["leadership"],
    // A quiet emerald warmth — the human chapter
    background:
      "radial-gradient(55% 45% at 65% 40%, rgb(16 185 129 / 0.06) 0%, transparent 70%)," +
      "radial-gradient(45% 40% at 20% 70%, rgb(109 112 245 / 0.055) 0%, transparent 70%)",
  },
  { ids: ["contact"], background: HERO_LIGHT },
];

export function DarkAtmosphere() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const idToZone = new Map<string, number>();
    ZONES.forEach((z, i) => z.ids.forEach((id) => idToZone.set(id, i)));

    // A section becomes the active room when it crosses the vertical center
    // of the viewport — works for normal and very tall pinned sections alike.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const zone = idToZone.get(entry.target.id);
          if (zone !== undefined) setActive(zone);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700"
      style={{ zIndex: 0 }}
    >
      {/* Slow environmental drift shared by every room (reduced-motion safe
          via the global media query that freezes all animations) */}
      <div className="absolute inset-0 aurora-3">
        {ZONES.map((zone, i) => (
          <div
            key={zone.ids[0]}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              background: zone.background,
              opacity: i === active ? 1 : 0,
              transitionDuration: "1800ms",
            }}
          />
        ))}
      </div>
    </div>
  );
}
