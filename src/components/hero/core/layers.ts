export type CoreLayerId = "frontend" | "backend" | "data" | "ai";

// Frontend (top) → Backend → Data (bottom); the AI layer is the inner core.
export const RINGS: { id: Exclude<CoreLayerId, "ai">; radius: number; tube: number; y: number }[] = [
  { id: "frontend", radius: 1.02, tube: 0.045, y: 0.42 },
  { id: "backend", radius: 1.22, tube: 0.06, y: 0 },
  { id: "data", radius: 1.02, tube: 0.045, y: -0.42 },
];

export const EXPLODE_DISTANCE = 0.9;

/** Y (before the Core's own scale) of a layer when fully exploded. */
export const layerExplodedY = (id: CoreLayerId): number => {
  const i = RINGS.findIndex((r) => r.id === id);
  return i < 0 ? 0 : RINGS[i].y + (1 - i) * EXPLODE_DISTANCE;
};
