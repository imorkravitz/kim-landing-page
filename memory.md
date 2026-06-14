# Kim Landing Page — Development Memory

> **Instructions:** Update this file after every feature addition or significant change.
> Date format: YYYY-MM-DD

---

## Current Status: 🟡 In Progress

**Last updated:** 2026-05-26 (session 5)

---

## ✅ Completed Features

### Core Infrastructure
- [x] React 18 + Vite + Tailwind CSS + Framer Motion v11 setup
- [x] RTL support — `dir="rtl"` on root div AND on `section` element AND on each `ContentPanel`
- [x] Calibri font loaded from local TTF assets
- [x] SEO meta tags (SEOHead component)
- [x] Mobile-responsive foundation (breakpoints: sm/md/lg)

### Scroll Story Section (7 Phases) — ScrollStorySection.jsx
- [x] Sticky scroll theater (520vh outer, 100vh sticky inner)
- [x] `useScroll` + `useMotionValueEvent` phase state machine
- [x] `AnimatePresence mode="wait"` phase transitions (enter 0.65s / exit 0.35s, slowed for readability)
- [x] **FIXED RTL layout**: `ContentPanel` now uses `padding-left: 50%` (physical CSS) instead of CSS Grid — text is always in physical RIGHT half regardless of `dir="rtl"` 
- [x] Phase 0 — Hero: logo, headline, credentials, CTA, social proof
- [x] Phase 1 — Busy Life: floating lifestyle icons, problem statement
- [x] Phase 2 — Plate: `PlateVisual` SVG component (CSS conic plate, no image file needed)
- [x] Phase 3 — Exploded Plate: **proper explosion animation** sequence:
  - `start_frame.png` visible → scale pulse → fades out
  - Shockwave ring expands from centre (gold border)
  - White flash burst
  - 8 food-coloured particles fly outward in all directions
  - `end_frame.png` fades in and settles (with spring overshoot)
  - Food-component badges appear after explosion (1.1s+ delay)
- [x] Phase 4 — 80:20 Ring: animated SVG donut chart
- [x] Phase 5 — App: Liveat mock UI card with meal plan
- [x] Phase 6 — Support: chat bubbles + final CTA
- [x] Phase progress dots (bottom centre)
- [x] Scroll hint arrow (Phase 0 only)
- [x] Bottom banner (persistent)

### Kim Image
- [x] Using `kim-hero.png` (replaced older transparent variants)
- [x] Desktop: `w-[48%]` absolute left column, `h-full object-contain object-bottom` — fills from bottom to top of viewport
- [x] Mobile: top strip `h-44`, content pushed with `pt-48`
- [x] **Scroll shrink effect:** `kimScale` 1.0 → 0.86 as user scrolls in, restored near end
- [x] Fade effect (`kimOpacity`) — fades to 0.2 during mid-scroll phases
- [x] Parallax lift (`kimY` -60px over full scroll)

### Title / Heading Visuals
- [x] `SectionLabel` — small uppercase text + 8px gold bar (right-aligned)
- [x] `PhaseHeading` — consistent h2 (font-black, TEXT color, dir="rtl")
- [x] `Accent` — brand-colored word with thin underline bar

### UI / UX
- [x] `ScrollProgressBar.jsx` — fixed top, grows left→right, gold gradient, spring-eased
- [x] Mobile scroll-snap: `proximity` (fixes sticky section conflict)
- [x] Touch-friendly buttons (`min-h-[48px]`)
- [x] Checklist items use `dir="rtl"` flex (icon left of text in RTL = icon on right visually) ✅

### Shared Scroll Video Background (3 Sections)
- [x] **`ScrollVideoBackground.jsx`** — sticky canvas spanning ProblemSolution + Features + **ProcessSection**
  - White background (`#ffffff`), no `mix-blend-mode` (not needed on white — white×white=white)
  - Always **cover mode** (`Math.max`) — fills 100vw×100vh on all devices including mobile
  - `useScroll` offset `['start end', 'end start']` → animation starts moment section enters viewport
  - lerp 0.18 — fast enough for mobile scroll momentum
  - `width: 100%` on sticky div — iOS Safari safe (no overflow:hidden/clip on wrapper)
  - `isolation: 'isolate'` on wrapper — stacking context, canvas z-index:-1 behind all content
- [x] Phase 5 **Liveat card** — real food photo diary (app-2 / app-5 / app-6 screenshots):
  - 2×2 photo grid: each logged cell crops a real meal photo from app-2 / app-5 using `objectFit:cover` + `objectPosition`
  - Water tracker row: app-6 screenshot cropped to bottle area (`objectPosition: 50% 92%`) + `Droplets` icon label
  - **Progress bar = weight goal** (3.5 / 6.0 ק"ג, 58%) — NOT calories
  - Gradient bar (`LIVEAT_GREEN → #86efac`), "התקדמות ביעד המשקל" sub-label
  - Full responsive: 340px desktop card (left of Kim) + compact mobile card (in ContentPanel)
  - No emoji anywhere in the card

### Other Page Sections
- [x] ProblemSolutionSection — transparent bg (`bg-white` removed), `min-h-screen` added
- [x] FeaturesSection — **simplified**: removed internal `ScrollCanvasVideo`; transparent background, `min-h-screen`, full-width card grid; video handled by shared `ScrollVideoBackground`
- [x] ProcessSection
- [x] PricingSection
- [x] AppSection
- [x] TestimonialsSection
- [x] AboutSection
- [x] CalculatorSection
- [x] FAQSection
- [x] CTASection
- [x] Footer
- [x] FloatingCTA (WhatsApp sticky button)
- [x] ScrollToTop button
- [x] AccessibilityWidget

---

## 🔴 Known Issues / Priority TODOs

### High Priority
- [ ] **RTL audit of other sections** — ProblemSolution, Features, Pricing, Process, AppSection, Testimonials, About, Calculator, FAQ, CTA, Footer. Need to open each file and check for `flex-row`, `ml-*`, `mr-*`, `left-*`, `right-*`, `text-left` that may break in RTL context.
- [ ] **Mobile QA** — Test all 7 scroll phases at 375px viewport width
- [ ] **Phase visuals on mobile** — Food badges / ring / app card are `hidden lg:` — consider mobile-specific layout for phases 1–6

### Medium Priority
- [ ] **Image optimisation** — Convert `kim-hero.png`, `start_frame.png`, `end_frame.png` to WebP (currently ~1–1.5 MB each)
- [ ] **Preload kim-hero.png** in `index.html` for better LCP score
- [ ] **Explosion animation timing** — food particle delays (1.1s+) may feel slow; test in real browser and tune
- [ ] **Accessibility** — Add `aria-label` to icon-only buttons; review `alt` on decorative images

### Low Priority
- [ ] Dark mode variant
- [ ] Before/after testimonial photos
- [ ] `srcset` / responsive images for `kim-hero.png`
- [ ] WhatsApp floating button pulse animation

---

## 🗂️ File Change Log

| Date | File | Change |
|------|------|--------|
| 2026-05-26 | `ScrollStorySection.jsx` | **Mobile scroll section full fix**: ContentPanel changed from `items-center h-full` to `items-start lg:items-center` with `pt-[156px] pb-28` on mobile — content now starts *below* Kim's strip (h-36+pt-3=156px) and clears the bottom banner+dots area. Kim mobile strip: `h-44 pt-14` → `h-36 pt-3` (156px total, saves 76px). Video layer: `h-[230px] pt-14` → `h-[160px] pt-3`. Phase content wrapper: removed useless `h-[110%] pt-60 lg:pt-0` → `h-full`. PhaseHeading: `text-5xl md:text-6xl` → `text-3xl md:text-5xl lg:text-6xl`. Phase 0: logo `h-36 md:h-96` → `h-24 md:h-36 lg:h-96`, h1 `text-4xl` → `text-2xl sm:text-3xl`, tighter mb on mobile, stats `hidden lg:flex`. Phase 5: removed `mt-20` from mobile card, grid cells 82→62px, water tracker hidden in compact, paragraph `hidden lg:block`. Phase 6: paragraph `hidden sm:block`, checklist `mb-4 lg:mb-7`. |
| 2026-05-26 | `index.html`, `tailwind.config.js`, `index.css`, `AboutSection.jsx` | **Global Heebo font**: Loaded Heebo (wght 300–900) from Google Fonts via `<link>` in `index.html`. Registered `heebo` + overrode `sans` token in `tailwind.config.js`. Changed `body { font-family }` in `index.css` from Calibri → Heebo. Removed all 4 `font-calibri` explicit classes from `AboutSection.jsx` (now inherit Heebo). `font-gveret` untouched everywhere. |
| 2026-05-26 | `ScrollStorySection.jsx` | **Phase 0 Hero — motion polish**: Added `useCountUp` hook (0→5,000 easeOutQuart, 1.3s, 0.6s delay). Added `HighlightWord` component (gold underline sweeps right→left, RTL-safe `originX:1`): wraps "התזונה" (delay 0.8s) and "רפואה" (delay 1.05s). Added `MarkerHighlight` component (translucent brand-color background sweep): wraps "בלי דיאטות קיצוניות" (delay 0.95s). CTA button wrapped in `motion.a` with `whileHover` spring lift + glow filter + `whileTap` scale. Social proof card wrapped in `motion.div` with hover lift + box-shadow. Stars use `heroStarContainer`/`heroStarItem` stagger variants (pop-in with spring, 0.07s stagger, delayed 0.4s). |
| 2026-05-25 | `ScrollStorySection.jsx` | **Phase 5 Liveat — food photo diary v3 (real images)**: Replaced all emoji/colour placeholders with real Liveat app screenshots. `app-2.png` + `app-5.png` used as `objectFit:cover` image sources for the 3 logged meal cells (different `objectPosition` per cell to show distinct food areas). `app-6.png` used for water-bottle tracker row (cropped to bottom 8% of screen). Progress bar changed from calorie (860/1450 קל) to **weight goal** (3.5/6.0 ק"ג, 58%). Gradient bar + "התקדמות ביעד המשקל" caption. Zero emoji in card. |
| 2026-05-25 | `ScrollStorySection.jsx` | **Phase 5 Liveat — food photo diary mock** (v2): Rebuilt to match actual Liveat app (app-2/app-5 screens). 2×2 photo grid — coloured placeholder cells with emoji, timestamp overlay, meal label, calorie. Empty "+" slot for unlogged meal. Water bottle tracker (4/6). Progress bar kept (860/1450 קל, 59%). "שותף עם קים" header badge with pulse dot. ContentPanel text updated: PDF menu + photo diary description. |
| 2026-05-25 | `ScrollVideoBackground.jsx` | **Full rewrite**: BG `#fff3cd` → `#ffffff` (white). Removed `mix-blend-mode:multiply` (not needed on white). Always cover mode (`Math.max`) — fills 100vw×100vh on all devices. No source crop. offset `['start start','end start']` → `['start end','end start']` for earlier animation start. lerp 0.11→0.18. Removed `overflow:clip` (iOS Safari sticky fix). `width:100%` safe. |
| 2026-05-25 | `Home.jsx` | Added `ProcessSection` inside `ScrollVideoBackground` — now 3 sections (ProblemSolution + Features + Process) share the stethoscope animation background. |
| 2026-05-25 | `ProcessSection.jsx` | Transparent bg, `py-16 md:py-24 min-h-[55vh] md:min-h-[85vh]`. Grid 4-col → `grid-cols-2 md:grid-cols-4`. Icons `w-24→w-16 md:w-24`. Compact heading margin mobile. |
| 2026-05-25 | `ProblemSolutionSection.jsx` | `py-10 md:py-24 min-h-[50vh] md:min-h-[75vh]`. Cards: `backdrop-blur-sm`, compact padding `p-6 md:p-10 lg:p-12`. |
| 2026-05-25 | `FeaturesSection.jsx` | Cards `bg-white/80 backdrop-blur-sm`. Section `min-h-[50vh] md:min-h-[75vh]`. |
| 2026-05-23 | `ScrollVideoBackground.jsx` | **Created** — shared sticky canvas background for ProblemSolution + Features. `stethoscope_animated_1.mp4`, same canvas engine, `mix-blend-mode:multiply`, sticky + `marginBottom:-100vh`, `['start start','end start']` scroll offset. |
| 2026-05-23 | `FeaturesSection.jsx` | **Simplified** — removed internal `ScrollCanvasVideo` engine + framer-motion/video imports. Transparent outer bg, `min-h-screen`, full-width content. |
| 2026-05-23 | `ProblemSolutionSection.jsx` | Removed `bg-white`, added `min-h-screen` — section is now transparent so sticky video shows through. |
| 2026-05-23 | `Home.jsx` | Replaced two `<AnimatedSection>` wrappers for ProblemSolution + Features with single `<ScrollVideoBackground>`. |
| 2026-05-23 | `ScrollStorySection.jsx` | **Mobile video support**: Video layer changed from `hidden lg:block` (desktop-only) to responsive — mobile: `top-0 full-width h-[230px] pt-14` (top strip), desktop: `left-0 w-[52%] full-height` (left column). Mobile Kim converted to `motion.div` with `kimOpacity` spring (fades out when video appears). Mobile content padding `pt-48`→`pt-60` to clear video strip. |
| 2026-05-23 | `ScrollStorySection.jsx` | **Single video**: Replaced 3-video player with single `animated.mp4`. Simplified RAF loop. |
| 2026-05-23 | `ScrollStorySection.jsx` | **Canvas scrubber v3**: `<video>` hidden, frame painted to `<canvas>` on every `seeked` event. Canvas holds last good frame = zero black-flash. `pendingRef` = one seek at a time (decoder never overwhelmed). lerp 8%/frame. `ctx.getContext('2d', {alpha:false})` for performance. white fill + `mix-blend-mode:multiply` removes white video BG. |
| 2026-05-23 | `ScrollStorySection.jsx` | **Video phases**: Added `ScrollVideoPlayer` — 3 MP4 videos scrubbed by scroll position across phases 2-3. `mix-blend-mode: multiply` blends with cream BG. Kim hidden during video phases. Kim image enlarged 70%→80%. All fonts enlarged (PhaseHeading 5xl/6xl, Hero h1 4xl/6xl, body text xl/lg). Removed PlateExplosion, PlateVisual, FOOD_PARTICLES, angleToXY dead code. |
| 2026-05-23 | `ScrollStorySection.jsx` | Replaced broken `<img src={startFrame}>` with PlateVisual (SVG), then replaced again with video approach above. |
| 2026-05-23 | `ScrollStorySection.jsx` | Slowed hero transition timing: `pageVariants` duration 0.4→0.65s, exit 0.25→0.35s; `stagger` children 0.07→0.12s / delay 0.08→0.15s; `item` duration 0.38→0.55s |
| 2026-05-22 | `ScrollStorySection.jsx` | **Major rewrite v2**: RTL-safe ContentPanel (padding-left 50%), bigger kim-hero image (w-[48%] h-full), proper explosion animation (shockwave+flash+particles), PhaseHeading/SectionLabel/Accent components, removed debug hooks |
| 2026-05-22 | `ScrollStorySection.jsx` | Initial rewrite v1: kim-hero.png, kimScale, start/end frame — later found RTL grid bug |
| 2026-05-22 | `ScrollProgressBar.jsx` | Created — fixed top progress bar |
| 2026-05-22 | `Home.jsx` | Added ScrollProgressBar; fixed mobile scroll-snap mandatory→proximity |
| 2026-05-22 | `CLAUDE.md` | Created — project AI instructions |
| 2026-05-22 | `memory.md` | Created — development status tracker |

---

## 🔑 Critical Architecture Notes

### RTL Layout Rule (IMPORTANT)
CSS Grid and Flexbox both reverse direction in `dir="rtl"`. **Never use CSS Grid columns to separate image/text** when the page has `dir="rtl"`.

**The solution for ScrollStorySection:**
```css
/* ContentPanel wrapper — physical left padding pushes text to right half */
padding-left: 50%;  /* physical property, RTL-safe */
padding-right: 3rem;
```
`padding-left` is a **physical** CSS property (not logical), so it always adds space to the physical left regardless of writing direction. ✅

### Explosion Animation Sequence (Phase 3)
```
t=0.0s  start_frame visible
t=0.45s shockwave ring begins expanding
t=0.50s white flash burst
t=0.48s food particles begin flying outward (staggered 0.04s each)
t=0.95s end_frame fades in
t=1.10s food component badges appear (staggered 0.1s each)
```

---

## 💡 Feature Ideas for Future

1. **Testimonial carousel** with before/after patient photos
2. **Video background** for hero (short Kim cooking/consulting loop)
3. **Interactive BMI/calorie calculator** (currently static)
4. **Blog section** linking to Kim's Instagram
5. **Live calendar** — show next available consultation slots
6. **A/B test CTA copy** — "קבעי ייעוץ" vs "התחילי את המסע שלך"
7. **Micro-interactions** — confetti on CTA click
8. **Cookie consent banner** (Israeli privacy law compliance)
9. **Page speed** — image lazy loading, bundle splitting per route

---

## 🎨 Design Decisions Log

| Decision | Rationale |
|----------|-----------|
| `padding-left: 50%` for text column | RTL-safe alternative to CSS Grid column ordering |
| `w-[48%] h-full object-bottom` for Kim | Fills full viewport height, anchored from bottom — looks natural |
| Explosion: particles not images | CSS/Framer Motion particles give real "animated" feel vs static image swap |
| Shockwave ring in `#D4A843` gold | Matches brand palette; feels premium not garish |
| Progress bar left→right in RTL | Convention for progress indicators — time flows left→right |
| `mode="wait"` AnimatePresence | Cleaner phase transitions — no simultaneous enter/exit overlap |
