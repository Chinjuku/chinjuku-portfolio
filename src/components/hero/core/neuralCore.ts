import type * as THREE from "three";

/** Object names shared by the Blender GLB and the procedural placeholder. */
export const NEURAL_CORE_NAMES = {
  coreSphere: "Core_Sphere",
  network: "Neural_Network",
  nodes: "Neural_Nodes",
  shell: "Glass_Shell",
  ring1: "Orbit_Ring_01",
  ring2: "Orbit_Ring_02",
  planets: "Orbit_Planets",
  glow: "Core_Glow",
} as const;

export type NeuralCorePartKey = keyof typeof NEURAL_CORE_NAMES;
export type NeuralCoreParts = Record<NeuralCorePartKey, THREE.Object3D | null>;

export const emptyNeuralCoreParts = (): NeuralCoreParts => ({
  coreSphere: null,
  network: null,
  nodes: null,
  shell: null,
  ring1: null,
  ring2: null,
  planets: null,
  glow: null,
});

/** Flip `enabled` once public/models/neural-ai-core.glb exists (see docs/hero/neural-ai-core-asset-spec.md). */
export const NEURAL_CORE_GLB = { url: "/models/neural-ai-core.glb", enabled: false };

/** Glass shell radius in Core units (before the Core's own scale). */
export const NEURAL_CORE_RADIUS = 0.5;

/** Radii of the two orbit rings (planets ride on them). */
export const ORBIT_RADII = [0.7, 0.82] as const;
