import React, { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Edges, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "../../constants/projects";
import type { CoreState } from "../hero/core";

interface ProjectOrbitProps {
  projects: Project[];
  state: CoreState;
  onSelect: (p: Project) => void;
  onHover?: (index: number | null) => void;
  /** DOM labels rendered outside the canvas; positioned here every frame */
  labelRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  radius?: number;
  /** world-size multiplier for cards (smaller on narrow screens) */
  cardScale?: number;
}

const VISIBLE_FROM = 0.6;

export const ProjectOrbit: React.FC<ProjectOrbitProps> = ({
  projects,
  state,
  onSelect,
  onHover,
  labelRefs,
  radius = 2.2,
  cardScale = 1,
}) => {
  const group = useRef<THREE.Group>(null);
  const cardRefs = useRef<(THREE.Group | null)[]>([]);
  const speed = useRef(1);
  const visibility = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }, dt) => {
    const target = state.focus > VISIBLE_FROM ? 1 : 0;
    visibility.current = THREE.MathUtils.damp(visibility.current, target, 5, dt);
    speed.current = THREE.MathUtils.damp(speed.current, hovered === null ? 1 : 0.2, 6, dt);
    const g = group.current;
    if (g) {
      g.rotation.y += dt * 0.18 * speed.current;
      g.scale.setScalar(0.6 + visibility.current * 0.4);
      g.visible = visibility.current > 0.02;
    }
    // project each card's centre to screen space for its DOM label
    cardRefs.current.forEach((card, i) => {
      const el = labelRefs.current[i];
      if (!card || !el) return;
      card.getWorldPosition(tmp).project(camera);
      const x = (tmp.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.style.opacity = String(tmp.z < 1 ? visibility.current : 0);
    });
  });

  const isInteractive = () => visibility.current > 0.8;
  const setHover = (i: number | null) => {
    setHovered(i);
    onHover?.(i);
  };

  // pointer cursor while a card is hovered; always reset on unmount
  useEffect(() => {
    document.body.style.cursor = hovered === null ? "" : "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  return (
    <group ref={group} rotation={[0.18, 0, 0]}>
      {projects.map((p, i) => {
        const angle = (i / projects.length) * Math.PI * 2;
        const position: [number, number, number] = [
          Math.sin(angle) * radius,
          Math.sin(angle * 2) * 0.18,
          // flattened ellipse keeps the nearest card from filling the screen
          Math.cos(angle) * radius * 0.5,
        ];
        const isHovered = hovered === i;
        const color = isHovered ? "#8ABFFF" : "#C9D1DB";
        return (
          <Billboard
            key={p.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            position={position}
            scale={cardScale}
          >
            <RoundedBox
              args={[1.05, 0.66, 0.035]}
              radius={0.035}
              smoothness={4}
              onPointerOver={(e) => {
                if (!isInteractive()) return;
                e.stopPropagation();
                setHover(i);
              }}
              onPointerOut={() => setHover(null)}
              onClick={(e) => {
                if (!isInteractive()) return;
                e.stopPropagation();
                onSelect(p);
              }}
            >
              <meshPhysicalMaterial
                color={color}
                metalness={0.3}
                roughness={0.1}
                clearcoat={1}
                transparent
                opacity={isHovered ? 0.2 : 0.08}
                depthWrite={false}
              />
              <Edges threshold={20} color={color} />
            </RoundedBox>
          </Billboard>
        );
      })}
    </group>
  );
};
