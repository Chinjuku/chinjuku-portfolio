// Lazy-loaded so three.js / R3F stay out of the main bundle and the hero
// text paints before the 3D scene is ready.
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CoreFallback } from "./CoreFallback";
import {
  NeuralCoreCanvas,
  hasWebGL,
  IntelligenceCore,
  layerExplodedY,
  type CoreLayerId,
  type CoreState,
} from "./core";

const CAMERA_Z = 6;

/** Flies the camera toward the opened layer and back out on close. */
const CameraRig: React.FC<{ activeLayer: CoreLayerId | null; scale: number; offsetX: number }> = ({
  activeLayer,
  scale,
  offsetX,
}) => {
  const lookAt = useRef(new THREE.Vector3());
  useFrame(({ camera }, dt) => {
    const y = activeLayer ? layerExplodedY(activeLayer) * scale : 0;
    const z = activeLayer ? (activeLayer === "ai" ? 4.2 : 4.4) : CAMERA_Z;
    // shift the view so the opened layer sits left of the detail panel
    const x = activeLayer ? offsetX : 0;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 3.5, dt);
    lookAt.current.x = THREE.MathUtils.damp(lookAt.current.x, x, 3.5, dt);
    // sit slightly above the opened layer so its ring reads as an ellipse
    camera.position.y = THREE.MathUtils.damp(camera.position.y, activeLayer ? y + 1.1 : 0, 3.5, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3.5, dt);
    lookAt.current.y = THREE.MathUtils.damp(lookAt.current.y, y, 3.5, dt);
    camera.lookAt(lookAt.current);
  });
  return null;
};

interface HeroCoreSceneProps {
  state: CoreState;
  scale: number;
  /** horizontal camera shift while a layer is open (desktop panel sits right) */
  offsetX?: number;
  activeLayer: CoreLayerId | null;
  onSelectLayer: (id: CoreLayerId) => void;
  onClose: () => void;
  className?: string;
}

const HeroCoreScene: React.FC<HeroCoreSceneProps> = ({
  state,
  scale,
  offsetX = 0,
  activeLayer,
  onSelectLayer,
  onClose,
  className,
}) =>
  !hasWebGL() ? (
    <CoreFallback className={className} />
  ) : (
  <NeuralCoreCanvas
    state={state}
    className={className}
    camera={{ position: [0, 0, CAMERA_Z], fov: 35 }}
    onPointerMissed={onClose}
    settleKey={activeLayer ?? "overview"}
  >
    <CameraRig activeLayer={activeLayer} scale={scale} offsetX={offsetX} />
    <IntelligenceCore
      state={state}
      scale={scale}
      activeLayer={activeLayer}
      onSelectLayer={onSelectLayer}
    />
  </NeuralCoreCanvas>
  );

export default HeroCoreScene;
