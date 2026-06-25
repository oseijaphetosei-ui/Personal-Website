"use client";

import { useEffect, useState } from "react";

type Star = {
  id: number;
  size: number;
  left: number;
  bottom: number;
  floatDuration: number;
  twinkleDuration: number;
  floatDelay: number;
  twinkleDelay: number;
  bright: boolean;
};

export function StarBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const arr: Star[] = [];
    for (let i = 0; i < 120; i++) {
      const size         = Math.random() * 2.5 + 0.5;   // 0.5 px – 3 px
      const floatDuration = Math.random() * 40 + 20;     // 20 s – 60 s
      arr.push({
        id:              i,
        size,
        left:            Math.random() * 100,             // % across screen
        bottom:          Math.random() * 100,             // % up screen
        floatDuration,
        twinkleDuration: Math.random() * 3 + 1,          // 1 s – 4 s
        floatDelay:      Math.random() * -60,             // stagger start positions
        twinkleDelay:    Math.random() * -4,
        bright:          size > 1.8,                      // larger stars get a soft glow
      });
    }
    setStars(arr);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-700 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {stars.map(s => (
        <div
          key={s.id}
          className={s.bright ? "star-particle star-bright" : "star-particle"}
          style={{
            width:             `${s.size}px`,
            height:            `${s.size}px`,
            left:              `${s.left}%`,
            bottom:            `${s.bottom}%`,
            animationDuration: `${s.floatDuration}s, ${s.twinkleDuration}s`,
            animationDelay:    `${s.floatDelay}s, ${s.twinkleDelay}s`,
          }}
        />
      ))}
    </div>
  );
}
