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

    // ── Glass crystal ────────────────────────────────────────────────────────
    const crystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 2),
      new THREE.MeshPhysicalMaterial({
        transmission: 0.96,
        roughness: 0.02,
        metalness: 0.0,
        thickness: 0.5,
        ior: 1.6,
        color: new THREE.Color("#dffff5"),
        envMapIntensity: 1,
        transparent: true,
      })
    );
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
    const light1 = new THREE.PointLight(0x10b981, 3.5, 14);
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

    // ── Animation loop ───────────────────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

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

    return () => {
      cancelAnimationFrame(animId);
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
