/**
 * TEMPORARY PLACEHOLDER — procedural geometry standing in for the final
 * Blender model. To swap: replace this file's body with a useGLTF-based
 * component that keeps the same props ({ state, scale }) and reads
 * state.explode / rotateY / pointer / focus the same way.
 */
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { CoreState } from "./scrollState";
import { useQuality, useReducedMotion } from "./hooks";

export const CORE_LAYER_COUNT = 3;

interface IntelligenceCoreProps {
  state: CoreState;
  scale?: number;
}

// Frontend (top) → Backend → Data (bottom)
const LAYERS = [
  { radius: 1.02, tube: 0.045, y: 0.42 },
  { radius: 1.22, tube: 0.06, y: 0 },
  { radius: 1.02, tube: 0.045, y: -0.42 },
];
const EXPLODE_DISTANCE = 0.9;
const OBSIDIAN = new THREE.Color("#080B12");

const useGlowTexture = () =>
  useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(138,191,255,0.9)");
    g.addColorStop(0.35, "rgba(138,191,255,0.25)");
    g.addColorStop(1, "rgba(138,191,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.damp(current, target, lambda, dt);

export const IntelligenceCore: React.FC<IntelligenceCoreProps> = ({ state, scale = 1 }) => {
  const root = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const layerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const orbit = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Sprite>(null);
  const inner = useRef<THREE.Group>(null);
  const quality = useQuality();
  const reduced = useReducedMotion();
  const glowTexture = useGlowTexture();

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    const g = root.current;
    if (g) {
      g.rotation.y = damp(g.rotation.y, state.rotateY + state.pointerX * 0.3 + t * 0.06, 3, dt);
      g.rotation.x = damp(g.rotation.x, 0.18 + state.pointerY * 0.15, 3, dt);
    }
    layerRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const target = LAYERS[i].y + (1 - i) * state.explode * EXPLODE_DISTANCE;
      // reduced motion renders on demand (single frames), so snap instead of easing
      mesh.position.y = reduced ? target : damp(mesh.position.y, target, 6, dt);
      mesh.rotation.z = t * (0.15 + i * 0.05) * (i % 2 ? -1 : 1);
    });
    if (shell.current) {
      const s = 1 + state.focus * 1.6;
      shell.current.scale.setScalar(s);
      const mat = shell.current.material as THREE.Material;
      mat.opacity = 1 - state.focus;
      shell.current.visible = state.focus < 0.98;
    }
    if (inner.current) inner.current.scale.setScalar(1 - state.focus * 0.55);
    if (orbit.current) orbit.current.rotation.z = t * 0.1;
    if (glow.current) {
      const pulse = 1 + Math.sin(t * 1.4) * 0.06;
      glow.current.scale.setScalar(1.25 * pulse);
    }
  });

  return (
    <group ref={root} scale={scale}>
      {/* optical glass shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.55, 1]} />
        <MeshTransmissionMaterial
          transparent
          resolution={quality.transmissionRes}
          samples={quality.samples}
          thickness={0.35}
          roughness={0.08}
          background={OBSIDIAN}
          ior={1.45}
          chromaticAberration={0.03}
          anisotropicBlur={0.08}
          distortion={0.05}
          distortionScale={0.3}
          color="#F4F6FA"
          clearcoat={1}
          clearcoatRoughness={0.1}
          backside={false}
        />
      </mesh>

      <group ref={inner}>
      {/* chrome structural layers: frontend / backend / data */}
      {LAYERS.map((layer, i) => (
        <mesh
          key={i}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          position={[0, layer.y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[layer.radius, layer.tube, 24, 128]} />
          <meshStandardMaterial color="#C9D1DB" metalness={1} roughness={0.15} />
        </mesh>
      ))}

      {/* thin tilted orbit ring */}
      <mesh ref={orbit} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <torusGeometry args={[1.9, 0.008, 8, 160]} />
        <meshStandardMaterial color="#C9D1DB" metalness={1} roughness={0.25} />
      </mesh>

      {/* AI core */}
      <mesh>
        <sphereGeometry args={[0.22, 48, 48]} />
        <meshStandardMaterial color="#8ABFFF" emissive="#8ABFFF" emissiveIntensity={1.2} />
      </mesh>
      <sprite ref={glow}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      </group>
    </group>
  );
};
