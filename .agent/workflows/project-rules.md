---
description: Project structure, rules, and coding guidelines for Antigravity
---

# Project Rules & Guidelines

This project is a React-based portfolio application using modern web technologies. Follow these rules carefully when contributing or generating code.

## 1. Tech Stack

- **Framework**: React 19, Vite, TypeScript
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS (v3) + PostCSS
- **Animations**: GSAP (GreenSock)
- **Icons**: Lucide React

## 2. Directory Structure

- `src/components/`: Reusable UI components (e.g., Navbar, About, Experience).
- `src/pages/`: Page-level components associated with specific routes.
- `src/context/`: React Context providers (e.g., ThemeContext).
- `src/data/`: Static data structures, configurations, and mock data.
- `src/utils/`: Reusable utility functions and custom hooks.
- `src/assets/`: Static assets like images and global CSS.

## 3. Component & Code Signatures

- **Functional Components**: Use standard functional components with React hooks. Explicitly type props using interfaces/types.
- **GSAP Animations**:
  - Always encapsulate GSAP animations within `useLayoutEffect` or `useEffect` using `gsap.context()`.
  - Always return a cleanup function `() => ctx.revert()` to prevent memory leaks and strict-mode double-firing.
  - Ex: Use `gsap.from()`, `gsap.to()`, and ScrollTrigger safely bound to a `ref` via `gsap.context(() => {}, ref)`.
- **TypeScript**:
  - Maintain strict typing. Avoid `any`.
  - Interfaces/Types should be placed near the component they belong to or in a designated `types.ts` if shared.
- **Routing**:
  - For smooth scrolling on navigation, utilize custom hooks like `useNavClick` in `src/utils/index.ts`.

## 4. Styling & Tailwind Conventions

- **Utility-First**: Use Tailwind CSS for all styling. Avoid custom CSS files unless absolutely necessary (like global base styles in `index.css`).
- **Dark Mode**: The project uses Tailwind's `class` strategy for dark mode.
  - Always provide both light and dark mode classes: e.g., `bg-space-white dark:bg-space-dark` or `text-space-black dark:text-white`.
- **Custom Theme Colors** (Defined in `tailwind.config.js`):
  - Space Theme: `space-black`, `space-dark`, `space-light`, `space-white`
  - Station Theme: `station-gray`, `station-light`
  - Nebula Theme: `nebula-purple`, `nebula-glow`
  - Starlight Theme: `starlight-cyan`, `starlight-blue`
- Include responsive prefixes (`md:`, `lg:`) and use fluid layouts (Flexbox, Grid).

## 5. General Best Practices

- **Clean Code**: Keep components small, readable, and single-purpose. Break down complex pages into smaller components.
- **Accessibility**: Use semantic HTML tags (`<section>`, `<article>`, `<nav>`, `<main>`). Add `aria-labels` when necessary.
- **Imports**: Organize imports logically (React built-ins first, external libraries second, internal relative paths last).
