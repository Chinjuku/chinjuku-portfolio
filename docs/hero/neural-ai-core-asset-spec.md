# Neural AI Core — Blender asset spec

The hero's Neural AI Core is currently a **temporary procedural placeholder**
(`src/components/hero/core/NeuralCorePlaceholder.tsx`). This document is what
the Blender model must follow so it can replace the placeholder with no code
changes beyond one flag.

## Deliverable

- File: `public/models/neural-ai-core.glb` (glTF Binary)
- Size: **< 3 MB** (target ~1 MB)
- Enable it: set `enabled: true` in `NEURAL_CORE_GLB` in
  `src/components/hero/core/neuralCore.ts`. If the file is missing or broken
  the site keeps the placeholder and logs one `[hero]` warning.

## Object names and hierarchy

Object names must match exactly (the code finds them with `getObjectByName`).
All are children of one empty named `Neural_AI_Core`.

| Object | What it is | Animated at runtime |
|---|---|---|
| `Core_Sphere` | Small luminous ice-blue sphere at the center | emissive strength (breathing, hover, open) |
| `Neural_Network` | Thin filaments inside the shell (curves converted to mesh, or a single line mesh) | material opacity |
| `Neural_Nodes` | Small dots at filament joints (one mesh; instancing optional) | whole-object scale pulse |
| `Glass_Shell` | Clear outer sphere around the network | material opacity (clears when the AI layer opens); also the click target |
| `Orbit_Ring_01` | Chrome ring, ~1.4× shell radius, tilted | rotation around its local Z |
| `Orbit_Ring_02` | Chrome ring, ~1.65× shell radius, different tilt | rotation around its local Z (opposite direction) |
| `Orbit_Planets` | 2–3 tiny spheres on the rings (one object/group) | rotation around Y |
| `Core_Glow` | Soft glow card/sphere behind the core (optional) | scale breathing |

Nothing needs to be keyframed in Blender; all motion is done in code.

## Units, scale and orientation

- Model so **`Glass_Shell` radius = 0.5 m**. (The loader also normalizes
  scale from the shell's bounding sphere, but keep this to avoid surprises.)
- Origin of `Neural_AI_Core` at the center of the shell; +Y up; −Z forward.
- Apply all transforms (Ctrl+A → All Transforms) before export, except the
  ring tilts, which may stay as object rotation.
- The core sits inside a 1.32 m wide aperture in the site's glass plates:
  keep everything except the two rings inside a 0.66 m radius.

## Budgets

- Total ≤ 60k triangles (shell ~4k, rings ~2k each, network as thin geometry).
- Textures optional; if used ≤ 1024², WebP or PNG; no 4k maps.
- ≤ 8 materials (fewer draw calls).

## Materials (glTF-safe only)

Use **Principled BSDF** only. Procedural textures, Shader-to-RGB,
custom node groups and Eevee-only effects (bloom, volumetrics) do not survive
glTF export.

| Part | Principled settings | glTF result |
|---|---|---|
| Glass_Shell | Base #E3ECF7, Roughness 0.05, Transmission 1, IOR 1.3, Volume thickness ~0.2, attenuation color #8ABFFF | `KHR_materials_transmission`, `_ior`, `_volume` |
| Core_Sphere, Neural_Nodes, Neural_Network | Base #8ABFFF, Emission #8ABFFF, Emission Strength 2–4 | `KHR_materials_emissive_strength` |
| Orbit rings, planets | Metallic 1, Roughness 0.15–0.2, Base #C9D1DB | standard metallic/roughness |
| Core_Glow | Emission with alpha (Blend mode: Alpha Blend) | emissive + alpha |

Keep emission modest; the site adds its own glow sprite and lighting
(studio Lightformers + an icy rim light).

## Export settings (File → Export → glTF 2.0)

- Format: **glTF Binary (.glb)**
- Include: Selected Objects (select `Neural_AI_Core` and children), Custom Properties off
- Transform: +Y Up
- Data → Mesh: Apply Modifiers on, UVs on, Normals on, Tangents off
- Data → Material: Export
- Compression: **meshopt** preferred (`gltf-transform optimize in.glb out.glb --compress meshopt`).
  If using Draco instead, note that drei loads the Draco decoder from its CDN.
- Animation: off

## Check before handing over

1. `npx gltf-transform inspect public/models/neural-ai-core.glb` → names above present, size < 3 MB.
2. Set `enabled: true`, run `npm run dev`, open `/`: the core replaces the
   placeholder, rings spin, hovering the core brightens it, opening the AI
   layer clears the shell.
