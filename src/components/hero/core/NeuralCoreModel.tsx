import React, { Component, Suspense, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { CoreState } from "./scrollState";
import { useReducedMotion } from "./hooks";
import {
  NEURAL_CORE_GLB,
  NEURAL_CORE_NAMES,
  NEURAL_CORE_RADIUS,
  type NeuralCorePartKey,
} from "./neuralCore";
import { NeuralCorePlaceholder } from "./NeuralCorePlaceholder";
import { useCoreAnimations } from "./useCoreAnimations";

type Register = (key: NeuralCorePartKey, obj: THREE.Object3D | null) => void;
type MeshHandlers = React.ComponentProps<"mesh">;

export interface NeuralCoreModelProps {
  state: CoreState;
  hovered: boolean;
  active: boolean;
  dimmed: boolean;
  low: boolean;
  /** pointer handlers for the AI layer, attached to the glass shell */
  handlers: MeshHandlers;
}

/** A broken or missing GLB must never take the hero down: fall back to the placeholder. */
class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.warn(`[hero] ${NEURAL_CORE_GLB.url} could not be loaded, using the placeholder core:`, error.message);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** The Blender asset: cloned, normalized so Glass_Shell has radius NEURAL_CORE_RADIUS, parts registered by name. */
const NeuralCoreGlb: React.FC<{ register: Register; handlers: MeshHandlers }> = ({ register, handlers }) => {
  const { scene } = useGLTF(NEURAL_CORE_GLB.url);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const reference = clone.getObjectByName(NEURAL_CORE_NAMES.shell) ?? clone;
    const sphere = new THREE.Box3().setFromObject(reference).getBoundingSphere(new THREE.Sphere());
    const s = sphere.radius > 0 ? NEURAL_CORE_RADIUS / sphere.radius : 1;
    clone.scale.multiplyScalar(s);
    clone.position.sub(sphere.center.multiplyScalar(s));
    return clone;
  }, [scene]);

  useLayoutEffect(() => {
    (Object.keys(NEURAL_CORE_NAMES) as NeuralCorePartKey[]).forEach((key) => {
      const obj = model.getObjectByName(NEURAL_CORE_NAMES[key]) ?? null;
      // opacity is animated on these, so their materials must be transparent
      if (obj && (key === "network" || key === "shell")) {
        const m = (obj as THREE.Mesh).material as THREE.Material | undefined;
        if (m) m.transparent = true;
      }
      register(key, obj);
    });
    return () => (Object.keys(NEURAL_CORE_NAMES) as NeuralCorePartKey[]).forEach((key) => register(key, null));
  }, [model, register]);

  return <primitive object={model} {...handlers} />;
};

/**
 * SPA hosts (Vite dev, Vercel rewrites) answer a missing file with index.html
 * and status 200, which would make the GLB loader reject. Check first so a
 * missing asset quietly keeps the placeholder.
 */
const useGlbAvailable = (url: string, enabled: boolean): boolean => {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    fetch(url, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (alive) setOk(r.ok && !type.includes("text/html"));
        if (!r.ok || type.includes("text/html")) console.warn(`[hero] ${url} not found, using the placeholder core`);
      })
      .catch(() => alive && setOk(false));
    return () => {
      alive = false;
    };
  }, [url, enabled]);
  return enabled && ok;
};

/** The Neural AI Core at the center of the stack: the GLB when enabled, else the placeholder. */
export const NeuralCoreModel: React.FC<NeuralCoreModelProps> = ({ state, hovered, active, dimmed, low, handlers }) => {
  const reduced = useReducedMotion();
  const { group, register } = useCoreAnimations({ state, hovered, active, dimmed, reduced });
  const placeholder = <NeuralCorePlaceholder register={register} low={low} shellHandlers={handlers} />;
  const glbReady = useGlbAvailable(NEURAL_CORE_GLB.url, NEURAL_CORE_GLB.enabled);

  return (
    <group ref={group}>
      {glbReady ? (
        <ModelErrorBoundary fallback={placeholder}>
          <Suspense fallback={placeholder}>
            <NeuralCoreGlb register={register} handlers={handlers} />
          </Suspense>
        </ModelErrorBoundary>
      ) : (
        placeholder
      )}
    </group>
  );
};
