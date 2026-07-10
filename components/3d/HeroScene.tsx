"use client";

import { useEffect, useRef, MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface MouseRef {
  x: number;
  y: number;
}

// Particle data — generated once at module load
const PARTICLE_COUNT = 140;
const PARTICLE_POSITIONS = new Float32Array(PARTICLE_COUNT * 3);
const PARTICLE_COLORS = new Float32Array(PARTICLE_COUNT * 3);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 2.5 + Math.random() * 2.2;
  PARTICLE_POSITIONS[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  PARTICLE_POSITIONS[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  PARTICLE_POSITIONS[i * 3 + 2] = r * Math.cos(phi);
  const isEmerald = Math.random() > 0.4;
  if (isEmerald) {
    PARTICLE_COLORS[i * 3] = 0.063;
    PARTICLE_COLORS[i * 3 + 1] = 0.725;
    PARTICLE_COLORS[i * 3 + 2] = 0.506;
  } else {
    PARTICLE_COLORS[i * 3] = 0.388;
    PARTICLE_COLORS[i * 3 + 1] = 0.4;
    PARTICLE_COLORS[i * 3 + 2] = 0.945;
  }
}

interface HeroSceneProps {
  mouseRef: MutableRefObject<MouseRef>;
  className?: string;
}

export function HeroScene({ mouseRef, className }: HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    // ── Scene + Camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 6;

    // ── Environment (for glass refraction) ──────────────────────────────────
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmrem.dispose();

    // ── Glass crystal — Liquid Aurora Glass material ─────────────────────────
    // Same geometry, same mesh. Only the material changes: flat shading turns
    // every facet into a distinct sparkling plane; iridescence/sheen/clearcoat
    // are native MeshPhysicalMaterial properties (cheap, real PBR) driving the
    // angle-dependent color shift and polish; a small onBeforeCompile hook adds
    // the slow-drifting aurora hue suspended inside the glass itself.
    const auroraUniforms = { uTime: { value: 0 } };

    const crystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 2),
      new THREE.MeshPhysicalMaterial({
        transmission: 0.96,
        roughness: 0.02,
        metalness: 0.0,
        thickness: 0.5,
        ior: 1.6,
        color: new THREE.Color("#eef6ff"),
        envMapIntensity: 1,
        transparent: true,
        flatShading: true,

        iridescence: 1.0,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [120, 420],

        sheen: 0.45,
        sheenColor: new THREE.Color("#a78bfa"),
        sheenRoughness: 0.35,

        clearcoat: 0.35,
        clearcoatRoughness: 0.12,

        attenuationColor: new THREE.Color("#38bdf8"),
        attenuationDistance: 1.1,
      })
    );

    crystal.material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = auroraUniforms.uTime;

      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", `#include <common>\nvarying vec3 vAuroraNormal;`)
        .replace(
          "#include <beginnormal_vertex>",
          `#include <beginnormal_vertex>\nvAuroraNormal = objectNormal;`
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform float uTime;
          varying vec3 vAuroraNormal;

          // Hue is confined to cyan → blue → indigo → violet → magenta → soft
          // pink and back — never crosses into red/orange/yellow/green.
          vec3 auroraHSL(float hue, float sat, float light) {
            vec3 rgb = clamp(abs(mod(hue * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
            return light + sat * (rgb - 0.5) * (1.0 - abs(2.0 * light - 1.0));
          }`
        )
        .replace(
          "#include <dithering_fragment>",
          `
          // Liquid aurora suspended inside the crystal — phase depends on the
          // object-space normal (each facet reads a slightly different hue)
          // plus an extremely slow time drift, never on the geometry itself.
          float auroraPhase = sin(dot(normalize(vAuroraNormal), vec3(0.5, 0.7, 0.4)) * 3.14159 + uTime * 0.045);
          float auroraHue = mix(0.47, 0.90, 0.5 + 0.5 * auroraPhase);
          vec3 aurora = auroraHSL(auroraHue, 0.62, 0.58);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, aurora, 0.22);
          #include <dithering_fragment>`
        );

      crystal.userData.shader = shader;
    };

    scene.add(crystal);

    // ── Outer wireframe shells ───────────────────────────────────────────────
    const wf1 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.85, 1),
      new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0x10b981,
        transparent: true,
        opacity: 0.055,
      })
    );
    scene.add(wf1);

    const wf2 = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.05, 1),
      new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.03,
      })
    );
    wf2.rotation.set(Math.PI / 4, Math.PI / 6, 0);
    scene.add(wf2);

    // ── Orbital particles ────────────────────────────────────────────────────
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(PARTICLE_POSITIONS.slice(), 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(PARTICLE_COLORS.slice(), 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        size: 0.022,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
      })
    );
    scene.add(particles);

    // ── Lights ───────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.08));
    const light1 = new THREE.PointLight(0x22d3ee, 3.5, 14);
    light1.position.set(4, 4, 4);
    scene.add(light1);
    const light2 = new THREE.PointLight(0x6366f1, 2.0, 12);
    light2.position.set(-4, -2, -3);
    scene.add(light2);
    const light3 = new THREE.PointLight(0xffffff, 1.2, 10);
    light3.position.set(1, 6, 1);
    scene.add(light3);

    // ── Resize handler ───────────────────────────────────────────────────────
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // ── Smooth parallax state ────────────────────────────────────────────────
    const group = new THREE.Group();
    group.add(crystal);
    group.add(wf1);
    group.add(wf2);
    scene.add(group);

    let smoothX = 0;
    let smoothY = 0;

    // ── Press-and-hold delight ───────────────────────────────────────────────
    // Holding the pointer down anywhere over the hero makes the aurora inside
    // the crystal flow ~3× faster, easing back on release. A quiet reward for
    // exploration — geometry, rotation, and material stay untouched.
    let auroraTime = 0;
    let auroraSpeed = 1;
    let auroraTarget = 1;
    const onPress = () => { auroraTarget = 3.2; };
    const onRelease = () => { auroraTarget = 1; };
    window.addEventListener("pointerdown", onPress);
    window.addEventListener("pointerup", onRelease);
    window.addEventListener("pointercancel", onRelease);

    // ── Animation loop ───────────────────────────────────────────────────────
    // Fully stopped (no rAF at all) while the hero is scrolled out of view —
    // otherwise the sphere renders forever underneath the rest of the page.
    let animId = 0;
    let sceneVisible = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!sceneVisible) {
        animId = 0;
        return;
      }
      animId = requestAnimationFrame(animate);
      // getDelta() also advances clock.elapsedTime — read both from one call
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      auroraSpeed += (auroraTarget - auroraSpeed) * 0.055;
      auroraTime += dt * auroraSpeed;
      if (crystal.userData.shader) {
        crystal.userData.shader.uniforms.uTime.value = auroraTime;
      }

      // Auto rotation
      crystal.rotation.x = t * 0.08;
      crystal.rotation.y = t * 0.12;
      wf1.rotation.x = t * 0.05;
      wf1.rotation.y = t * 0.07;

      // Float
      group.position.y = Math.sin(t * 0.7) * 0.12;

      // Mouse parallax (smoothed)
      smoothX += (mouseRef.current.y * -0.25 - smoothX) * 0.04;
      smoothY += (mouseRef.current.x * 0.25 - smoothY) * 0.04;
      group.rotation.x = smoothX;
      group.rotation.y = smoothY;

      // Orbital particles rotate slowly
      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = entry.isIntersecting;
        if (nowVisible && !sceneVisible) {
          sceneVisible = true;
          animate(); // restart the stopped loop
        } else if (!nowVisible) {
          sceneVisible = false; // loop exits on its next frame
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointerdown", onPress);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      renderer.dispose();
      envTexture.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  // mouseRef is a stable ref — safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ background: "transparent" }}
    />
  );
}
