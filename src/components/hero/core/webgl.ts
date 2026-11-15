let cached: boolean | null = null;

/** True when this browser can create a WebGL context (memoized). */
export const hasWebGL = (): boolean => {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    cached = false;
  }
  return cached;
};
