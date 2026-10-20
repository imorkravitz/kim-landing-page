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
| Plate burst video | `src/assets/videos/plate-1440.mp4`, `plate-820.mp4` | Plate phase (canvas scrub via `useScrubVideo`) |
| Stethoscope video | `src/assets/videos/stethoscope-1920.mp4`, `-1280.mp4` | `ScrollVideoBackground` |
| KIM logo | `src/assets/icons/KIM - LOGO 2.png` | PhaseHero |
| Kim icon | `src/assets/icons/kim-icon-1.png` | PhaseSupport chat |

---

## Architecture — ScrollStorySection

`ScrollStorySection` renders one of two layouts (`useIsWide`, 1024px):

- **Desktop — `StageStory`:** a **460svh** section with a sticky 100svh stage. Six phases (hero, busy life, plate, 80:20, app, support) share the scroll by `PHASE_WEIGHTS`; `PHASE_STARTS` is derived from it. Each mounted phase is a `PhaseLayer` whose position (-1 arriving, 0 settled, 1 leaving) is a `useTransform` of progress across `±HANDOFF`: sequential fade, artwork and copy travelling at different rates. Invisible 1px markers (`story-*` ids) sit at each phase's settled scroll position for the navbar.
- **Phone — `FlowStory`:** the same phase components as separate `Scene` sections in normal page flow, each as tall as its content (hero fills the screen), so content moves with the finger. Artwork lags the scroll slightly (depth); Kim appears in the hero only. Nothing pins: `PlateScene` scrubs the burst from the plate's own travel through the screen, using a 49-frame JPEG sequence (`public/plate-seq/`, `useFrameSequence`) because video seeking on iOS stutters.
- **Stethoscope (`ScrollVideoBackground`):** desktop scrubs the video (`useScrubVideo`); phones and tablets (<1024px) scrub a 121-frame JPEG sequence (`public/steth-seq/`, `useFrameSequence`) for the same iOS reason. Never scrub a `<video>` on phones.

Phase entrances use `whileInView` (`VIEW_ONCE`); the phone mockups mount on first sight (`MountInView`). Busy-life objects float (`Floating`: idle bob + per-object scroll depth).

**Navbar — `SectionNav.jsx`:** adapted from 21st.dev "Scroll Spy". Appears after the hero, highlights the section in view with a sliding pill, click scrolls to it. Destinations (`NAV_SECTIONS` in `Home.jsx`): בית `story-hero`, השיטה `method`, על קים `about`, סיפורי הצלחה `results`, יוצאות לדרך `start`, האפליקציה `app`, תוכניות `pricing`, שאלות `faq`. Jumps use the layout offset (not the painted rect) so entrance transforms don't skew the landing.

The **plate burst** is a real video scrubbed onto a canvas (`src/hooks/useScrubVideo.js`, shared with the stethoscope). It multiplies onto the cream background so the white backdrop disappears; the wrapper's radial mask feathers the crop edge.

### Video encoding
Scrub videos are H.264, `yuv420p`, no audio, `+faststart`. Plate: GOP 6 with no B-frames (cheap seeks at half the bytes of all-intra). Stethoscope: every frame a keyframe, studio backdrop lifted to pure white with `curves`. Never ship HEVC/10-bit: Chrome and Firefox do not reliably decode it.

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
1. Keep `PHASE_WEIGHTS` and `PHASES` in sync with any phase additions/removals
2. Each phase component is a self-contained `motion.div` with `pageVariants`
3. Visual elements on the left half must stay within `left < 50%` to avoid overlapping Kim
4. **Update `memory.md`** after changes
