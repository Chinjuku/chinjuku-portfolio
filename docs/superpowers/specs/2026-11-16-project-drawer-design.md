# All Projects: project drawer, gallery and odometer stats

Date: 2026-11-16
Status: draft, waiting for approval

## Intent

The All Projects page (`/projects`) only shows cards with a short description and
Live demo / Source buttons. Visitors can't see what a project actually looks like
or what it covers. The site is now a showcase, not a job hunt, so each project
should be explorable on its own: real screenshots, a fuller write-up and the stack,
without leaving the list.

The header stats (projects, since, AI projects, technologies) are static numbers;
they should animate in.

## Goals

- Clicking any project (grid card or featured carousel) opens a drawer with the
  full project: screenshot gallery, overview, my role, highlights, stack, links.
- Screenshots can be viewed one at a time (large view + thumbnails + prev/next)
  and opened full screen (lightbox).
- Screenshots sit in a device frame that matches what they are: browser frame for
  desktop shots, phone frame for phone shots. The device switcher only shows the
  devices that have real screenshots for that project.
- The drawer works on phone, tablet and desktop.
- Stats count in with an odometer (each digit rolls in its own slot).

## Non-goals

- Live preview (iframe of the deployed site). Considered and parked.
- Tablet screenshots. Not captured; no tablet frame.
- Changes to the Home page "Selected work" section.
- Writing final copy for all 24 projects. The drawer must look complete with only
  the existing fields.

## Anti-goals

- Never put a screenshot in a frame for a device it wasn't taken on (no shrinking
  a desktop shot into a phone frame). It misrepresents the project.
- No broken or empty-looking drawer when a project has no gallery yet.

## Constraints

- Stack and conventions from `portfolio-conventions`: React 19, Tailwind 3, GSAP,
  data in `src/constants/`, sub-components in `src/components/all-projects/` with
  the barrel `index.ts`, English code and comments.
- Dark "core" palette only (`core-*` tokens), contrast at least 4.5:1 for text.
- Respect `prefers-reduced-motion` (no slide or roll animations; show final state).
- Screenshots live in `public/projects/<slug>/` as `.webp`.
- No commits or pushes until the owner says so.

## Approaches considered

1. **Case-study page at `/projects/:slug`**: most room and a clean shareable URL,
   but the most content to write and it takes the visitor away from the filters.
2. **Drawer on the same page (picked)**: quick to open and close, keeps the filter
   and scroll position, enough room for a gallery. Shareable via `?project=<slug>`.
3. **Expand the card in place**: flashiest, hardest to make work well on phones.

The owner picked 2. For the device frames, the owner picked "frames only for the
devices that have screenshots" over a live iframe preview.

## Design

### Data (`src/constants/projects.ts`)

`Project` gets optional fields so existing entries keep working:

```ts
export type ShotDevice = "desktop" | "phone";

export interface ProjectShot {
  src: string;        // "/projects/fintax/dashboard.webp"
  device: ShotDevice;
  caption?: string;
}

export interface Project {
  // existing fields unchanged
  slug: string;              // required, kebab-case, unique; used in ?project=
  overview?: string[];       // paragraphs; falls back to `description`
  highlights?: string[];     // short bullet points
  gallery?: ProjectShot[];   // falls back to `image`, then the generated cover
}
```

`slug` is added to every project (derived from the title by hand, checked unique).

### Drawer (`src/components/all-projects/ProjectDrawer.tsx`)

- Opened from `ProjectCard` and `FeaturedCarousel` via an `onOpen(project)` prop;
  state lives in `AllProjects.tsx`, synced to `?project=<slug>` with
  `useSearchParams` (opening a shared link opens the drawer; closing removes it).
- Content order: title, role and year, Live demo / Source buttons, gallery,
  overview, highlights, stack chips.
- Sizes: phone (< 768px) is a full-height sheet sliding up from the bottom; tablet
  is a right panel at about 70% width; desktop is a right panel 600px wide with the
  grid dimmed behind it.
- Accessibility: `role="dialog"`, `aria-modal`, labelled by the title; focus moves
  in on open and back to the card on close; Esc and backdrop click close it; page
  scroll is locked while open.
- GSAP slide in/out (x for the panel, y for the sheet), scoped with
  `gsap.context` per the project pattern.

### Gallery (`ProjectGallery.tsx`) and frames (`DeviceFrame.tsx`)

- Device tabs show only devices present in `gallery`; with one device, no tabs.
- One large shot inside its frame, thumbnails below, prev/next buttons and a
  counter (`2 / 5`). Phone shots are shown narrower, centered.
- Clicking the large shot opens the lightbox.
- No `gallery`: show `image` (or the existing `ProjectCover` initials cover) with
  no frame and no tabs.
- Images use `loading="lazy"`, fixed aspect ratios (16:10 desktop, 9:19.5 phone) so
  nothing jumps while loading.

### Lightbox (`ProjectLightbox.tsx`)

- Full-screen overlay above the drawer: image, caption, counter, prev/next.
- Keys: left/right to move, Esc closes the lightbox only. Swipe on touch.

### Odometer (`src/components/motion/Odometer.tsx`)

- Each digit is a 0–9 reel in an overflow-hidden slot; reels roll to their digit,
  later digits slightly longer, when the stats scroll into view (once).
- Used for all four stats on the All Projects header, replacing the plain numbers.
- Reduced motion: renders the final number with no roll.
- `aria-label` carries the real number; the reels are `aria-hidden`.

### Content

- FinTax first: screenshots exported from the owner's Figma file via the Figma MCP
  (2x PNG, converted to `.webp`), plus a drafted overview and highlights for the
  owner to edit.
- Other projects: existing description only until screenshots and copy arrive.

## Left to the builder

- Exact animation timings and easing, within the project's existing style.
- Thumbnail size and how many fit before the strip scrolls.
- Whether the drawer reuses `RepoModal` for multi-repo Source buttons (it should,
  as the cards do today).

## Open items for the owner

- Figma link for FinTax (ideally a link to the frames to use).
- Review the drafted FinTax overview and highlights.

## Update 2026-11-16: drawer replaced by case-study pages

After seeing the drawer with FinTax's 14 screenshots, the owner switched to approach 1:

- Each project has its own page at `/projects/:slug` (`src/pages/ProjectDetail.tsx`): back link and `NN / 23` position, title, role and year, Live demo / Source, gallery (sticky on large screens), Overview / My role / Highlights / Stack rows, and a "Next project" link (newest-first order, wrapping).
- Grid cards and the featured carousel link to that page; the drawer (`ProjectDrawer.tsx`) and its `?project=` state were removed.
- Old `?project=<slug>` links redirect to `/projects/<slug>`; unknown slugs go to `/projects`.
- The phone frame is 300px wide (was 240px in the drawer). Gallery, frames, lightbox, data fields and the odometer are unchanged.
