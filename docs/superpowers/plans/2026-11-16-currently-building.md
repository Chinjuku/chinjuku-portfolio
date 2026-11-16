# Currently Building Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Currently building" section to the Home page showing BeatDrop and Sheet2Web with cross-fading screenshot previews, an on-demand live iframe for BeatDrop, "Working on" lines and an "Interested in" strip.

**Architecture:** One data file drives the section. A section shell renders a header, two `BuildCard`s and the interests strip; each card owns a `PreviewFrame` that cross-fades screenshots and can swap to an iframe. Sheet2Web's screenshots also go into its project gallery.

**Tech Stack:** React 19, Tailwind 3, GSAP, lucide-react, Vitest (pure helpers only).

**Spec:** `docs/superpowers/specs/2026-11-16-currently-building-design.md`

## Global Constraints

- Follow `.claude/skills/portfolio-conventions` (shell in `src/components/CurrentlyBuilding.tsx`, parts in `src/components/currently-building/` with barrel; GSAP via `gsap.context` + `ctx.revert()`; double quotes; English code/comments; `core-*` colors; contrast ≥ 4.5:1).
- Use the shared `Container` (`src/components/common/Container.tsx`).
- No iframe is created until the visitor clicks "Try it here"; below `md` that button opens the site in a new tab instead.
- Reduced motion: no cross-fade; first screenshot stays.
- Never show Sheet2Web's Sheets sync or Settings screens.
- No `git commit` / `git push`. Each task ends with `npm test`, `npm run lint` (baseline 4 problems: ProfileAura.tsx, ThemeContext.tsx, useActiveSection.ts) and `npm run build` passing.

## Review Focus

1. Many shots + hover: the rotation pauses while hovered or focused and resumes after (Task 2 browser check).
2. One shot only: no timer runs (Task 1 `nextShot` test with length 1).
3. "Try it here" then "Back to preview": iframe is removed from the DOM, rotation resumes (Task 2 browser check).
4. A `slug` in the data that doesn't exist in `all_projects`: caught by a test, not a broken link (Task 1 test).
5. Phone width: button is a link with `target="_blank"`, no iframe (Task 2 browser check at 390px).

---

### Task 1: Data, helpers and Sheet2Web gallery

**Files:**
- Create: `src/constants/currentlyBuilding.ts` (export from `src/constants/index.ts`)
- Create: `src/components/currently-building/previewTimer.ts`
- Modify: `src/constants/projects.ts` (Sheet2Web `image` + `gallery`)
- Test: `src/components/currently-building/currentlyBuilding.test.ts`

**Interfaces:**
- Produces: `BuildingItem` and `CURRENTLY_BUILDING` exactly as in the spec's Data block; `nextShot(index: number, length: number): number` (wraps; returns 0 when `length <= 1`).

- [ ] **Step 1: Write the failing tests**

```ts
import { expect, it } from "vitest";
import { CURRENTLY_BUILDING } from "../../constants/currentlyBuilding";
import { all_projects } from "../../constants/projects";
import { nextShot } from "./previewTimer";

it("every item links to a real project", () => {
  const slugs = new Set(all_projects.map((p) => p.slug));
  CURRENTLY_BUILDING.items.forEach((i) => expect(slugs.has(i.slug)).toBe(true));
});
it("only BeatDrop is embeddable", () => {
  expect(CURRENTLY_BUILDING.items.filter((i) => i.embeddable).map((i) => i.slug)).toEqual(["beatdrop"]);
});
it("every item has at least one shot", () => {
  CURRENTLY_BUILDING.items.forEach((i) => expect(i.shots.length).toBeGreaterThan(0));
});
it("nextShot wraps and stays at 0 for a single shot", () => {
  expect(nextShot(3, 4)).toBe(0);
  expect(nextShot(1, 4)).toBe(2);
  expect(nextShot(0, 1)).toBe(0);
});
```

- [ ] **Step 2: Run** `npm test` → FAIL (modules missing).

- [ ] **Step 3: Implement the data file and helper**

Values:
- `updated: "Nov 2026"`
- BeatDrop: slug `beatdrop`, url `https://beatdrop-self.vercel.app`, status `live`, summary "Song-guessing game from short clips, Thai and international.", workingOn "Real-time rooms for playing with friends" (draft), stack `["Next.js", "TypeScript", "Upstash Redis", "PostgreSQL"]`, shots `/projects/beatdrop/{play,guesser,daily,room}.png`, embeddable `true`.
- Sheet2Web: slug `sheet2web`, url `https://sheet-portfolio-tracker.vercel.app`, status `in-progress`, summary "Google Sheets sync and multi-market portfolio tracker.", workingOn "Dividend and cash-flow insights" (draft), stack `["Next.js", "TypeScript", "Supabase", "Lucent DS"]`, shots `/projects/sheet2web/{dashboard,portfolios,allocation,dividends}.png`, embeddable `false`.
- interests (draft): `["AI tools in everyday development", "Design systems", "Real-time web apps"]`.

Mark draft strings with a `// draft: owner to confirm` comment.

- [ ] **Step 4: Sheet2Web gallery** in `projects.ts`: `image: "/projects/sheet2web/dashboard.png"`; `gallery` with the 8 desktop shots (dashboard, portfolios, allocation, dividends, cash-fx, realized-pnl, matrix, activity) then 4 phone shots (`*-phone.png`), English captions; comment "test account, email masked".

- [ ] **Step 5: Run** `npm test && npm run lint; npm run build` → tests pass, lint baseline, build OK.

---

### Task 2: Section UI and Home wiring

**Files:**
- Create: `src/components/currently-building/PreviewFrame.tsx`, `BuildCard.tsx`, `index.ts`
- Create: `src/components/CurrentlyBuilding.tsx`
- Modify: `src/pages/Home.tsx` (insert `<div id="now"><CurrentlyBuilding /></div>` between `#projects` and `#activity`), `src/components/common/Navbar.tsx` (add "Now" → `#now` between Work and Activity)

**Interfaces:**
- Consumes: `CURRENTLY_BUILDING`, `BuildingItem`, `nextShot` (Task 1).
- Produces: `PreviewFrame: React.FC<{ item: BuildingItem; live: boolean; onExitLive: () => void }>`; `BuildCard: React.FC<{ item: BuildingItem }>`; default export `CurrentlyBuilding`.

- [ ] **Step 1: `PreviewFrame`** — browser chrome bar (3 dots + host from `new URL(item.url).host`), `aspect-[16/10]`; stacked `<img>`s cross-fading via opacity every 4000 ms using `nextShot`; pause on `mouseenter`/`focusin`, resume on leave; reduced motion → no timer. When `live`: render `<iframe src={item.url} title={`${item.name} live preview`} loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups allow-forms">` instead of images, plus a "Back to preview" button calling `onExitLive`.

- [ ] **Step 2: `BuildCard`** — frame, name + status pill (`Live` icy, `In progress` amber-ish using existing tokens/`cyber-amber`), summary, `WORKING ON` mono label + `workingOn`, stack chips, buttons: "Try it here" (only if `embeddable`; `md` and up toggles `live` state; below `md` render as `<a target="_blank" rel="noopener noreferrer">`), "Open site ↗" (new tab), "Case study →" (`<Link to={`/projects/${slug}`}>`).

- [ ] **Step 3: `CurrentlyBuilding` shell** — `Container`, header (`NOW` eyebrow, h2 "Currently building", stamp `UPDATED {updated.toUpperCase()}`), `grid gap-6 lg:grid-cols-2`, then interests row (`INTERESTED IN` + chips). GSAP entrance like other sections (`.now-head`, `.now-card`, `toggleActions` per conventions).

- [ ] **Step 4: Wire Home and Navbar.**

- [ ] **Step 5: Run** `npm test && npm run lint; npm run build`.

- [ ] **Step 6: Browser checks** (preview `vite`): at 1440px — section sits between Work and Activity, shots rotate, hover pauses; "Try it here" loads BeatDrop iframe, "Back to preview" removes it (`document.querySelector('#now iframe') === null`); Sheet2Web has no "Try it here"; "Case study →" goes to `/projects/<slug>`; Nav "Now" scrolls to the section. At 390px — cards stack, "Try it here" is a new-tab link, no horizontal overflow.
