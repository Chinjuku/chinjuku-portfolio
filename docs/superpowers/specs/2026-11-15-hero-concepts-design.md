# Hero Concepts — "The Intelligence Core" (design)

Date: 2026-11-15 · Status: draft, awaiting approval · Scope: visual exploration only

## Intent and why

The portfolio owner wants the site to:

1. **Feel "wow"** through real interactive 3D: mouse-reactive and scroll-driven animation with the feel of lusion.co, not just a pretty static hero.
2. **Not look AI-generated.** The generic "glass + chrome + glowing core, Apple-like" recipe is itself an AI cliché. What makes it read as hand-made is **specificity**: real data, real projects, and interactions that mean something.
3. **Let visitors explore the Core** to reach profile info and projects.
4. **Be seen as Fullstack Dev *and* AI Dev**, in equal weight.

We build **three concepts** on an isolated route so the owner can compare them before choosing one for production. The concepts differ in **how the visitor travels into the Core**, not just in layout.

## Goals

- `/hero-concepts` route with a switcher between Concept 01 / 02 / 03.
- Each concept is a scroll-story hero ~3–4 viewports long (owner chose "A: long scroll-story hero that hands off to existing sections").
- Shared Core metaphor: **chrome structural shell = Fullstack** (layers: Frontend → Backend → Data), **glass luminous core = AI** (models/agents).
- Real content only, read from `src/constants/` (see Data).
- Responsive desktop + mobile; respects `prefers-reduced-motion`.
- Code organized so the placeholder Core can be swapped for a Blender GLB later with one component change.

## Non-goals

- Changing the production homepage (`/`) or projects page (`/projects`).
- Choosing the final concept or migrating the site palette.
- Final Blender model, final copy polish, SEO, light-mode version of the concepts.

## Anti-goals (failure even if it "works")

- Looks like a template / generic AI landing page: excessive gradients, neon, filler stats, lorem-style labels.
- Feels like a gaming site or a dashboard.
- Janky scroll (<50fps on a mid laptop) or a blank canvas on mobile.
- Placeholder Core presented as if it were the final model.

## Constraints

- Stack: React 19, Vite 7, TS strict, Tailwind 3, GSAP 3.13 (ScrollTrigger + **ScrollSmoother available, free, already installed**), React Router 7.
- **Approved new deps:** `three`, `@react-three/fiber`, `@react-three/drei` (+ `@types/three` dev). Nothing else without asking.
- Do not delete/rewrite existing components; do not change existing routes.
- Follow `.claude/skills/portfolio-conventions` (GSAP `gsap.context` + `ctx.revert()`, barrels, double quotes).
- Leave the owner's uncommitted `vite.config.ts` change untouched.

## Approaches considered

| | Approach | Trade-off | Decision |
|---|---|---|---|
| 1 | **React Three Fiber + drei + GSAP** | +~250KB gz (lazy), declarative, `MeshTransmissionMaterial` real glass, `Environment` chrome reflections, easy GLB swap | **Chosen by owner** |
| 2 | Vanilla three.js in `useEffect` + GSAP | Only `three`, smaller; more boilerplate, weaker glass, slower iteration | Not chosen |
| — | Spline | Fast but template-looking, heavy runtime, low control | Dropped (contradicts anti-goal) |
| — | p5 WEBGL (already installed) | No transmission/env reflections | Dropped (can't reach the look) |

## Shared design system (all three concepts)

- **Palette** (scoped to the concepts via Tailwind arbitrary values or a local `tokens.ts`; *not* added to `tailwind.config.js` yet):
  Obsidian `#080B12` (bg) · Graphite `#222B39` (lines/panels) · Chrome Silver `#C9D1DB` · Icy Blue `#8ABFFF` (the only accent, used sparingly) · Text `#F4F6FA` · Muted `#929EAF`.
- **Type:** Inter (already the site font) for display/body, tight tracking on headlines (`-0.03em`), large sizes (clamp ~48–112px); `font-mono` for technical labels at 11–12px uppercase, wide tracking.
- **Copy (identical in all):**
  - Eyebrow: `FULL-STACK × AI DEVELOPER`
  - H1: "Building ideas into intelligent systems."
  - Sub: "I design and build modern web applications, full-stack systems and AI-powered experiences."
  - CTAs: **View Projects** → `/projects`, **About Me** → `/#about`.
- **Core object (placeholder, code geometry):**
  - Glass outer shell: icosahedron/rounded sphere with `MeshTransmissionMaterial` (thickness, low chromatic aberration).
  - Chrome rings/plates: 3 stacked torus/disc layers, `meshStandardMaterial` metalness 1 roughness ~0.15 = Frontend / Backend / Data.
  - Inner core: small emissive sphere in Icy Blue with subtle bloom-free glow (emissive + soft sprite; no postprocessing pass to keep cost down).
  - Lighting: drei `Environment` preset (`city` or `studio`) + one key light. No HDR file download needed.
  - Visible tag in the switcher bar: "Core = temporary placeholder geometry, final Blender model pending."
- **Motion feel:** `ScrollSmoother` (smooth 1–1.2) for lusion-like inertia; Core follows pointer with damped rotation (lerp ~0.05); scroll drives a GSAP timeline that writes to a shared plain object read inside `useFrame` (no React re-render per frame).

## The three concepts

### 01 — Exploded Editorial (Apple-like)
- Layout: text column left (eyebrow, H1, sub, CTAs), Core right ~55% width. Minimal nav (name mark + 2 links).
- Scroll (section pinned): Core **explodes vertically** into its layers; each layer gets a thin leader line + mono label with real stack:
  FRONTEND — React · Next.js · Tailwind / BACKEND — Node · Django · FastAPI · Laravel / DATA — PostgreSQL · MongoDB · Prisma / AI CORE — Gemini · ML forecasting · agents.
- End: layers re-assemble, short line "Explore the work →" hands off.
- Interaction: passive (scroll + slight pointer tilt). Most readable.

### 02 — Immersive Dive (closest to lusion)
- Layout: Core full-bleed centered; H1 split across lines *behind and in front* of the Core (DOM layered above/below the canvas via z-index + transparent canvas).
- Scroll: camera dollies **through** the glass shell into the core. Inside, AI-and-flagship projects orbit as glass cards (FinTax, FinSight, Antigravity Discord Bridge, GovBudget, Egg-e-egg-egg, TripFlow — 6 most recent by `finished_date`).
- Hover a card: orbit slows, title + role + 3 tech tags appear (DOM tooltip via drei `Html`). Click: if `repos` is an array → open existing `RepoModal`; if string → open repo in new tab.
- Interaction: exploratory. Most "wow", project-focused.

### 03 — System Map (engineer identity)
- Layout: asymmetric; text block top-left, Core large on right, faint Graphite 8px/64px grid, coordinate tag `13.75°N 100.50°E · BANGKOK`.
- Small info blocks (mono, real, computed from constants): `PROJECTS 19` · `BUILDING SINCE 2022` · `TECH USED <n unique>` · `AI PROJECTS <n>` (projects whose tech includes Gemini/ML/Machine Learning/AI).
- Scroll: Core rotates in 3 steps; each step highlights one node on the Core and its info panel: **Fullstack** (stack + representative projects) → **AI / ML** (AI projects) → **Profile** (role, location, education/experience summary from `constants/about.ts` / `experiences.ts`).
- Click a node (or its label) jumps to that step. Not a dashboard: ≤4 blocks visible at once, lots of empty space.

## Page structure and files

```
src/pages/HeroConcepts.tsx                 (lazy-loaded route page, switcher, ScrollSmoother wrapper)
src/components/hero-concepts/
  index.ts
  tokens.ts                                (palette, type scale, copy)
  data.ts                                  (selectors over src/constants: stack layers, AI projects, stats)
  ConceptSwitcher.tsx                      (fixed segmented control 01/02/03 + placeholder notice)
  core/IntelligenceCore.tsx                (placeholder Core; the ONLY file to replace with GLB later)
  core/CoreCanvas.tsx                      (R3F <Canvas>, Environment, DPR/quality by device)
  core/scrollState.ts                      (shared mutable progress/pointer object)
  EditorialConcept.tsx
  ImmersiveConcept.tsx
  SystemMapConcept.tsx
```

Modified existing files (minimal):
- `src/App.tsx`: add `<Route path="/hero-concepts" element={<Suspense><HeroConcepts/></Suspense>}/>` with `React.lazy`; hide global `Navbar` and `grain-overlay` when `pathname === "/hero-concepts"` (otherwise the old nav sits on top of the concept). Existing routes untouched.
- `package.json` / lockfile: the 3 approved deps + `@types/three`.

Switching: segmented control writes `?c=1|2|3` (deep-linkable, default 1). On switch: kill ScrollTriggers/smoother of previous concept (via `ctx.revert()` on unmount), scroll to top, remount concept. One `<Canvas>` per concept (simpler cleanup over sharing one).

## Responsive and performance

- Desktop: DPR cap 2, transmission samples ~6.
- Mobile (<768px or `navigator.hardwareConcurrency <= 4`): DPR 1.25, transmission resolution halved, Concept 02 shows 4 cards, layouts stack (text above Core), labels shortened; ScrollSmoother disabled on touch (native scroll) with ScrollTrigger still scrubbing.
- `prefers-reduced-motion`: no smoother, no camera flight; Core rendered static (frameloop `demand`), steps become plain stacked content.
- Canvas `frameloop` paused when concept section is offscreen.
- Whole route lazy-loaded so `/` bundle size is unchanged (verify with `vite build` output).

## Verification

- `npm run lint` and `npm run build` pass.
- Manual/Playwright pass at 1440×900 and 375×812 for each concept: switcher works, CTAs navigate, scroll animation plays forward/backward, no horizontal scroll, no console errors.
- `/` and `/projects` visually unchanged; `git diff` shows only App.tsx route/nav-hide lines in existing files.

## Builder calls (made by Claude, owner to check)

- Hide existing Navbar on `/hero-concepts` (needs a small conditional in `App.tsx`).
- Concepts are dark-only regardless of site theme toggle.
- Stats are computed from static constants; GitHub commit counts are **not** used (avoids network coupling in a preview).
- Six most recent projects in Concept 02; AI detection by tech keywords.
- No postprocessing (bloom) pass in v1 — glow faked with emissive + sprite to stay performant; can add later.
- CTA "About Me" goes to `/#about` on the existing homepage.

## Left to the builder

Exact geometry proportions, easing curves, label placement, and copy line-breaks — tune visually against the anti-goals.
