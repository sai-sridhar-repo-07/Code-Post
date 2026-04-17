"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ── Star field ──────────────────────────────────────────── */
function Stars() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(9000);
    for (let i = 0; i < 9000; i++) arr[i] = (Math.random() - 0.5) * 100;
    return arr;
  }, []);

  useFrame((_, delta) => {
    ref.current.rotation.x -= delta * 0.015;
    ref.current.rotation.y -= delta * 0.008;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#818cf8" size={0.06} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

/* ── Secondary star layer (warmer tones) ─────────────────── */
function Stars2() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(4000);
    for (let i = 0; i < 4000; i++) arr[i] = (Math.random() - 0.5) * 60;
    return arr;
  }, []);

  useFrame((_, delta) => {
    ref.current.rotation.x += delta * 0.01;
    ref.current.rotation.z += delta * 0.005;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#38bdf8" size={0.04} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}

/* ── Floating torus ──────────────────────────────────────── */
function FloatingTorus({ position, color, speed, radius }: {
  position: [number, number, number]; color: string; speed: number; radius: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.y = t * 0.6;
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.6;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, radius * 0.3, 16, 60]} />
      <meshStandardMaterial color={color} transparent opacity={0.2} wireframe />
    </mesh>
  );
}

/* ── Floating icosahedron ────────────────────────────────── */
function FloatingIco({ position, color, speed, size }: {
  position: [number, number, number]; color: string; speed: number; size: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.y = position[1] + Math.sin(t) * 0.7;
    ref.current.position.x = position[0] + Math.cos(t * 0.6) * 0.4;
    ref.current.rotation.x = t * 0.35;
    ref.current.rotation.z = t * 0.25;
  });
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial color={color} transparent opacity={0.14} wireframe />
    </mesh>
  );
}

/* ── Floating octahedron ─────────────────────────────────── */
function FloatingOcta({ position, color, speed, size }: {
  position: [number, number, number]; color: string; speed: number; size: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.y = position[1] + Math.cos(t * 1.1) * 0.5;
    ref.current.rotation.x = t * 0.5;
    ref.current.rotation.y = t * 0.3;
    ref.current.rotation.z = t * 0.4;
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[size]} />
      <meshStandardMaterial color={color} transparent opacity={0.18} wireframe />
    </mesh>
  );
}

/* ── Floating torus knot ─────────────────────────────────── */
function FloatingKnot({ position, color, speed }: {
  position: [number, number, number]; color: string; speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.5;
    ref.current.position.y = position[1] + Math.sin(t * 0.7) * 0.4;
  });
  return (
    <mesh ref={ref} position={position}>
      <torusKnotGeometry args={[0.7, 0.22, 80, 12, 2, 3]} />
      <meshStandardMaterial color={color} transparent opacity={0.16} wireframe />
    </mesh>
  );
}

/* ── Perspective grid plane ──────────────────────────────── */
function GridPlane() {
  return (
    <>
      <gridHelper args={[60, 60, "#1e1b4b", "#0f172a"]} position={[0, -6, -4]} />
      <gridHelper args={[40, 20, "#312e81", "#0f172a"]} position={[0, -6, -4]} rotation={[Math.PI / 2, 0, 0]} />
    </>
  );
}

/* ── Ambient particles drifting upward ───────────────────── */
function AmbientParticles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(600);
    for (let i = 0; i < 200; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    ref.current.position.y += delta * 0.12;
    if (ref.current.position.y > 10) ref.current.position.y = -10;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#c084fc" size={0.12} sizeAttenuation depthWrite={false} opacity={0.5} />
    </Points>
  );
}

/* ── Scene ───────────────────────────────────────────────── */
function SceneObjects() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]}   color="#818cf8" intensity={3} />
      <pointLight position={[-10, -5, -10]} color="#38bdf8" intensity={2} />
      <pointLight position={[0, 5, -8]}     color="#c084fc" intensity={1.5} />
      <pointLight position={[8, -3, 5]}     color="#f472b6" intensity={1} />

      <Stars />
      <Stars2 />
      <AmbientParticles />
      <GridPlane />

      <FloatingTorus position={[-5, 1, -4]}   color="#818cf8" speed={0.4} radius={1.4} />
      <FloatingTorus position={[5, -1, -6]}   color="#38bdf8" speed={0.3} radius={1.0} />
      <FloatingTorus position={[0, 2, -9]}    color="#c084fc" speed={0.5} radius={0.7} />
      <FloatingTorus position={[-8, -2, -7]}  color="#f472b6" speed={0.35} radius={1.1} />

      <FloatingIco position={[-7, 0, -5]}   color="#38bdf8" speed={0.5} size={0.7} />
      <FloatingIco position={[7, 1, -3]}    color="#c084fc" speed={0.4} size={0.5} />
      <FloatingIco position={[2, -2, -7]}   color="#818cf8" speed={0.6} size={0.9} />
      <FloatingIco position={[-3, 3, -6]}   color="#f472b6" speed={0.45} size={0.4} />

      <FloatingOcta position={[9, 2, -5]}   color="#a78bfa" speed={0.38} size={0.6} />
      <FloatingOcta position={[-4, -3, -8]} color="#60a5fa" speed={0.55} size={0.5} />

      <FloatingKnot position={[6, -3, -8]}  color="#c084fc" speed={0.25} />
      <FloatingKnot position={[-6, 2, -10]} color="#38bdf8" speed={0.2} />
    </>
  );
}

export function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 65 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <SceneObjects />
    </Canvas>
  );
}
