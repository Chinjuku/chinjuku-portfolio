export type CoreLayerId = "frontend" | "backend" | "data" | "ai";

/** Glass plates stacked top → bottom; the AI layer is the orb in the central aperture. */
export const PLATES: { id: Exclude<CoreLayerId, "ai">; y: number }[] = [
  { id: "frontend", y: 0.42 },
  { id: "backend", y: 0 },
  { id: "data", y: -0.42 },
];

export const PLATE_SIZE = 2.0;
export const PLATE_HOLE = 0.42;
export const EXPLODE_DISTANCE = 0.9;

/** Y (before the Core's own scale) of a layer when fully exploded. */
export const layerExplodedY = (id: CoreLayerId): number => {
  const i = PLATES.findIndex((p) => p.id === id);
  return i < 0 ? 0 : PLATES[i].y + (1 - i) * EXPLODE_DISTANCE;
};
