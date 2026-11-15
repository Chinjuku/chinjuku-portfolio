/**
 * TEMPORARY PLACEHOLDER — procedural geometry standing in for the final
 * Blender model. To swap: replace the shell/rings with a useGLTF model but
 * keep the same props and the per-layer groups (hit areas + inner details).
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { CoreState } from "./scrollState";
import { useQuality, useReducedMotion } from "./hooks";
import { AiLattice, BackendGraph, DataStack, FrontendPanels } from "./LayerDetails";
import { EXPLODE_DISTANCE, RINGS, type CoreLayerId } from "./layers";

interface IntelligenceCoreProps {
  state: CoreState;
  scale?: number;
  /** layer currently opened (null = overview) */
  activeLayer?: CoreLayerId | null;
  onSelectLayer?: (id: CoreLayerId) => void;
}

const OBSIDIAN = new THREE.Color("#080B12");
const ICY = new THREE.Color("#8ABFFF");
const BLACK = new THREE.Color("#000000");

const DETAILS: Record<CoreLayerId, React.FC> = {
  frontend: FrontendPanels,
  backend: BackendGraph,
  data: DataStack,
  ai: AiLattice,
};

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

/** Invisible, generous hit volume so thin rings are easy to click. */
const HitArea: React.FC<{
  children: React.ReactNode;
  onOver: () => void;
  onOut: () => void;
  onClick: () => void;
  enabled: boolean;
}> = ({ children, onOver, onOut, onClick, enabled }) => (
  <mesh
    onPointerOver={(e: ThreeEvent<PointerEvent>) => {
      if (!enabled) return;
      e.stopPropagation();
      onOver();
    }}
    onPointerOut={onOut}
    onClick={(e: ThreeEvent<MouseEvent>) => {
      if (!enabled) return;
      e.stopPropagation();
      onClick();
    }}
  >
    {children}
    <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
  </mesh>
);

export const IntelligenceCore: React.FC<IntelligenceCoreProps> = ({
  state,
  scale = 1,
  activeLayer = null,
  onSelectLayer,
}) => {
  const root = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ringGroups = useRef<(THREE.Group | null)[]>([]);
  const ringMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const detailGroups = useRef<Partial<Record<CoreLayerId, THREE.Group | null>>>({});
  const orbit = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Sprite>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const coreMesh = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Group>(null);
  const reveal = useRef(0);
  const [hovered, setHovered] = useState<CoreLayerId | null>(null);
  const quality = useQuality();
  const reduced = useReducedMotion();
  const glowTexture = useGlowTexture();
  const interactive = Boolean(onSelectLayer);

  // pointer cursor while hovering a layer; always reset on unmount
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    const step = (cur: number, target: number, lambda: number) =>
      reduced ? target : damp(cur, target, lambda, dt);

    reveal.current = step(reveal.current, activeLayer ? 1 : 0, 4);
    const r = reveal.current;
    const explode = Math.max(state.explode, r);

    const g = root.current;
    if (g) {
      // calmer motion while a layer is open so it can be read
      const drift = t * 0.06 * (1 - r);
      g.rotation.y = damp(g.rotation.y, state.rotateY + state.pointerX * 0.3 * (1 - r * 0.7) + drift, 3, dt);
      g.rotation.x = damp(g.rotation.x, 0.18 * (1 - r) + state.pointerY * 0.15 * (1 - r), 3, dt);
    }

    RINGS.forEach((ring, i) => {
      const grp = ringGroups.current[i];
      const mat = ringMats.current[i];
      if (!grp || !mat) return;
      grp.position.y = step(grp.position.y, ring.y + (1 - i) * explode * EXPLODE_DISTANCE, 6);
      const isActive = activeLayer === ring.id;
      const dimmed = activeLayer !== null && !isActive;
      grp.scale.setScalar(step(grp.scale.x, isActive ? 1.12 : 1, 6));
      mat.opacity = step(mat.opacity, dimmed ? 0.15 : 1, 6);
      mat.emissive.lerpColors(BLACK, ICY, hovered === ring.id || isActive ? 0.25 : 0);
      const spin = grp.children[0];
      if (spin) spin.rotation.z = t * (0.15 + i * 0.05) * (i % 2 ? -1 : 1) * (isActive ? 0.3 : 1);
    });

    (Object.keys(DETAILS) as CoreLayerId[]).forEach((id) => {
      const d = detailGroups.current[id];
      if (!d) return;
      const target = activeLayer === id ? 1.35 : 0;
      const s = step(d.scale.x, target, 5);
      d.scale.setScalar(Math.max(s, 0.0001));
      d.visible = s > 0.01;
      // details follow their ring's exploded position
      const i = RINGS.findIndex((ring) => ring.id === id);
      if (i >= 0) d.position.y = ringGroups.current[i]?.position.y ?? 0;
    });

    if (shell.current) {
      const s = 1 + state.focus * 1.6 + r * 0.25;
      shell.current.scale.setScalar(s);
      const mat = shell.current.material as THREE.Material;
      mat.opacity = (1 - state.focus) * (1 - r * 0.85);
      shell.current.visible = mat.opacity > 0.02;
    }
    if (inner.current) inner.current.scale.setScalar(1 - state.focus * 0.55);
    if (orbit.current) {
      orbit.current.rotation.z = t * 0.1;
      (orbit.current.material as THREE.MeshStandardMaterial).opacity = 1 - r * 0.8;
    }
    if (coreMat.current) {
      const aiFocus = activeLayer === "ai" || hovered === "ai";
      coreMat.current.emissiveIntensity = step(coreMat.current.emissiveIntensity, aiFocus ? 2.2 : activeLayer ? 0.5 : 1.2, 5);
    }
    // shrink the glowing sphere when the AI layer opens so its lattice reads
    if (coreMesh.current) {
      const coreScale = activeLayer === "ai" ? 0.45 : activeLayer ? 0.55 : 1;
      coreMesh.current.scale.setScalar(step(coreMesh.current.scale.x, coreScale, 5));
    }
    if (glow.current) {
      const pulse = 1 + Math.sin(t * 1.4) * 0.06;
      glow.current.scale.setScalar((activeLayer === "ai" ? 1.5 : activeLayer ? 0.8 : 1.25) * pulse);
    }
  });

  const hitProps = (id: CoreLayerId) => ({
    enabled: interactive,
    onOver: () => setHovered(id),
    onOut: () => setHovered((h) => (h === id ? null : h)),
    onClick: () => onSelectLayer?.(id),
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
        {RINGS.map((ring, i) => (
          <group
            key={ring.id}
            ref={(el) => {
              ringGroups.current[i] = el;
            }}
            position={[0, ring.y, 0]}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[ring.radius, ring.tube, 24, 128]} />
              <meshStandardMaterial
                ref={(m) => {
                  ringMats.current[i] = m;
                }}
                color="#C9D1DB"
                metalness={1}
                roughness={0.15}
                transparent
              />
            </mesh>
            <HitArea {...hitProps(ring.id)}>
              <torusGeometry args={[ring.radius, 0.2, 8, 48]} />
            </HitArea>
          </group>
        ))}

        {/* per-layer inner objects, hidden until that layer is opened */}
        {(Object.keys(DETAILS) as CoreLayerId[]).map((id) => {
          const Detail = DETAILS[id];
          return (
            <group
              key={id}
              ref={(el) => {
                detailGroups.current[id] = el;
              }}
              scale={0.0001}
              visible={false}
            >
              <Detail />
            </group>
          );
        })}

        {/* thin tilted orbit ring */}
        <mesh ref={orbit} rotation={[Math.PI / 2.6, 0.4, 0]}>
          <torusGeometry args={[1.9, 0.008, 8, 160]} />
          <meshStandardMaterial color="#C9D1DB" metalness={1} roughness={0.25} transparent />
        </mesh>

        {/* AI core */}
        <mesh ref={coreMesh}>
          <sphereGeometry args={[0.22, 48, 48]} />
          <meshStandardMaterial ref={coreMat} color="#8ABFFF" emissive="#8ABFFF" emissiveIntensity={1.2} />
        </mesh>
        <HitArea {...hitProps("ai")}>
          <sphereGeometry args={[0.42, 16, 16]} />
        </HitArea>
        <sprite ref={glow}>
          <spriteMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
    </group>
  );
};
