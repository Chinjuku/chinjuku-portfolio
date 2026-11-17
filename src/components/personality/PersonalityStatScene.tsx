// Radar stat แบบ 3D: แผ่น radar 5 แฉกเอียงเหมือนโฮโลแกรม มี Neural Core เดิมลอยตรงกลาง
// โหลดแบบ lazy (default export) เพื่อไม่ให้ three.js เข้า bundle หลัก
import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PERSONALITY_TRAITS } from "../../constants/personality";
import { NeuralCoreCanvas } from "../hero/core/NeuralCoreCanvas";
import { NeuralCoreModel } from "../hero/core/NeuralCoreModel";
import { useQuality, useReducedMotion } from "../hero/core/hooks";
import type { CoreState } from "../hero/core/scrollState";
import { RADAR_HOVER, RADAR_REST, RADAR_RINGS, radarAxis } from "./radarGeometry";

const COUNT = PERSONALITY_TRAITS.length;
const RADIUS = 1.35;
const LABEL_AT = 1.3; // ป้ายชื่ออยู่เลยปลายแฉกออกไป (สัดส่วนของ RADIUS)
const TILT = -0.5; // เอียงแผ่น radar ให้ดูเหมือนแผ่นโฮโลแกรมวางอยู่
const CAMERA_Z = 6;
/** สัดส่วนกว้าง/สูงขั้นต่ำที่ radar ทั้งวง (รวมป้ายชื่อ) ยังพอดี ถ้าแคบกว่านี้ให้ถอยกล้อง */
const FIT_ASPECT = 1.15;
const ICY = new THREE.Color("#8ABFFF");
const GRID = new THREE.Color("#2A3444");

const ringPoints = (scale: number) =>
  Array.from({ length: COUNT }, (_, i) => {
    const [x, y] = radarAxis(i, COUNT);
    return new THREE.Vector3(x * scale * RADIUS, y * scale * RADIUS, 0);
  });

/** วงตาราง + เส้นแกน (นิ่ง ไม่ต้องอัปเดตทุกเฟรม) */
const RadarGrid: React.FC = () => {
  const rings = useMemo(() => RADAR_RINGS.map((r) => new THREE.BufferGeometry().setFromPoints(ringPoints(r))), []);
  const spokes = useMemo(
    () =>
      new THREE.BufferGeometry().setFromPoints(
        ringPoints(1).flatMap((p) => [new THREE.Vector3(0, 0, 0), p]),
      ),
    [],
  );
  return (
    <group>
      {rings.map((g, i) => (
        <lineLoop key={i} geometry={g}>
          <lineBasicMaterial color={i === rings.length - 1 ? ICY : GRID} transparent opacity={i === rings.length - 1 ? 0.35 : 0.8} />
        </lineLoop>
      ))}
      <lineSegments geometry={spokes}>
        <lineBasicMaterial color={GRID} transparent opacity={0.8} />
      </lineSegments>
    </group>
  );
};

interface StatShapeProps {
  hover: number | null;
  onHover: (i: number | null) => void;
  onSelect: (i: number) => void;
}

/** รูป stat (fan + เส้นขอบ + จุดปลายแฉก) ยืดออกทีละแฉกตอนโหลด และแฉกที่ชี้จะยืดสุด */
const StatShape: React.FC<StatShapeProps> = ({ hover, onHover, onSelect }) => {
  const reduced = useReducedMotion();
  const scales = useRef<number[]>(Array(COUNT).fill(reduced ? RADAR_REST : 0));
  const nodes = useRef<(THREE.Mesh | null)[]>([]);

  const { fill, outline } = useMemo(() => {
    const fillGeo = new THREE.BufferGeometry();
    fillGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array((COUNT + 1) * 3), 3));
    // สามเหลี่ยมจากจุดกลางไปแต่ละคู่ของยอด
    fillGeo.setIndex(Array.from({ length: COUNT }, (_, i) => [0, i + 1, ((i + 1) % COUNT) + 1]).flat());
    const outlineGeo = new THREE.BufferGeometry();
    outlineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    return { fill: fillGeo, outline: outlineGeo };
  }, []);

  useFrame(({ clock }, dt) => {
    const t = clock.getElapsedTime();
    const fillPos = fill.getAttribute("position") as THREE.BufferAttribute;
    const linePos = outline.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      // reveal: แฉกค่อยๆ ยืดออกทีละอันหลังโหลด
      const started = reduced || t > 0.35 + i * 0.12;
      const target = !started ? 0 : hover === i ? RADAR_HOVER : RADAR_REST;
      scales.current[i] = reduced ? target : THREE.MathUtils.damp(scales.current[i], target, 6, dt);
      const [ax, ay] = radarAxis(i, COUNT);
      const x = ax * scales.current[i] * RADIUS;
      const y = ay * scales.current[i] * RADIUS;
      fillPos.setXYZ(i + 1, x, y, 0);
      linePos.setXYZ(i, x, y, 0);
      const node = nodes.current[i];
      if (node) {
        node.position.set(x, y, 0.01);
        const s = THREE.MathUtils.damp(node.scale.x, hover === i ? 1.8 : 1, 8, dt);
        node.scale.setScalar(s);
      }
    }
    fillPos.needsUpdate = true;
    linePos.needsUpdate = true;
    fill.computeBoundingSphere();
    outline.computeBoundingSphere();
  });

  return (
    <group>
      <mesh geometry={fill}>
        <meshBasicMaterial color={ICY} transparent opacity={0.09} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <lineLoop geometry={outline}>
        <lineBasicMaterial color={ICY} transparent opacity={0.9} />
      </lineLoop>
      {PERSONALITY_TRAITS.map((trait, i) => (
        <mesh
          key={trait.id}
          ref={(m) => {
            nodes.current[i] = m;
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(i);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            onHover(null);
            document.body.style.cursor = "";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(i);
          }}
        >
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshBasicMaterial color={ICY} toneMapped={false} />
          {/* hit area ใหญ่กว่าจุดที่เห็น จะได้ชี้ง่าย */}
          <mesh visible={false}>
            <sphereGeometry args={[0.2, 8, 8]} />
          </mesh>
        </mesh>
      ))}
    </group>
  );
};

interface RadarRigProps extends StatShapeProps {
  state: CoreState;
  /** ปุ่มป้ายชื่อ (DOM นอก canvas) ที่ต้องขยับตามปลายแฉกทุกเฟรม */
  labels: React.RefObject<(HTMLElement | null)[]>;
}

const LABEL_LOCAL = Array.from({ length: COUNT }, (_, i) => {
  const [x, y] = radarAxis(i, COUNT);
  return new THREE.Vector3(x * RADIUS * LABEL_AT, y * RADIUS * LABEL_AT, 0);
});

/** ทั้งแผ่น radar: เอียงตามเมาส์ แกว่งเบาๆ และมี Core อยู่ตรงกลาง */
const RadarRig: React.FC<RadarRigProps> = ({ state, hover, onHover, onSelect, labels }) => {
  const root = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const quality = useQuality();
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, camera, size }, dt) => {
    const g = root.current;
    if (!g) return;
    const sway = reduced ? 0 : Math.sin(clock.getElapsedTime() * 0.35) * 0.08;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, TILT + state.pointerY * 0.12, 3, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointerX * 0.25 + sway, 3, dt);
    // กล่องแคบกว่าสูง (เช่น tablet) ให้ถอยกล้องออก radar จะได้ไม่ล้นด้านข้าง
    const aspect = size.width / Math.max(1, size.height);
    const fitZ = CAMERA_Z * Math.max(1, FIT_ASPECT / aspect);
    camera.position.z = reduced ? fitZ : THREE.MathUtils.damp(camera.position.z, fitZ, 4, dt);
    g.updateMatrixWorld();
    // แปลงตำแหน่งปลายแฉก (3D) เป็นพิกเซลบนจอ แล้ววางป้ายชื่อตรงนั้น
    LABEL_LOCAL.forEach((local, i) => {
      const el = labels.current?.[i];
      if (!el) return;
      tmp.copy(local).applyMatrix4(g.matrixWorld).project(camera);
      const x = (tmp.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    });
  });

  return (
    <group ref={root} rotation={[TILT, 0, 0]}>
      <RadarGrid />
      <StatShape hover={hover} onHover={onHover} onSelect={onSelect} />
      {/* Neural Core ตัวเดียวกับหน้าแรก ตื่นขึ้นเมื่อชี้นิสัยใดนิสัยหนึ่ง */}
      <group scale={0.75} position={[0, 0, 0.35]}>
        <NeuralCoreModel
          state={state}
          hovered={hover !== null}
          active={false}
          dimmed={false}
          low={quality.isLow}
          handlers={{}}
        />
      </group>
    </group>
  );
};

interface PersonalityStatSceneProps {
  state: CoreState;
  onSelect: (traitId: string) => void;
  className?: string;
}

const PersonalityStatScene: React.FC<PersonalityStatSceneProps> = ({ state, onSelect, className = "" }) => {
  const [hover, setHover] = useState<number | null>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  return (
    <div className={className}>
      <NeuralCoreCanvas
        state={state}
        className="absolute inset-0"
        camera={{ position: [0, 0, CAMERA_Z], fov: 35 }}
        settleKey={hover ?? "rest"}
      >
        <RadarRig
          state={state}
          hover={hover}
          onHover={setHover}
          onSelect={(i) => onSelect(PERSONALITY_TRAITS[i].id)}
          labels={labels}
        />
      </NeuralCoreCanvas>
      {/* ป้ายชื่อนิสัยเป็นปุ่ม DOM ทับ canvas (RadarRig ขยับตำแหน่งให้ทุกเฟรม) กดด้วยคีย์บอร์ดได้ */}
      <div className="pointer-events-none absolute inset-0">
        {PERSONALITY_TRAITS.map((trait, i) => (
          <button
            key={trait.id}
            ref={(el) => {
              labels.current[i] = el;
            }}
            type="button"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            onClick={() => onSelect(trait.id)}
            aria-label={`${trait.name}: jump to trait`}
            className={`pointer-events-auto absolute left-0 top-0 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.25em] backdrop-blur-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-icy ${
              hover === i
                ? "border-core-icy/60 bg-core-icy/10 text-core-ink"
                : "border-white/10 bg-core-obsidian/60 text-core-mist"
            }`}
          >
            {trait.name.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonalityStatScene;
