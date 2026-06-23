"use client";

import { useEffect, useRef } from "react";

// ── Vertex: full-screen passthrough quad ─────────────────────────────────────
const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// ── Fragment: flowing organic color fields ────────────────────────────────────
// Technique: two-pass domain warp (Inigo Quilez style) drives a set of large
// Gaussian blobs through an organic, non-repeating motion field.
// Mouse position perturbs the warp, creating the "liquid being pushed" feel.
const FRAG = `
precision highp float;

uniform float u_time;
uniform vec2  u_res;
uniform vec2  u_mouse;
uniform float u_intensity;

const vec3 BASE   = vec3(0.973, 0.980, 0.996);
const vec3 SKY    = vec3(0.741, 0.898, 0.992);
const vec3 CYAN   = vec3(0.776, 0.957, 0.988);
const vec3 INDIGO = vec3(0.847, 0.886, 0.996);
const vec3 LAV    = vec3(0.906, 0.882, 0.996);
const vec3 DBLUE  = vec3(0.596, 0.761, 0.984);
const vec3 ELEC   = vec3(0.686, 0.933, 0.984);

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float sn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * sn(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

float blob(vec2 uv, vec2 c, float r) {
  float d = length(uv - c) / r;
  return exp(-d * d * 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float ar = u_res.x / u_res.y;
  vec2 p   = vec2(uv.x * ar, uv.y);
  float t  = u_time * 0.055;

  vec2 mouse = vec2(u_mouse.x * ar, u_mouse.y);

  // Pass 1: compute warp field q
  vec2 q = vec2(
    fbm(p + t * 0.35),
    fbm(p + vec2(5.2, 1.3) + t * 0.30)
  );
  // Pass 2: warp with q to get richer, non-repeating distortion
  vec2 r = vec2(
    fbm(p + q + vec2(1.7, 9.2) + t * 0.18),
    fbm(p + q + vec2(8.3, 2.8) + t * 0.22)
  );
  vec2 wp = p + vec2(r.x - 0.5, r.y - 0.5) * 0.20;

  // Cursor deformation: colors drift toward mouse position
  vec2 toMouse = mouse - p;
  float md = length(toMouse);
  float ms = exp(-md * md * 2.5);
  wp += toMouse * ms * 0.08;

  // Five large blobs drifting in slow independent orbits
  vec2 b1 = vec2((0.22 + 0.18 * sin(t * 0.70)) * ar,        0.30 + 0.17 * cos(t * 0.50));
  vec2 b2 = vec2((0.72 + 0.14 * cos(t * 0.60 + 1.1)) * ar,  0.70 + 0.13 * sin(t * 0.80 + 0.4));
  vec2 b3 = vec2((0.50 + 0.22 * sin(t * 0.45 + 2.3)) * ar,  0.48 + 0.19 * cos(t * 0.65 + 1.2));
  vec2 b4 = vec2((0.85 + 0.10 * cos(t * 0.85 + 0.8)) * ar,  0.22 + 0.17 * sin(t * 0.55 + 2.1));
  vec2 b5 = vec2((0.15 + 0.12 * sin(t * 0.50 + 1.7)) * ar,  0.77 + 0.13 * cos(t * 0.75 + 0.6));

  float rb = 0.44 * ar;

  float f1 = blob(wp, b1, rb * 1.20);
  float f2 = blob(wp, b2, rb * 1.05);
  float f3 = blob(wp, b3, rb * 1.50);
  float f4 = blob(wp, b4, rb * 0.85);
  float f5 = blob(wp, b5, rb * 0.90);

  // Three very large unwarped blobs for a slow background wash (adds depth)
  float bg1 = blob(p, vec2(0.38 * ar, 0.52), rb * 2.2);
  float bg2 = blob(p, vec2(0.78 * ar, 0.32), rb * 1.9);
  float bg3 = blob(p, vec2(0.55 * ar, 0.85), rb * 1.7);

  vec3 col = BASE;

  // Background wash — ultra-soft, large-scale tint
  col = mix(col, INDIGO, bg1 * 0.14);
  col = mix(col, SKY,    bg2 * 0.12);
  col = mix(col, LAV,    bg3 * 0.10);

  // Main warped blobs
  col = mix(col, SKY,    f1 * 0.62);
  col = mix(col, ELEC,   f2 * 0.52);
  col = mix(col, INDIGO, f3 * 0.48);
  col = mix(col, DBLUE,  f4 * 0.45);
  col = mix(col, LAV,    f5 * 0.52);

  // Richer color where blobs overlap
  col = mix(col, CYAN,  clamp(f1 * f3 * 1.5, 0.0, 1.0) * 0.55);
  col = mix(col, SKY,   clamp(f2 * f5 * 1.5, 0.0, 1.0) * 0.40);

  // Subtle atmospheric glow near cursor
  col = mix(col, DBLUE, ms * 0.09);

  // Scroll intensity: blend toward BASE as user scrolls down
  col = mix(BASE, col, u_intensity);

  gl_FragColor = vec4(col, 1.0);
}
`;

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect system-level reduced-motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    const compile = (type: number, src: string): WebGLShader => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (process.env.NODE_ENV !== "production" && !gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("[AmbientBg] shader compile error:", gl.getShaderInfoLog(s));
      }
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[AmbientBg] link error:", gl.getProgramInfoLog(prog));
      }
      return;
    }
    gl.useProgram(prog);

    // Full-screen triangle strip: two tris covering clip space [-1,1]²
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime      = gl.getUniformLocation(prog, "u_time");
    const uRes       = gl.getUniformLocation(prog, "u_res");
    const uMouse     = gl.getUniformLocation(prog, "u_mouse");
    const uIntensity = gl.getUniformLocation(prog, "u_intensity");

    let rafId = 0;
    const startTime = performance.now();
    const mouseTarget = { x: 0.5, y: 0.5 };
    const mouseSmooth = { x: 0.5, y: 0.5 };
    let intensityTarget = 1.0;
    let intensity = 1.0;

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.x = e.clientX / window.innerWidth;
      mouseTarget.y = 1.0 - e.clientY / window.innerHeight; // flip Y: GL origin is bottom-left
    };
    window.addEventListener("mousemove", onMouseMove);

    const onScroll = () => {
      const vh = window.innerHeight;
      const t = Math.max(0, Math.min(1, (window.scrollY - vh * 0.5) / (vh * 1.0)));
      intensityTarget = 1.0 - t * 0.75; // 1.0 (hero) → 0.25 (lower sections)
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const render = () => {
      rafId = requestAnimationFrame(render);
      // Frame-rate-independent lerp for mouse (decayRate ≈ 5 → settles in ~0.6s)
      mouseSmooth.x += (mouseTarget.x - mouseSmooth.x) * 0.035;
      mouseSmooth.y += (mouseTarget.y - mouseSmooth.y) * 0.035;
      intensity += (intensityTarget - intensity) * 0.04;

      gl.uniform1f(uTime, (performance.now() - startTime) / 1000);
      gl.uniform2f(uMouse, mouseSmooth.x, mouseSmooth.y);
      gl.uniform1f(uIntensity, intensity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      gl.deleteProgram(prog);
      gl.deleteBuffer(quad);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none dark:opacity-0 transition-opacity duration-500"
      style={{
        zIndex: 0,
        width: "100%",
        height: "100%",
        // Instant CSS gradient fallback — shown before WebGL initialises
        // or on devices/browsers that don't support WebGL
        background:
          "linear-gradient(135deg, #f0f9ff 0%, #ede9fe 35%, #f0f4ff 65%, #ecfeff 100%)",
      }}
    />
  );
}
