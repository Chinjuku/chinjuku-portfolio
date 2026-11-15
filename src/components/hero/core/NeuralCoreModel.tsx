import React from "react";
import type { CoreState } from "./scrollState";
import { useReducedMotion } from "./hooks";
import { NeuralCorePlaceholder } from "./NeuralCorePlaceholder";
import { useCoreAnimations } from "./useCoreAnimations";

export interface NeuralCoreModelProps {
  state: CoreState;
  hovered: boolean;
  active: boolean;
  dimmed: boolean;
  low: boolean;
  /** pointer handlers for the AI layer, attached to the glass shell */
  handlers: React.ComponentProps<"mesh">;
}

/** The Neural AI Core at the center of the stack (placeholder until the GLB ships). */
export const NeuralCoreModel: React.FC<NeuralCoreModelProps> = ({ state, hovered, active, dimmed, low, handlers }) => {
  const reduced = useReducedMotion();
  const { group, register } = useCoreAnimations({ state, hovered, active, dimmed, reduced });

  return (
    <group ref={group}>
      <NeuralCorePlaceholder register={register} low={low} shellHandlers={handlers} />
    </group>
  );
};
