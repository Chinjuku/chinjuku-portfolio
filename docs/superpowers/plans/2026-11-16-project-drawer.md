# Project Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On `/projects`, clicking a project opens a drawer with a device-framed screenshot gallery, lightbox and the full write-up; the header stats roll in as an odometer.

**Architecture:** Optional fields on `Project` (`slug`, `overview`, `highlights`, `gallery`) plus pure helpers drive everything. `AllProjects.tsx` owns the open project via the `?project=<slug>` search param; `ProjectDrawer` renders it with `ProjectGallery` / `DeviceFrame` / `ProjectLightbox`. `Odometer` is a standalone motion component.

**Tech Stack:** React 19, React Router 7 (`useSearchParams`), Tailwind 3, GSAP 3, lucide-react, Vitest (new, unit tests for pure helpers only).

**Spec:** `docs/superpowers/specs/2026-11-16-project-drawer-design.md`

## Global Constraints

- Follow `.claude/skills/portfolio-conventions`: data in `src/constants/`, sub-components in `src/components/all-projects/` exported from its `index.ts`, GSAP via `gsap.context(..., ref)` + `ctx.revert()`, double quotes, trailing commas.
- English code and comments. Colors from `core-*` tokens only; text contrast at least 4.5:1.
- `prefers-reduced-motion`: no slide/roll animations, render final state (use `usePrefersReducedMotion` from `src/components/motion`).
- Never show a screenshot in a frame for a device it wasn't taken on.
- Screenshots live in `public/projects/<slug>/`.
- **No `git commit` / `git push`.** The owner commits. Each task ends with `npm run lint` showing no new problems (baseline: 4 problems in `ProfileAura.tsx`, `ThemeContext.tsx`, `useActiveSection.ts`) and `npm run build` passing.

## Review Focus

1. `?project=unknown-slug` in the URL: page loads normally, no drawer, param removed. (Task 1 test `projectBySlug` + Task 4 browser check.)
2. Project with no `gallery` and a dead/missing `image`: drawer shows the `ProjectCover` initials, no frame, no tabs. (Task 1 `galleryDevices([])` test + Task 3 browser check.)
3. Gallery with exactly one shot: no prev/next, no counter, no thumbnail strip. (Task 1 `stepIndex` test + Task 3 browser check.)
4. Browser Back while the drawer is open closes the drawer (open pushes history, close replaces). (Task 4 browser check.)
5. Changing filters while a drawer is open, or opening a project the filters hide: drawer stays on that project (looked up in `all_projects`, not the filtered list). Esc inside the lightbox closes only the lightbox. (Task 4 browser checks.)

---

### Task 1: Test runner, data model, slugs and gallery helpers

**Files:**
- Modify: `package.json` (add devDependency `vitest@^3.2.4`, script `"test": "vitest run"`)
- Modify: `src/constants/projects.ts` (types + `slug` on every project)
- Create: `src/components/all-projects/projectGallery.ts`
- Modify: `src/components/all-projects/index.ts` (export it)
- Test: `src/components/all-projects/projectGallery.test.ts`

**Interfaces:**
- Produces (in `src/constants/projects.ts`):
  ```ts
  export type ShotDevice = "desktop" | "phone";
  export interface ProjectShot { src: string; device: ShotDevice; caption?: string }
  // Project gains: slug: string; overview?: string[]; highlights?: string[]; gallery?: ProjectShot[];
  ```
- Produces (in `projectGallery.ts`):
  - `projectBySlug(slug: string | null): Project | undefined` — searches `all_projects`.
  - `galleryDevices(project: Project): ShotDevice[]` — unique devices present, `"desktop"` before `"phone"`; `[]` when no gallery.
  - `shotsFor(project: Project, device: ShotDevice): ProjectShot[]`
  - `stepIndex(index: number, delta: number, length: number): number` — wraps; returns `0` when `length <= 1`.

- [ ] **Step 1: Install Vitest and add the script**

Run: `npm i -D vitest@^3.2.4` then add `"test": "vitest run"` to `scripts`.

- [ ] **Step 2: Write the failing tests** in `projectGallery.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { all_projects, type Project } from "../../constants/projects";
import { galleryDevices, projectBySlug, shotsFor, stepIndex } from "./projectGallery";

const base = all_projects[0];
const withShots: Project = {
  ...base,
  gallery: [
    { src: "/p/a.webp", device: "phone" },
    { src: "/p/b.webp", device: "desktop" },
    { src: "/p/c.webp", device: "desktop" },
  ],
};

describe("slugs", () => {
  it("every project has a unique kebab-case slug", () => {
    const slugs = all_projects.map((p) => p.slug);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("projectBySlug", () => {
  it("finds fintax", () => expect(projectBySlug("fintax")?.title).toBe("FinTax"));
  it("returns undefined for unknown or null", () => {
    expect(projectBySlug("nope")).toBeUndefined();
    expect(projectBySlug(null)).toBeUndefined();
  });
});

describe("galleryDevices / shotsFor", () => {
  it("is empty without a gallery", () => expect(galleryDevices({ ...base, gallery: undefined })).toEqual([]));
  it("orders desktop before phone, unique", () => expect(galleryDevices(withShots)).toEqual(["desktop", "phone"]));
  it("filters by device", () => expect(shotsFor(withShots, "desktop").map((s) => s.src)).toEqual(["/p/b.webp", "/p/c.webp"]));
});

describe("stepIndex", () => {
  it("wraps both ways", () => {
    expect(stepIndex(2, 1, 3)).toBe(0);
    expect(stepIndex(0, -1, 3)).toBe(2);
  });
  it("is 0 for a single or empty list", () => {
    expect(stepIndex(0, 1, 1)).toBe(0);
    expect(stepIndex(0, -1, 0)).toBe(0);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL (`projectGallery` module not found / `slug` undefined).

- [ ] **Step 4: Add the types and slugs to `projects.ts`**

Add the types from Interfaces. Set `slug` on each project, in file order:
`fintax`, `tripflow`, `restauranteu`, `connextra`, `hongsamutit`, `psit-place`, `caretrack`, `jacs`, `finsight`, `ticketflicks`, `calendoo-todolist`, `smartbin`, `discovery-piscine`, `inventory-stock`, `adorable-miaw`, `egg-e-egg-egg`, `govbudget-tracking`, `antigravity-discord-bridge`, `stockperfnoti`, `lucent-design-system`, `tft-trivia`, `beatdrop`, `sheet2web`.

- [ ] **Step 5: Implement `projectGallery.ts`** with the four functions above and export it from `index.ts`.

- [ ] **Step 6: Run tests, lint, build**

Run: `npm test && npm run lint; npm run build`
Expected: tests PASS; lint shows only the 4 baseline problems; build `✓ built`.

---

### Task 2: Odometer stats

**Files:**
- Create: `src/components/motion/odometer.ts` (pure)
- Create: `src/components/motion/Odometer.tsx`
- Modify: `src/components/motion/index.ts` (export both)
- Modify: `src/pages/AllProjects.tsx` (stats `<dd>` renders `<Odometer value={s.value} />`)
- Test: `src/components/motion/odometer.test.ts`

**Interfaces:**
- Produces: `odometerDigits(value: number): number[]` (non-negative integer → digits, `0` → `[0]`); `Odometer: React.FC<{ value: number; className?: string }>`.

- [ ] **Step 1: Write the failing test**

```ts
import { expect, it } from "vitest";
import { odometerDigits } from "./odometer";

it("splits into digits", () => {
  expect(odometerDigits(2023)).toEqual([2, 0, 2, 3]);
  expect(odometerDigits(7)).toEqual([7]);
  expect(odometerDigits(0)).toEqual([0]);
});
```

- [ ] **Step 2: Run to verify it fails** — `npm test` → FAIL (module not found).

- [ ] **Step 3: Implement `odometerDigits` and `Odometer`**

Each digit: an `overflow-hidden` slot `1em` tall (`leading-none`) containing a column of 0–9; GSAP `fromTo` `yPercent` from 0 to `-digit * 10` (column is 10 rows), duration `0.9 + i * 0.2` s, `power3.out`, `scrollTrigger: { trigger: root, start: "top 90%", once: true }`. Root `<span aria-label={String(value)}>`, columns `aria-hidden`, `tabular-nums`. Reduced motion: no tween, columns set straight to the final offset.

- [ ] **Step 4: Run tests, lint, build** — as Task 1 Step 6.

- [ ] **Step 5: Browser check** — `/projects` at 1440×900: the four stats roll in once on load and end on exactly the values `STATS` computes today (PROJECTS 23, the rest unchanged from before the edit).

---

### Task 3: Gallery, device frames and lightbox

**Files:**
- Create: `src/components/all-projects/DeviceFrame.tsx`
- Create: `src/components/all-projects/ProjectGallery.tsx`
- Create: `src/components/all-projects/ProjectLightbox.tsx`
- Modify: `src/components/all-projects/index.ts`

**Interfaces:**
- Consumes: `ProjectShot`, `ShotDevice`, `galleryDevices`, `shotsFor`, `stepIndex` (Task 1); `ProjectCover` (existing).
- Produces:
  - `DeviceFrame: React.FC<{ device: ShotDevice; children: React.ReactNode }>` — desktop: browser chrome bar (3 dots) + `aspect-[16/10]`; phone: rounded `aspect-[9/19.5]`, `max-w-[240px] mx-auto`.
  - `ProjectGallery: React.FC<{ project: Project }>`
  - `ProjectLightbox: React.FC<{ shots: ProjectShot[]; index: number; onIndex: (i: number) => void; onClose: () => void }>`

- [ ] **Step 1: Implement `DeviceFrame`** (images inside use `object-cover object-top`, `loading="lazy"`).

- [ ] **Step 2: Implement `ProjectGallery`**

State: `device` (first of `galleryDevices`), `index`, `lightboxOpen`. Device tabs only when `galleryDevices(project).length > 1`. Prev/next buttons (`aria-label` "Previous screenshot" / "Next screenshot"), counter `"{i+1} / {n}"` and thumbnail strip only when `n > 1`. Caption under the frame when present. No gallery: `<ProjectCover src={project.image} title={project.title} />` in an `aspect-[16/10]` rounded box, no frame, no tabs. Clicking the large shot opens the lightbox. Reset `index` to 0 when `device` or `project.slug` changes.

- [ ] **Step 3: Implement `ProjectLightbox`**

Overlay `fixed inset-0 z-[70]` (above the drawer), `role="dialog"`, `aria-modal`. Keys on window while open: ArrowLeft/ArrowRight via `stepIndex`, Escape → `onClose` and `stopPropagation` so the drawer's Esc handler doesn't fire. Touch: horizontal swipe over 50px steps. Close button `aria-label="Close"`.

- [ ] **Step 4: Lint and build** — as Task 1 Step 6.

(Browser checks for this task run in Task 4, once the drawer can host the gallery.)

---

### Task 4: Drawer and wiring into the page

**Files:**
- Create: `src/components/all-projects/ProjectDrawer.tsx`
- Modify: `src/components/all-projects/index.ts`
- Modify: `src/components/all-projects/ProjectCard.tsx` (add `onOpen`)
- Modify: `src/components/all-projects/FeaturedCarousel.tsx` (add `onOpen`)
- Modify: `src/pages/AllProjects.tsx`

**Interfaces:**
- Consumes: `projectBySlug` (Task 1), `ProjectGallery` (Task 3), `RepoModal` (existing).
- Produces: `ProjectDrawer: React.FC<{ project: Project | undefined; onClose: () => void; onRepos: (repos: string | string[]) => void }>`; `ProjectCard` and `FeaturedCarousel` props gain `onOpen: (project: Project) => void`.

- [ ] **Step 1: Wire state in `AllProjects.tsx`**

`const [params, setParams] = useSearchParams(); const open = projectBySlug(params.get("project"));` Open: `setParams({ project: p.slug })` (push). Close: `setParams({}, { replace: true })`. If the param is set but `open` is undefined, clear it with `replace` in an effect. The drawer looks up `all_projects`, so filters never close or change it.

- [ ] **Step 2: Make cards open the drawer**

`ProjectCard`: the title becomes `<button type="button" onClick={() => onOpen(project)}>` with a stretched hit area (`after:absolute after:inset-0 after:content-['']`); Live demo and Source stay clickable above it (`relative z-30`). Same for the featured carousel's title. Add a visible "Details" text affordance next to Source (`text-core-mist`, arrow icon).

- [ ] **Step 3: Implement `ProjectDrawer`**

- Render nothing when `project` is undefined (keep mounted for the close animation: animate out, then unmount).
- Backdrop `fixed inset-0 z-[60] bg-core-obsidian/70` (click → `onClose`); panel `role="dialog" aria-modal="true" aria-labelledby` the title.
- Sizes: `< md` full-height bottom sheet (slide `yPercent` 100 → 0); `md` right panel `w-[70vw]`; `lg` right panel `w-[600px]` (slide `xPercent` 100 → 0). GSAP 0.45s `power3.out`; reduced motion: no tween.
- Body scroll lock while open; focus the close button on open; on close return focus to the element that opened it.
- Esc closes (ignored while the lightbox is open).
- Content order: close button, title, `role · year`, Live demo / Source (Source uses `onRepos`), `<ProjectGallery>`, overview (`overview ?? [description]`), highlights list (only if present), stack chips (all `tech`).

- [ ] **Step 4: Lint, build, tests** — as Task 1 Step 6.

- [ ] **Step 5: Browser checks** (preview `vite`, `/projects`)

At 1440×900, 768×1024, 390×844:
1. Click a grid card and a carousel card → drawer opens at the right size for the width; URL has `?project=<slug>`.
2. Esc, backdrop click, close button, and browser Back each close it; focus returns to the card.
3. Load `/projects?project=nope` → no drawer, param gone.
4. Open FinTax, change the year filter → drawer stays on FinTax.
5. A project with no gallery (e.g. `stockperfnoti`) → initials/image cover, no tabs, no arrows.
6. With FinTax shots from Task 5 (or a temporary 1-shot gallery): one shot shows no arrows/counter/thumbnails; several shots step with arrows and thumbnails; lightbox opens, arrow keys move, Esc closes only the lightbox.
7. `prefers-reduced-motion` emulated → drawer and odometer appear without motion.
8. No console errors; no horizontal page scroll at 390px.

---

### Task 5: FinTax content

**Files:**
- Create: `public/projects/fintax/*.webp` (or `.png` if `sips` can't write WebP)
- Modify: `src/constants/projects.ts` (FinTax `overview`, `highlights`, `gallery`)

- [ ] **Step 1: Get the screenshots**

Figma file `3gVdaegydcm9fwqKZPHIXQ` (node `708:2326`) currently returns "no edit access" for the connected account. Either the owner grants edit access (then `download_assets` with `defaultScale: 2` per chosen frame) or the owner exports the frames at 2x PNG into `public/projects/fintax/`. Pick 3–5 frames with the owner; name files by screen (`dashboard`, `tax-planner`, `forecast`, …).

- [ ] **Step 2: Convert** — `sips -s format webp <file>.png --out <file>.webp`; if `sips` rejects WebP, keep PNG.

- [ ] **Step 3: Fill FinTax data** — `gallery` with `device` from frame size (width ≥ 1024 → `"desktop"`, ≤ 480 → `"phone"`), captions from screen names; `overview` (2 paragraphs) and `highlights` (3–4 bullets) drafted from the existing description and tech, marked for owner review in the hand-off message (not in code).

- [ ] **Step 4: Lint, build, browser check** — FinTax drawer shows the frames and captions at all three widths.
