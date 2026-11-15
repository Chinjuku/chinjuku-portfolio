import * as THREE from "three";
import { PLATE_HOLE, PLATE_SIZE } from "./layers";

/** Rounded-square glass plate with a circular aperture, lying flat (XZ plane). */
export const createPlateGeometry = (): THREE.BufferGeometry => {
  const h = PLATE_SIZE / 2;
  const r = 0.3;
  const shape = new THREE.Shape();
  shape.moveTo(-h + r, -h);
  shape.lineTo(h - r, -h);
  shape.quadraticCurveTo(h, -h, h, -h + r);
  shape.lineTo(h, h - r);
  shape.quadraticCurveTo(h, h, h - r, h);
  shape.lineTo(-h + r, h);
  shape.quadraticCurveTo(-h, h, -h, h - r);
  shape.lineTo(-h, -h + r);
  shape.quadraticCurveTo(-h, -h, -h + r, -h);
  const hole = new THREE.Path();
  hole.absarc(0, 0, PLATE_HOLE, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 4,
    curveSegments: 64,
  });
  g.center();
  g.rotateX(-Math.PI / 2);
  return g;
};

const TOP = 0.062; // just above the plate's top face

const seg = (pts: [number, number][]): number[] => {
  const out: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    out.push(pts[i][0], TOP, pts[i][1], pts[i + 1][0], TOP, pts[i + 1][1]);
  }
  return out;
};
const rect = (x0: number, z0: number, x1: number, z1: number) =>
  seg([[x0, z0], [x1, z0], [x1, z1], [x0, z1], [x0, z0]]);

/** Line etchings that tell the layers apart: UI blocks, circuit traces, data grid. */
export const createEtching = (id: "frontend" | "backend" | "data"): THREE.BufferGeometry => {
  const v: number[] = [];
  if (id === "frontend") {
    // a tiny app layout: header bar, sidebar, content cards
    v.push(...rect(-0.78, -0.8, 0.78, -0.6));
    v.push(...rect(-0.78, -0.5, -0.52, 0.8));
    v.push(...rect(0.52, -0.5, 0.78, 0.15));
    v.push(...rect(-0.4, 0.55, 0.78, 0.8));
    v.push(...rect(0.52, 0.25, 0.78, 0.45));
  } else if (id === "backend") {
    // right-angled traces leaving the aperture, ending in pads
    const traces: [number, number][][] = [
      [[0.46, 0], [0.64, 0], [0.64, 0.52], [0.82, 0.52]],
      [[-0.46, 0], [-0.7, 0], [-0.7, -0.62], [-0.82, -0.62]],
      [[0, 0.46], [0, 0.7], [-0.45, 0.7], [-0.45, 0.82]],
      [[0, -0.46], [0, -0.66], [0.5, -0.66], [0.5, -0.82]],
      [[0.33, 0.33], [0.52, 0.52], [0.52, 0.8]],
      [[-0.33, -0.33], [-0.5, -0.5], [-0.82, -0.5]],
    ];
    traces.forEach((t) => {
      v.push(...seg(t));
      const [ex, ez] = t[t.length - 1];
      v.push(...rect(ex - 0.025, ez - 0.025, ex + 0.025, ez + 0.025));
    });
  } else {
    // dot-matrix records around the aperture (tiny crosses read as dots)
    for (let x = -0.8; x <= 0.81; x += 0.16) {
      for (let z = -0.8; z <= 0.81; z += 0.16) {
        if (Math.hypot(x, z) < PLATE_HOLE + 0.12) continue;
        const d = 0.012;
        v.push(x - d, TOP, z, x + d, TOP, z, x, TOP, z - d, x, TOP, z + d);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
  return g;
};
