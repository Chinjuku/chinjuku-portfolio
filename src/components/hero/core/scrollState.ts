// Shared mutable state written by GSAP / pointer listeners and read inside
// useFrame. Mutating a plain object avoids React re-renders on every frame.
export interface CoreState {
  /** overall scroll progress of the concept, 0..1 */
  progress: number;
  /** layer separation, 0 = assembled, 1 = fully exploded */
  explode: number;
  /** target Y rotation in radians */
  rotateY: number;
  /** normalized pointer, -1..1 */
  pointerX: number;
  pointerY: number;
  /** 0 = viewing from outside, 1 = inside the glass shell */
  focus: number;
}

export const createCoreState = (): CoreState => ({
  progress: 0,
  explode: 0,
  rotateY: 0,
  pointerX: 0,
  pointerY: 0,
  focus: 0,
});
