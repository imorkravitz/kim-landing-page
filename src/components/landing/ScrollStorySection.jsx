import React, { useRef, useState, useEffect, useContext, createContext } from 'react';
import ResponsiveImage from '@/components/ui/responsive-image';
import img_4a45529a3_app_icon from '../../assets/remote/4a45529a3_app-icon.webp';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
  useSpring,
  useInView,
  useMotionValueEvent,
  motionValue,
} from 'framer-motion';
import useScrubVideo from '@/hooks/useScrubVideo';
import useFrameSequence from '@/hooks/useFrameSequence';
import { Button } from '@/components/ui/button';
import { trackCTA } from '@/lib/analytics';
import {
  Star, GraduationCap, Stethoscope,
  Leaf, Droplets, Flame, Apple,
  CheckCircle2, ChevronDown,
} from 'lucide-react';

// @ts-ignore
/* Studio portrait, matted to transparency so Kim sits on the cream section
   rather than inside a rectangle. 1586x992, so the intrinsic aspect is 1.599
   and NOT the 1.778 of the photo it replaced: the width/height attributes on
   both <ResponsiveImage> uses below carry the new numbers, because they are
   what reserves the box before the image decodes. Leaving the old 16:9 pair
   there would reserve the wrong height and shift the hero on load. */
import kimHero from '../../assets/images/kim-hero-v1.webp';
// @ts-ignore
import kimLogo from '../../assets/icons/KIM - LOGO 2.png';
// @ts-ignore
import kimIcon from '../../assets/images/kim-icon-whatsapp.webp';
/* Plate burst, cropped square around the action from the 4K master and
   encoded twice (GOP 6, no B-frames, so a seek decodes at most six frames). */
// @ts-ignore
import plateVideo1440 from '../../assets/videos/plate-1440.mp4';
// @ts-ignore
import plateVideo820 from '../../assets/videos/plate-820.mp4';

// Phase 5 — real food photos + goals screen (Liveat diary)
// @ts-ignore
import meal1    from '../../assets/app/meal-2.webp';   // breakfast photo
// @ts-ignore
import meal2    from '../../assets/app/meal-1.webp';   // morning-snack photo
// @ts-ignore
import meal3    from '../../assets/app/meal-3.webp';   // lunch photo
// @ts-ignore
import eatDiary1 from '../../assets/app/eat_diary_1.webp'; // actual app diary screen 1
// @ts-ignore
import eatDiary2 from '../../assets/app/eat_diary_2.webp'; // actual app diary screen 2 (macros)

// Phase 4 — food sticker images for 80:20 ring
// @ts-ignore
import nt1 from '../../assets/8020/pizza.webp';
// @ts-ignore
import nt2 from '../../assets/8020/wine.webp';
// @ts-ignore
import nt3 from '../../assets/8020/crossiant.webp';
// @ts-ignore
import nt4 from '../../assets/8020/water.webp';
// @ts-ignore
import nt5 from '../../assets/8020/bread.webp';
// @ts-ignore
import nt7 from '../../assets/8020/healthyPlate.webp';
// @ts-ignore
import nt8 from '../../assets/8020/running2.webp';
// @ts-ignore
import nt9 from '../../assets/8020/banana.webp';
// @ts-ignore
import nt10 from '../../assets/8020/veggie.webp';


// Phase 1 custom images (transparent PNGs)
// @ts-ignore
import imgNoTime        from '../../assets/images/no-time.webp';
// @ts-ignore
import imgWork          from '../../assets/images/work.webp';
// @ts-ignore
import imgTierd         from '../../assets/images/tierd.webp';
// @ts-ignore
import imgStressCalendar from '../../assets/images/stress-calander.webp';
// @ts-ignore
import imgMessages      from '../../assets/images/messages.webp';
// @ts-ignore
import imgKids          from '../../assets/images/kids.webp';

const BRAND = '#8B7F4B';
// Brand olive is 4.01:1 on white — valid for fills, icons and large
// type, but NOT for body text. This is the text-safe shade (6.01:1).
const BRAND_INK = '#6D6339';
// ...and this is the shade for fills that carry white text (4.63:1 vs 4.01).
// Visually a hair off BRAND; the difference only shows up in a contrast meter.
const BRAND_SURFACE = '#807545';
const BG    = '#e9e4ce';
const TEXT  = '#333333';
/* Phase pacing.
 *
 * These were [0, 0.15, 0.29, 0.43, 0.60, 0.78], which over the old 560svh
 * gave 84 / 78 / 78 / 95 / 101 / 123svh of scroll per phase — the last two
 * phases each held for more than a full screen while the tightest held for
 * 0.78. That slack at the END is the worst place to have it: it is the part a
 * visitor reaches only after already deciding to stay.
 *
 * Even sixths spend the same scroll on every phase, so shortening the section
 * takes its reduction out of the loose phases rather than uniformly off all
 * six. No phase is removed and no content changes — this is the scroll
 * DISTANCE mapped onto the story, not the story.
 */

/* Only one hero should exist in the DOM at a time.
   The two Kim images are CSS-hidden per breakpoint (hidden lg:flex / lg:hidden),
   but display:none does not stop a browser fetching an <img> — so on a phone
   BOTH the desktop and mobile hero were being downloaded, and the hero is the
   LCP asset. Rendering conditionally means exactly one is ever requested. */
function useIsWide() {
  const query = '(min-width: 1024px)';
  const [wide, setWide] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setWide(mq.matches);
    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync);
    sync();
    return () => { mq.removeEventListener('change', sync); window.removeEventListener('resize', sync); };
  }, []);
  return wide;
}

const ease = [0.25, 0.1, 0.25, 1];

/* Each scene publishes its position (-1 entering, 0 centred, 1 leaving) so
   ContentPanel can move the copy at its own rate. */
const PhaseMotionContext = createContext(null);
const STILL = motionValue(0);

/* Entrances play once, the first time a block is a quarter on screen. With
   the story now in normal page flow every scene is mounted from the start,
   so mount-time animations would finish before anyone saw them. */
// Starts as the block's top edge comes into view, not once a quarter of it
// is on screen: on a phone a tall block waited so long the scroll showed
// empty cream first.
const VIEW_ONCE = { once: true, amount: 0, margin: '0px 0px -6% 0px' };

/* The phone mockups run a scripted timeline (screens, typing, replies) from
   the moment they mount. They mount on first sight instead, into a box of
   their own size so nothing moves when they arrive. */
function MountInView({ width, height, children }) {
  const ref = useRef(null);
  // Mounts a little before it scrolls in, so the phone is never an empty box.
  const seen = useInView(ref, { once: true, margin: '0px 0px 35% 0px' });
  return <div ref={ref} style={{ width, minHeight: height }}>{seen ? children : null}</div>;
}
// Stagger gives the text-children a gentle rise-in without fighting the exit
const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.10, delayChildren: 0.12 } },
};
const item = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.50, ease } },
};

/**
 * Text panel — always in the physical RIGHT half on desktop.
 * Uses padding-left: 50% (physical CSS property, RTL-safe) to push
 * content out of Kim's image area.
 *
 * Mobile layout:
 *   items-start    → content anchored to top (not centered)
 *   pt-[156px]     → starts below Kim's strip (pt-3 + h-36 = 12+144=156px)
 *   pb-28          → clears bottom banner (44px) + phase dots (52px) + breathing
 */
/**
 * Phase content column.
 *
 * The mobile offset used to be top padding on a top-aligned box: the padding
 * cleared the artwork, and then the text sat immediately beneath it and left
 * whatever remained of the screen empty — on the shorter phases that was most
 * of the bottom third.
 *
 * It is now a reserved spacer plus a flex-1 region that CENTRES the text in
 * the space the artwork does not use. The artwork keeps exactly the room it
 * had, the text no longer clings to the top of the leftover, and short and
 * long phases both sit evenly on the screen. Desktop is unchanged.
 */
function ContentPanel({ children, mobilePt = 'pt-[24svh]', mobileAlign = 'items-start', mobilePb = 'pb-8' }) {
  // the offsets are authored as Tailwind arbitrary values; read the length back
  const reserve = ((mobilePt.match(/\[([^\]]+)\]/) || [, null])[1] || '').replace(/_/g, ' ')
    || { 'pt-2': '0.5rem', 'pt-3': '0.75rem' }[mobilePt]
    || '0px';

  /* The scene's artwork lags the scroll (Scene); the copy is pulled back
     towards natural speed, so text reads steadily while the art sits deeper. */
  const local = useContext(PhaseMotionContext);
  const reduce = useReducedMotion();
  const copyY = useTransform(local || STILL, [-1, 0, 1], reduce ? [0, 0, 0] : [50, 0, -50]);

  return (
    <motion.div className="flex-1 flex flex-col lg:block lg:h-full" style={{ y: copyY }}>
      {/* Space the artwork occupies above the copy */}
      <div className="shrink-0 lg:hidden" style={{ height: reserve }} aria-hidden="true" />

      {/* safe center: when the copy is taller than the space left (360x640 phones) it
          overflows downward instead of climbing into the artwork above */}
      <div className="flex-1 min-h-0 flex items-center [align-items:safe_center] lg:h-full lg:items-center">
        <div className={`w-full ${mobilePb} px-5 lg:pt-0 lg:pb-0 lg:px-0 lg:pl-[50%] lg:pr-12`}>
          {/* dir="rtl" is re-applied here so text inside is always RTL */}
          <div dir="rtl" className="text-right">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Decorated section label ── */
function SectionLabel({ children }) {
  return (
    <motion.div variants={item} className="flex items-center gap-2 justify-end mb-3">
      <span className="text-sm font-bold tracking-widest uppercase" style={{ color: `${BRAND}bb` }}>
        {children}
      </span>
      <span className="block w-8 h-[2px] rounded-full" style={{ background: BRAND }} />
    </motion.div>
  );
}

/* ── Main heading with brand-colored accent word ── */
function PhaseHeading({ children }) {
  return (
    <motion.h2
      variants={item}
      className="text-3xl md:text-5xl lg:text-6xl font-heading leading-tight mb-2.5 lg:mb-5"
      style={{ color: TEXT }}
      dir="rtl"
    >
      {children}
    </motion.h2>
  );
}

/* ── Inline accent span with gold underline ── */
function Accent({ children }) {
  return (
    <span className="relative" style={{ color: BRAND_INK }}>
      {children}
      <span
        className="absolute inset-x-0 bottom-0 h-[3px] rounded-full opacity-40"
        style={{ background: BRAND }}
      />
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 0 · Hero — animation helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Count-up hook: animates 0 → target on mount with easeOutQuart curve */
function useCountUp(target, { duration = 1.4, delay = 0.5 } = {}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let raf;
    const startAt = performance.now() + delay * 1000;
    const tick = (now) => {
      const elapsed = Math.max(0, now - startAt);
      const t = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
      setCount(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return count;
}

/**
 * Animated underline that sweeps in from the right (RTL reading direction).
 * Works inside stagger containers — its own timeline is independent.
 */
function HighlightWord({ children, delay = 0.8, color = BRAND }) {
  return (
    <span className="relative inline-block" style={{ color }}>
      {children}
      <motion.span
        className="absolute left-0 right-0 h-[3px] rounded-full"
        style={{ background: color, bottom: '-2px', originX: 1 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </span>
  );
}

/**
 * Highlighter-pen sweep: animated background rectangle behind the text,
 * expanding from right to left (RTL). Children rendered in brand color + bold.
 */
function MarkerHighlight({ children, delay = 0.95, color = BRAND }) {
  return (
    <span className="relative inline-block">
      <motion.span
        className="absolute inset-y-0 rounded"
        style={{ background: `${color}28`, left: '-5px', right: '-5px', originX: 1 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <span className="relative font-bold" style={{ color }}>{children}</span>
    </span>
  );
}

/* Star pop-in — stagger variant set (separate from outer stagger so keys don't clash) */
const heroStarContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
};
const heroStarItem = {
  hidden: { opacity: 0, scale: 0, rotate: -40 },
  show: {
    opacity: 1, scale: 1, rotate: 0,
    transition: { type: 'spring', stiffness: 380, damping: 14 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// WhatsApp floating testimonial bubbles (desktop background only)
// ─────────────────────────────────────────────────────────────────────────────
function WaBubble({ name, avatar, messages }) {
  return (
    <div className="w-56 rounded-2xl overflow-hidden shadow-xl" style={{ fontFamily: 'Rubik, sans-serif' }}>
      <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: '#075E54' }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: '#128C7E' }}>{avatar}</div>
        <div>
          <p className="text-white text-[11px] font-semibold leading-none">{name}</p>
          <p className="text-green-200 text-[9px] mt-0.5">מחובר/ת</p>
        </div>
      </div>
      <div className="px-2.5 py-2 space-y-1.5" style={{ background: '#ECE5DD', direction: 'rtl' }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'kim' ? 'justify-start' : 'justify-end'}`}>
            <div className="max-w-[88%] px-2.5 py-1 rounded-xl text-[10px] leading-relaxed shadow-sm"
              style={{ background: m.from === 'kim' ? '#fff' : '#DCF8C6', color: '#333' }}>
              <p>{m.text}</p>
              <p className="text-[8px] text-[var(--text-muted)] text-left mt-0.5">{m.time}{m.from !== 'kim' && ' ✓✓'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Real testimonials extracted from patient WhatsApp screenshots
const waChatsLeft = [
  {
    name: 'לקוחה מרוצה',
    avatar: '★',
    messages: [
      { from: 'user', text: 'בוקר טוב נשקלתי ושקלתי 58.7! רזיתי השבוע 900 גר', time: '11:35' },
      { from: 'user', text: 'וסה״כ בכמעט 3 חודשים, 4.7 קג 🏆🏆🏆', time: '11:35' },
    ],
  },
  {
    name: 'לקוחה מרוצה',
    avatar: '★',
    messages: [
      { from: 'user', text: 'היי התהליך היה מדהים בזכות דניאל האלופה! זו כבר פעם שניה שמבצעת מולה את התהליך', time: '20:54' },
      { from: 'user', text: 'ירדתי כבר באזור ה-15 קילו בחצי שנה! כלים שהם לחיים ולא לדיאטה זמנית ❤️', time: '20:54' },
    ],
  },
];

const waChatsRight = [
  {
    name: 'לקוחה מרוצה',
    avatar: '★',
    messages: [
      { from: 'user', text: 'היום סיימתי תכנית אחרי 4 חודשים ירידה של כמעט 15 וחצי קילו!!!', time: '14:20' },
      { from: 'user', text: 'תודה שגרמת לי להתחיל לאהוב את עצמי ❤️🙏', time: '14:21' },
    ],
  },
  {
    name: 'לקוחה מרוצה',
    avatar: '★',
    messages: [
      { from: 'user', text: 'אוכלת קינדר בואנו כמנת ביניים ועדיין יורדת 😍', time: '19:03' },
      { from: 'user', text: 'התחלנו ב-85.1 והיום אני 61.5 🎉', time: '19:03' },
    ],
  },
];

// Compact mobile testimonials (single bubble strip)
const mobileTestimonials = [
  { text: 'ירדתי 15 קילו בחצי שנה, כלים לחיים, לא לדיאטה זמנית ❤️', time: '20:54' },
  { text: '15 וחצי קילו ב-4 חודשים!!! תודה שגרמת לי לאהוב את עצמי 🙏', time: '14:20' },
  { text: 'אוכלת קינדר בואנו ועדיין יורדת 😍 מ-85 ל-61.5!', time: '19:03' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 0 · Hero
// ─────────────────────────────────────────────────────────────────────────────
function PhaseHero() {
  const isWide = useIsWide();
  const successCount = useCountUp(5000, { duration: 1.3, delay: 0.6 });

  return (
    <motion.div className="relative flex-1 flex flex-col">

      {/* Mobile: logo pinned top-right, above Kim + the WhatsApp bubbles */}
      <motion.div
        className="lg:hidden absolute top-3 right-4 z-30 pointer-events-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ResponsiveImage
          src={kimLogo}
          stem="/src/assets/icons/kim-logo"
          sizes="80px"
          width="640"
          height="640"
          loading="eager"
          alt="KIM"
          className="h-20 w-auto drop-shadow-md"
        />
      </motion.div>

      <ContentPanel mobilePt="pt-[38svh]">
        <motion.div variants={stagger} initial="initial" animate="animate">

          {isWide && <motion.div variants={item} className="hidden lg:inline-block mb-2 lg:mb-4">
            <ResponsiveImage
              src={kimLogo}
              stem="/src/assets/icons/kim-logo"
              sizes="320px"
              width="640"
              height="640"
              loading="eager"
              alt="KIM"
              className="md:h-56 lg:h-80 w-auto drop-shadow-lg"
            />
          </motion.div>}

          {/* Main headline */}
          <motion.h2
            variants={item}
            dir="rtl"
            className="text-3xl sm:text-4xl md:text-5xl font-heading leading-[1.15] mb-3 lg:mb-5"
          >
            <span style={{ color: BRAND_INK }}>
              לנהל את התזונה שלכם
            </span>
            <br></br>
            <span style={{ color: BRAND_INK }}>
              לאכול הכל
            </span>{' '}

            <span className="block" style={{ color: TEXT }}>לרדת במשקל <br></br>ולשמור על התוצאות.</span>
          </motion.h2>

          {/* Credentials card */}
          <motion.div
            variants={item}
            className="bg-white/60 p-3 lg:p-4 rounded-xl border border-[#8B7F4B]/10 backdrop-blur-sm inline-block mb-3 lg:mb-5"
          >
            <div className="flex flex-col gap-2" dir="rtl">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#333]">בוגרת תואר ראשון בתזונה, האוניברסיטה העברית</span>
                <GraduationCap className="w-4 h-4 shrink-0" style={{ color: BRAND }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#333]">סטודנטית לרפואה, אוניברסיטת תל אביב</span>
                <Stethoscope className="w-4 h-4 shrink-0" style={{ color: BRAND }} />
              </div>
            </div>
          </motion.div>

          {/* CTA row */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-start mb-3 lg:mb-5 lg:pr-24">

            {/* Primary CTA — spring lift + glow on hover */}
            <motion.a
              href="https://wa.link/ntdrz1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('whatsapp_consult', 'hero')}
              aria-label="קביעת ייעוץ חינם עם קים בווצאפ"
              className="block sm:inline-block w-full sm:w-auto"
              whileHover={{ y: -4, scale: 1.05, filter: 'drop-shadow(0 8px 24px rgba(139,127,75,0.50))' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              <Button
                className="rounded-full px-8 py-6 text-lg font-bold text-white min-h-[48px]
                           shadow-[0_4px_20px_rgba(139,127,75,0.35)] w-full sm:w-auto"
                style={{ background: BRAND_SURFACE }}
              >
                לקביעת ייעוץ התאמה חינם
              </Button>
            </motion.a>

            {/* Social-proof card — subtle lift on hover */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm border border-[#8B7F4B]/20 rounded-2xl px-4 py-2 shadow-md cursor-default"
              whileHover={{ scale: 1.05, y: -3, boxShadow: '0 12px 28px rgba(139,127,75,0.22)' }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              {/* Stars — pop-in stagger */}
              <motion.div
                className="flex items-center gap-1 mb-0.5"
                dir="rtl"
                variants={heroStarContainer}
                initial="hidden"
                animate="show"
              >
                {[1,2,3,4,5].map(i => (
                  <motion.span key={i} variants={heroStarItem} className="inline-block leading-none">
                    <Star className="w-3 h-3 fill-[#8B7F4B] text-[var(--brand-ink)]" />
                  </motion.span>
                ))}
              </motion.div>
              <div className="flex items-baseline gap-1.5" dir="rtl">
                <span className="text-xs font-bold text-gray-700">סיפורי הצלחה</span>
                {/* Count-up number */}
                <span className="text-2xl font-black" style={{ color: BRAND_INK }}>
                  {successCount.toLocaleString()}+
                </span>
              </div>
            </motion.div>

          </motion.div>

          {/* Stats — desktop only; hero content is tight on mobile.
              lg:pr-24 keeps the first (rightmost) stat clear of the fixed
              WhatsApp floating button pinned to the bottom-right corner */}
          <motion.div variants={item} className="hidden lg:flex gap-6 border-t border-[#8B7F4B]/20 pt-4 lg:pr-24" dir="rtl">
            <div className="flex items-center gap-2">
              <div className="text-xs text-[var(--text-secondary)] font-medium leading-tight">שנות<br/>ניסיון</div>
              <div className="text-2xl font-black" style={{ color: BRAND_INK }}>12+</div>
            </div>
          </motion.div>


        </motion.div>
      </ContentPanel>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 1 · Busy Life
// ─────────────────────────────────────────────────────────────────────────────
// All items kept at left ≤ 22 % — safely to Kim's left (her body starts ~28 %).
// Two loose columns (left edge ~2 % and inner ~17 %) alternating top→bottom.
const lifestyleItems = [
  { src: imgNoTime,         label: 'לו״ז עמוס', style: { left: '28%',  top: '5%'  }, delay: 0    },
  { src: imgWork,           label: 'שעות עבודה ארוכות',   style: { left: '45%', top: '10%'  }, delay: 0.1  },
  { src: imgMessages,       label: 'גירויים אינסופיים במהלך היום',  style: { left: '15%',  top: '25%' }, delay: 0.22 },
  { src: imgKids,           label: 'ילדים והרצון שלך להיות אמא נוכחת',   style: { left: '46%', top: '35%' }, delay: 0.15 },
  { src: imgTierd,          label: 'עייפות מצטברת',  style: { left: '18%',  top: '48%' }, delay: 0.18 },
  { src: imgStressCalendar, label: 'ריבוי משימות',     style: { left: '50%', top: '55%' }, delay: 0.12 },
];

// Mobile positions — 3 left / 3 right, all within the top 42vh (Kim's strip height)
// In svh, not %: on a phone the section is as tall as its content, so a
// percentage would drift with the copy length.
const mobileLifestylePositions = [
  { left: '4%',  top: '3svh'  },
  { right: '4%', top: '7svh'  },
  { left: '2%',  top: '20svh' },
  { right: '3%', top: '22svh' },
  { left: '4%',  top: '37svh' },
  { right: '4%', top: '36svh' },
];

/* Weightless drift for the busy-life objects. Two motions stacked: a slow
   idle bob, each object on its own period and phase so they never move in
   unison, and a scroll parallax at a different depth per object, so as the
   section moves they separate like things suspended at different distances. */
const FLOAT_DEPTHS = [46, 22, 58, 30, 40, 18];
function Floating({ index, amp = 10, children }) {
  const local = useContext(PhaseMotionContext) || STILL;
  const reduce = useReducedMotion();
  const depth = FLOAT_DEPTHS[index % FLOAT_DEPTHS.length];
  const drift = useTransform(local, [-1, 0, 1], reduce ? [0, 0, 0] : [depth, 0, -depth]);
  return (
    <motion.div className="flex flex-col items-center" style={{ y: drift }}>
      <motion.div
        className="flex flex-col items-center gap-1.5"
        animate={reduce ? undefined : { y: [0, -amp, 0], rotate: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 4.4 + (index % 3) * 0.9, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function PhaseBusyLife() {
  return (
    <motion.div className="relative flex-1 flex flex-col">

      {/* Desktop: lifestyle items floating around Kim */}
      {lifestyleItems.map(({ src, label, style, delay }, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex flex-col items-center gap-1.5 z-10"
          style={style}
          initial={{ opacity: 0, scale: 0.55, y: 24 }}
          viewport={VIEW_ONCE} whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25 + delay, duration: 0.5, ease }}
        >
          <Floating index={i} amp={12}>
            <img
              src={src}
              alt={label}
              width="128"
              height="128"
              loading="lazy"
              decoding="async"
              className="w-32 h-32 object-contain"
              style={{ filter: 'drop-shadow(0 10px 14px rgba(60,50,20,0.16))' }}
            />
            <span
              className="text-sm font-semibold bg-white/75 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm"
              style={{ color: TEXT }}
            >
              {label}
            </span>
          </Floating>
        </motion.div>
      ))}

      {/* Mobile: lifestyle items scattered around Kim in the top 42vh */}
      {lifestyleItems.map(({ src, label, delay }, i) => (
        <motion.div
          key={`mob-${i}`}
          className="absolute flex flex-col items-center gap-0.5 lg:hidden"
          style={{ ...mobileLifestylePositions[i], zIndex: 5 }}
          initial={{ opacity: 0, scale: 0.6, y: 14 }}
          viewport={VIEW_ONCE} whileInView={{ opacity: 0.9, scale: 1, y: 0 }}
          transition={{ delay: 0.2 + delay, duration: 0.45, ease }}
        >
          <Floating index={i} amp={7}>
            <img
              src={src}
              alt={label}
              width="80"
              height="80"
              loading="lazy"
              decoding="async"
              className="object-contain"
              // 80px on a normal phone, smaller on short screens so the icons clear the heading
              style={{ width: 'min(80px, 10svh)', height: 'min(80px, 10svh)', filter: 'drop-shadow(0 6px 8px rgba(60,50,20,0.15))' }}
            />
            <span className="text-xs font-semibold bg-white/80 px-2 py-1 rounded-full text-gray-700 leading-none">
              {label}
            </span>
          </Floating>
        </motion.div>
      ))}

      <ContentPanel mobilePt="pt-[53svh]">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={VIEW_ONCE}>

          {/* Mobile heading */}
          <motion.h2
            variants={item}
            className="text-3xl font-heading leading-tight mb-3 lg:hidden"
            style={{ color: TEXT }}
            dir="rtl"
          >
            החיים שלך עמוסים<br/>
            <span style={{ color: BRAND_INK }}>השיטה שלנו מותאמת לזה.</span>
          </motion.h2>
          <div className="hidden lg:block">
            <PhaseHeading>
              החיים שלך עמוסים<br/>
              <Accent>השיטה שלנו מותאמת לזה.</Accent>
            </PhaseHeading>
          </div>

          {/* Desktop paragraph — full */}
          <motion.p variants={item} className="hidden lg:block text-xl text-gray-600 leading-relaxed mb-6">
            עבודה, ילדים, אירועים, חופשות ורגעים שבהם האכילה יוצאת מהאיזון.<br/>
            בדיוק בשביל זה בניתי שיטה שלא דורשת ממך לעצור את החיים<br></br> אלא ללמוד איך להתנהל בתוכם.
          </motion.p>
          {/* Mobile paragraph — condensed to one sentence */}
          <motion.p variants={item} className="lg:hidden text-lg text-gray-600 leading-relaxed mb-2">
            בדיוק בשביל זה בנינו שיטה שלא דורשת ממך לעצור את החיים, אלא ללמוד להתנהל בתוכם.
          </motion.p>

          <motion.div variants={item} className="flex flex-col gap-1.5 lg:gap-3">
            {[
              'תוכנית אישית שמתאימה לחיים שלך, לא להפך',
              'גמישות יומיומית וגיוון תזונתי',
              'ליווי צמוד ברגעים שבהם הכי קל לוותר',
              'כלים לאכילה מאוזנת גם במסעדות, חופשות וסופי שבוע',
              'שיטה שמלמדת אותך לשמור על התוצאות לאורך זמן',
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 lg:gap-3" dir="rtl">
                <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 shrink-0" style={{ color: BRAND }} />
                <span className="text-base lg:text-lg font-semibold text-[#333]">{t}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </ContentPanel>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scroll-driven video player  (phases 2-3, 3 videos scrubbed by scroll)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The plate burst, scrubbed by scroll (see useScrubVideo for the mechanics).
 *
 * The frame is white and the canvas multiplies onto the cream section, so the
 * backdrop disappears and only the food remains. The wrapper's radial mask
 * feathers the crop edge, so a bean or a crumb that flies out of frame fades
 * instead of being sliced off by a hard line.
 */
function ScrollVideoPlayer({ plateProgress }) {
  /* Picked once for the size the plate will actually paint at: half the
     viewport on desktop, the full width (capped by the strip height) on a
     phone. A dpr-2 phone needs ~780px, which the 820 encode covers at well
     under half the bytes of the desktop file. */
  const [file] = useState(() => {
    if (typeof window === 'undefined') return plateVideo820;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const wide = window.innerWidth >= 1024;
    const css = wide
      ? Math.min(window.innerWidth * 0.52, window.innerHeight)
      : Math.min(window.innerWidth, window.innerHeight * 0.48);
    return css * dpr > 900 ? plateVideo1440 : plateVideo820;
  });

  /* Attached one idle tick after mount: first paint stays light for the hero
     image, and the buffer is long ready before anyone scrolls two phases. */
  const [src, setSrc] = useState(null);
  useEffect(() => {
    const start = () => setSrc(file);
    const id = 'requestIdleCallback' in window
      ? requestIdleCallback(start, { timeout: 1500 })
      : setTimeout(start, 600);
    return () => ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id));
  }, [file]);

  const { videoRef, canvasRef } = useScrubVideo({ src, progress: plateProgress, fit: 'contain', tau: 0.08 });

  return (
    <motion.div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: BG,
      isolation: 'isolate',
      WebkitMaskImage: 'radial-gradient(closest-side, #000 80%, transparent 100%)',
      maskImage: 'radial-gradient(closest-side, #000 80%, transparent 100%)',
    }}>
      {/* Decode source only, never rendered directly */}
      <video
        ref={videoRef}
        src={src || undefined}
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', pointerEvents: 'none', overflow: 'hidden' }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: 'block', width: '100%', height: '100%', mixBlendMode: 'multiply' }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2 · The Plate  (left visual = video player from root; only text here)
// ─────────────────────────────────────────────────────────────────────────────
function PhasePlate({ reserve = 'pt-[calc(56px_+_44svh)]' }) {
  return (
    <motion.div className="relative flex-1 flex flex-col">
      <ContentPanel mobilePt={reserve}>
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={VIEW_ONCE}>
          {/* One responsive heading: inline on mobile, stacked on desktop */}
          <PhaseHeading>הכל<br className="hidden lg:block" />{' '}<Accent>מתחיל בצלחת.</Accent></PhaseHeading>
          <motion.p
            variants={item}
            style={{
              lineHeight: 1.8,
              fontSize: 'clamp(1rem, 4vw, 1.4rem)',
              color: '#555',
              textWrap: 'pretty',
              maxWidth: 520,
            }}
          >
            במקום עוד תפריט נוקשה שקשה להחזיק לאורך זמן <br></br>
             נלמד אותך איך לבנות צלחת שמתאימה לחיים האמיתיים שלך.{' '}
            בבית, בעבודה,{' '}
            <strong style={{ color: BRAND_INK, fontWeight: 800 }}>במסעדה</strong>,{' '}
            <strong style={{ color: BRAND_INK, fontWeight: 800 }}>בחופשה</strong>,{' '}
            <strong style={{ color: BRAND_INK, fontWeight: 800 }}>בסוף שבוע</strong>.{' '}<br></br>
            לא כדי שתהיי תלויה בתפריט אלא כדי שתדעי להתנהל נכון{' '} <br></br>
            <strong style={{ color: BRAND_INK }}>בכל סיטואציה</strong>.{' '}
            כי כשאת מבינה איך הדברים עובדים <br></br>
            הרבה יותר קל{' '}
            <strong style={{ color: BRAND_INK, fontWeight: 800 }}>לרדת במשקל, להתמיד ולשמור על התוצאות</strong>.
          </motion.p>
        </motion.div>
      </ContentPanel>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 3 · Exploded Plate  (left visual = scroll-driven video from root)
// ─────────────────────────────────────────────────────────────────────────────

const foodComponents = [
  { label: 'חלבון',     sublabel: 'בשר, דגים, קטניות', color: '#C49A7A', Icon: Flame    },
  { label: 'פחמימות',   sublabel: 'אורז, לחם, פסטה',    color: '#D4A843', Icon: Apple    },
  { label: 'ירקות',     sublabel: 'מגוון וצבעוני',        color: '#7BAE7F', Icon: Leaf     },
  { label: 'שומן בריא', sublabel: 'אבוקדו, שמן זית',     color: '#8B7F4B', Icon: Droplets },
  { label: 'תיבול',     sublabel: 'עשבי תיבול, לימון',   color: '#A89070', Icon: Star     },
];


function PhaseExploded() {
  return (
    // Left visual = video player (rendered from root, covers phases 2-3 continuously)
    <motion.div className="relative flex-1 flex flex-col">
      <ContentPanel>
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={VIEW_ONCE}>
          {/* Section label — desktop only (saves ~32px on mobile) */}
          <div className="hidden lg:block"><SectionLabel>השיטה שלנו</SectionLabel></div>
          <PhaseHeading>מה יש<br/><Accent>בצלחת מאוזנת?</Accent></PhaseHeading>
          {/* Desktop paragraph */}
          <motion.p variants={item} className="hidden lg:block text-lg text-gray-600 leading-relaxed mb-4">
            כל רכיב יש לו תפקיד. אנחנו לא מורידות, אנחנו מאזנות.
          </motion.p>
          {/* Mobile paragraph — compact */}
          <motion.p variants={item} className="lg:hidden text-base text-gray-600 leading-relaxed mb-3">
            כל רכיב יש לו תפקיד. אנחנו לא מורידות, אנחנו מאזנות.
          </motion.p>
          <motion.div variants={item} className="flex flex-col gap-2 lg:gap-3">
            {foodComponents.map(({ label, sublabel, color, Icon }) => (
              <div key={label} className="flex items-center gap-3" dir="rtl">
                <div className="rounded-full p-1.5 lg:p-2.5 shrink-0" style={{ background: `${color}22`, border: `1.5px solid ${color}55` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <span className="text-base font-bold text-[#333]">{label}</span>
                  <span className="text-xs lg:text-sm text-[var(--text-muted)] block leading-tight">{sublabel}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </ContentPanel>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 4 · 80:20 Ring
// ─────────────────────────────────────────────────────────────────────────────
const CIRC = 2 * Math.PI * 72;

// @ts-ignore
function FoodSticker({ src, style, delay = 0, rotate = 0, size = 72, floatAmp = 12, accent = false }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ ...style, zIndex: 15 }}
      initial={{ scale: 0, opacity: 0, rotate: rotate - 15 }}
      viewport={VIEW_ONCE} whileInView={{ scale: 1, opacity: 1, rotate }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, delay }}
    >
      <motion.img
        src={src}
        alt=""
        width={size}
        height={size}
        animate={{ y: [0, -floatAmp, 0] }}
        transition={{ repeat: Infinity, duration: 2.8 + delay * 0.4, ease: 'easeInOut', delay: delay * 0.3 }}
        style={{
          width: size, height: size,
          objectFit: 'cover',
          borderRadius: '22%',

        }}
      />
    </motion.div>
  );
}
// Ring rendered at 480 px — 1.6× original, more dominant in left column
const RING_SIZE = 480;

/* The 80:20 ring's arcs. They draw when `seen` flips, and `seen` comes from
   an HTML wrapper (useInView), not from the <circle> elements themselves:
   iOS Safari does not reliably report SVG children to IntersectionObserver,
   so on iPhones a whileInView on the circles never fired and the ring stayed
   an empty grey track. */
function RingArcs({ seen, compact = false }) {
  return (
    <>
      <circle cx="100" cy="100" r="72" fill="none" stroke="#ddd6bc" strokeWidth="14" />
      {/* 80% arc */}
      <motion.circle
        cx="100" cy="100" r="72" fill="none" stroke={BRAND}
        strokeWidth="14" strokeLinecap="round"
        strokeDasharray={CIRC}
        initial={{ strokeDashoffset: CIRC }}
        animate={{ strokeDashoffset: seen ? CIRC * 0.2 : CIRC }}
        transition={{ duration: compact ? 1.2 : 1.4, delay: compact ? 0.2 : 0.3, ease }}
        transform="rotate(-90 100 100)"
      />
      {/* 20% arc */}
      <motion.circle
        cx="100" cy="100" r="72" fill="none" stroke="#C49A7A"
        strokeWidth="14" strokeLinecap="round"
        strokeDasharray={`${CIRC * 0.2} ${CIRC * 0.8}`}
        strokeDashoffset={`${-CIRC * 0.8}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: seen ? 1 : 0 }}
        transition={{ duration: 0.5, delay: compact ? 1.0 : 1.1 }}
        transform="rotate(-90 100 100)"
      />
      {compact ? (
        <>
          <text x="100" y="88" textAnchor="middle" fill={BRAND} fontSize="36" fontWeight="900" fontFamily="Heebo, sans-serif">80:20</text>
          <text x="100" y="113" textAnchor="middle" fill="#6e6e6e" fontSize="12" fontFamily="Heebo,sans-serif">הגישה שלנו</text>
        </>
      ) : (
        <>
          <text x="100" y="92" textAnchor="middle" fill={BRAND} fontSize="28" fontWeight="900" fontFamily="Heebo, sans-serif">80:20</text>
          <text x="100" y="116" textAnchor="middle" fill="#6e6e6e" fontSize="11" fontFamily="Heebo">הגישה שלנו</text>
        </>
      )}
    </>
  );
}

function PhaseRing() {
  const deskRef = useRef(null);
  const mobRef = useRef(null);
  const deskSeen = useInView(deskRef, { once: true, amount: 0.3 });
  const mobSeen = useInView(mobRef, { once: true, amount: 0.3 });
  return (
    <motion.div className="relative flex-1 flex flex-col">

      {/* ── Desktop: ring — left visual column, scaled 1.6× for prominence ── */}
      <motion.div
        ref={deskRef}
        className="absolute hidden lg:flex flex-col items-center pointer-events-none z-[13]"
        style={{
          left: '6%',
          top: '50%',
          translateY: '-50%',
        }}
        initial={{ opacity: 0, scale: 0.72 }}
        viewport={VIEW_ONCE} whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.1, 0.64, 1] }}
      >
        {/* SVG scales to RING_SIZE; viewBox stays 200×200 → all radii / text scale */}
        <svg width={RING_SIZE} height={RING_SIZE} viewBox="0 0 200 200">
          <RingArcs seen={deskSeen} />
        </svg>

        {/* Legend below the ring — no absolute overflow */}
        <div className="flex flex-col gap-2 mt-1">
          <motion.div className="flex items-center gap-2 justify-center"
            initial={{ opacity: 0, y: 6 }} viewport={VIEW_ONCE} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.35 }}
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: BRAND }} />
            <span className="text-2xl font-semibold" style={{ color: TEXT }}>80% עקביות</span>
          </motion.div>
          <motion.div className="flex items-center gap-2 justify-center"
            initial={{ opacity: 0, y: 6 }} viewport={VIEW_ONCE} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.35 }}
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: '#C49A7A' }} />
            <span className="text-2xl font-semibold" style={{ color: TEXT }}>20% גמישות</span>
          </motion.div>
        </div>

        {/* ── Food stickers — positions ×1.6, sizes ×1.2 of original 300px ring ── */}
        {/* 20% treats */}
        <FoodSticker src={nt3} style={{ left: -70, top:  50 }} delay={0.40} rotate={ -5} size={150} accent={false} floatAmp={9} />
        <FoodSticker src={nt2} style={{ left:  10, top: -35 }} delay={0.50} rotate={ -15} size={150} accent={false} floatAmp={7} />
        <FoodSticker src={nt1} style={{ left:  100, top:-70 }} delay={0.60} rotate={  50} size={150} accent={false} floatAmp={8} />
        {/* 80% healthy */}
        <FoodSticker src={nt8} style={{ left: 272, top: -70 }} delay={0.45} rotate={  5} size={140} accent={true} floatAmp={10} />
        <FoodSticker src={nt9}  style={{ left: 410, top:  30 }} delay={0.55} rotate={ -6} size={180} accent={true} floatAmp={9}  />
        <FoodSticker src={nt4}  style={{ left: 450, top: 192 }} delay={0.65} rotate={  8} size={170} accent={true} floatAmp={7}  />
        <FoodSticker src={nt7}  style={{ left: 307, top: 380 }} delay={0.70} rotate={ -5} size={170} accent={true} floatAmp={10} />
        <FoodSticker src={nt10}  style={{ left:   0, top: 360 }} delay={0.75} rotate={  7} size={180} accent={true} floatAmp={6}  />
        <FoodSticker src={nt5}  style={{ left: -80, top: 220 }} delay={0.80} rotate={ -4} size={170} accent={true} floatAmp={7}  />
      </motion.div>

      <ContentPanel mobilePt="pt-2" mobileAlign="items-center">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={VIEW_ONCE}>

          {/* Mobile-only: full-size ring with 8 stickers orbiting the ring edge */}
          <motion.div variants={item} className="lg:hidden flex flex-col items-center mb-2">
            {/*
              Container: 340×330px. SVG 240px centered → SVG top-left at (50,45), center at (170,165).
              Ring rendered radius = 72/200×240 = 86.4px from center.
              Sticker centers (size/2 = 40px offset) placed ON the ring circumference at 8 positions.
            */}
            <div ref={mobRef} style={{
              position: 'relative',
              width: 'min(92vw, 340px)',
              height: 'min(90vw, 330px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg
                style={{ width: 'min(68vw, 240px)', height: 'min(68vw, 240px)', flexShrink: 0, position: 'relative', zIndex: 1 }}
                viewBox="0 0 200 200"
              >
                <RingArcs seen={mobSeen} compact />
              </svg>

              {/* 8 stickers — centers placed on ring circumference (top → clockwise) */}
              {/* Top 270°: pizza */}
              <FoodSticker src={nt1}  style={{ left: '30%', top: '-2%'    }} delay={0.45} rotate={80}  size={80} floatAmp={7} />
              {/* Top-right 315°: running */}
              <FoodSticker src={nt8}  style={{ left: '60%', top: '5%'    }} delay={0.55} rotate={5}   size={76} floatAmp={6} />
              {/* Right 0°: banana */}
              <FoodSticker src={nt9}  style={{ right: '2%', top: '28%'   }} delay={0.65} rotate={-8}  size={88} floatAmp={7} />
              {/* Bottom-right 45°: water */}
              <FoodSticker src={nt4}  style={{ right: '8%', bottom: '19%'}} delay={0.75} rotate={10}  size={80} floatAmp={5} />
              {/* Bottom 90°: veggie plate */}
              <FoodSticker src={nt7}  style={{ left: '40%', bottom: '-3%' }} delay={0.80} rotate={-5}  size={82} floatAmp={6} />
              {/* Bottom-left 135°: bread */}
              <FoodSticker src={nt5}  style={{ left: '11%', bottom: '8%' }} delay={0.70} rotate={7}   size={88} floatAmp={5} />
              {/* Left 180°: croissant */}
              <FoodSticker src={nt3}  style={{ left: '2%', top: '18%'    }} delay={0.40} rotate={-10} size={84} floatAmp={6} />
              {/* Top-left 225°: wine */}
              <FoodSticker src={nt2}  style={{ left: '15%', top: '3%'    }} delay={0.50} rotate={-15}   size={90} floatAmp={5} />
            </div>

            {/* Legend, as on desktop: what the two arc colours mean. */}
            <div className="flex items-center justify-center gap-6 mt-3" dir="rtl">
              <motion.div className="flex items-center gap-2"
                initial={{ opacity: 0, y: 6 }} animate={mobSeen ? { opacity: 1, y: 0 } : undefined}
                transition={{ delay: 0.9, duration: 0.35 }}
              >
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: BRAND }} />
                <span className="text-lg font-semibold" style={{ color: TEXT }}>80% עקביות</span>
              </motion.div>
              <motion.div className="flex items-center gap-2"
                initial={{ opacity: 0, y: 6 }} animate={mobSeen ? { opacity: 1, y: 0 } : undefined}
                transition={{ delay: 1.15, duration: 0.35 }}
              >
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: '#C49A7A' }} />
                <span className="text-lg font-semibold" style={{ color: TEXT }}>20% גמישות</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.h2
            variants={item}
            className="text-2xl font-heading leading-tight mb-1 lg:hidden"
            style={{ color: TEXT }}
            dir="rtl"
          >
            גישת <span style={{ color: BRAND_INK }}>80:20</span>
          </motion.h2>
          <div className="hidden lg:block">
            <PhaseHeading>גישת<br/><Accent>80:20</Accent></PhaseHeading>
          </div>

          {/* Sub-headline */}
          <motion.p
            variants={item}
            style={{ fontSize: 'clamp(1.05rem, 3vw, 2rem)', color: '#777', lineHeight: 1.45 }}
            className="mb-2 lg:mb-4"
          >
           השיטה שמאפשרת לרדת במשקל בלי להפוך את החיים לדיאטה
          </motion.p>
          

          <motion.div variants={item} className="flex flex-col gap-2">
            <div className="bg-white/65 backdrop-blur-sm rounded-xl p-3.5 lg:rounded-2xl lg:p-4 border border-white/60" dir="rtl">
              <p className="font-bold mb-1" style={{ color: '#333', fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>ה-80% שלך</p>
              <p style={{ color: '#666', lineHeight: 1.55, fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
                אוכל שמזין את הגוף שלך: ירקות, חלבונים,<br></br>פחמימות טובות, שומנים בריאים ומים.<br></br>
                 זה הבסיס שמאפשר לך ליהנות מהשאר.
              </p>
            </div>
            <div className="rounded-xl p-3.5 lg:rounded-2xl lg:p-4" style={{ background: '#C49A7A18', border: '1px solid #C49A7A40' }} dir="rtl">
              <p className="font-bold mb-1" style={{ color: '#A0745A', fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>ה-20% שלך</p>
              <p style={{ color: '#666', lineHeight: 1.55, fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
                אוכל שמזין את הנשמה שלך: הפיצה של שישי, הגלידה בחופשה. <br></br>
                 זה חלק מהשיטה, ובגלל זה היא עובדת לאורך זמן.
              </p>
            </div>
          </motion.div>

          {/* Social proof — desktop only (saves vertical space on mobile) */}
          <motion.p
            variants={item}
            className="hidden lg:block text-center mt-4"
            style={{ fontSize: 'clamp(0.78rem, 2.5vw, 1rem)', opacity: 0.65, color: '#555' }}
          >
            אלפי נשים כבר שינו את הדרך שהן מסתכלות על הצלחת שלהן.
          </motion.p>

        </motion.div>
      </ContentPanel>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 5 · App Interface
// Realistic Liveat food-photo diary mock (based on actual app-2 / app-5 screens)
// The core feature: patient photographs every meal → Kim reviews & responds daily
// ─────────────────────────────────────────────────────────────────────────────
const LIVEAT_GREEN = '#2D9F6A';
const LIVEAT_ICON  = img_4a45529a3_app_icon;

// Photo diary cells — one dedicated meal photo per logged entry.
// objectPosition defaults to 'center' for all; tweak per photo if needed.
const diaryGrid = [
  {
    time: '08:01',
    label: 'בוקר',
    desc: 'דייסת קוואקר + יוגורט פרו חלבון + תותים',
    imgSrc: meal1,
    imgPos: 'center',
    logged: true,
  },
  {
    time: '13:39',
    label: 'צהריים',
    desc: '3 יחידות שניצל + טורטיה + ירקרות',
    imgSrc: meal3,
    imgPos: 'center',
    logged: true,
  },
  {
    time: '17:00',
    label: 'ביניים',
    desc: 'קפה',           // not yet photographed — shows + button
    imgSrc: null,
    imgPos: null,
    logged: false,
  },
   {
    time: '09:35',
    label: 'ערב',
    desc: 'לחמנייה + גבינה לבנה + חביתה + ירקות',
    imgSrc: meal2,
    imgPos: 'center',
    logged: true,
  }
];

// Weight-goal progress (not calories — reflects the actual KPI)
const weightLost = 3.5;                                          // kg lost so far
const weightGoal = 6.0;                                          // total kg goal
const weightPct  = Math.round((weightLost / weightGoal) * 100); // 58 %

/* ── Water bottle SVG — matches Liveat app illustration style ── */
function WaterBottleSVG({ filled = true, size = 40 }) {
  const w = Math.round(size * 0.58);
  return (
    <svg width={w} height={size} viewBox="0 0 20 36" fill="none">
      {/* Cap */}
      <rect x="6" y="0" width="8" height="4.5" rx="1.5" fill={filled ? '#94A3B8' : '#D1D5DB'} />
      {/* Neck */}
      <rect x="7.5" y="4" width="5" height="4" rx="1" fill={filled ? '#BFDBFE' : '#F3F4F6'} />
      {/* Body outline + fill */}
      <path d="M4 8 Q2 9.5 2 11.5 L2 32.5 Q2 34 3.5 34 L16.5 34 Q18 34 18 32.5 L18 11.5 Q18 9.5 16 8 Z"
        fill={filled ? '#93C5FD' : '#F1F5F9'}
        stroke={filled ? '#60A5FA' : '#CBD5E1'} strokeWidth="0.75"
      />
      {/* Water body (lighter inner region) */}
      {filled && <rect x="3" y="14" width="14" height="19" rx="2" fill="#BFDBFE" />}
      {/* Label strip */}
      <rect x="4" y="15.5" width="12" height="9" rx="2"
        fill="white" opacity={filled ? 0.45 : 0.6} />
      {/* Left-side highlight */}
      {filled && <rect x="4" y="11" width="3" height="15" rx="1.5" fill="white" opacity="0.28" />}
    </svg>
  );
}

/* ── Realistic iPhone mockup showing actual Liveat diary screenshots ─────── */
function AppPhoneMockup({ compact = false }) {
  const W = compact ? 200 : 258;
  const H = compact ? 390 : 510;
  const R = compact ? 36 : 44;

  // Keyframe animation: screen 1 → scroll → screen 2 → share badge → kim reply
  // All driven by Framer Motion keyframe arrays with `times`
  const screenDuration = 5.5;
  const crossfadeStart = 0.50; // fraction at which crossfade begins

  return (
    <div style={{ position: 'relative', width: W }}>

      {/* ── Phone shell ── */}
      <div style={{
        width: W, height: H,
        borderRadius: R,
        background: 'linear-gradient(160deg, #2e2e2e 0%, #181818 100%)',
        padding: `${compact ? 10 : 13}px ${compact ? 6 : 8}px`,
        /* Tight and light: the old 100px-blur shadow pooled into a dark
           rectangle under the phone. This just lifts it off the page. */
        boxShadow: [
          '0 14px 28px -10px rgba(60,50,20,0.30)',
          '0 0 0 1.5px rgba(255,255,255,0.09)',
          'inset 0 1px 0 rgba(255,255,255,0.09)',
        ].join(','),
        position: 'relative',
        overflow: 'visible',
        flexShrink: 0,
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 13, left: '50%',
          transform: 'translateX(-50%)',
          width: 86, height: 24,
          background: '#090909',
          borderRadius: 14,
          zIndex: 30,
        }} />

        {/* Power button */}
        <div style={{
          position: 'absolute', top: 108, right: -3,
          width: 3, height: 52,
          background: '#353535', borderRadius: '0 3px 3px 0',
        }} />
        {/* Volume up */}
        <div style={{
          position: 'absolute', top: 86, left: -3,
          width: 3, height: 36,
          background: '#353535', borderRadius: '3px 0 0 3px',
        }} />
        {/* Volume down */}
        <div style={{
          position: 'absolute', top: 130, left: -3,
          width: 3, height: 36,
          background: '#353535', borderRadius: '3px 0 0 3px',
        }} />

        {/* ── Screen ── */}
        <div style={{
          width: '100%', height: '100%',
          borderRadius: R - 10,
          overflow: 'hidden',
          background: '#f8f8f8',
          position: 'relative',
        }}>
          {/* Screen 1 — fades out after crossfadeStart */}
          <motion.img
            src={eatDiary1}
            alt="יומן אכילה"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top',
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0, 0],
              y:       [0, 0, -12, -20, -20],
            }}
            transition={{
              duration: screenDuration,
              times:    [0, 0.10, crossfadeStart - 0.05, crossfadeStart + 0.15, 1],
              ease:     'easeInOut',
              delay:    0.3,
            }}
          />

          {/* Screen 2 — fades in at crossfadeStart */}
          <motion.img
            src={eatDiary2}
            alt="יומן אכילה, מקרואים"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top',
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 0, 1, 1],
            }}
            transition={{
              duration: screenDuration,
              times:    [0, crossfadeStart - 0.05, crossfadeStart, crossfadeStart + 0.18, 1],
              ease:     'easeInOut',
              delay:    0.3,
            }}
          />

          {/* Top status-bar mask — prevents the real app status bar from clashing */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 40,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, transparent 100%)',
            zIndex: 10, pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* ── Share success badge (top-right) ── */}
      <motion.div
        dir="rtl"
        style={{
          position: 'absolute',
          top: compact ? -14 : -16,
          right: compact ? -14 : -22,
          background: 'white',
          borderRadius: 20,
          padding: '9px 14px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.05)',
          display: 'flex', alignItems: 'center', gap: 9,
          whiteSpace: 'nowrap',
          zIndex: 40,
        }}
        initial={{ opacity: 0, scale: 0.75, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 3.8, type: 'spring', stiffness: 340, damping: 24 }}
      >
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: LIVEAT_GREEN,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 13, fontWeight: 800, flexShrink: 0,
        }}>✓</div>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#111', lineHeight: 1.3 }}>יומן שותף עם הדיאטנית</p>
          <p style={{ margin: 0, fontSize: 10, color: '#999', lineHeight: 1.3 }}>היא תגיב בקרוב 💬</p>
        </div>
      </motion.div>

      {/* ── Kim response bubble (bottom-left) ── */}
      <motion.div
        dir="rtl"
        style={{
          position: 'absolute',
          bottom: compact ? 18 : 44,
          left: compact ? -14 : -28,
          background: BRAND_SURFACE,
          borderRadius: 18,
          padding: '9px 13px',
          boxShadow: '0 10px 28px rgba(139,127,75,0.32)',
          display: 'flex', alignItems: 'center', gap: 9,
          maxWidth: 196,
          zIndex: 40,
        }}
        initial={{ opacity: 0, x: -14, scale: 0.85 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 5.2, type: 'spring', stiffness: 280, damping: 22 }}
      >
        <img
          src={kimIcon}
          style={{
            width: 30, height: 30,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            border: '1.5px solid rgba(255,255,255,0.30)',
          }}
          alt="Kim"
            width="94"
            height="95"
          />
        <div>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.75)', lineHeight: 1.2 }}>דיאטנית</p>
          <p style={{ margin: 0, fontSize: 10.5, color: 'white', lineHeight: 1.4 }}>ראיתי את היומן שלך, כל הכבוד! 🌟</p>
        </div>
      </motion.div>
    </div>
  );
}

function PhaseApp() {
  return (
    <motion.div className="relative flex-1 flex flex-col">

      {/* Desktop: phone mockup floats left */}
      <motion.div
        className="absolute hidden lg:flex items-center justify-center pointer-events-none z-10"
        style={{ left: '15%', top: '30%', transform: 'translateY(-50%)' , height: '60vh', width: '25vw' }}
        initial={{ opacity: 0, y: 40, scale: 1.86 }}
        viewport={VIEW_ONCE} whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.34, 1.2, 0.64, 1] }}
      >
        <MountInView width={258} height={510}><AppPhoneMockup /></MountInView>
      </motion.div>

      <ContentPanel mobilePt="pt-3" mobilePb="pb-4">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={VIEW_ONCE}>

          {/* Mobile: compact phone mockup — scaled 0.62, wrapper clips leftover
              layout height so the phone never overlaps the heading below */}
          <motion.div variants={item} className="lg:hidden mb-2 flex justify-center"
            style={{ height: 'min(215px, 26svh)', overflow: 'hidden', paddingTop: '8px' }}>
            <div style={{ transform: 'scale(0.52)', transformOrigin: 'top center', flexShrink: 0 }}>
              <MountInView width={200} height={390}><AppPhoneMockup compact /></MountInView>
            </div>
          </motion.div>

          <PhaseHeading>יומן אכילה<br/><Accent>שיתוף הדיאטנית<br></br> המלווה באפליקציה שלנו</Accent></PhaseHeading>

          <motion.p variants={item} className="phase-intro text-gray-600 leading-snug lg:leading-relaxed mb-2.5 lg:mb-5" dir="rtl">
            כבר בפגישה הראשונה נבנה עבורך תפריט אישי, גמיש, מפורט עם הנחיות ושפת תזונה ברורה. <br className="hidden lg:block"></br>
            באפליקציה שלנו תוכלי לצלם את הארוחות ולשתף ישירות עם התזונאית.
          </motion.p>

          <motion.div variants={item} className="flex flex-col gap-2.5 lg:gap-2.5">
            {[
              'תפריט אישי מותאם כולל הנחיות מדויקות',
              'צילום יומני אכילה באפליקציה ושיתוף ישיר עם הדיאטנית',
              'פידבק כתוב מהדיאטנית בכל יום בווצאפ',
              'מענה לשאלות ופתרון קשיים שעולים לאורך התהליך',
              'הרצאות תזונה אונליין לקהילה של קים',
              'קיטים דיגיטליים עם מגוון מתכונים קלים, טעימים ופרקטיים\nלגיוון התזונה ביומיום',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 lg:gap-3" dir="rtl">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: LIVEAT_GREEN }} />
                <span className="phase-bullet leading-snug lg:leading-relaxed font-semibold text-[#333] whitespace-pre-line">{f}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </ContentPanel>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 6 · Support + CTA
// ─────────────────────────────────────────────────────────────────────────────
// const chatBubbles = [
//   { text: 'אפשר להחליף את ארוחת הערב?',              isKim: false },
//   { text: 'ברור! הנה 3 אופציות שמתאימות לך 💪',      isKim: true  },
//   { text: 'היום פחות הסתדרתי...',                     isKim: false },
//   { text: 'זה חלק מהדרך. ממשיכות מהארוחה הבאה 🌿',   isKim: true  },
// ];

const chatBubbles = [
  { text: 'יצאנו למסעדה ואני מתלבטת', isKim: false },
  { text: 'שלחי לי מה יש בתפריט', isKim: true },
  { text: 'דג, המבורגר, פסטה וסלטים', isKim: false },
  { text: 'נבחר משהו שגם טעים לך וגם מתאים לתהליך', isKim: true },
  { text: 'המטרה היא שתדעי להתנהל גם כשאין יום רגיל', isKim: true },
];

const CHAT_TIMES = ['10:32', '10:35', '10:37', '10:42', '10:43', '10:44'];

/* Three bouncing dots — WhatsApp typing indicator */
function TypingDots() {
  return (
    <div className="flex gap-[3px] items-center px-0.5 py-[3px]">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[5px] h-[5px] rounded-full"
          style={{ background: '#aaa' }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.65, delay: i * 0.16, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ── Realistic iPhone + WhatsApp mockup — shell identical to AppPhoneMockup ── */
function WaPhoneMockup({ compact = false }) {
  const W = compact ? 200 : 258;
  const H = compact ? 390 : 510;
  const R = compact ? 36 : 44;
  const fs = compact ? 9.5 : 11.5;

  // State-driven sequential message reveal — each message enters DOM one by one
  const [shown, setShown]   = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setShown(0);
    setTyping(false);
    const ts = [
      setTimeout(() => setShown(1),                             350),   // user msg 1
      setTimeout(() => setTyping(true),                         750),   // kim typing…
      setTimeout(() => { setTyping(false); setShown(2); },      1250),  // kim msg 2
      setTimeout(() => setShown(3),                             1900),  // user msg 3
      setTimeout(() => setTyping(true),                         2300),  // kim typing…
      setTimeout(() => { setTyping(false); setShown(4); },      2800),  // kim msg 4
      setTimeout(() => setTyping(true),                         3200),  // kim typing…
      setTimeout(() => { setTyping(false); setShown(5); },      3700),  // kim msg 5
      setTimeout(() => setTyping(true),                         4100),  // kim typing…
      setTimeout(() => { setTyping(false); setShown(6); },      4550),  // kim msg 6
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ position: 'relative', width: W, flexShrink: 0 }}>

      {/* ── iPhone shell ── */}
      <div style={{
        width: W, height: H,
        borderRadius: R,
        background: 'linear-gradient(160deg, #2e2e2e 0%, #181818 100%)',
        padding: `${compact ? 10 : 13}px ${compact ? 6 : 8}px`,
        /* Tight and light: the old 100px-blur shadow pooled into a dark
           rectangle under the phone. This just lifts it off the page. */
        boxShadow: [
          '0 14px 28px -10px rgba(60,50,20,0.30)',
          '0 0 0 1.5px rgba(255,255,255,0.09)',
          'inset 0 1px 0 rgba(255,255,255,0.09)',
        ].join(','),
        position: 'relative',
        overflow: 'visible',
        flexShrink: 0,
      }}>

        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 13, left: '50%',
          transform: 'translateX(-50%)',
          width: 86, height: 24,
          background: '#090909', borderRadius: 14, zIndex: 30,
        }} />

        {/* Power button */}
        <div style={{ position: 'absolute', top: 108, right: -3, width: 3, height: 52, background: '#353535', borderRadius: '0 3px 3px 0' }} />
        {/* Vol up */}
        <div style={{ position: 'absolute', top: 86, left: -3, width: 3, height: 36, background: '#353535', borderRadius: '3px 0 0 3px' }} />
        {/* Vol down */}
        <div style={{ position: 'absolute', top: 130, left: -3, width: 3, height: 36, background: '#353535', borderRadius: '3px 0 0 3px' }} />

        {/* ── Screen ── */}
        <div style={{
          width: '100%', height: '100%',
          borderRadius: R - 10,
          overflow: 'hidden',
          background: '#ECE5DD',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
        }}>

          {/* WA Header */}
          <div dir="rtl" style={{
            display: 'flex', alignItems: 'center', gap: compact ? 5 : 7,
            padding: `${compact ? 26 : 32}px ${compact ? 7 : 10}px 5px`,
            background: '#075E54', flexShrink: 0,
          }}>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: compact ? 13 : 16, marginLeft: 1 }}>‹</span>
            <img
              src={kimIcon}
              alt="Kim"
              style={{ width: compact ? 24 : 30, height: compact ? 24 : 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(255,255,255,0.25)' }}
            width="94"
            height="95"
          />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, color: '#fff', fontSize: compact ? 10 : 12, fontWeight: 700, lineHeight: 1.2 }}>קים גפסון</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4CAF50', flexShrink: 0 }} />
                <p style={{ margin: 0, color: '#A5DFDA', fontSize: compact ? 8 : 9.5, lineHeight: 1 }}>מחוברת עכשיו</p>
              </div>
            </div>
          </div>

          {/* ── Chat messages ── */}
          <div dir="rtl" style={{
            flex: 1, padding: '3px 5px',
            display: 'flex', flexDirection: 'column', gap: 3,
            justifyContent: 'flex-end', overflowY: 'hidden',
          }}>

            <AnimatePresence initial={false}>
              {chatBubbles.slice(0, shown).map(({ text, isKim }, i) => (
                <motion.div
                  key={i}
                  style={{ display: 'flex', justifyContent: isKim ? 'flex-start' : 'flex-end', alignItems: 'flex-end', gap: 4 }}
                  initial={{ opacity: 0, y: 10, scale: 0.90 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {isKim && (
                    <img src={kimIcon} alt="Kim"
                      style={{ width: compact ? 18 : 22, height: compact ? 18 : 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, marginBottom: 2 }}
            width="94"
            height="95"
          />
                  )}
                  <div style={{
                    maxWidth: '82%',
                    background: isKim ? '#ffffff' : '#DCF8C6',
                    borderRadius: isKim ? '3px 10px 10px 10px' : '10px 3px 10px 10px',
                    padding: '3px 7px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.09)',
                  }}>
                    {isKim && (
                      <p style={{ margin: '0 0 1px', fontSize: compact ? 7 : 8.5, fontWeight: 700, color: '#075E54' }}>קים</p>
                    )}
                    <p style={{ margin: 0, fontSize: fs, color: '#333', lineHeight: 1.45 }}>{text}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2, justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: compact ? 6 : 7.5, color: '#6B6B6B' }}>{CHAT_TIMES[i]}</span>
                      {!isKim && <span style={{ fontSize: compact ? 7 : 9, color: '#53BDEB' }}>✓✓</span>}
                    </div>
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  key="typing"
                  style={{ display: 'flex', justifyContent: 'flex-start' }}
                  initial={{ opacity: 0, scale: 0.85, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 6 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div style={{ background: '#fff', borderRadius: '3px 10px 10px 10px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input bar */}
          <div dir="rtl" style={{
            display: 'flex', alignItems: 'center', gap: compact ? 4 : 6,
            padding: `${compact ? 5 : 6}px ${compact ? 5 : 7}px ${compact ? 6 : 9}px`,
            background: '#F0F0F0', flexShrink: 0,
          }}>
            <div style={{
              flex: 1, background: '#fff', borderRadius: 16,
              padding: `${compact ? 3 : 5}px ${compact ? 8 : 10}px`,
              // #bbb measured 1.92:1 on the white input — this mockup mimics
              // WhatsApp's chrome, but it is live DOM text, not a screenshot,
              // so it answers to the same contrast rule as the rest of the page.
              fontSize: compact ? 7.5 : 9, color: '#6B6B6B',
              textAlign: 'right',
            }}>הקלידי הודעה...</div>
            <div style={{
              width: compact ? 22 : 28, height: compact ? 22 : 28,
              borderRadius: '50%', background: '#075E54',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontSize: compact ? 10 : 12 }}>↑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kim online badge — floats top-right, appears after messages settle */}
      <motion.div
        dir="rtl"
        style={{
          position: 'absolute',
          top: compact ? -12 : -14,
          right: compact ? -14 : -20,
          background: '#fff',
          borderRadius: 18,
          padding: compact ? '5px 9px' : '7px 12px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.05)',
          display: 'flex', alignItems: 'center', gap: 6,
          whiteSpace: 'nowrap', zIndex: 40,
        }}
        initial={{ opacity: 0, scale: 0.78, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 3.2, type: 'spring', stiffness: 340, damping: 22 }}
      >
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CAF50', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: compact ? 9 : 10.5, fontWeight: 600, color: '#333' }}>קים מחוברת עכשיו</p>
      </motion.div>
    </div>
  );
}

function PhaseSupport() {
  return (
    <motion.div className="relative flex-1 flex flex-col">

      {/* ── Desktop: iPhone WA mockup in left column ── */}
      <motion.div
        className="absolute hidden lg:flex items-center justify-center pointer-events-none z-10"
        style={{ left: '17%', top: '30%', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0, y: 36, scale: 0.88 }}
        viewport={VIEW_ONCE} whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.08, ease: [0.34, 1.2, 0.64, 1] }}
      >
        <MountInView width={258} height={510}><WaPhoneMockup /></MountInView>
      </motion.div>

      <ContentPanel mobilePt="pt-3" mobilePb="pb-4">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={VIEW_ONCE}>

          {/* Mobile: compact WA mockup — scaled 0.62, wrapper clips leftover
              layout height so the phone never overlaps the heading below */}
          <motion.div variants={item} className="lg:hidden flex justify-center mb-2"
            style={{ height: 'min(215px, 26svh)', overflow: 'hidden', paddingTop: '8px' }}>
            <div style={{ transform: 'scale(0.52)', transformOrigin: 'top center', flexShrink: 0 }}>
              <MountInView width={200} height={390}><WaPhoneMockup compact /></MountInView>
            </div>
          </motion.div>

          <PhaseHeading>ליווי יומיומי<br/><Accent>וכלים שנשארים איתך</Accent></PhaseHeading>

          <motion.p variants={item} className="phase-intro text-gray-600 leading-snug lg:leading-relaxed mb-2.5 lg:mb-5" dir="rtl">
           בתוכנית שלנו את לא רק מקבלת תפריט{' '}
            <strong style={{ color: BRAND_INK }}>את לומדת על התזונה שלך</strong>{' '}<br className="hidden lg:block"></br>
            כך שתדעי{' '}
            <strong style={{ color: BRAND_INK }}>לנהל אותה</strong>,
            {' '}גם{' '}
            <strong style={{ color: BRAND_INK }}>שהתהליך מסתיים</strong>.
          </motion.p>
          <motion.div variants={item} className="flex flex-col gap-2.5 lg:gap-2.5 mb-4 lg:mb-7">
            {['ליווי יומיומי בווצאפ', 'קהילת תמיכה סגורה (בתוכנית נבחרת)', 'גיוון וגמישות מלאה בתפריט', 'פגישות מעקב אישיות חודשיות עם דיאטנית קלינית מהצוות'].map((f) => (
              <div key={f} className="flex items-center gap-2.5 lg:gap-3" dir="rtl">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: BRAND }} />
                <span className="phase-bullet leading-snug lg:leading-relaxed font-semibold text-[#333]">{f}</span>
              </div>
            ))}
          </motion.div>
          <motion.div variants={item}>
            <motion.a
              href="https://wa.link/ntdrz1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('whatsapp_consult', 'hero')}
              aria-label="קביעת ייעוץ חינם עם קים בווצאפ"
              className="block sm:inline-block"
              whileHover={{ y: -4, scale: 1.05, filter: 'drop-shadow(0 8px 24px rgba(139,127,75,0.50))' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              <Button
                className="rounded-full px-8 py-3 lg:py-6 text-base lg:text-lg font-bold text-white min-h-[44px]
                           shadow-[0_4px_20px_rgba(139,127,75,0.35)] w-full sm:w-auto"
                style={{ background: BRAND_SURFACE }}
              >
                לקביעת ייעוץ התאמה חינם
              </Button>
            </motion.a>
          </motion.div>
        </motion.div>
      </ContentPanel>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root component
// ─────────────────────────────────────────────────────────────────────────────
/* Each scene publishes where it is in the viewport: -1 entering at the
   bottom, 0 centred, 1 leaving at the top. */
function useSceneProgress(ref) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return useTransform(scrollYProgress, [0, 0.5, 1], [-1, 0, 1]);
}

/** Kim behind a scene: desktop on the left, phone in the top strip. */
function KimBackdrop({ local, desktop, mobile, eager = false }) {
  const isWide = useIsWide();
  const reduce = useReducedMotion();
  // Kim lags the scroll more than anything else in the scene: the furthest layer.
  const y = useTransform(local, [-1, 0, 1], reduce ? [0, 0, 0] : [-60, 0, 70]);
  const scale = useTransform(local, [-1, 0, 1], reduce ? [1, 1, 1] : [0.96, 1, 0.92]);
  // Kim lives in the hero only; she fades out well before the seam so the
  // photo is never cut by the edge of the section.
  const fade = useTransform(local, [-1, -0.4, 0.12, 0.7], [0, 1, 1, 0]);
  const opacity = useTransform(fade, (f) => f * (isWide ? desktop : mobile));
  const priority = eager ? { loading: 'eager', fetchPriority: 'high' } : { loading: 'lazy' };

  if (isWide ? !desktop : !mobile) return null;
  return isWide ? (
    <motion.div
      className="absolute inset-y-0 left-0 flex items-end justify-center pointer-events-none z-10"
      style={{ width: '80%', opacity, y, scale, transformOrigin: '50% 100%' }}
    >
      <ResponsiveImage
        src={kimHero}
        stem="/src/assets/images/kim-hero-v1"
        sizes="80vw"
        alt={eager ? 'קים גפסון' : ''}
        className="w-full h-full object-contain object-bottom"
        width="1586"
        height="992"
        {...priority}
      />
    </motion.div>
  ) : (
    <motion.div
      className="absolute top-0 left-0 right-0 flex justify-center pt-3 z-10 pointer-events-none"
      style={{ opacity, y }}
    >
      {/* Height-driven box (36svh, capped 320px); at the 1.599 aspect that is
          ~467css wide on an 812px phone, so 480px picks the 1200w file. */}
      <ResponsiveImage
        src={kimHero}
        stem="/src/assets/images/kim-hero-v1"
        sizes="480px"
        alt={eager ? 'קים גפסון' : ''}
        className="object-contain object-bottom w-auto"
        style={{ height: '36svh', maxHeight: '320px' }}
        width="1586"
        height="992"
        {...priority}
      />
    </motion.div>
  );
}

/**
 * One chapter of the story, in normal page flow.
 *
 * The hero used to be a single 460svh pinned stage that swapped its content
 * in place, so on a phone the finger moved and the page did not: it read as
 * slides changing, not as scrolling. Each chapter is now its own section. The
 * content travels with the finger; the artwork lags it and Kim lags it most,
 * which is where the depth comes from. Only the plate pins, because its burst
 * genuinely needs scroll distance to play (PlateScene).
 */
function Scene({ id, label, kim = 0, kimMobile = 0, eager = false, padTop = true, children, extras = null }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const local = useSceneProgress(ref);
  const artY = useTransform(local, [-1, 0, 1], reduce ? [0, 0, 0] : [-36, 0, 36]);

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      tabIndex={-1}
      /* As tall as its content (the hero fills the screen): a fixed 100svh
         per chapter left a band of empty cream under every short one. */
      className={`relative overflow-hidden outline-none flex flex-col ${padTop ? 'pt-12' : 'min-h-[100svh]'}`}
      style={{ background: BG }}
    >
      <KimBackdrop local={local} desktop={kim} mobile={kimMobile} eager={eager} />
      {extras}
      <motion.div className="relative z-20 flex-1 flex flex-col" style={{ y: artY }}>
        <PhaseMotionContext.Provider value={local}>
          {children}
        </PhaseMotionContext.Provider>
      </motion.div>
    </section>
  );
}

const PLATE_FRAMES = Array.from({ length: 49 }, (_, i) => `/plate-seq/f${String(i + 1).padStart(2, '0')}.jpg`);

/**
 * The plate burst on a phone. Not pinned: the section scrolls like any other
 * and the burst is driven by its own travel through the screen, so every bit
 * of finger movement both moves the page and advances the burst. (Pinned, the
 * page stood still for over a screen of scrolling while the burst caught up.)
 * Frames come from an image sequence (useFrameSequence), which scrubs
 * smoothly on iOS where seeking a video does not.
 */
function PlateScene() {
  const ref = useRef(null);
  const plateRef = useRef(null);
  const reduce = useReducedMotion();
  // 0 as the plate's top enters at the bottom of the screen, 1 as its
  // bottom reaches the navbar: the burst spans the whole time it is in view.
  const { scrollYProgress: travel } = useScroll({ target: plateRef, offset: ['start end', 'end 64px'] });
  const scrub  = useTransform(travel, [0.12, 0.92], [0, 1]);
  const scale  = useTransform(travel, [0, 0.4], reduce ? [1, 1] : [0.88, 1]);
  const rotate = useTransform(travel, [0, 0.4], reduce ? [0, 0] : [-7, 0]);
  const local  = useSceneProgress(ref);
  const canvasRef = useFrameSequence({ frames: PLATE_FRAMES, progress: scrub, fill: '#ffffff' });

  return (
    <section
      ref={ref}
      id="story-plate"
      aria-label="הכל מתחיל בצלחת"
      tabIndex={-1}
      className="relative outline-none overflow-hidden pt-12"
      style={{ background: BG }}
    >
      <motion.div
        ref={plateRef}
        className="relative mx-auto w-full max-w-[460px] aspect-square pointer-events-none"
        style={{
          scale, rotate,
          background: BG,
          isolation: 'isolate',
          WebkitMaskImage: 'radial-gradient(closest-side, #000 80%, transparent 100%)',
          maskImage: 'radial-gradient(closest-side, #000 80%, transparent 100%)',
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ display: 'block', width: '100%', height: '100%', mixBlendMode: 'multiply' }}
        />
      </motion.div>
      <div className="relative z-20 flex flex-col">
        <PhaseMotionContext.Provider value={local}>
          <PhasePlate reserve="pt-0" />
        </PhaseMotionContext.Provider>
      </div>
    </section>
  );
}

function HeroExtras({ banner = true }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // The testimonial chips and the hint leave as soon as the visitor moves.
  const opacity = useTransform(scrollY, [0, 260], [1, 0]);
  const y = useTransform(scrollY, [0, 400], reduce ? [0, 0] : [0, -60]);
  const hint = useTransform(scrollY, [0, 120], [1, 0]);

  return (
    <>
      <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity, y, zIndex: 9 }} aria-hidden="true">
        {[
          { chat: waChatsLeft[0],  pos: { top: '12%', left: '1%' },     rot: -2 },
          { chat: waChatsLeft[1],  pos: { bottom: '20%', left: '1%' },  rot: 1.5 },
          { chat: waChatsRight[0], pos: { top: '24%', left: '16%' },    rot: 2 },
          { chat: waChatsRight[1], pos: { bottom: '30%', left: '14%' }, rot: -1.5 },
        ].map(({ chat, pos, rot }, i) => (
          <motion.div key={`wab-d${i}`} className="hidden lg:block absolute"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 0.5, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={pos}>
            <div style={{ transform: `rotate(${rot}deg)` }}><WaBubble {...chat} /></div>
          </motion.div>
        ))}
        <motion.div className="lg:hidden absolute"
          initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ top: '7vh', left: '2px', transform: 'scale(0.72)', transformOrigin: 'top left' }}>
          <div style={{ transform: 'rotate(-2deg)' }}><WaBubble {...waChatsLeft[0]} /></div>
        </motion.div>
        <motion.div className="lg:hidden absolute"
          initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ duration: 0.6, delay: 0.45 }}
          style={{ top: '17vh', right: '2px', transform: 'scale(0.72)', transformOrigin: 'top right' }}>
          <div style={{ transform: 'rotate(1.5deg)' }}><WaBubble {...waChatsRight[0]} /></div>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-12 md:bottom-32 left-1/2 -translate-x-1/2 z-30" style={{ opacity: hint }}>
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="text-sm font-medium" style={{ color: `${BRAND}80` }}>גללי לגלות</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}>
            <ChevronDown className="w-5 h-5" style={{ color: `${BRAND}70` }} />
          </motion.div>
        </motion.div>
      </motion.div>

      {banner && <StoryBanner />}
    </>
  );
}

function StoryBanner() {
  return (
    <div className="hidden md:block absolute bottom-0 left-0 right-0 z-40" style={{ background: `${BRAND}ee` }}>
      <p className="text-white text-center text-sm md:text-base font-medium py-3 px-6">
       תוכנית תזונה מדויקת וממוקדת, ליווי אישי עם דיאטנית קלינית מהצוות שלנו, אפליקציה תומכת וקהילה סגורה
      </p>
    </div>
  );
}

/* Section ids the page navigation links to (SectionNav). */
export const STORY_SECTIONS = [
  { id: 'story-hero', label: 'בית', flush: true },
];

/* ─────────────────────────────────────────────────────────────────────────
   Desktop: one pinned stage. The phases hand over inside it, locked to the
   scroll position (PhaseLayer). On a wide screen there is room for Kim, the
   artwork and the copy side by side, and the stage reads as a film.
   ───────────────────────────────────────────────────────────────────────── */

/* Scroll budget per phase; the plate gets more because its burst is scrubbed
   frame by frame. Order: hero, busy life, plate, 80:20, app, support. */
const PHASE_WEIGHTS = [1, 1, 1.45, 1, 1, 1.1];
const PHASE_STARTS = PHASE_WEIGHTS.reduce((acc, w, i) => {
  if (i > 0) acc.push(acc[i - 1] + PHASE_WEIGHTS[i - 1]);
  return acc;
}, [0]).map((x) => x / PHASE_WEIGHTS.reduce((a, b) => a + b, 0));
// Half-width of a hand-off, in stage progress.
const HANDOFF = 0.04;
const STAGE_SVH = 460;
const PHASES = [PhaseHero, PhaseBusyLife, PhasePlate, PhaseRing, PhaseApp, PhaseSupport];
const PHASE_IDS = ['story-hero', 'story-life', 'story-plate', 'story-balance', 'story-app', 'story-support'];

/** One phase on the stage: -1 arriving, 0 settled, 1 leaving. */
function PhaseLayer({ index, progress, active, children }) {
  const reduce = useReducedMotion();
  const start = PHASE_STARTS[index];
  const end = PHASE_STARTS[index + 1];
  const input = index > 0 ? [start - HANDOFF, start + HANDOFF] : [0];
  const output = index > 0 ? [-1, 0] : [0];
  if (end !== undefined) { input.push(end - HANDOFF, end + HANDOFF); output.push(0, 1); }
  else { input.push(1); output.push(0); }
  const local = useTransform(progress, input, output);
  // Sequential: the outgoing phase is gone before the incoming one shows.
  const opacity = useTransform(local, [-1, -0.42, -0.02, 0.02, 0.42, 1], [0, 0, 1, 1, 0, 0]);
  const y = useTransform(local, [-1, 0, 1], reduce ? [0, 0, 0] : [56, 0, -56]);

  return (
    <motion.div
      // Below the hero the navbar is showing, so later phases start under it.
      className={`absolute inset-x-0 bottom-0 flex flex-col ${index === 0 ? 'top-0' : 'top-16'}`}
      style={{ opacity, y, pointerEvents: active ? 'auto' : 'none', willChange: 'transform, opacity' }}
      aria-hidden={active ? undefined : true}
    >
      <PhaseMotionContext.Provider value={local}>
        {children}
      </PhaseMotionContext.Provider>
    </motion.div>
  );
}

function mountedAt(v) {
  const out = [];
  PHASE_STARTS.forEach((s, i) => {
    const e = PHASE_STARTS[i + 1] ?? 1;
    if (v >= s - 2 * HANDOFF && v <= e + 2 * HANDOFF) out.push(i);
  });
  return out.join(',');
}

function phaseAt(v) {
  let i = 0;
  while (i < PHASE_STARTS.length - 1 && v >= PHASE_STARTS[i + 1]) i++;
  return i;
}

function StageStory() {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // Smooths mouse-wheel notches; stiff enough never to trail the input.
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 36, mass: 0.5, restDelta: 0.0001 });

  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState('0');
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPhase(phaseAt(v));
    const key = mountedAt(v);
    setMounted((prev) => (prev === key ? prev : key));
  });

  const P = PHASE_STARTS;
  const H = HANDOFF;
  const PLATE_IN = P[2], PLATE_OUT = P[3];

  const kimOpacity = useTransform(
    progress,
    [0, P[1] - H, P[1] + H, PLATE_IN - H, PLATE_IN, PLATE_OUT, PLATE_OUT + H, P[4] - H, P[4] + H, 1],
    [1, 1,        0.2,      0.2,          0,        0,         0.2,           0.2,      1,        1]
  );
  const kimScale = useTransform(progress, [0, P[1] + H, 0.85, 1], [1, 0.86, 0.86, 1]);
  const kimY     = useTransform(progress, [0, 1], reduce ? [0, 0] : [0, -60]);

  const plateScrollProgress = useTransform(scrollYProgress, [PLATE_IN + H * 0.5, PLATE_OUT - H], [0, 1]);
  const plateOpacity = useTransform(progress, [PLATE_IN - H * 0.4, PLATE_IN + H * 0.5, PLATE_OUT - H * 0.5, PLATE_OUT + H * 0.4], [0, 1, 1, 0]);
  const plateScale   = useTransform(progress, [PLATE_IN - H, PLATE_IN + H, PLATE_OUT - H, PLATE_OUT + H], reduce ? [1, 1, 1, 1] : [0.84, 1, 1, 1.06]);
  const plateY       = useTransform(progress, [PLATE_IN - H, PLATE_IN + H, PLATE_OUT - H, PLATE_OUT + H], reduce ? [0, 0, 0, 0] : [70, 0, 0, -70]);
  const plateRotate  = useTransform(progress, [PLATE_IN - H, PLATE_IN + H], reduce ? [0, 0] : [-8, 0]);

  const mountedSet = mounted.split(',').map(Number);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      style={{ height: `${STAGE_SVH}svh`, position: 'relative', background: BG }}
    >
      {/* Navbar targets: each lands where its phase has fully settled. */}
      {PHASE_IDS.map((id, i) => (
        <div
          key={id}
          id={id}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-x-0 h-px outline-none pointer-events-none"
          style={{ top: `calc(${STAGE_SVH - 100}svh * ${i === 0 ? 0 : PHASE_STARTS[i] + HANDOFF})` }}
        />
      ))}

      <div className="sticky top-0 overflow-hidden" style={{ height: '100svh', background: BG }}>
        <motion.div
          className="absolute inset-y-0 left-0 flex items-end justify-center pointer-events-none z-10"
          style={{ width: '80%', opacity: kimOpacity, y: kimY, scale: kimScale, transformOrigin: '50% 100%' }}
        >
          <ResponsiveImage
            src={kimHero}
            stem="/src/assets/images/kim-hero-v1"
            sizes="80vw"
            alt="קים גפסון"
            className="w-full h-full object-contain object-bottom"
            width="1586"
            height="992"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>

        <motion.div
          className="absolute pointer-events-none top-16 bottom-0 left-0 w-[52%]"
          style={{ opacity: plateOpacity, scale: plateScale, y: plateY, rotate: plateRotate, zIndex: 11 }}
        >
          <ScrollVideoPlayer plateProgress={plateScrollProgress} />
        </motion.div>

        {phase <= 1 && <HeroExtras banner={false} />}
        <StoryBanner />

        <div className="relative z-20 h-full">
          {mountedSet.map((i) => {
            const Phase = PHASES[i];
            return (
              <PhaseLayer key={i} index={i} progress={progress} active={i === phase}>
                <Phase />
              </PhaseLayer>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Phone: chapters in normal page flow, so the content moves with the finger.
   A pinned stage on a phone reads as slides changing while the finger moves
   and the page does not. Only the plate pins, because its burst needs scroll.
   ───────────────────────────────────────────────────────────────────────── */
function FlowStory() {
  return (
    <div dir="rtl" style={{ background: BG }}>
      <Scene id="story-hero" label="קים גפסון" kim={1} kimMobile={1} eager padTop={false} extras={<HeroExtras />}>
        <PhaseHero />
      </Scene>
      <Scene id="story-life" label="החיים שלך עמוסים">
        <PhaseBusyLife />
      </Scene>
      <PlateScene />
      <Scene id="story-balance" label="גישת 80:20">
        <PhaseRing />
      </Scene>
      <Scene id="story-app" label="יומן אכילה">
        <PhaseApp />
      </Scene>
      <Scene id="story-support" label="ליווי יומיומי">
        <PhaseSupport />
      </Scene>
    </div>
  );
}

export default function ScrollStorySection() {
  const isWide = useIsWide();
  return isWide ? <StageStory /> : <FlowStory />;
}
