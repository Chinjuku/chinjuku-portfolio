import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { CoreState } from "./scrollState";
import { useQuality, useReducedMotion } from "./hooks";

interface CoreCanvasProps {
  state: CoreState;
  children?: ReactNode;
  camera?: { position: [number, number, number]; fov: number };
  className?: string;
  /** called when a click lands on empty canvas (no 3D object hit) */
  onPointerMissed?: () => void;
  /** change this to re-run the reduced-motion settle frames (e.g. on selection) */
  settleKey?: string | number;
}

/**
 * With frameloop="demand" (reduced motion) nothing re-renders on its own, so
 * damped values would freeze mid-way. Render frames for a short window after
 * mount so the scene settles into its static pose, then stop.
 */
const Settle: React.FC = () => {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const id = window.setInterval(() => invalidate(), 16);
    const stop = window.setTimeout(() => window.clearInterval(id), 1500);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, [invalidate]);
  return null;
};

/**
 * Studio-lit, transparent R3F canvas shared by all concepts.
 * Reflections come from procedural Lightformers (no HDR download).
 */
export const CoreCanvas: React.FC<CoreCanvasProps> = ({
  state,
  children,
  camera = { position: [0, 0, 6], fov: 35 },
  className = "",
  onPointerMissed,
  settleKey,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();
  const quality = useQuality();

  // Pause rendering while offscreen.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer → normalized coordinates.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      state.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [state]);

  const frameloop = reduced ? "demand" : visible ? "always" : "never";

  return (
    <div ref={wrapperRef} className={className}>
      <Canvas
        frameloop={frameloop}
        dpr={[1, quality.dpr]}
        camera={camera}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        aria-hidden="true"
        onPointerMissed={onPointerMissed}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[4, 6, 5]} intensity={1.2} color="#F4F6FA" />
        <Environment resolution={256} frames={1}>
          {/* softbox studio: long strips give the chrome its Apple-like highlights */}
          <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[10, 1.2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={2} position={[-5, 1, -1]} scale={[8, 0.6, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={2} position={[5, -1, -1]} scale={[8, 0.6, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="ring" color="#8ABFFF" intensity={1.5} position={[0, 0, -6]} scale={3} />
        </Environment>
        {reduced && <Settle key={settleKey} />}
        {children}
      </Canvas>
    </div>
  );
};
