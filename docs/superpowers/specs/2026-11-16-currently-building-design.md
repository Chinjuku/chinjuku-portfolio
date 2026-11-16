# Currently Building section

Date: 2026-11-16
Status: draft, waiting for owner approval

## Intent

A section on the Home page (not a separate page) that shows visitors what the owner is
working on right now, what they are interested in, and which projects are in progress.
It shows two live products: BeatDrop and Sheet2Web. The Work section shows shipped work;
this one shows work in motion.

## Goals

- Two project cards, each with a browser frame that previews the real product.
- Previews feel live but stay light: screenshots cross-fade automatically.
- BeatDrop can be tried in place: "Try it here" swaps the frame to the real site (iframe),
  loaded only on click, with a way back to the preview.
- Each card says what is being worked on now, not only what the project is.
- An "Interested in" strip answers "what are you into right now".
- Content lives in one data file so it can be updated without touching UI code.

## Non-goals

- A separate page or route.
- Embedding Sheet2Web live: it redirects to a login page and sends
  `X-Frame-Options: DENY` (correct; a framed login form is a clickjacking risk).
- A Sheet2Web demo mode (later, in the Sheet2Web repo; the card is built so a
  "Try it here" can be switched on once it exists).

## Anti-goals

- Slowing the Home page: no iframe loads until the visitor asks for it.
- Leaking personal data: screenshots use the test account with the email masked;
  Sheets sync and Settings pages are never shown (secret token field).
- Stale "currently" content: the section shows an "Updated <month year>" stamp.

## Approaches considered

1. Live iframes for both, always loaded: most real, but heavy (BeatDrop takes 30–40 s
   to load on phones), shows a cookie banner, and Sheet2Web cannot be framed.
2. Screenshots only: fast and safe, but nothing to try.
3. **Screenshots by default, real site on demand (picked)**: fast first paint, still
   playable for BeatDrop. Sheet2Web stays screenshots-only until a demo mode exists.

## Design

### Placement

Home page, between Work ("Products, shipped.") and Activity, so the page reads
shipped → in progress → commit activity. Nav gets a "Now" link (`#now`).

### Layout

- Header: eyebrow `NOW`, title "Currently building", right-aligned mono stamp
  "UPDATED NOV 2026". Uses the shared `Container`.
- Two cards side by side from `lg`, stacked below.
- Card contents, top to bottom:
  - Browser frame (reuse `DeviceFrame` look: 3 dots + host name), 16:10, desktop shots
    cross-fading every ~4 s; pauses on hover/focus; static first shot under reduced motion.
  - Name + status pill (`Live` / `In progress`).
  - One-line description.
  - `WORKING ON` label + one line of current focus.
  - Stack chips.
  - Buttons: "Try it here" (only when `embeddable`), "Open site ↗", "Case study →"
    (`/projects/<slug>`).
- "Try it here": replaces the screenshots with an iframe of the site inside the same
  frame (`loading="lazy"`, `title`, sandbox allowing scripts/same-origin/popups), plus a
  "Back to preview" button. On phones the button opens the site in a new tab instead,
  because the framed app is too slow and cramped there.
- Below the cards: `INTERESTED IN` and a row of short chips.

### Data (`src/constants/currentlyBuilding.ts`)

```ts
export interface BuildingItem {
  slug: string;          // matches a project in projects.ts (for the case-study link)
  name: string;
  url: string;
  status: "live" | "in-progress";
  summary: string;
  workingOn: string;
  stack: string[];
  shots: string[];       // desktop screenshots for the frame
  embeddable: boolean;   // shows "Try it here"
}
export const CURRENTLY_BUILDING: { updated: string; items: BuildingItem[]; interests: string[] };
```

Initial content:
- BeatDrop: live, embeddable, shots from `public/projects/beatdrop/` (play, guesser,
  daily, room).
- Sheet2Web: in progress, not embeddable, shots from `public/projects/sheet2web/`
  (dashboard, portfolios, allocation, dividends).
- `workingOn` and `interests`: owner to provide; drafts used until then and listed in
  the hand-off.

The Sheet2Web screenshots (8 desktop + 4 phone) are also added to its `gallery` so its
case-study page has them.

### Files

- New: `src/constants/currentlyBuilding.ts`, `src/components/CurrentlyBuilding.tsx`
  (section shell + GSAP entrance), `src/components/currently-building/BuildCard.tsx`,
  `src/components/currently-building/PreviewFrame.tsx` (cross-fade + iframe swap),
  barrel `index.ts`.
- Edit: `src/pages/Home.tsx` (insert `#now`), `src/components/common/Navbar.tsx` (link),
  `src/constants/projects.ts` (Sheet2Web gallery + cover).

## Left to the builder

Exact fade timing and easing, chip styling, card heights, iframe sandbox flags beyond
those listed, phone breakpoint for the new-tab fallback (use `md`).

## Open items for the owner

- Real `workingOn` lines for both projects.
- The "Interested in" topics.
