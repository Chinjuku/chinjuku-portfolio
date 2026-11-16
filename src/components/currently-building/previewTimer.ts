/** Index of the next screenshot in the rotation; stays at 0 when there is nothing to rotate. */
export const nextShot = (index: number, length: number): number =>
  length <= 1 ? 0 : (index + 1) % length;
