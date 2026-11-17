---
name: portfolio-conventions
description: Coding conventions for the chinjuku-portfolio project (React 19 + Vite + TS + Tailwind v3 + GSAP + p5). Use whenever adding or changing a section, component, animation, project/skill data, theme color, or 3D/canvas effect in this repo.
---

# chinjuku-portfolio conventions

## Stack
React 19, Vite 7, TypeScript ~5.9 (strict, no `any`), React Router 7, Tailwind CSS 3 (`darkMode: "class"`), GSAP 3 + ScrollTrigger, p5 (canvas effects), lucide-react icons. Deployed on Vercel (`vercel.json`).

Scripts: `npm run dev`, `npm run build` (`tsc -b && vite build`), `npm run lint`.

## Layout
- `src/pages/` – routes: `Home.tsx` (stacks sections), `AllProjects.tsx`.
- `src/components/<Section>.tsx` – section shell (owns the GSAP timeline + data wiring).
- `src/components/<section-kebab>/` – the section's sub-components, each named `<Section><Part>.tsx`, re-exported from a barrel `index.ts` (`export * from "./SkillsHeader";`).
- `src/components/common/` – Navbar, RepoModal, ScrollToTop.
- `src/constants/<name>.ts(x)` – all static content (projects, skills, experiences, about, contact, codeActivities) with exported interfaces, re-exported from `src/constants/index.ts`. Content changes go here, not in components.
- `src/hooks/` – `useActiveSection`, `useNavClick` (smooth-scroll nav). `src/utils/`, `src/context/ThemeContext.tsx` (`light | dark | system`, stored in localStorage).
- Note: `.agent/workflows/project-rules.md` still mentions `src/data/`; the real folder is `src/constants/`.

## New section recipe
1. Data + interface in `src/constants/foo.ts`, export from `constants/index.ts`.
2. Sub-components in `src/components/foo/FooHeader.tsx` etc. + `index.ts` barrel.
3. Shell `src/components/Foo.tsx` as `const Foo: React.FC = () => {...}` with a `sectionRef`, give the `<section>` an `id` for nav, add to `pages/Home.tsx` and Navbar.

## GSAP pattern (required)
```tsx
gsap.registerPlugin(ScrollTrigger); // module level

useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "restart none restart none",
      },
    });
    tl.fromTo(".foo-header", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" })
      .fromTo(".foo-card", { y: 35, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.09, ease: "back.out(1.2)" }, "-=0.2");
  }, sectionRef);
  return () => ctx.revert();
}, []);
```
- Always scope with `gsap.context(..., ref)` and `ctx.revert()` cleanup.
- Target children via kebab-case hook classes prefixed by the section (`.skills-header`, `.skills-pillar-card`) placed on sub-component roots.
- Use `fromTo`, overlap steps with `"-=0.2"`–`"-=0.3"`; eases `power3.out` / `power2.out` / `back.out(1.2)`.

## Styling
- Tailwind only; custom CSS only for globals in `index.css` / `App.css`.
- Always pair light + dark classes: `bg-space-white dark:bg-space-dark`, `text-space-black dark:text-white`.
- Palette (tailwind.config.js): `space-{black,dark,light,white,canvas}`, `station-{gray,light}`, `nebula-{purple,glow,deep,light}`, `starlight-{cyan,blue,teal,sky}`, `surface-{glass-light,glass-dark,border-light,border-dark}`, `cyber-{emerald,amber,rose}`. Add new colors there, not as hex in JSX.
- Visual language: space / station / "telemetry" sci-fi HUD (glass panels, mono labels, glow). Responsive with `md:` / `lg:`.

## Project screenshots (gallery limits)
- Desktop shots: **5–8 per project**.
- Phone shots: **2–4 per project**, only for screens where mobile differs from desktop. Never reuse a desktop shot in a phone frame.
- Total: **no more than ~10 shots** per project.
- Format `.webp`, stored in `public/projects/<slug>/`, referenced from `gallery` in `src/constants/projects.ts`.
- Exception: FinTax already has 14 shots; don't trim it without asking.

## Canvas / 3D effects
- Hero uses p5 (`hero/ForceFieldBackground.tsx`, spec in `.agent/hero-force-field.md`): create the p5 instance in an effect, `remove()` it on cleanup, handle resize, keep it `absolute inset-0` behind content with `pointer-events-none` overlays.
- Any three.js / R3F scene follows the same rules: lazy-load the heavy component (`React.lazy`), dispose renderer/geometries on unmount, load Blender exports as compressed `.glb` (Draco/meshopt) from `public/`, respect `prefers-reduced-motion`.

## Code style
- Double quotes, trailing commas, functional components, props typed with interfaces.
- Imports: React → external libs → internal (constants, then components).
- Semantic HTML (`section`, `nav`, `article`) and `aria-label` on icon-only buttons.
- Run `npm run lint` and `npm run build` before committing.
