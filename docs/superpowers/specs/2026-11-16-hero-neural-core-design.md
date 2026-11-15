# Hero — Neural AI Core inside the layer stack (design)

Date: 2026-11-16 · Status: draft, awaiting approval · Branch: `feat/intelligence-core-hero` (PR #1)

## Intent and why

The owner wants the hero 3D to look **more premium** per the new art direction
"Neural AI Core — Premium / Minimal / Apple-like", while keeping what the hero
already does well: tell the **Full-stack × AI** story through layers, with the
scroll walkthrough and click-to-open panels they asked for earlier.

Chosen approach **A (hybrid)**: keep the three glass layer plates
(Frontend / Backend / Data) and replace the small blue orb in the middle with a
large **Neural AI Core** built from named parts, loadable from a Blender GLB.

## Current state (what exists)

- `src/components/Hero.tsx`: layout, copy, GSAP pinned scroll walkthrough
  (+=480%, directional snap, inertia off), click/label/panel logic. Lazy-loads
  `hero/HeroCoreScene.tsx`.
- `hero/HeroCoreScene.tsx`: one `<CoreCanvas>` + `CameraRig` (fly-in per layer) +
  `<IntelligenceCore>`.
- `hero/core/CoreCanvas.tsx`: the only R3F `<Canvas>` (transparent, Lightformer
  environment, offscreen pause, reduced-motion "Settle", pointer → `CoreState`).
- `hero/core/IntelligenceCore.tsx`: procedural plates (`plateGeometry.ts`),
  etchings, beam, orb + gyro, glow sprite, orbit ring, floor glow, per-layer
  inner objects (`LayerDetails.tsx`), hover/click handlers.
- `hero/core/layers.ts`: plate Y positions, hole radius, explode distance,
  `layerExplodedY` (also drives `CameraRig` and label anchors in
  `HeroLayerLabel.tsx`, calibrated for desktop scale 0.62).
- No GLB, no `public/models/`, no WebGL fallback, no post-processing.
- Blender is **not installed** on this machine.

## Goals

1. A large, premium Neural AI Core at the center of the stack:
   `Core_Sphere`, `Neural_Network`, `Neural_Nodes`, `Glass_Shell`,
   `Orbit_Ring_01`, `Orbit_Ring_02`, `Orbit_Planets`, `Core_Glow`.
2. Plates restyled as thin **smoked glass** (no milky grey), still etched,
   still clickable, still opening their inner objects.
3. Component split per the prompt: `HeroSection` (= existing `Hero.tsx`),
   `NeuralCoreCanvas`, `NeuralCoreModel`, `CoreLighting`, `CoreAnimations`,
   `CoreFallback`.
4. GLB path via `useGLTF('/models/neural-ai-core.glb')`, animating named
   objects. Until the asset exists, a **temporary procedural placeholder** with
   the *same object names* is used, clearly labeled.
5. WebGL fallback + Suspense loading fallback.
6. Asset spec document for whoever builds the model in Blender.

## Non-goals

- Changing site layout, nav, copy, other sections, or `/projects`.
- Building the Blender model here (no Blender available).
- Removing the scroll walkthrough or the layer panels.

## Anti-goals (failure even if it works)

- Generic neon "AI orb": saturated glow, bloom haze, busy particles.
- Hero text/buttons harder to read than today.
- Jank: < 50 fps on a mid laptop, or broken pins/snap after the change.
- A second `<Canvas>`, console errors, or the placeholder passed off as final.

## Constraints

- Stack as-is: React 19, Vite 7, three 0.187, R3F 9, drei 10, GSAP 3.13.
- **No new dependencies.** Glow is faked with additive sprites/emissive (no
  `@react-three/postprocessing`). Revisit only with owner approval.
- Prompt says "avoid scroll hijacking"; the owner explicitly asked for the
  scroll walkthrough earlier, so it **stays** (owner decision supersedes).
- three.js must stay out of the main bundle (import core files directly, as now).

## Approaches considered

| | Approach | Trade-off | Decision |
|---|---|---|---|
| A | Neural Core inside the existing plate stack | Premium AI look + keeps layer story, walkthrough, panels; slightly busier image | **Chosen** |
| B | Neural Core only (prompt verbatim) | Most faithful to prompt; loses layer story/panels; closer to generic AI orb | Not chosen |
| C | Polish current stack only | Fastest; not the new art direction | Not chosen |

## Design

### Composition
```
        ╭── Orbit_Ring_01 (tilted) ──╮
   ┌────┴─ Frontend plate (aperture) ─┴──┐
   │      ╭── Glass_Shell ──╮            │
   ├──────│  Core_Sphere +  │── Backend ─┤   ← Neural Core sits in the
   │      │  Neural_Network │            │     enlarged central aperture
   │      ╰─ Neural_Nodes ──╯            │
   └──── Data plate ─────────────────────┘
        ╰── Orbit_Ring_02 + Orbit_Planets ──╯      Core_Glow behind
```
- Neural Core shell radius ≈ 0.5 (world, before Core scale); plate aperture
  enlarged to ≈ 0.6 so the shell sits in the backend plate's hole; base plate
  spacing increased to ≈ 0.55 so the core reads between plates in the overview.
  `layerExplodedY` and label anchors are recalibrated accordingly.
- The vertical beam stays (thin, softer) and passes through the core.
- Orbit rings: two chrome tori at different tilts around the core (radius
  ≈ 0.7 / 0.82), replacing the current gyroscope; the large outer silhouette
  ring stays.

### Look
- Core_Sphere: ice-blue emissive, soft (not white-hot); inner Neural_Network:
  thin luminous filaments (curves inside the sphere); Neural_Nodes: small
  emissive dots at filament joints (instanced); Glass_Shell: clear physical
  glass with low roughness, subtle icy attenuation; Core_Glow: large soft
  additive sprite, low opacity.
- Plates: smoked glass (darker tint, roughness ≈ 0.08, thinner), chrome edges
  and etchings unchanged in meaning.
- Lighting moved to `CoreLighting` (same Lightformer studio + a faint icy rim
  light aimed at the core).

### Components (all under `src/components/hero/core/`)
- `NeuralCoreCanvas` — the existing `CoreCanvas`, renamed; still the only
  `<Canvas>`; adds adaptive DPR (drei `PerformanceMonitor` stepping DPR between
  1 and quality cap) and an error boundary that switches to `CoreFallback` if
  WebGL context creation fails.
- `CoreLighting` — environment + key/rim lights (extracted from the canvas).
- `NeuralCoreModel` — renders the Neural Core. If `NEURAL_CORE_GLB.enabled`
  (constant in `layers.ts` or a small config) and the GLB loads, it uses
  `useGLTF` and pulls nodes by name; otherwise renders `NeuralCorePlaceholder`
  (procedural, same names, a visible `TEMPORARY` comment and a dev-only
  console note). A load error falls back to the placeholder (error boundary).
- `useCoreAnimations` (the "CoreAnimations" unit) — one hook that takes the
  named object refs + `CoreState` + hover/active flags and does, in `useFrame`
  with delta time and no React state: idle float, ring/planet orbit, node
  pulse, core breathing, hover/AI-open illumination, reduced-motion snapping.
- `CoreFallback` — static CSS/SVG composition (concentric rings + soft icy
  glow + three plate outlines) used for no-WebGL and as the Suspense fallback.
- `IntelligenceCore` keeps the plates/etchings/details and renders
  `<NeuralCoreModel>` in the center instead of orb/gyro/glow.

### Interaction (unchanged contract)
- Pointer parallax on the root group (as now), hover on core → brighter core +
  network; hover/click plates and core → same `onSelectLayer` ids
  (`frontend|backend|data|ai`); scroll walkthrough and panels untouched.

### Performance
- Draw calls: network = one `LineSegments`, nodes = one `InstancedMesh`,
  planets = one `InstancedMesh`.
- Mobile/low tier (`useQuality().isLow`): fewer filaments/nodes (≈ 50 %),
  DPR cap 1.5.
- No post-processing anywhere. Reduced motion: no idle motion, Settle frames
  only. Offscreen pause kept.
- GLB target < 3 MB; textures ≤ 1k; Draco/meshopt per asset spec.

### Asset spec (deliverable)
`docs/hero/neural-ai-core-asset-spec.md`: object names and hierarchy, units
and scale (shell radius 0.5 m, origin at center, +Y up, applied transforms),
polycount budgets, glTF-safe materials only (Principled BSDF → metallic/
roughness, transmission + IOR + volume for glass, emissive strength for
core/nodes), what is animated at runtime (so nothing needs baking), export
settings (glTF Binary, compression), file path, and how to enable it in code.

## Phases (each verified before the next)
1. Restructure only: rename/extract `NeuralCoreCanvas`, `CoreLighting`,
   `CoreFallback` + WebGL detection; no visual change.
2. Placeholder Neural Core (named parts) + `useCoreAnimations`, enlarged
   aperture, recalibrated layer positions/labels, smoked-glass plates.
3. `NeuralCoreModel` GLB path (+ error fallback) and the asset spec doc.
4. Polish + performance pass; desktop/mobile/reduced-motion/no-WebGL checks;
   build; commit and push to PR #1.

## Calls made by Claude (owner to check)
- `Hero.tsx` keeps its file name (it *is* HeroSection) to avoid churn in `Home`.
- No bloom/post-processing dependency; glow is sprite/emissive only.
- Scroll walkthrough kept despite the prompt's "avoid scroll hijacking".
- GLB use is behind a constant so a missing/404 file never breaks the hero.

## Left to the builder
Exact radii, colors, filament layout, pulse timings and camera framing, tuned
against the anti-goals by screenshot.
