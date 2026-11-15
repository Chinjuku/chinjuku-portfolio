/**
 * Inner 3D objects revealed when a layer of the Core is opened.
 * Each one is small (fits inside its ring), procedural and cheap.
 */
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const CHROME = "#C9D1DB";
const ICY = "#8ABFFF";

/** Frontend: stacked glass UI windows floating at different depths. */
export const FrontendPanels: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const panels = [
    { x: -0.28, y: 0.06, z: -0.25 },
    { x: 0.05, y: 0.0, z: 0 },
    { x: 0.3, y: -0.06, z: 0.25 },
  ];
  useFrame(({ clock }) => {
    group.current?.children.forEach((c, i) => {
      c.position.y = panels[i].y + Math.sin(clock.elapsedTime * 1.2 + i) * 0.03;
    });
  });
  return (
    <group ref={group}>
      {panels.map((p, i) => (
        <group key={i} position={[p.x, p.y, p.z]}>
          <RoundedBox args={[0.78, 0.48, 0.015]} radius={0.02} smoothness={3}>
            <meshPhysicalMaterial color={CHROME} transparent opacity={0.1} roughness={0.1} depthWrite={false} />
            <Edges threshold={20} color={i === 1 ? ICY : CHROME} />
          </RoundedBox>
          {/* title bar + three window dots */}
          <mesh position={[0, 0.2, 0.01]}>
            <boxGeometry args={[0.74, 0.004, 0.001]} />
            <meshBasicMaterial color={CHROME} transparent opacity={0.6} />
          </mesh>
          {[0, 1, 2].map((d) => (
            <mesh key={d} position={[-0.33 + d * 0.035, 0.215, 0.01]}>
              <circleGeometry args={[0.009, 12]} />
              <meshBasicMaterial color={d === 0 ? ICY : CHROME} />
            </mesh>
          ))}
          {/* content lines */}
          {[0, 1, 2].map((l) => (
            <mesh key={l} position={[-0.1 + (l === 2 ? -0.08 : 0), 0.08 - l * 0.08, 0.01]}>
              <boxGeometry args={[l === 2 ? 0.34 : 0.5, 0.025, 0.001]} />
              <meshBasicMaterial color={CHROME} transparent opacity={0.25} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

/** Backend: a small service graph with data packets travelling along edges. */
export const BackendGraph: React.FC = () => {
  const nodes = useMemo(
    () => [
      new THREE.Vector3(-0.6, 0.05, 0),
      new THREE.Vector3(-0.2, 0.2, 0.3),
      new THREE.Vector3(-0.15, -0.15, -0.3),
      new THREE.Vector3(0.25, 0.1, -0.1),
      new THREE.Vector3(0.6, -0.05, 0.25),
      new THREE.Vector3(0.55, 0.2, -0.35),
    ],
    [],
  );
  const edges: [number, number][] = useMemo(
    () => [
      [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [1, 5],
    ],
    [],
  );
  const lineGeometry = useMemo(() => {
    const pts = edges.flatMap(([a, b]) => [nodes[a], nodes[b]]);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [edges, nodes]);
  const packets = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    packets.current.forEach((m, i) => {
      if (!m) return;
      const [a, b] = edges[(i * 2) % edges.length];
      const t = (clock.elapsedTime * 0.5 + i * 0.27) % 1;
      m.position.lerpVectors(nodes[a], nodes[b], t);
    });
  });

  return (
    <group>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color={CHROME} transparent opacity={0.45} />
      </lineSegments>
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <sphereGeometry args={[i === 3 ? 0.07 : 0.05, 24, 24]} />
          <meshStandardMaterial color={CHROME} metalness={1} roughness={0.15} />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            packets.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshBasicMaterial color={ICY} />
        </mesh>
      ))}
    </group>
  );
};

// Particle start positions, generated once at module load (pure during render).
const COUNT = 60;
const DATA_POSITIONS = (() => {
  const arr = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 0.12 + Math.random() * 0.1;
    arr[i * 3] = Math.cos(a) * r;
    arr[i * 3 + 1] = Math.random() * 0.8 - 0.4;
    arr[i * 3 + 2] = Math.sin(a) * r;
  }
  return arr;
})();

/** Data: a stacked database with a column of records flowing upward. */
export const DataStack: React.FC = () => {
  const points = useRef<THREE.Points>(null);
  // own copy: the frame loop mutates it
  const positions = useMemo(() => DATA_POSITIONS.slice(), []);

  useFrame((_, dt) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      let y = attr.getY(i) + dt * 0.25;
      if (y > 0.4) y = -0.4;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <group>
      {[-0.18, 0, 0.18].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.36, 0.36, 0.11, 48]} />
            <meshStandardMaterial color={CHROME} metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.056, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.36, 0.006, 8, 64]} />
            <meshBasicMaterial color={ICY} />
          </mesh>
        </group>
      ))}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={ICY} size={0.02} transparent opacity={0.8} depthWrite={false} />
      </points>
    </group>
  );
};

/** AI: a neural lattice around the core with pulsing nodes. */
export const AiLattice: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const nodesMat = useRef<THREE.PointsMaterial>(null);
  const { edges, vertices } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(0.62, 1);
    const e = new THREE.EdgesGeometry(ico);
    return { edges: e, vertices: ico.getAttribute("position") };
  }, []);

  useFrame(({ clock }, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.3;
      group.current.rotation.x += dt * 0.1;
    }
    if (nodesMat.current) nodesMat.current.size = 0.035 + Math.sin(clock.elapsedTime * 3) * 0.012;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={ICY} transparent opacity={0.5} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[vertices.array, 3]} />
        </bufferGeometry>
        <pointsMaterial ref={nodesMat} color={ICY} size={0.035} transparent depthWrite={false} />
      </points>
    </group>
  );
};
