import React, { Component, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { CoreFallback } from "../CoreFallback";
import { CoreLighting } from "./CoreLighting";
import type { CoreState } from "./scrollState";
import { useQuality, useReducedMotion } from "./hooks";

interface NeuralCoreCanvasProps {
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

/** If WebGL context creation (or the scene) throws, show the static fallback. */
class CanvasErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("[hero] 3D core failed, showing fallback:", error.message, info.componentStack?.slice(0, 120));
  }
  render() {
    return this.state.failed ? <CoreFallback className="h-full w-full" /> : this.props.children;
  }
}

/**
 * Studio-lit, transparent R3F canvas shared by all concepts.
 * Reflections come from procedural Lightformers (no HDR download).
 */
export const NeuralCoreCanvas: React.FC<NeuralCoreCanvasProps> = ({
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
  // adaptive pixel ratio: PerformanceMonitor steps between 1 and the device cap
  const [dpr, setDpr] = useState(quality.dpr);

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
      <CanvasErrorBoundary>
      <Canvas
        frameloop={frameloop}
        dpr={Math.min(dpr, quality.dpr)}
        camera={camera}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        aria-hidden="true"
        onPointerMissed={onPointerMissed}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(quality.dpr)} />
        <CoreLighting />
        {reduced && <Settle key={settleKey} />}
        {children}
      </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};
