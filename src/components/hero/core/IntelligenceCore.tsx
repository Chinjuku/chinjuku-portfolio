/**
 * The Intelligence Core — procedural stand-in for the final Blender model.
 *
 * Three rounded glass plates (Frontend / Backend / Data) stack around a
 * central aperture; the Neural AI Core sits in the middle and a beam runs
 * through every layer. Each plate carries its own etching so the layers
 * read at a glance. To swap in a GLB later, keep the same props and the
 * per-layer groups (plate + etching + inner detail).
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import type { CoreState } from "./scrollState";
import { useQuality, useReducedMotion } from "./hooks";
import { BackendGraph, DataStack, FrontendPanels } from "./LayerDetails";
import { NeuralCoreModel } from "./NeuralCoreModel";
import { EXPLODE_DISTANCE, PLATES, type CoreLayerId } from "./layers";
import { createEtching, createPlateGeometry } from "./plateGeometry";

interface IntelligenceCoreProps {
  state: CoreState;
  scale?: number;
  /** layer currently opened (null = overview) */
  activeLayer?: CoreLayerId | null;
  onSelectLayer?: (id: CoreLayerId) => void;
}

const ICY = new THREE.Color("#8ABFFF");
const CHROME = new THREE.Color("#C9D1DB");

const DETAILS: Record<CoreLayerId, React.FC> = {
  frontend: FrontendPanels,
  backend: BackendGraph,
  data: DataStack,
  // the Neural Core itself is the AI layer's detail (shell clears, network lights up)
  ai: () => null,
};
// inner objects float just above their plate (the AI layer is the Neural Core itself)
const DETAIL_LIFT: Record<CoreLayerId, number> = { frontend: 0.4, backend: 0.32, data: 0.4, ai: 0 };

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

export const IntelligenceCore: React.FC<IntelligenceCoreProps> = ({
  state,
  scale = 1,
  activeLayer = null,
  onSelectLayer,
}) => {
  const root = useRef<THREE.Group>(null);
  const plateGroups = useRef<(THREE.Group | null)[]>([]);
  const plateMats = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  const etchMats = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const edgeMats = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const detailGroups = useRef<Partial<Record<CoreLayerId, THREE.Group | null>>>({});
  const beam = useRef<THREE.Group>(null);
  const beamMat = useRef<THREE.MeshBasicMaterial>(null);
  const orbit = useRef<THREE.Mesh>(null);
  const floor = useRef<THREE.Mesh>(null);
  const reveal = useRef(0);
  const [hovered, setHovered] = useState<CoreLayerId | null>(null);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const glowTexture = useGlowTexture();
  const plateGeometry = useMemo(() => createPlateGeometry(), []);
  const etchings = useMemo(() => PLATES.map((p) => createEtching(p.id)), []);
  const interactive = Boolean(onSelectLayer);

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
      // three-quarter view so the stack reads as stacked plates, calmer when a layer is open
      const drift = reduced ? 0 : t * 0.08 * (1 - r);
      g.rotation.y = damp(g.rotation.y, -0.6 + state.rotateY + state.pointerX * 0.35 * (1 - r * 0.7) + drift, 3, dt);
      g.rotation.x = damp(g.rotation.x, 0.42 - r * 0.2 + state.pointerY * 0.12 * (1 - r), 3, dt);
    }

    PLATES.forEach((plate, i) => {
      const grp = plateGroups.current[i];
      const mat = plateMats.current[i];
      if (!grp || !mat) return;
      const bob = reduced ? 0 : Math.sin(t * 0.9 + i * 1.3) * 0.025 * (1 - r);
      grp.position.y = step(grp.position.y, plate.y + (1 - i) * explode * EXPLODE_DISTANCE + bob, 6);
      const isActive = activeLayer === plate.id;
      const dimmed = activeLayer !== null && !isActive;
      const lit = hovered === plate.id || isActive;
      grp.scale.setScalar(step(grp.scale.x, isActive ? 1.06 : 1, 6));
      mat.opacity = step(mat.opacity, dimmed ? 0.12 : 1, 6);
      const etch = etchMats.current[i];
      if (etch) {
        etch.opacity = step(etch.opacity, dimmed ? 0.05 : lit ? 0.95 : 0.4, 6);
        etch.color.lerpColors(CHROME, ICY, lit ? 1 : 0);
      }
      const edge = edgeMats.current[i];
      if (edge) {
        edge.opacity = step(edge.opacity, dimmed ? 0.1 : 0.9, 6);
        edge.color.lerpColors(CHROME, ICY, lit ? 1 : 0);
      }
    });

    (Object.keys(DETAILS) as CoreLayerId[]).forEach((id) => {
      const d = detailGroups.current[id];
      if (!d) return;
      const s = step(d.scale.x, activeLayer === id ? 1.35 : 0, 5);
      d.scale.setScalar(Math.max(s, 0.0001));
      d.visible = s > 0.01;
      const i = PLATES.findIndex((p) => p.id === id);
      d.position.y = (i >= 0 ? plateGroups.current[i]?.position.y ?? 0 : 0) + DETAIL_LIFT[id];
    });

    // the beam stretches with the explode and breathes
    if (beam.current) beam.current.scale.y = 1 + explode * 1.6;
    if (beamMat.current) {
      const aiOn = activeLayer === "ai" || hovered === "ai";
      const base = activeLayer && !aiOn ? 0.08 : aiOn ? 0.5 : 0.25;
      beamMat.current.opacity = base * (reduced ? 1 : 0.8 + Math.sin(t * 2.2) * 0.2);
    }
    if (orbit.current) {
      if (!reduced) orbit.current.rotation.z = t * 0.1;
      (orbit.current.material as THREE.MeshStandardMaterial).opacity = 0.45 - r * 0.35;
    }
    if (floor.current) {
      floor.current.position.y = -(0.72 + explode * EXPLODE_DISTANCE) - 0.55;
      (floor.current.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - r * 0.6);
    }
  });

  const handlers = (id: CoreLayerId) => ({
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      if (!interactive) return;
      e.stopPropagation();
      setHovered(id);
    },
    onPointerOut: () => setHovered((h) => (h === id ? null : h)),
    onClick: (e: ThreeEvent<MouseEvent>) => {
      if (!interactive) return;
      e.stopPropagation();
      onSelectLayer?.(id);
    },
  });

  return (
    <group ref={root} scale={scale}>
      {/* soft light pool under the stack */}
      <mesh ref={floor} rotation={[-Math.PI / 2, 0, 0]} scale={[3.2, 3.2, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glowTexture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {PLATES.map((plate, i) => (
        <group
          key={plate.id}
          ref={(el) => {
            plateGroups.current[i] = el;
          }}
          position={[0, plate.y, 0]}
        >
          <mesh geometry={plateGeometry} {...handlers(plate.id)}>
            <meshPhysicalMaterial
              ref={(m) => {
                plateMats.current[i] = m;
              }}
              color="#6F7D91"
              transmission={1}
              thickness={0.12}
              roughness={0.03}
              ior={1.3}
              clearcoat={1}
              clearcoatRoughness={0.04}
              specularIntensity={1}
              attenuationColor="#6EA8F0"
              attenuationDistance={1.6}
              envMapIntensity={1.3}
              transparent
            />
            <Edges threshold={40}>
              <lineBasicMaterial
                ref={(m) => {
                  edgeMats.current[i] = m;
                }}
                color="#C9D1DB"
                transparent
                opacity={0.9}
              />
            </Edges>
          </mesh>
          <lineSegments geometry={etchings[i]}>
            <lineBasicMaterial
              ref={(m) => {
                etchMats.current[i] = m;
              }}
              color="#C9D1DB"
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </lineSegments>
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

      {/* the beam of intelligence running through every aperture */}
      <group ref={beam}>
        <mesh>
          <cylinderGeometry args={[0.018, 0.018, 1.6, 16, 1, true]} />
          <meshBasicMaterial
            ref={beamMat}
            color="#B5D5FF"
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 1.6, 24, 1, true]} />
          <meshBasicMaterial color="#8ABFFF" transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* the Neural AI Core in the central aperture (the AI layer) */}
      <group scale={1.2}>
      <NeuralCoreModel
        state={state}
        hovered={hovered === "ai"}
        active={activeLayer === "ai"}
        dimmed={activeLayer !== null && activeLayer !== "ai"}
        low={quality.isLow}
        handlers={handlers("ai")}
      />
      </group>

      {/* thin tilted orbit ring for silhouette */}
      <mesh ref={orbit} rotation={[Math.PI / 2 - 0.12, 0, 0.18]}>
        <torusGeometry args={[1.7, 0.005, 8, 200]} />
        <meshStandardMaterial color="#C9D1DB" metalness={1} roughness={0.25} transparent />
      </mesh>
    </group>
  );
};
