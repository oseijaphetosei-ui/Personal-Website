"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Fluid ambient shader
//
// Architecture:
//   1. Divergence-free curl-noise velocity field (two scales)
//   2. Semi-Lagrangian backward advection (3 × RK2 steps)
//   3. Sample IQ cosine palette at the advected source position
//   4. Saturation boost — colors are rendered at full intensity in WebGL;
//      the translucency and diffusion come entirely from CSS (opacity + blur).
//
// Mouse: vortex rotation + directional push, both decay via u_mstr.
// Scroll: u_inten fades the field toward white in lower sections.
// ─────────────────────────────────────────────────────────────────────────────
const FRAG = `
precision highp float;

uniform float u_time;
uniform vec2  u_res;
uniform vec2  u_mouse;   // [0,1]x[0,1], y=0 at bottom
uniform vec2  u_mvel;    // mouse velocity, norm-viewport / sec
uniform float u_mstr;    // mouse energy [0,1]
uniform float u_inten;   // scroll intensity 1→0.25

// ─── IQ cosine palette ───────────────────────────────────────────────────────
// c = (1,1,1) makes it truly periodic: pal(t) = pal(t+1), safe with fract().
// d = (0.10, 0.45, 0.75) starts the sweep at violet-pink and covers:
//     violet → indigo → electric blue → cyan → emerald → lime → gold → orange → ruby → violet
vec3 pal(float t) {
  return vec3(0.5) + vec3(0.5) * cos(6.28318 * (t + vec3(0.10, 0.45, 0.75)));
}

// ─── Value noise + fBm ───────────────────────────────────────────────────────
float _h(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(_h(i), _h(i+vec2(1.,0.)), f.x),
             mix(_h(i+vec2(0.,1.)), _h(i+vec2(1.,1.)), f.x), f.y);
}
float fbm(vec2 p) {
  float v=0.0, a=0.5;
  mat2 m = mat2(1.6,1.2,-1.2,1.6);
  v+=a*vn(p); p=m*p; a*=0.5;
  v+=a*vn(p); p=m*p; a*=0.5;
  v+=a*vn(p);
  return v;
}

// ─── Curl-noise velocity (divergence-free by construction) ───────────────────
// v = (∂φ/∂y, −∂φ/∂x), where φ = fbm(scaled_p + time_drift)
// Two scales: large slow flow + small faster turbulence.
vec2 flowAt(vec2 p, float t) {
  const float E = 0.005;

  vec2 d1 = t * vec2(0.068, 0.044);
  float f0=fbm(p*0.80+d1), fx=fbm(p*0.80+d1+vec2(E,0.)), fy=fbm(p*0.80+d1+vec2(0.,E));
  vec2 c1 = vec2(fy-f0, -(fx-f0)) / E;

  vec2 d2 = t * vec2(0.122, 0.085) + vec2(4.3, 2.1);
  float g0=fbm(p*1.65+d2), gx=fbm(p*1.65+d2+vec2(E,0.)), gy=fbm(p*1.65+d2+vec2(0.,E));
  vec2 c2 = vec2(gy-g0, -(gx-g0)) / E;

  return c1*0.45 + c2*0.18;
}

// ─── Mouse force ─────────────────────────────────────────────────────────────
// Vortex: rotational swirl around cursor (peaks ~0.12 units away).
// Push: directional force aligned with mouse velocity.
vec2 mouseForce(vec2 p, vec2 mo, vec2 mv, float ms) {
  vec2  d  = p - mo;
  float r2 = dot(d,d) + 0.0005;
  float r  = sqrt(r2);
  vec2 vortex = vec2(-d.y, d.x) * (ms * 0.0065 * r / (r2 + 0.018));
  float spd   = min(length(mv), 2.0);
  vec2  push  = (spd > 0.005 ? normalize(mv) : vec2(0.)) * spd * exp(-r2*10.0) * ms * 0.09;
  return vortex + push;
}

// ─── Color field ─────────────────────────────────────────────────────────────
// Sampled at the advected source position — static fbm patches that look like
// they're streaming because advection moves the sampling point through them.
vec3 colorAt(vec2 pos) {
  float n1 = fbm(pos * 0.95);
  float n2 = fbm(pos * 0.72 + vec2(3.4, 1.9));
  float n3 = fbm(pos * 1.55 + vec2(7.1, 4.2));
  float n4 = fbm(pos * 0.50 + vec2(1.3, 8.6)); // extra low-freq layer for large blobs

  // Combine layers; fract wraps smoothly (palette is periodic, no seams)
  float t = fract(n1 * 1.5 + n2 * 0.65 + n3 * 0.22 + n4 * 0.35);

  // Add local frequency detail for iridescence — makes adjacent points vary in hue
  float detail = fbm(pos * 3.5 + vec2(n1*2.0, n2*2.0)) * 0.08;
  t = fract(t + detail);

  vec3 col = pal(t);

  // Saturation boost: the shader renders at full vividness.
  // CSS opacity (0.28) and CSS blur (70-80px) handle the translucency + diffusion.
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = vec3(lum) + 2.0 * (col - vec3(lum));
  return clamp(col, 0.0, 1.0);
}

void main() {
  vec2 uv  = gl_FragCoord.xy / u_res;
  float ar = u_res.x / u_res.y;
  vec2 p   = vec2(uv.x * ar, uv.y);
  float t  = u_time;
  vec2 mo  = vec2(u_mouse.x * ar, u_mouse.y);
  vec2 mv  = vec2(u_mvel.x  * ar, u_mvel.y);

  // Semi-Lagrangian backward advection — 3 steps × RK2 midpoint.
  // Each step traces backward by DT units along the flow field.
  const float DT = 0.28, HD = 0.14;
  vec2 pos=p, v0, pm;

  v0=flowAt(pos,t)+mouseForce(pos,mo,mv,u_mstr); pm=pos-v0*HD;
  pos=pos-(flowAt(pm,t)+mouseForce(pm,mo,mv,u_mstr))*DT;

  v0=flowAt(pos,t)+mouseForce(pos,mo,mv,u_mstr); pm=pos-v0*HD;
  pos=pos-(flowAt(pm,t)+mouseForce(pm,mo,mv,u_mstr))*DT;

  v0=flowAt(pos,t)+mouseForce(pos,mo,mv,u_mstr); pm=pos-v0*HD;
  pos=pos-(flowAt(pm,t)+mouseForce(pm,mo,mv,u_mstr))*DT;

  vec3 col = colorAt(pos);

  // Fade toward white as user scrolls (preserves readability)
  col = mix(vec3(1.0), col, u_inten);

  gl_FragColor = vec4(col, 1.0);
}
`;

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Responsive blur radius: larger viewport benefits from more diffusion
    const isMobile = window.innerWidth < 768;
    canvas.style.filter = `blur(${isMobile ? 48 : 78}px)`;

    const gl = canvas.getContext("webgl", {
      alpha: false, antialias: false, depth: false,
      stencil: false, preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    }) as WebGLRenderingContext | null;
    if (!gl) return;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src); gl!.compileShader(s);
      if (process.env.NODE_ENV !== "production" && !gl!.getShaderParameter(s, gl!.COMPILE_STATUS))
        console.warn("[AmbientBg]", gl!.getShaderInfoLog(s));
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (process.env.NODE_ENV !== "production")
        console.warn("[AmbientBg] link:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uMvel  = gl.getUniformLocation(prog, "u_mvel");
    const uMstr  = gl.getUniformLocation(prog, "u_mstr");
    const uInten = gl.getUniformLocation(prog, "u_inten");

    let rafId = 0;
    const t0 = performance.now();
    // Mobile: half-resolution canvas (CSS scales it up — invisible for a blurry effect)
    const scale = isMobile ? 0.5 : 1.0;

    const resize = () => {
      const w = Math.max(1, Math.round((canvas.clientWidth  || window.innerWidth)  * scale));
      const h = Math.max(1, Math.round((canvas.clientHeight || window.innerHeight) * scale));
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // ── Mouse tracking ────────────────────────────────────────────────────────
    const mTarget = { x: 0.5, y: 0.5 };
    const mSmooth = { x: 0.5, y: 0.5 };
    const mVel    = { x: 0.0, y: 0.0 };
    let   mStr    = 0.0;
    let prevRx    = 0.5, prevRy = 0.5;

    const onMove = (e: MouseEvent) => {
      const rx = e.clientX / window.innerWidth;
      const ry = 1.0 - e.clientY / window.innerHeight; // flip Y for GL (0 = bottom)
      const dvx = (rx - prevRx) * 60; // scale to approx units/sec at 60fps events
      const dvy = (ry - prevRy) * 60;
      prevRx = rx; prevRy = ry;
      // Exponentially smooth velocity to remove jitter
      mVel.x = mVel.x * 0.55 + dvx * 0.45;
      mVel.y = mVel.y * 0.55 + dvy * 0.45;
      mTarget.x = rx; mTarget.y = ry;
      // Accumulate mouse energy proportional to speed
      mStr = Math.min(1.0, mStr + Math.hypot(dvx, dvy) * 0.042);
    };
    window.addEventListener("mousemove", onMove);

    // ── Scroll intensity ──────────────────────────────────────────────────────
    let intenTarget = 1.0, inten = 1.0;
    const onScroll = () => {
      const vh = window.innerHeight;
      const f = Math.max(0, Math.min(1, (window.scrollY - vh * 0.5) / vh));
      intenTarget = 1.0 - f * 0.75;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Dark-mode pause ───────────────────────────────────────────────────────
    // The canvas is dark:opacity-0 — invisible — so drawing the fluid sim in
    // dark mode is pure GPU waste. Skip the draw while .dark is set; keep the
    // rAF loop alive (near-zero cost) so the sim resumes instantly on toggle.
    let isDark = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ── Render loop ───────────────────────────────────────────────────────────
    const render = () => {
      rafId = requestAnimationFrame(render);

      // Smooth mouse follow (slightly delayed for organic feel)
      mSmooth.x += (mTarget.x - mSmooth.x) * 0.055;
      mSmooth.y += (mTarget.y - mSmooth.y) * 0.055;
      // Inertia: velocity and energy decay naturally
      mVel.x  *= 0.91;
      mVel.y  *= 0.91;
      mStr    *= 0.983;
      inten   += (intenTarget - inten) * 0.04;

      if (isDark) return; // invisible in dark mode — skip the GPU work

      gl.uniform1f(uTime,  (performance.now() - t0) / 1000);
      gl.uniform2f(uMouse, mSmooth.x, mSmooth.y);
      gl.uniform2f(uMvel,  mVel.x,    mVel.y);
      gl.uniform1f(uMstr,  mStr);
      gl.uniform1f(uInten, inten);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      gl.deleteProgram(prog);
      gl.deleteBuffer(quad);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // opacity-[0.28]: Tailwind arbitrary value — specificity (0,1,0)
      // dark:opacity-0: specificity (0,2,0) because of the .dark parent selector — wins
      // transition-opacity: smooth theme-switch animation
      className="fixed inset-0 pointer-events-none opacity-[0.28] dark:opacity-0 transition-opacity duration-500"
      style={{
        zIndex: 0,
        width: "100%",
        height: "100%",
        // filter set by JS after mount (responsive blur radius).
        // This default is replaced in useEffect — present here for the first frame.
        filter: "blur(78px)",
        // Static gradient shown on the first frame before WebGL fires,
        // and as a permanent fallback if WebGL is unavailable.
        background:
          "linear-gradient(135deg,#edd6ff 0%,#d0d4ff 22%,#c2eeff 44%,#c8ffea 66%,#fef9d0 88%,#ffd6f0 100%)",
      }}
    />
  );
}
