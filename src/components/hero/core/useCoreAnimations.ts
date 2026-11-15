import { useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { CoreState } from "./scrollState";
import { ORBIT_RADII, emptyNeuralCoreParts, type NeuralCorePartKey, type NeuralCoreParts } from "./neuralCore";

interface CoreAnimationOptions {
  state: CoreState;
  /** pointer is over the core */
  hovered: boolean;
  /** the AI layer is open */
  active: boolean;
  /** another layer is open */
  dimmed: boolean;
  reduced: boolean;
}

type WithMaterial = THREE.Object3D & { material?: THREE.Material | THREE.Material[] };
const materialOf = (o: THREE.Object3D | null) => {
  const m = (o as WithMaterial | null)?.material;
  return (Array.isArray(m) ? m[0] : m) as (THREE.Material & { emissiveIntensity?: number; opacity: number }) | undefined;
};

const tmpM = new THREE.Matrix4();
const tmpV = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();
const one = new THREE.Vector3(1, 1, 1);

/**
 * All Neural Core motion in one frame loop (delta-time damped, no React
 * state): idle float, ring + planet orbits, node pulse, core breathing and
 * hover / open illumination. Works for both the GLB and the placeholder;
 * any part that is missing is simply skipped.
 *
 * Owns the refs it animates: attach `group` to the model's root and call
 * `register(key, object)` for each named part (GLB lookup or placeholder).
 */
export const useCoreAnimations = (opts: CoreAnimationOptions) => {
  const group = useRef<THREE.Group>(null);
  const parts = useRef<NeuralCoreParts>(emptyNeuralCoreParts());
  const register = useCallback((key: NeuralCorePartKey, obj: THREE.Object3D | null) => {
    parts.current[key] = obj;
  }, []);

  useFrame(({ clock }, dt) => {
    const { hovered, active, dimmed, reduced } = opts;
    const t = reduced ? 0 : clock.getElapsedTime();
    const p = parts.current;
    const k = (cur: number, target: number, lambda = 5) =>
      reduced ? target : THREE.MathUtils.damp(cur, target, lambda, dt);

    if (group.current) group.current.position.y = reduced ? 0 : Math.sin(t * 0.8) * 0.03;

    const lit = hovered || active;
    const core = materialOf(p.coreSphere);
    if (core && core.emissiveIntensity !== undefined) {
      const breathe = reduced ? 0 : Math.sin(t * 1.6) * 0.15;
      core.emissiveIntensity = k(core.emissiveIntensity, (lit ? 2.6 : dimmed ? 0.5 : 1.6) + breathe);
    }
    const net = materialOf(p.network);
    if (net) net.opacity = k(net.opacity, lit ? 0.9 : dimmed ? 0.2 : 0.55);

    const shell = materialOf(p.shell);
    if (shell) shell.opacity = k(shell.opacity, active ? 0.25 : dimmed ? 0.5 : 1, 4);

    if (!reduced) {
      if (p.ring1) p.ring1.rotation.z += dt * 0.15;
      if (p.ring2) p.ring2.rotation.z -= dt * 0.1;
    }

    // planets ride their rings (placeholder: instanced; GLB: spin the group)
    const planets = p.planets as THREE.InstancedMesh | null;
    const layout = planets?.userData.planets as [number, number][] | undefined;
    if (planets?.isInstancedMesh && layout) {
      layout.forEach(([ring, phase], i) => {
        const r = ring === 0 ? p.ring1 : p.ring2;
        if (!r) return;
        r.updateMatrix();
        const a = phase + t * (ring === 0 ? 0.5 : -0.35);
        tmpV.set(Math.cos(a) * ORBIT_RADII[ring], Math.sin(a) * ORBIT_RADII[ring], 0).applyMatrix4(r.matrix);
        planets.setMatrixAt(i, tmpM.compose(tmpV, tmpQ.identity(), one));
      });
      planets.instanceMatrix.needsUpdate = true;
    } else if (planets && !reduced) {
      planets.rotation.y += dt * 0.2;
    }

    // neural nodes pulse (placeholder: per instance; GLB: whole object)
    const nodes = p.nodes as THREE.InstancedMesh | null;
    const base = nodes?.userData.basePositions as THREE.Vector3[] | undefined;
    if (nodes?.isInstancedMesh && base && !reduced) {
      base.forEach((pos, i) => {
        const s = 1 + 0.3 * Math.sin(t * 2 + i) + (lit ? 0.2 : 0);
        nodes.setMatrixAt(i, tmpM.compose(pos, tmpQ.identity(), tmpV.setScalar(s)));
      });
      nodes.instanceMatrix.needsUpdate = true;
    } else if (nodes && !reduced) {
      nodes.scale.setScalar(1 + 0.04 * Math.sin(t * 2));
    }

    if (p.glow) {
      const breathe = reduced ? 1 : 1 + Math.sin(t * 1.4) * 0.06;
      const target = (active ? 2 : dimmed ? 1.1 : 1.6) * breathe;
      p.glow.scale.setScalar(k(p.glow.scale.x, target));
    }
  });

  return { group, register };
};
