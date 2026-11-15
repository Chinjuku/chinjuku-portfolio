# Hero Neural AI Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put a premium, named-part Neural AI Core (GLB-ready, procedural placeholder for now) at the center of the existing hero layer stack, with a WebGL fallback and adaptive DPR.

**Architecture:** One R3F canvas (`NeuralCoreCanvas`, renamed from `CoreCanvas`) with lighting split into `CoreLighting`. `IntelligenceCore` keeps plates/etchings/details and renders `NeuralCoreModel` in the enlarged aperture; the model resolves to either GLB nodes (by name) or `NeuralCorePlaceholder`, and both are driven by one `useCoreAnimations` hook through a shared `NeuralCoreParts` ref object.

**Tech Stack:** React 19, Vite 7, three 0.187, @react-three/fiber 9, @react-three/drei 10, GSAP 3.13.

**Spec:** `docs/superpowers/specs/2026-11-16-hero-neural-core-design.md`

## Global Constraints

- No new dependencies; no post-processing. Glow = additive sprite / emissive only.
- Exactly one `<Canvas>` on the page. three.js stays out of `index-*.js` (Hero imports core files directly, never the `core` barrel).
- GLB path `/models/neural-ai-core.glb`; object names exactly: `Core_Sphere`, `Neural_Network`, `Neural_Nodes`, `Glass_Shell`, `Orbit_Ring_01`, `Orbit_Ring_02`, `Orbit_Planets`, `Core_Glow`.
- Placeholder must be labeled TEMPORARY in a top-of-file comment.
- Scroll walkthrough, snap, click/panel behavior, layer ids `frontend|backend|data|ai` unchanged.
- No test framework (not approved): verification = `npx eslint <changed files>`, `npx tsc -b`, `npm run build`, Playwright checks. Pre-existing lint errors in CodeActivities/ThemeContext/ProfileAura are out of scope.
- Commit after each task on `feat/intelligence-core-hero`; push once at the end (Task 4).

## Review Focus

1. **No WebGL** (context creation returns null): hero shows `CoreFallback`, text/buttons/scroll still work, no uncaught error. → Task 1 step 4.
2. **GLB enabled but missing/invalid** (Vite dev serves index.html for unknown paths): placeholder renders, one console warning, no crash. → Task 3 step 3.
3. **Hover/click on the core vs. a plate** after the aperture grows: core opens `ai`, plates open their own layer. → Task 2 step 5.
4. **Mobile 375px**: core fully inside the stage, labels/panel unaffected, no horizontal scroll. → Task 4 step 2.
5. **Reduced motion**: static core (no idle/orbit/pulse), explode pose correct after Settle. → Task 4 step 3.

---

### Task 1: Canvas restructure, lighting split, fallback, adaptive DPR (no visual change)

**Files:**
- Rename: `src/components/hero/core/CoreCanvas.tsx` → `NeuralCoreCanvas.tsx` (export `NeuralCoreCanvas`; same props as today)
- Create: `src/components/hero/core/CoreLighting.tsx`, `src/components/hero/core/webgl.ts`, `src/components/hero/CoreFallback.tsx`
- Modify: `src/components/hero/core/index.ts`, `src/components/hero/HeroCoreScene.tsx`, `src/components/Hero.tsx` (Suspense fallback only)

**Interfaces:**
- Produces: `CoreLighting: React.FC` (ambient 0.15 + directional key `[4,6,5]` 1.2 + `Environment resolution={256} frames={1}` with the current four Lightformers + a new faint icy rim `pointLight` at `[-3, 1.5, -2]`, color `#8ABFFF`, intensity 0.6).
- Produces: `hasWebGL(): boolean` (try `webgl2` then `webgl` on a throwaway canvas; false on throw/null; memoized).
- Produces: `CoreFallback({ className?: string }): JSX` — pure CSS/SVG (no three import): soft radial icy glow, two thin ellipse rings, three stacked rounded-rect outlines; `aria-hidden`.
- Produces: `NeuralCoreCanvas` wraps `<Canvas>` in a class `CanvasErrorBoundary` (renders `<CoreFallback/>` on error) and adds drei `PerformanceMonitor` that steps `dpr` between `1` and `quality.dpr` (`onDecline` → 1, `onIncline` → cap).

- [ ] Step 1: Implement the four pieces; `HeroCoreScene` renders `<CoreFallback className=…/>` instead of the canvas when `!hasWebGL()`; Hero's `Suspense fallback` becomes `<CoreFallback className="absolute inset-0" />`.
- [ ] Step 2: `npx eslint src/components/hero src/components/Hero.tsx && npx tsc -b && npm run build` → no new errors; `grep -l WebGLRenderer dist/assets/index-*.js` → nothing.
- [ ] Step 3: Playwright 1440×900 screenshot of `/` matches pre-change composition (stack + labels on scroll).
- [ ] Step 4 (Review Focus 1): Playwright with init script `HTMLCanvasElement.prototype.getContext = () => null` → `#hero` shows the fallback SVG, `h1` visible, scrolling past hero works, `pageerror` count 0.
- [ ] Step 5: Commit `refactor(hero): NeuralCoreCanvas, CoreLighting, WebGL fallback, adaptive DPR`.

### Task 2: Placeholder Neural Core + animations in the stack

**Files:**
- Create: `src/components/hero/core/neuralCore.ts` (names + config + parts type), `NeuralCorePlaceholder.tsx`, `useCoreAnimations.ts`, `NeuralCoreModel.tsx`
- Modify: `IntelligenceCore.tsx` (remove orb/gyro/glow/beam-highlight logic, render `NeuralCoreModel`; smoked plates), `layers.ts`, `plateGeometry.ts` (hole from `PLATE_HOLE`), `src/components/hero/HeroLayerLabel.tsx` (anchors), `HeroCoreScene.tsx` (AI camera distance)

**Interfaces:**
- Produces in `neuralCore.ts`:
  - `NEURAL_CORE_NAMES = { coreSphere: "Core_Sphere", network: "Neural_Network", nodes: "Neural_Nodes", shell: "Glass_Shell", ring1: "Orbit_Ring_01", ring2: "Orbit_Ring_02", planets: "Orbit_Planets", glow: "Core_Glow" } as const`
  - `type NeuralCoreParts = { [K in keyof typeof NEURAL_CORE_NAMES]: THREE.Object3D | null }`
  - `NEURAL_CORE_GLB = { url: "/models/neural-ai-core.glb", enabled: false }`
  - `NEURAL_CORE_RADIUS = 0.5` (shell radius, world units before Core scale)
- Produces: `NeuralCorePlaceholder({ partsRef: MutableRefObject<NeuralCoreParts>, low: boolean })` — builds every named part (set `.name` to the exact string): sphere r 0.26 emissive `#8ABFFF` intensity 1.6; network = one `LineSegments` of ~36 (low: 18) curved filaments (CatmullRom through 3 random points inside r 0.24, 12 segments each) additive `#B5D5FF` opacity 0.55; nodes = one `InstancedMesh` (r 0.012) at filament end/mid points, emissive; shell = sphere r 0.5 `MeshPhysicalMaterial` transmission 1, roughness 0.05, ior 1.3, thickness 0.2, attenuation `#8ABFFF`/1.5; rings = chrome tori r 0.7 tube 0.006 tilt `[1.2, 0, 0.3]` and r 0.82 tube 0.005 tilt `[1.9, 0.4, -0.2]`; planets = `InstancedMesh` of 3 spheres r 0.02 (2 on ring1, 1 on ring2); glow = additive sprite scale 1.6. Random layout generated at module scope (lint purity).
- Produces: `useCoreAnimations(parts: MutableRefObject<NeuralCoreParts>, opts: { state: CoreState; hovered: boolean; active: boolean; dimmed: boolean; reduced: boolean })` — single `useFrame`, delta-time damping, no setState: float `y = sin(t·0.8)·0.03`; ring1/ring2 rotate on their own axes at 0.15/−0.1 rad/s; planets advance along their ring; node pulse via per-instance scale `1 + 0.35·sin(t·2 + i)`; core emissive base 1.6, hover/active → 2.6, dimmed → 0.5; network opacity 0.55 → 0.9 on hover/active; glow scale breathes ±6 %; shell opacity → 0.25 when `active`; reduced → write target values once, no time terms.
- Produces: `NeuralCoreModel({ state, hovered, active, dimmed, low, handlers })` where `handlers` is the same `{ onPointerOver, onPointerOut, onClick }` object `IntelligenceCore` builds for `"ai"`; attach to the shell mesh (hit target). Task 3 adds the GLB branch; here it always renders the placeholder.
- Values: `layers.ts` → `PLATES y: 0.55, 0, -0.55`, `PLATE_HOLE = 0.6`, `EXPLODE_DISTANCE = 0.9` (unchanged). Plates: color `#8E9DB2`, roughness 0.08, thickness 0.12, extrude depth 0.04. `HERO` desktop scale stays 0.6; recompute label `top` % from a screenshot so each label sits beside its exploded plate (±3 %).

- [ ] Step 1: Implement `neuralCore.ts`, placeholder, hook, model; wire into `IntelligenceCore` (core group at y 0, inside backend aperture).
- [ ] Step 2: Update `layers.ts`, plate hole/material, `HeroCoreScene` AI camera `z` so the whole shell + rings fit (start 4.6) .
- [ ] Step 3: `npx eslint src/components/hero && npx tsc -b` clean.
- [ ] Step 4: Playwright 1440×900: overview screenshot, then wheel-step through Frontend/Backend/Data/AI (same script as before) → each panel opens, screenshots read as "neural core in stack"; adjust label anchors.
- [ ] Step 5 (Review Focus 3): mouse click at core center opens `AI Core layer`; click on a plate corner region opens that plate's layer.
- [ ] Step 6: Commit `feat(hero): neural AI core placeholder inside the layer stack`.

### Task 3: GLB loading path + Blender asset spec

**Files:**
- Modify: `src/components/hero/core/NeuralCoreModel.tsx`
- Create: `docs/hero/neural-ai-core-asset-spec.md`

**Interfaces:**
- Consumes: `NEURAL_CORE_GLB`, `NEURAL_CORE_NAMES`, `NeuralCoreParts`, `useCoreAnimations`, `NeuralCorePlaceholder` (Task 2).
- Produces: inner `NeuralCoreGlb` — `useGLTF(NEURAL_CORE_GLB.url)`, `scene.clone(true)`, fill `partsRef` via `scene.getObjectByName(name)` for every name (missing names stay `null` and are skipped by the hook), scale the clone so its bounding-sphere radius equals `NEURAL_CORE_RADIUS`. `NeuralCoreModel` renders `NeuralCoreGlb` inside a `ModelErrorBoundary` (fallback = placeholder, `console.warn` once) and `Suspense` (fallback = placeholder) only when `NEURAL_CORE_GLB.enabled`.
- Asset spec contents: names/hierarchy (all children of an empty `Neural_AI_Core`), units (shell radius 0.5 m, origin center, +Y up, transforms applied), budgets (total ≤ 60k tris, textures ≤ 1024², GLB < 3 MB), materials (Principled BSDF only: metallic/roughness; glass = Transmission + IOR + Volume → `KHR_materials_transmission/ior/volume`; emissive with Strength → `KHR_materials_emissive_strength`; no procedural/Shader-node textures), runtime-animated parts (no baked animation needed), export settings (glTF Binary, Apply Modifiers, +Y Up, Compression: meshopt preferred; if Draco, note drei loads the decoder from its CDN), enabling (`enabled: true` in `neuralCore.ts`).

- [ ] Step 1: Implement GLB branch + boundary; write the spec doc.
- [ ] Step 2: `npx eslint … && npx tsc -b` clean.
- [ ] Step 3 (Review Focus 2): temporarily set `enabled: true` with no file → page renders placeholder, exactly one warning, `pageerror` 0; set back to `false`.
- [ ] Step 4: Commit `feat(hero): GLB loading path for the neural core + Blender asset spec`.

### Task 4: Polish, performance, final verification, push

**Files:** tuning only in files from Tasks 1–3 and `HeroLayerLabel.tsx`.

- [ ] Step 1: Visual pass at 1440×900 against anti-goals (no neon haze, text readable): tune glow opacity, ring tilt, plate tint.
- [ ] Step 2 (Review Focus 4): 375×812 — core inside stage, tap core opens AI panel, `scrollWidth ≤ innerWidth`.
- [ ] Step 3 (Review Focus 5): `reducedMotion: 'reduce'` — no pin, static exploded stack with core, labels visible.
- [ ] Step 4: Playwright FPS sample (120 rAF) overview and AI-open at DPR 1 → ≥ 55 fps on this machine; record numbers.
- [ ] Step 5: `npm run build` → OK; main chunk gzip within ±5 kB of 487 kB; no `WebGLRenderer` in `index-*.js`.
- [ ] Step 6: Commit any tuning; `git push`; update PR #1 description (new section: Neural AI Core, fallback, GLB path, asset spec).
