# Kim Landing Page — Claude Instructions

## Project Overview
Landing page for **Kim Gafson**, clinical nutritionist. Built with **React 18 + Vite + Tailwind CSS + Framer Motion v11**.

- **Live dev server:** `npm run dev -- --port 5174` → http://localhost:5174/
- **Root dir:** `/Users/orkravitz/develop/kim-landing-page`
- **Language:** Hebrew (RTL). The root `<div>` carries `dir="rtl"`. All text must be right-aligned; flex layouts use `justify-end` for RTL-correct alignment.

---

## Design System

| Token | Value |
|-------|-------|
| Brand gold | `#8B7F4B` |
| Background | `#e9e4ce` |
| Main text | `#333333` |
| Accent warm | `#C49A7A` |
| Fonts | Calibri (body), Piki/Arial (display) |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/Home.jsx` | Page composition — sections, fixed elements, global styles |
| `src/components/landing/ScrollStorySection.jsx` | Sticky 7-phase scroll story (hero, busy life, plate, exploded, 80:20, app, support) |
| `src/components/landing/ScrollProgressBar.jsx` | Fixed progress bar at viewport top |
| `src/components/landing/FloatingCTA.jsx` | Sticky WhatsApp CTA button |
| `src/index.css` | Global styles, font-face declarations, Tailwind base |

### Assets
| Asset | Path | Used in |
|-------|------|---------|
| Kim hero photo | `src/assets/images/kim-hero.png` | ScrollStorySection (desktop + mobile) |
| Full plate | `src/assets/images/start_frame.png` | PhasePlate, PhaseExploded (enter frame) |
| Exploded plate | `src/assets/images/end_frame.png` | PhaseExploded (exit frame) |
| KIM logo | `src/assets/icons/KIM - LOGO 2.png` | PhaseHero |
| Kim icon | `src/assets/icons/kim-icon-1.png` | PhaseSupport chat |

---

## Architecture — ScrollStorySection

The component occupies **520vh** with a **sticky inner div** (`height: 100vh`). Scroll progress drives a 7-phase state machine:

```
PHASE_STARTS = [0, 0.15, 0.29, 0.43, 0.57, 0.72, 0.86]
phases       = [Hero, BusyLife, Plate, Exploded, Ring, App, Support]
```

`AnimatePresence mode="wait"` handles enter/exit transitions between phases.

Kim's photo is **always visible** on the left half (desktop) / top strip (mobile), separate from the text column. It fades and **shrinks on scroll** via `kimOpacity`, `kimY`, and `kimScale` motion values.

The **plate explode animation** (Phase 3) crossfades `start_frame.png → end_frame.png`:
- start_frame fades **out** + scales up (burst)
- end_frame fades **in** + settles from slight under-scale

---

## RTL Rules — CRITICAL

### The CSS Grid / Flexbox trap
`dir="rtl"` reverses both Grid column order AND flex main-axis direction.  
**Never** use a CSS Grid or Flexbox to split "image left / text right" when the page is RTL — the columns will be swapped.

### The fix used in ScrollStorySection
Use **physical** CSS padding to push text into the right half:
```jsx
// ContentPanel — always physically right-aligned regardless of dir
<div className="w-full px-5 lg:pl-[50%] lg:pr-12">
```
`padding-left` is a physical property (not logical), so it always adds left-side space, pushing content to the right half — even inside `dir="rtl"`. ✅

### Other RTL rules
- Each `ContentPanel` re-declares `dir="rtl"` and `text-right` on the inner wrapper.
- Checklist items: `<div dir="rtl" className="flex">` — icon appears on the right visually.
- Scroll progress bar uses `transformOrigin: '0% 0%'` (left-to-right — convention for progress indicators even in RTL pages).
- Absolutely-positioned visual elements use explicit `left: X%` / `top: Y%` — these are physical coords, not affected by RTL.

## Mobile Rules
- Min touch target: **44×44px** (use `min-h-[48px]` on buttons).
- Kim mobile image is `h-40`; content area has `pt-52` to push below it.
- Avoid `scroll-snap-type: y mandatory` on `<html>` — it fights the sticky scroll section. Use `proximity`.
- Font size minimum **16px** on mobile to prevent iOS auto-zoom.

---

## When adding a new section
1. Create `src/components/landing/NewSection.jsx`
2. Import and render in `Home.jsx` inside `<AnimatedSection>`
3. Ensure `dir="rtl"` flows correctly (no hardcoded LTR)
4. **Update `memory.md`** with the change

## When modifying ScrollStorySection
1. Keep `PHASE_STARTS` in sync with any phase additions/removals
2. Each phase component is a self-contained `motion.div` with `pageVariants`
3. Visual elements on the left half must stay within `left < 50%` to avoid overlapping Kim
4. **Update `memory.md`** after changes
