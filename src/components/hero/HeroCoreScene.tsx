// Lazy-loaded so three.js / R3F stay out of the main bundle and the hero
// text paints before the 3D scene is ready.
import React from "react";
import { CoreCanvas, IntelligenceCore, type CoreState } from "./core";

interface HeroCoreSceneProps {
  state: CoreState;
  scale: number;
  className?: string;
}

const HeroCoreScene: React.FC<HeroCoreSceneProps> = ({ state, scale, className }) => (
  <CoreCanvas state={state} className={className}>
    <IntelligenceCore state={state} scale={scale} />
  </CoreCanvas>
);

export default HeroCoreScene;
