"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Generative ambient soundscape — no audio files, everything is synthesized
 * with the Web Audio API:
 *
 *   · two softly detuned oscillators form a low drone dyad
 *   · a looped noise buffer through a lowpass adds "air"
 *   · a 0.05Hz LFO breathes the master gain so the bed never feels static
 *
 * Each section "room" (same observer pattern as DarkAtmosphere) retunes the
 * drone and re-voices the filter over ~2s — walking between sections quietly
 * changes the key of the space. Contact returns to the hero's chord: the
 * story closes where it opened.
 *
 * Muted by default; sound is strictly opt-in via the corner toggle (which
 * also satisfies the browser's user-gesture requirement for AudioContext).
 */

type RoomVoice = {
  ids: string[];
  /** Drone dyad in Hz */
  freqs: [number, number];
  /** Lowpass cutoff — the "brightness" of the room */
  cutoff: number;
  /** Relative noise-bed level 0..1 */
  air: number;
};

const HERO_VOICE: Omit<RoomVoice, "ids"> = { freqs: [110, 164.8], cutoff: 700, air: 0.5 };

const ROOMS: RoomVoice[] = [
  { ids: ["home"], ...HERO_VOICE },
  { ids: ["about"], freqs: [98, 146.8], cutoff: 600, air: 0.45 },
  { ids: ["experience"], freqs: [87.3, 130.8], cutoff: 520, air: 0.4 },
  { ids: ["projects"], freqs: [110, 138.6], cutoff: 760, air: 0.55 },
  { ids: ["ai"], freqs: [123.5, 185], cutoff: 860, air: 0.6 },
  { ids: ["skills"], freqs: [82.4, 123.5], cutoff: 640, air: 0.45 },
  { ids: ["leadership"], freqs: [146.8, 220], cutoff: 700, air: 0.5 },
  { ids: ["contact"], ...HERO_VOICE },
];

const MASTER_LEVEL = 0.045; // barely-there by design
const GLIDE = 2.0; // seconds — room-to-room retuning time

type AudioGraph = {
  ctx: AudioContext;
  master: GainNode;
  oscA: OscillatorNode;
  oscB: OscillatorNode;
  filter: BiquadFilterNode;
  airGain: GainNode;
};

export function AmbienceAudio() {
  const [enabled, setEnabled] = useState(false);
  const graphRef = useRef<AudioGraph | null>(null);
  const roomRef = useRef(0);

  // Track the active room continuously (cheap), whether or not audio is on,
  // so enabling sound mid-page starts in the right key.
  useEffect(() => {
    const idToRoom = new Map<string, number>();
    ROOMS.forEach((r, i) => r.ids.forEach((id) => idToRoom.set(id, i)));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const room = idToRoom.get(entry.target.id);
          if (room !== undefined && room !== roomRef.current) {
            roomRef.current = room;
            applyRoom(room);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Suspend while the tab is hidden; resume only if the user had sound on.
  useEffect(() => {
    const onVisibility = () => {
      const g = graphRef.current;
      if (!g) return;
      if (document.hidden) void g.ctx.suspend();
      else if (enabled) void g.ctx.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled]);

  // Full teardown on unmount.
  useEffect(() => {
    return () => {
      const g = graphRef.current;
      if (g) {
        g.oscA.stop();
        g.oscB.stop();
        void g.ctx.close();
        graphRef.current = null;
      }
    };
  }, []);

  const applyRoom = (room: number) => {
    const g = graphRef.current;
    if (!g) return;
    const voice = ROOMS[room];
    const t = g.ctx.currentTime;
    // setTargetAtTime = exponential approach — glides, never clicks
    g.oscA.frequency.setTargetAtTime(voice.freqs[0], t, GLIDE / 3);
    g.oscB.frequency.setTargetAtTime(voice.freqs[1], t, GLIDE / 3);
    g.filter.frequency.setTargetAtTime(voice.cutoff, t, GLIDE / 3);
    g.airGain.gain.setTargetAtTime(voice.air * 0.35, t, GLIDE / 3);
  };

  const buildGraph = (): AudioGraph => {
    type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };
    const Ctx = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext!;
    const ctx = new Ctx();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // The room's tone shaper
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = HERO_VOICE.cutoff;
    filter.Q.value = 0.6;
    filter.connect(master);

    // Drone dyad — triangle waves, slightly detuned against each other
    const oscA = ctx.createOscillator();
    oscA.type = "triangle";
    oscA.frequency.value = HERO_VOICE.freqs[0];
    const oscAGain = ctx.createGain();
    oscAGain.gain.value = 0.5;
    oscA.connect(oscAGain).connect(filter);

    const oscB = ctx.createOscillator();
    oscB.type = "triangle";
    oscB.frequency.value = HERO_VOICE.freqs[1];
    oscB.detune.value = 6; // gentle beating against oscA
    const oscBGain = ctx.createGain();
    oscBGain.gain.value = 0.35;
    oscB.connect(oscBGain).connect(filter);

    // "Air" — looped noise bed, heavily lowpassed
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = "lowpass";
    airFilter.frequency.value = 480;
    const airGain = ctx.createGain();
    airGain.gain.value = HERO_VOICE.air * 0.35;
    noise.connect(airFilter).connect(airGain).connect(filter);

    // Breathing — 0.05Hz LFO gently swells the master ±20%
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = MASTER_LEVEL * 0.2;
    lfo.connect(lfoDepth).connect(master.gain);

    oscA.start();
    oscB.start();
    noise.start();
    lfo.start();

    return { ctx, master, oscA, oscB, filter, airGain };
  };

  const toggle = async () => {
    if (!enabled) {
      let g = graphRef.current;
      if (!g) {
        g = buildGraph();
        graphRef.current = g;
      }
      await g.ctx.resume();
      applyRoom(roomRef.current);
      // Fade the bed in over 1.5s
      g.master.gain.cancelScheduledValues(g.ctx.currentTime);
      g.master.gain.setTargetAtTime(MASTER_LEVEL, g.ctx.currentTime, 0.5);
      setEnabled(true);
    } else {
      const g = graphRef.current;
      if (g) {
        // Fade out, then suspend so the graph costs nothing while muted
        g.master.gain.cancelScheduledValues(g.ctx.currentTime);
        g.master.gain.setTargetAtTime(0, g.ctx.currentTime, 0.3);
        window.setTimeout(() => {
          if (graphRef.current && graphRef.current.master.gain.value < 0.001) {
            void graphRef.current.ctx.suspend();
          }
        }, 1600);
      }
      setEnabled(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn ambient sound off" : "Turn ambient sound on"}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 left-5 z-[80] flex items-center gap-2 h-9 px-3.5 rounded-full glass text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald/40"
    >
      {enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
      <span className="font-mono text-[10px] tracking-[0.25em] uppercase">
        {enabled ? "Sound on" : "Sound"}
      </span>
    </motion.button>
  );
}
