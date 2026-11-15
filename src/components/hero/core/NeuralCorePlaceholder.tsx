/**
 * TEMPORARY PLACEHOLDER — procedural stand-in for the Blender asset
 * public/models/neural-ai-core.glb. Every part carries the same object name
 * the GLB will use, so useCoreAnimations drives both identically.
 */
import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { NEURAL_CORE_NAMES, NEURAL_CORE_RADIUS, ORBIT_RADII, type NeuralCorePartKey } from "./neuralCore";

// ---- procedural layout, generated once at module load (pure during render) ----
const FILAMENTS = 36;
const SEGMENTS = 12;
const INNER = 0.36;

const randomInSphere = (r: number) => {
  for (;;) {
    const v = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    if (v.lengthSq() <= 1) return v.multiplyScalar(r);
  }
};

const LAYOUT = (() => {
  const lines: number[] = [];
  const nodes: THREE.Vector3[] = [];
  for (let f = 0; f < FILAMENTS; f++) {
    const a = randomInSphere(INNER);
    const b = randomInSphere(INNER * 0.5);
    const c = randomInSphere(INNER);
    const pts = new THREE.CatmullRomCurve3([a, b, c]).getPoints(SEGMENTS);
    for (let i = 0; i < pts.length - 1; i++) lines.push(...pts[i].toArray(), ...pts[i + 1].toArray());
    nodes.push(a, pts[Math.floor(SEGMENTS / 2)], c);
  }
  return { lines: new Float32Array(lines), nodes, segPerFilament: SEGMENTS * 2 };
})();

// planets: [ring index, phase]
const PLANETS: [number, number][] = [
  [0, 0],
  [0, Math.PI],
  [1, Math.PI / 2],
];

const glowTexture = (() => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(181,213,255,0.85)");
    g.addColorStop(0.3, "rgba(138,191,255,0.22)");
    g.addColorStop(1, "rgba(138,191,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
})();

interface NeuralCorePlaceholderProps {
  register: (key: NeuralCorePartKey, obj: THREE.Object3D | null) => void;
  low: boolean;
  shellHandlers: React.ComponentProps<"mesh">;
}

export const NeuralCorePlaceholder: React.FC<NeuralCorePlaceholderProps> = ({ register, low, shellHandlers }) => {
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const planetsRef = useRef<THREE.InstancedMesh>(null);
  const filamentCount = low ? FILAMENTS / 2 : FILAMENTS;
  const nodeCount = filamentCount * 3;

  const networkGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(LAYOUT.lines, 3));
    g.setDrawRange(0, filamentCount * LAYOUT.segPerFilament);
    return g;
  }, [filamentCount]);

  // initial node matrices; base positions kept for the pulse animation
  useLayoutEffect(() => {
    const mesh = nodesRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < nodeCount; i++) mesh.setMatrixAt(i, m.makeTranslation(LAYOUT.nodes[i]));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.userData.basePositions = LAYOUT.nodes.slice(0, nodeCount);
  }, [nodeCount]);

  useLayoutEffect(() => {
    if (planetsRef.current) planetsRef.current.userData.planets = PLANETS;
  }, []);

  const named = (key: NeuralCorePartKey) => ({
    name: NEURAL_CORE_NAMES[key],
    ref: (o: THREE.Object3D | null) => register(key, o),
  });

  return (
    <group>
      <sprite {...named("glow")} scale={1.6}>
        <spriteMaterial map={glowTexture} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      <mesh {...named("coreSphere")}>
        <sphereGeometry args={[0.11, 48, 48]} />
        <meshStandardMaterial color="#8ABFFF" emissive="#8ABFFF" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>

      <lineSegments {...named("network")} geometry={networkGeometry}>
        <lineBasicMaterial color="#9CC8FF" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>

      <instancedMesh
        {...named("nodes")}
        ref={(o: THREE.InstancedMesh | null) => {
          nodesRef.current = o;
          register("nodes", o);
        }}
        args={[undefined, undefined, nodeCount]}
      >
        <sphereGeometry args={[0.0065, 8, 8]} />
        <meshBasicMaterial color="#B5D5FF" toneMapped={false} />
      </instancedMesh>

      <mesh {...named("shell")} {...shellHandlers}>
        <sphereGeometry args={[NEURAL_CORE_RADIUS, 64, 64]} />
        <meshPhysicalMaterial
          color="#E3ECF7"
          transmission={1}
          roughness={0.05}
          ior={1.3}
          thickness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationColor="#8ABFFF"
          attenuationDistance={1.5}
          envMapIntensity={1.6}
          transparent
        />
      </mesh>

      <mesh {...named("ring1")} rotation={[1.2, 0, 0.3]}>
        <torusGeometry args={[ORBIT_RADII[0], 0.006, 12, 160]} />
        <meshStandardMaterial color="#C9D1DB" metalness={1} roughness={0.18} />
      </mesh>
      <mesh {...named("ring2")} rotation={[1.9, 0.4, -0.2]}>
        <torusGeometry args={[ORBIT_RADII[1], 0.005, 12, 160]} />
        <meshStandardMaterial color="#C9D1DB" metalness={1} roughness={0.18} />
      </mesh>

      <instancedMesh
        {...named("planets")}
        ref={(o: THREE.InstancedMesh | null) => {
          planetsRef.current = o;
          register("planets", o);
        }}
        args={[undefined, undefined, PLANETS.length]}
      >
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color="#DDEBFF" emissive="#8ABFFF" emissiveIntensity={0.8} metalness={0.4} roughness={0.2} />
      </instancedMesh>
    </group>
  );
};
