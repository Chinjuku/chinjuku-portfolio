# Hero Concepts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** An isolated `/hero-concepts` route with three switchable scroll-story hero concepts built around one placeholder 3D "Intelligence Core".

**Architecture:** A lazy-loaded page holds a `?c=1|2|3` switcher and mounts one concept at a time. Each concept owns its DOM layout, its GSAP ScrollTrigger timeline, and one R3F `<Canvas>`. GSAP writes progress into a mutable `CoreState` object that `useFrame` reads, so no React re-render happens per frame. All 3D lives in `core/`; `IntelligenceCore.tsx` is the single swap point for a future Blender GLB.

**Tech Stack:** React 19, Vite 7, TS strict, Tailwind 3, GSAP 3.13 (ScrollTrigger, ScrollSmoother), three, @react-three/fiber, @react-three/drei.

**Spec:** `docs/superpowers/specs/2026-11-15-hero-concepts-design.md`

## Global Constraints

- New deps allowed ONLY: `three`, `@react-three/fiber`, `@react-three/drei`, dev `@types/three`. No test framework is installed, and adding one is not approved, so verification is `npm run lint`, `npm run build`, and in-browser checks.
- Do not change `/` or `/projects`, and do not delete or rewrite existing components. Existing-file edits are limited to `src/App.tsx`, `package.json`, and `package-lock.json`.
- Do not touch the owner's uncommitted `vite.config.ts`. **Do not commit** (owner instruction). Each task's last step is "leave uncommitted".
- Palette: Obsidian `#080B12`, Graphite `#222B39`, Chrome `#C9D1DB`, Icy `#8ABFFF`, Text `#F4F6FA`, Muted `#929EAF`. Icy Blue is the only accent. No neon, and no gradients beyond subtle radial falloff.
- Copy (verbatim): eyebrow `FULL-STACK × AI DEVELOPER`; H1 `Building ideas into intelligent systems.`; sub `I design and build modern web applications, full-stack systems and AI-powered experiences.`; CTAs `View Projects` → `/projects`, `About Me` → `/#about`.
- Placeholder notice (verbatim, shown in the switcher): `Core = temporary placeholder geometry · final Blender model pending`.
- Conventions: `.claude/skills/portfolio-conventions` (use `gsap.context` + `ctx.revert()`, barrel `index.ts`, double quotes).

## Review Focus

1. **Switching concepts mid-scroll** should not leave stale pins, spacers, or smoother transforms. The new concept starts at the top with correct heights. Test lives in Task 1, step 5 (re-run after Tasks 4 to 6).
2. **Reverse scrolling** should play the animation backward smoothly with no jumps. Each concept task has a "scroll down then up" check.
3. **Mobile at 375px** should have no horizontal scroll and the Core visible and not clipped. Covered by Task 7, step 2.
4. **`prefers-reduced-motion: reduce`** should show readable stacked content with no camera flight and no smoother. Covered by Task 7, step 3.
5. **Leaving to `/` via a CTA** should bring back the normal Navbar/grain, leave no leftover ScrollSmoother wrapper styles, and keep the homepage scroll working. Covered by Task 1, step 6.

---

### Task 1: Deps, route, page shell, switcher, tokens

**Files:**
- Modify: `package.json`, `package-lock.json` (via npm)
- Modify: `src/App.tsx` (lazy route + hide Navbar/grain on `/hero-concepts`)
- Create: `src/pages/HeroConcepts.tsx`
- Create: `src/components/hero-concepts/{index.ts,tokens.ts,ConceptSwitcher.tsx,CtaButtons.tsx}`

**Interfaces:**
- Produces: `tokens.ts` exports `COLORS` (keys `obsidian, graphite, chrome, icy, text, muted`), `COPY` (`eyebrow, title, sub, ctaProjects:{label,href}, ctaAbout:{label,href}, placeholderNotice`).
- Produces: `type ConceptId = 1 | 2 | 3`. `ConceptSwitcher({ active: ConceptId; onChange(id: ConceptId): void })`.
- Produces: `HeroConcepts` page reads and writes `?c` through `useSearchParams` (invalid or missing → 1), and renders `<ConceptN key={c}/>`. Remounting by key is the cleanup mechanism.
- Produces: shared `CtaButtons` in `hero-concepts/CtaButtons.tsx`. It uses `Link` for `/projects` and `Link to="/#about"`. The primary button is a Chrome fill with Obsidian text, and the secondary is a Graphite outline.

- [ ] **Step 1:** Run `npm i three @react-three/fiber @react-three/drei && npm i -D @types/three`. Expected: the install succeeds and `git diff --stat` shows only the package files added.
- [ ] **Step 2:** Edit `App.tsx`. Add `const HeroConcepts = lazy(() => import("./pages/HeroConcepts"))` and `<Route path="/hero-concepts" element={<Suspense fallback={null}><HeroConcepts/></Suspense>}/>`. Add `const isConcepts = useLocation().pathname === "/hero-concepts"`, and do not render `grain-overlay` or `<Navbar/>` when it is true. Leave the existing two routes byte-identical.
- [ ] **Step 3:** Build the page and switcher. The page root is `bg-[#080B12] text-[#F4F6FA] min-h-screen`. The switcher is fixed at bottom-center on mobile and top-right on desktop. It is a segmented control with labels `01 Editorial`, `02 Immersive`, `03 System`, shows the placeholder notice in 11px mono Muted under it, and uses buttons with `aria-pressed`. On change, call `window.scrollTo(0,0)` and then set `?c`. Concept components can be stub `<section className="h-[300vh]">` until their tasks land.
- [ ] **Step 4:** Run `npm run lint && npm run build`. Expected: both pass, and the build output shows a separate chunk for `HeroConcepts`. The main chunk must not contain `three` (check that `grep -l "WebGLRenderer" dist/assets/index-*.js` returns nothing).
- [ ] **Step 5 (Review Focus 1):** Run `npm run dev` and open `/hero-concepts?c=2`, scroll halfway, then click `03`. Expected: the URL is `?c=3`, the scroll is at the top, and `document.querySelectorAll(".pin-spacer").length` equals only the new concept's pins.
- [ ] **Step 6 (Review Focus 5):** Click `View Projects` and then the browser back button, and click `About Me`. Expected: the old Navbar appears on `/` and `/projects`, `/#about` scrolls to About, and `document.body.style` has no leftover transform or height.
- [ ] **Step 7:** Leave uncommitted.

### Task 2: Data selectors

**Files:** Create: `src/components/hero-concepts/data.ts`

**Interfaces:**
- Consumes: `all_projects: Project[]` from `src/constants/projects`, and `src/constants/about` and `src/constants/experiences` (read only what exists; do not add fields).
- Produces:
  - `STACK_LAYERS: { id: "frontend"|"backend"|"data"|"ai"; label: string; items: string[] }[]`. Values follow the spec: FRONTEND `React, Next.js, Tailwind`; BACKEND `Node, Django, FastAPI, Laravel`; DATA `PostgreSQL, MongoDB, Prisma`; AI CORE `Gemini, ML forecasting, agents`.
  - `isAiProject(p: Project): boolean`. True if any tech, case-insensitive, matches `/gemini|machine learning|\bml\b|\bai\b|llm|agent/`.
  - `recentProjects(n: number): Project[]`, sorted by `finished_date` descending.
  - `STATS: { projects: number; since: number; techCount: number; aiProjects: number }`. `since` is the minimum year of `finished_date`, and `techCount` is the number of unique tech entries, case-insensitive.
  - `openProject(p: Project, openModal: (repos: string[]) => void): void`. If `repos` is an array, call `openModal`. Otherwise, call `window.open(repos, "_blank", "noopener")`.

- [ ] **Step 1:** Implement.
- [ ] **Step 2:** Verify in the dev console on `/hero-concepts` (temporarily `console.table(STATS)` in the page, then remove it). Expected: `projects: 19`, `since: 2022`, `aiProjects` ≥ 2 (FinTax, FinSight), and `recentProjects(6)[0].title` is a 2026-10 project.
- [ ] **Step 3:** Run `npm run lint`. Leave uncommitted.

### Task 3: The Core (placeholder 3D)

**Files:** Create `src/components/hero-concepts/core/{scrollState.ts,CoreCanvas.tsx,IntelligenceCore.tsx,index.ts}`

**Interfaces:**
- Produces: `type CoreState = { progress: number; explode: number; rotateY: number; pointerX: number; pointerY: number; focus: number }` (all 0..1 except rotateY, which is in radians), and `createCoreState(): CoreState`.
- Produces: `CoreCanvas({ state: CoreState; children?: ReactNode; camera?: { position: [number,number,number]; fov: number }; className?: string })`. It is an R3F `<Canvas>` with transparent bg, `dpr={[1, quality.dpr]}`, drei `<Environment preset="city"/>`, one directional key light, and `frameloop="demand"` when `useReducedMotion()` is true. It also listens to pointermove on window and writes normalized `pointerX/Y` (-1..1) into state.
- Produces: `useQuality(): { dpr: number; transmissionRes: number; samples: number; isLow: boolean }`. The low tier applies when width < 768 or `hardwareConcurrency <= 4`. Values: desktop `{2, 512, 6}`, low `{1.25, 256, 3}`.
- Produces: `useReducedMotion(): boolean`, which reads `matchMedia("(prefers-reduced-motion: reduce)")` with a listener.
- Produces: `IntelligenceCore({ state: CoreState; scale?: number })`. Each frame it lerps rotation toward `state.rotateY + pointerX*0.3` (factor 0.05). It has three chrome discs or tori (metalness 1, roughness 0.15, color `#C9D1DB`) whose y-offset is `layerIndex * state.explode * 0.9`. The glass shell is an icosahedron detail 4 with `MeshTransmissionMaterial` (thickness 0.6, chromaticAberration 0.03, `resolution`/`samples` from `useQuality`), and its opacity fades as `focus` → 1. The inner sphere is emissive `#8ABFFF`, intensity 1.5, plus a soft additive sprite. Export `CORE_LAYER_COUNT = 3`.
- Swap note: a comment at the top of `IntelligenceCore.tsx` says the GLB replaces this file and must keep the same props.

- [ ] **Step 1:** Implement. Mount it temporarily in the Concept 1 stub, with a GSAP tween on `state.explode` 0→1 yoyo.
- [ ] **Step 2:** Check in the browser. Expected: refracting glass, reflective chrome, and an icy core, with no console errors. The Core follows the mouse with lag, and layers separate as `explode` animates. FPS ≥ 50 at 1440×900 (check via `performance.now()` frame deltas or the DevTools FPS meter).
- [ ] **Step 3:** Run `npm run lint && npm run build`. Remove the temporary tween. Leave uncommitted.

### Task 4: Concept 01 — Exploded Editorial

**Files:** Create `src/components/hero-concepts/EditorialConcept.tsx`

**Interfaces:** Consumes `COPY`, `CtaButtons`, `STACK_LAYERS`, `CoreCanvas`, `IntelligenceCore`, and `createCoreState`.

- [ ] **Step 1:** Build the layout.
  - **Desktop:** a 12-column grid. Text spans columns 1–5 (eyebrow in mono Icy, H1 at `clamp(48px,6vw,104px)` with tracking `-0.03em`, sub in Muted with max-w 34ch, CTAs). The canvas spans columns 6–12 and is ~80vh tall.
  - **Mobile:** text goes on top and the canvas below at 60vh.
  - **Nav:** a minimal row with `CHINJUKU` in mono and links to `Projects` and `About`.
- [ ] **Step 2:** Build the scroll story with a single pinned section of `+=250%` and scrub 1. Timeline: `explode` 0→1 (0–40%). Four layer labels (`.ed-label`) fade and slide in with stagger, each with a 1px Graphite leader line and the label `FRONTEND — React · Next.js · Tailwind` built from `STACK_LAYERS`, and the AI label sits at the core (40–75%). Then `explode` goes 1→0 and the line `Explore the work →` (a link to `/projects`) appears (75–100%). Use `gsap.context` scoped to the section ref, and `ctx.revert()` on unmount.
- [ ] **Step 3:** Check. Expected: labels align with the separated layers at 1440 and 1024 widths. Scrolling down then up reverses cleanly. No horizontal scroll at 375px.
- [ ] **Step 4:** Run `npm run lint`. Leave uncommitted.

### Task 5: Concept 02 — Immersive Dive

**Files:** Create `src/components/hero-concepts/ImmersiveConcept.tsx` and `src/components/hero-concepts/ProjectOrbit.tsx`

**Interfaces:**
- Produces: `ProjectOrbit({ projects: Project[]; state: CoreState; onSelect(p: Project): void })`. It is an R3F group of glass cards (rounded plane, `MeshTransmissionMaterial` at low res) on a ring of radius 2.2, visible when `state.focus > 0.6`. Hovering a card uses drei `<Html>` to show title, role, and 3 tech tags, and sets the orbit speed to ×0.2. Clicking calls `onSelect`.
- Consumes: `recentProjects`, `openProject`, existing `RepoModal` (`isOpen`, `repos`, `onClose`).

- [ ] **Step 1:** Build the layout. The canvas is `fixed inset-0` inside a pinned section. The H1 is split into two DOM lines: line 1 at `z-0` behind the canvas, and line 2 at `z-20` in front. Make the canvas transparent and put it at `z-10`. The sub text and CTAs sit bottom-left. Nothing else is on screen.
- [ ] **Step 2:** Build the scroll with a pin of `+=300%`. The camera z goes from 6 to 0.4 while `focus` goes 0→1 (0–55%). Inside, the orbit appears and the headline fades out (55–70%). The orbit stays interactive to the end (70–100%). Camera movement is done in `useFrame` by lerping toward a target computed from `state.progress`.
- [ ] **Step 3:** Wire `onSelect` to `openProject(p, repos => setModal(repos))`, and render `RepoModal`. Mobile shows `recentProjects(4)`, and desktop shows 6.
- [ ] **Step 4:** Check. Expected: the fly-through feels continuous both ways. Hovering slows the orbit and shows a tooltip. Clicking FinTax (array repos) opens the modal, and clicking TripFlow (string) opens a new tab. No dashboard-like chrome.
- [ ] **Step 5:** Run `npm run lint`. Leave uncommitted.

### Task 6: Concept 03 — System Map

**Files:** Create `src/components/hero-concepts/SystemMapConcept.tsx`

**Interfaces:** Consumes `STATS`, `STACK_LAYERS`, `isAiProject`, `all_projects`, the about/experience constants, `CoreCanvas`, and `IntelligenceCore`.

- [ ] **Step 1:** Build the layout. The background is a CSS grid of Graphite lines at 8% opacity with 64px cells. The text block is top-left (H1 smaller than in 01, at `clamp(40px,5vw,84px)`). The canvas is right-aligned and bleeds off the edge on desktop. Show the coordinate tag `13.75°N 100.50°E · BANGKOK` and a row of four stat blocks: `PROJECTS 19`, `BUILDING SINCE 2022`, `TECH USED {n}`, `AI PROJECTS {n}`, all taken from `STATS`.
- [ ] **Step 2:** Build three steps with a pin of `+=300%` and snap to `[0, 0.5, 1]`. `rotateY` goes to `0`, `2π/3`, then `4π/3`. Each step shows one panel (≤ 4 lines plus a project list of ≤ 3): **Fullstack** (stack plus 3 non-AI recent projects), **AI / ML** (AI projects), **Profile** (role and location plus experience summary from constants). The step index (`01/03`) is rendered in mono.
- [ ] **Step 3:** Clicking a node label scrolls to that step with `ScrollTrigger`'s `labelToScroll` (or computing it from `st.start + (st.end-st.start)*i/2`) via `window.scrollTo({behavior:"smooth"})`.
- [ ] **Step 4:** Check. Expected: at most 4 info blocks are visible at once. Snap feels deliberate, node clicks jump correctly, and reverse scrolling works. It should not read as a dashboard.
- [ ] **Step 5:** Run `npm run lint`. Leave uncommitted.

### Task 7: Smoothness, responsive, reduced motion, final verification

**Files:** Modify `src/pages/HeroConcepts.tsx`, plus the concept files as needed.

- [ ] **Step 1:** Add `ScrollSmoother.create({ wrapper, content, smooth: 1.1, effects: false })` in the page via `gsap.context`, but skip it when the device is touch (`matchMedia("(pointer: coarse)")`) or reduced motion is on. Fixed canvases must sit outside `#smooth-content`, or be pinned by ScrollTrigger. Kill the smoother on unmount.
- [ ] **Step 2 (Review Focus 3):** At 375×812, for each concept, check that `document.documentElement.scrollWidth === innerWidth`, the Core is fully visible, the switcher does not cover the CTAs, and the text is ≥ 14px.
- [ ] **Step 3 (Review Focus 4):** Emulate `prefers-reduced-motion: reduce`. Expected: no smoother, no pins (each concept renders its steps as plain stacked sections), and the Core is static but rendered.
- [ ] **Step 4:** Re-run Task 1, steps 5–6 across all three concepts.
- [ ] **Step 5:** Run `npm run lint && npm run build`. Expected: both pass. `git status` shows modified files are only `src/App.tsx`, `package.json`, `package-lock.json`, and the pre-existing `vite.config.ts`. Everything else is new under `src/pages/HeroConcepts.tsx`, `src/components/hero-concepts/`, and `docs/`.
- [ ] **Step 6:** Visually compare `/` and `/projects` against the current state. Expected: no change.
- [ ] **Step 7:** Report the deliverables per the original brief: route, differences, files, the unchanged-pages confirmation, and limitations (placeholder Core, no bloom, static stats). Leave uncommitted.
