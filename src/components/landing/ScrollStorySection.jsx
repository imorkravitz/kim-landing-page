import React, { useRef, useState, useEffect } from 'react';
import img_4a45529a3_app_icon from '../../assets/remote/4a45529a3_app-icon.webp';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Star, GraduationCap, Stethoscope,
  Leaf, Droplets, Flame, Apple,
  CheckCircle2, TrendingUp, ChevronDown,
} from 'lucide-react';

// @ts-ignore
import kimHero from '../../assets/images/kim-hero.png';
// @ts-ignore
import kimLogo from '../../assets/icons/KIM - LOGO 2.png';
// @ts-ignore
import kimIcon from '../../assets/images/kim-icon-whatsapp.png';
// @ts-ignore
import animatedVideo from '../../assets/videos/animated.mp4';

// Phase 5 — real food photos + goals screen (Liveat diary)
// @ts-ignore
import meal1    from '../../assets/app/meal-2.webp';   // breakfast photo
// @ts-ignore
import meal2    from '../../assets/app/meal-1.webp';   // morning-snack photo
// @ts-ignore
import meal3    from '../../assets/app/meal-3.webp';   // lunch photo
// @ts-ignore
import appGoals from '../../assets/app/app-6.png';    // daily-goals screen — water bottles at bottom
// @ts-ignore
import eatDiary1 from '../../assets/app/eat_diary_1.webp'; // actual app diary screen 1
// @ts-ignore
import eatDiary2 from '../../assets/app/eat_diary_2.webp'; // actual app diary screen 2 (macros)

// Phase 4 — food sticker images for 80:20 ring
// @ts-ignore
import nt1 from '../../assets/8020/pizza.png';
// @ts-ignore
import nt2 from '../../assets/8020/wine.png';
// @ts-ignore
import nt3 from '../../assets/8020/crossiant.webp';
// @ts-ignore
import nt4 from '../../assets/8020/water.png';
// @ts-ignore
import nt5 from '../../assets/8020/bread.webp';
// @ts-ignore
import nt7 from '../../assets/8020/healthyPlate.webp';
// @ts-ignore
import nt8 from '../../assets/8020/running2.png';
// @ts-ignore
import nt9 from '../../assets/8020/banana.png';
// @ts-ignore
import nt10 from '../../assets/8020/veggie.png';


// Phase 1 custom images (transparent PNGs)
// @ts-ignore
import imgNoTime        from '../../assets/images/no-time.png';
// @ts-ignore
import imgWork          from '../../assets/images/work.png';
// @ts-ignore
import imgTierd         from '../../assets/images/tierd.png';
// @ts-ignore
import imgStressCalendar from '../../assets/images/stress-calander.png';
// @ts-ignore
import imgMessages      from '../../assets/images/messages.png';
// @ts-ignore
import imgKids          from '../../assets/images/kids.png';

const BRAND = '#8B7F4B';
const BG    = '#e9e4ce';
const TEXT  = '#333333';
const PHASE_STARTS = [0, 0.15, 0.29, 0.43, 0.60, 0.78];
const ease = [0.25, 0.1, 0.25, 1];

// Phase wrapper: subtle y-lift + crossfade — cinematic without jarring jumps.
// Exit is faster (0.20s) so the incoming phase doesn't wait long.
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.60, ease } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.20, ease: 'easeIn' } },
};
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
function ContentPanel({ children, mobilePt = 'pt-[24svh]', mobileAlign = 'items-start', mobilePb = 'pb-16' }) {
  return (
    <div className={`h-full flex ${mobileAlign} lg:items-center`}>
      <div className={`w-full ${mobilePt} ${mobilePb} px-5 lg:pt-0 lg:pb-0 lg:px-0 lg:pl-[50%] lg:pr-12`}>
        {/* dir="rtl" is re-applied here so text inside is always RTL */}
        <div dir="rtl" className="text-right">
          {children}
        </div>
      </div>
    </div>
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
      className="text-3xl md:text-5xl lg:text-6xl font-heading leading-tight mb-4 lg:mb-5"
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
    <span className="relative" style={{ color: BRAND }}>
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
              <p className="text-[8px] text-gray-400 text-left mt-0.5">{m.time}{m.from !== 'kim' && ' ✓✓'}</p>
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
      { from: 'user', text: 'וסה״כ בכמעט 3 חודשים — 4.7 קג 🏆🏆🏆', time: '11:35' },
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
  { text: 'ירדתי 15 קילו בחצי שנה — כלים לחיים, לא לדיאטה זמנית ❤️', time: '20:54' },
  { text: '15 וחצי קילו ב-4 חודשים!!! תודה שגרמת לי לאהוב את עצמי 🙏', time: '14:20' },
  { text: 'אוכלת קינדר בואנו ועדיין יורדת 😍 מ-85 ל-61.5!', time: '19:03' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 0 · Hero
// ─────────────────────────────────────────────────────────────────────────────
function PhaseHero() {
  const successCount = useCountUp(5000, { duration: 1.3, delay: 0.6 });

  return (
    <motion.div className="absolute inset-0" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      <ContentPanel>
        <motion.div variants={stagger} initial="initial" animate="animate">

          <motion.div variants={item} className="inline-block mb-2 lg:mb-4">
            <img src={kimLogo} alt="KIM" className="h-40 md:h-56 lg:h-80 drop-shadow-lg" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={item}
            dir="rtl"
            className="text-3xl sm:text-4xl md:text-5xl font-heading leading-[1.15] mb-3 lg:mb-5"
          >
            <span style={{ color: BRAND }}>
              לנהל את התזונה שלכם
            </span>
            <br></br>
            <span style={{ color: BRAND }}>
              לאכול הכל
            </span>{' '}

            <span className="block" style={{ color: TEXT }}>לרדת במשקל <br></br>ולשמור על התוצאות.</span>
          </motion.h1>

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
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 lg:gap-4 items-start mb-3 lg:mb-5">

            {/* Primary CTA — spring lift + glow on hover */}
            <motion.a
              href="https://wa.link/ntdrz1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="קביעת ייעוץ חינם עם קים בווצאפ"
              className="block sm:inline-block w-full sm:w-auto"
              whileHover={{ y: -4, scale: 1.05, filter: 'drop-shadow(0 8px 24px rgba(139,127,75,0.50))' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              <Button
                className="rounded-full px-8 py-6 text-lg font-bold text-white min-h-[48px]
                           shadow-[0_4px_20px_rgba(139,127,75,0.35)] w-full sm:w-auto"
                style={{ background: BRAND }}
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
                    <Star className="w-3 h-3 fill-[#8B7F4B] text-[#8B7F4B]" />
                  </motion.span>
                ))}
              </motion.div>
              <div className="flex items-baseline gap-1.5" dir="rtl">
                <span className="text-xs font-bold text-gray-700">סיפורי הצלחה</span>
                {/* Count-up number */}
                <span className="text-2xl font-black" style={{ color: BRAND }}>
                  {successCount.toLocaleString()}+
                </span>
              </div>
            </motion.div>

          </motion.div>

          {/* Stats — desktop only; hero content is tight on mobile */}
          <motion.div variants={item} className="hidden lg:flex gap-6 border-t border-[#8B7F4B]/20 pt-4" dir="rtl">
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 font-medium leading-tight">שנות<br/>ניסיון</div>
              <div className="text-2xl font-black" style={{ color: BRAND }}>12+</div>
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
const mobileLifestylePositions = [
  { left: '4%',  top: '3%'  },
  { right: '4%', top: '7%'  },
  { left: '2%',  top: '20%' },
  { right: '3%', top: '22%' },
  { left: '4%',  top: '37%' },
  { right: '4%', top: '36%' },
];

function PhaseBusyLife() {
  return (
    <motion.div className="absolute inset-0" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* Desktop: lifestyle items floating around Kim */}
      {lifestyleItems.map(({ src, label, style, delay }, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex flex-col items-center gap-1.5 z-10"
          style={style}
          initial={{ opacity: 0, scale: 0.55, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.25 + delay, duration: 0.5, ease }}
        >
          <img
            src={src}
            alt={label}
            className="w-32 h-32 object-contain"
            style={{ filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.20))' }}
          />
          <span
            className="text-sm font-semibold bg-white/75 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm"
            style={{ color: TEXT }}
          >
            {label}
          </span>
        </motion.div>
      ))}

      {/* Mobile: lifestyle items scattered around Kim in the top 42vh */}
      {lifestyleItems.map(({ src, label, delay }, i) => (
        <motion.div
          key={`mob-${i}`}
          className="absolute flex flex-col items-center gap-0.5 lg:hidden"
          style={{ ...mobileLifestylePositions[i], zIndex: 5 }}
          initial={{ opacity: 0, scale: 0.6, y: 14 }}
          animate={{ opacity: 0.9, scale: 1, y: 0 }}
          transition={{ delay: 0.2 + delay, duration: 0.45, ease }}
        >
          <img
            src={src}
            alt={label}
            className="w-14 h-14 object-contain"
            style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.18))' }}
          />
          <span className="text-[9px] font-semibold bg-white/72 px-1.5 py-0.5 rounded-full text-gray-600 leading-none">
            {label}
          </span>
        </motion.div>
      ))}

      <ContentPanel mobilePt="pt-[38svh]">
        <motion.div variants={stagger} initial="initial" animate="animate">

          {/* Mobile heading */}
          <motion.h2
            variants={item}
            className="text-3xl font-heading leading-tight mb-3 lg:hidden"
            style={{ color: TEXT }}
            dir="rtl"
          >
            החיים שלך עמוסים<br/>
            <span style={{ color: BRAND }}>השיטה שלנו מותאמת לזה.</span>
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
            בדיוק בשביל זה בניתי שיטה שלא דורשת ממך לעצור את החיים, אלא ללמוד איך להתנהל בתוכם.
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
 * Canvas-based scroll scrubber — the smoothest approach possible in-browser.
 *
 * Why canvas instead of <video>?
 *   When you set video.currentTime the browser must decode the target frame.
 *   During that decode window the <video> element goes blank/black — visible
 *   stutter. A <canvas> holds the LAST successfully painted frame on screen
 *   while the next one is being decoded, so there is never an empty flash.
 *
 * Smoothness rules:
 *   1. pendingRef  — only one seek at a time; new seek starts only after
 *                    'seeked' fires, preventing decoder overload.
 *   2. Lerp 8 %    — closes ~90 % of gap in ~250 ms; gives decoder time to
 *                    keep up even on low-keyframe-density videos.
 *   3. 1/30 s gate — skips seeks smaller than one frame (~33 ms of video).
 *
 * Background removal:
 *   Canvas is filled with white before each drawImage. The canvas element
 *   uses mix-blend-mode:multiply, so white × cream-BG = cream → invisible. ✓
 */
function ScrollVideoPlayer({ plateProgress }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const targetRef  = useRef(0);
  const smoothRef  = useRef(0);
  const pendingRef = useRef(false); // true while browser decodes a seek
  const rafRef     = useRef(null);

  useEffect(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // alpha:false = opaque canvas, slightly faster compositing
    const ctx = canvas.getContext('2d', { alpha: false });

    video.pause();
    video.currentTime = 0;

    // Paint the current video frame onto the canvas (object-contain scaling)
    const paint = () => {
      if (video.readyState < 2) { pendingRef.current = false; return; }
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh)           { pendingRef.current = false; return; }

      const cw = canvas.offsetWidth  || 640;
      const ch = canvas.offsetHeight || 360;

      // Sync logical px to CSS px (no blurry canvas)
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width  = cw;
        canvas.height = ch;
      }

      // object-contain: scale to fit, centred
      const scale = Math.min(cw / vw, ch / vh);
      const dw = Math.round(vw * scale);
      const dh = Math.round(vh * scale);
      const dx = Math.round((cw - dw) / 2);
      const dy = Math.round((ch - dh) / 2);

      // White fill → mix-blend-mode:multiply makes this transparent over cream BG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(video, dx, dy, dw, dh);

      pendingRef.current = false; // ready for the next seek
    };

    video.addEventListener('seeked',         paint);
    video.addEventListener('loadeddata',     paint); // paint frame 0 when ready
    video.addEventListener('canplaythrough', paint);
    video.load(); // explicit — some browsers defer buffering of display:none videos

    // ── RAF scrub loop ────────────────────────────────────────────────────────
    // pendingSince: watchdog — if a seek never fires `seeked` (unbuffered
    // region, mobile browser quirk), the pending flag would freeze the scrub
    // forever. This is what caused the janky/stuck feel at the start of the
    // Hero scroll on mobile.
    let pendingSince = 0;
    const tick = () => {
      if (pendingRef.current && performance.now() - pendingSince > 250) {
        pendingRef.current = false; // seek lost — recover instead of freezing
      }
      if (!pendingRef.current) {               // wait for previous seek to finish
        const target  = targetRef.current;
        const current = smoothRef.current;
        const diff    = target - current;

        if (Math.abs(diff) > 0.0004) {
          const next = current + diff * 0.08;  // gentle lerp — decoder keeps up
          smoothRef.current = next;

          const v = Math.max(0, Math.min(1, next));
          if (isFinite(video.duration) && video.duration > 0) {
            const t = v * video.duration;
            if (Math.abs(video.currentTime - t) > 1 / 30) { // ≥1 frame gap
              pendingRef.current = true;
              pendingSince = performance.now();
              video.currentTime  = t;
            }
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener('seeked',         paint);
      video.removeEventListener('loadeddata',     paint);
      video.removeEventListener('canplaythrough', paint);
    };
  }, []);

  // Only update the target — the RAF loop does all the work
  useMotionValueEvent(plateProgress, 'change', (rawV) => {
    targetRef.current = Math.max(0, Math.min(1, rawV));
  });

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: BG,
      isolation: 'isolate',
    }}>
      {/* Hidden video — decode source only, never rendered directly */}
      <video
        ref={videoRef}
        src={animatedVideo}
        muted
        playsInline
        preload="auto"
        style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}
      />
      {/* Canvas — always shows last good frame; zero black-flash between frames */}
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2 · The Plate  (left visual = video player from root; only text here)
// ─────────────────────────────────────────────────────────────────────────────
function PhasePlate() {
  return (
    <motion.div className="absolute inset-0" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <ContentPanel mobilePt="pt-[40svh]">
        <motion.div variants={stagger} initial="initial" animate="animate">
          <motion.h2
            variants={item}
            className="text-3xl font-heading leading-tight mb-3 lg:hidden"
            style={{ color: TEXT }}
            dir="rtl"
          >
            הכל <Accent>מתחיל בצלחת.</Accent>
          </motion.h2>
          <div className="hidden lg:block">
            <PhaseHeading>הכל<br/><Accent>מתחיל בצלחת.</Accent></PhaseHeading>
          </div>
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
            <strong style={{ color: BRAND, fontWeight: 800 }}>במסעדה</strong>,{' '}
            <strong style={{ color: BRAND, fontWeight: 800 }}>בחופשה</strong>,{' '}
            <strong style={{ color: BRAND, fontWeight: 800 }}>בסוף שבוע</strong>.{' '}<br></br>
            לא כדי שתהיי תלויה בתפריט אלא כדי שתדעי להתנהל נכון{' '} <br></br>
            <strong style={{ color: BRAND }}>בכל סיטואציה</strong>.{' '}
            כי כשאת מבינה איך הדברים עובדים <br></br>
            הרבה יותר קל{' '}
            <strong style={{ color: BRAND, fontWeight: 800 }}>לרדת במשקל, להתמיד ולשמור על התוצאות</strong>.
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
    <motion.div className="absolute inset-0" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <ContentPanel>
        <motion.div variants={stagger} initial="initial" animate="animate">
          {/* Section label — desktop only (saves ~32px on mobile) */}
          <div className="hidden lg:block"><SectionLabel>השיטה שלנו</SectionLabel></div>
          <PhaseHeading>מה יש<br/><Accent>בצלחת מאוזנת?</Accent></PhaseHeading>
          {/* Desktop paragraph */}
          <motion.p variants={item} className="hidden lg:block text-lg text-gray-600 leading-relaxed mb-4">
            כל רכיב יש לו תפקיד. אנחנו לא מורידות — אנחנו מאזנות.
          </motion.p>
          {/* Mobile paragraph — compact */}
          <motion.p variants={item} className="lg:hidden text-base text-gray-600 leading-relaxed mb-3">
            כל רכיב יש לו תפקיד. אנחנו לא מורידות — אנחנו מאזנות.
          </motion.p>
          <motion.div variants={item} className="flex flex-col gap-2 lg:gap-3">
            {foodComponents.map(({ label, sublabel, color, Icon }) => (
              <div key={label} className="flex items-center gap-3" dir="rtl">
                <div className="rounded-full p-1.5 lg:p-2.5 shrink-0" style={{ background: `${color}22`, border: `1.5px solid ${color}55` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <span className="text-base font-bold text-[#333]">{label}</span>
                  <span className="text-xs lg:text-sm text-gray-400 block leading-tight">{sublabel}</span>
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
      animate={{ scale: 1, opacity: 1, rotate }}
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

function PhaseRing() {
  return (
    <motion.div className="absolute inset-0" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ── Desktop: ring — left visual column, scaled 1.6× for prominence ── */}
      <motion.div
        className="absolute hidden lg:flex flex-col items-center pointer-events-none z-[13]"
        style={{
          left: '6%',
          top: '50%',
          translateY: '-50%',
        }}
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.1, 0.64, 1] }}
      >
        {/* SVG scales to RING_SIZE; viewBox stays 200×200 → all radii / text scale */}
        <svg width={RING_SIZE} height={RING_SIZE} viewBox="0 0 200 200">
          {/* Track */}
          <circle cx="100" cy="100" r="72" fill="none" stroke="#ddd6bc" strokeWidth="14" />
          {/* 80 % arc — gold */}
          <motion.circle
            cx="100" cy="100" r="72" fill="none" stroke={BRAND}
            strokeWidth="14" strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: CIRC * 0.2 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
            transform="rotate(-90 100 100)"
          />
          {/* 20 % arc — terracotta */}
          <motion.circle
            cx="100" cy="100" r="72" fill="none" stroke="#C49A7A"
            strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${CIRC * 0.2} ${CIRC * 0.8}`}
            strokeDashoffset={`${-CIRC * 0.8}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            transform="rotate(-90 100 100)"
          />
          {/* Centre labels */}
          <text x="100" y="92" textAnchor="middle" fill={BRAND} fontSize="28" fontWeight="900" fontFamily="Calibri,sans-serif">80:20</text>
          <text x="100" y="116" textAnchor="middle" fill="#6e6e6e" fontSize="11" fontFamily="Heebo">הגישה שלנו</text>
        </svg>

        {/* Legend below the ring — no absolute overflow */}
        <div className="flex flex-col gap-2 mt-1">
          <motion.div className="flex items-center gap-2 justify-center"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.35 }}
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: BRAND }} />
            <span className="text-2xl font-semibold" style={{ color: TEXT }}>80% עקביות</span>
          </motion.div>
          <motion.div className="flex items-center gap-2 justify-center"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
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
        <motion.div variants={stagger} initial="initial" animate="animate">

          {/* Mobile-only: full-size ring with 8 stickers orbiting the ring edge */}
          <motion.div variants={item} className="lg:hidden flex flex-col items-center mb-2">
            {/*
              Container: 340×330px. SVG 240px centered → SVG top-left at (50,45), center at (170,165).
              Ring rendered radius = 72/200×240 = 86.4px from center.
              Sticker centers (size/2 = 40px offset) placed ON the ring circumference at 8 positions.
            */}
            <div style={{
              position: 'relative',
              width: 'min(92vw, 340px)',
              height: 'min(90vw, 330px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg
                style={{ width: 'min(68vw, 240px)', height: 'min(68vw, 240px)', flexShrink: 0, position: 'relative', zIndex: 1 }}
                viewBox="0 0 200 200"
              >
                <circle cx="100" cy="100" r="72" fill="none" stroke="#ddd6bc" strokeWidth="14" />
                <motion.circle cx="100" cy="100" r="72" fill="none" stroke={BRAND}
                  strokeWidth="14" strokeLinecap="round" strokeDasharray={CIRC}
                  initial={{ strokeDashoffset: CIRC }} animate={{ strokeDashoffset: CIRC * 0.2 }}
                  transition={{ duration: 1.2, delay: 0.2, ease }} transform="rotate(-90 100 100)"
                />
                <motion.circle cx="100" cy="100" r="72" fill="none" stroke="#C49A7A"
                  strokeWidth="14" strokeLinecap="round"
                  strokeDasharray={`${CIRC * 0.2} ${CIRC * 0.8}`} strokeDashoffset={`${-CIRC * 0.8}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="88" textAnchor="middle" fill={BRAND} fontSize="36" fontWeight="900" fontFamily="Calibri,sans-serif">80:20</text>
                <text x="100" y="113" textAnchor="middle" fill="#aaa" fontSize="12" fontFamily="Heebo,sans-serif">הגישה שלנו</text>
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
          </motion.div>

          <motion.h2
            variants={item}
            className="text-2xl font-heading leading-tight mb-1 lg:hidden"
            style={{ color: TEXT }}
            dir="rtl"
          >
            גישת <span style={{ color: BRAND }}>80:20</span>
          </motion.h2>
          <div className="hidden lg:block">
            <PhaseHeading>גישת<br/><Accent>80:20</Accent></PhaseHeading>
          </div>

          {/* Sub-headline */}
          <motion.p
            variants={item}
            style={{ fontSize: 'clamp(0.85rem, 3vw, 2rem)', color: '#777', lineHeight: 1.4 }}
            className="mb-2 lg:mb-4"
          >
           השיטה שמאפשרת לרדת במשקל בלי להפוך את החיים לדיאטה
          </motion.p>
          

          <motion.div variants={item} className="flex flex-col gap-2">
            <div className="bg-white/65 backdrop-blur-sm rounded-xl p-2.5 lg:rounded-2xl lg:p-4 border border-white/60" dir="rtl">
              <p className="font-bold mb-1" style={{ color: '#333', fontSize: 'clamp(0.82rem, 3vw, 1.5rem)' }}>ה-80% שלך</p>
              <p style={{ color: '#666', lineHeight: 1.55, fontSize: 'clamp(0.82rem, 3vw, 1.5rem)' }}>
                אוכל שמזין את הגוף שלך — ירקות, חלבונים, פחמימות טובות, שומנים בריאים ומים.<br></br>
                 זה הבסיס שמאפשר לך ליהנות מהשאר.
              </p>
            </div>
            <div className="rounded-xl p-2.5 lg:rounded-2xl lg:p-4" style={{ background: '#C49A7A18', border: '1px solid #C49A7A40' }} dir="rtl">
              <p className="font-bold mb-1" style={{ color: '#A0745A', fontSize: 'clamp(0.82rem, 3vw, 1.5rem)' }}>ה-20% שלך</p>
              <p style={{ color: '#666', lineHeight: 1.55, fontSize: 'clamp(0.82rem, 3vw, 1.5rem)' }}>
                אוכל שמזין את הנשמה שלך — הפיצה של שישי, הגלידה בחופשה. <br></br>
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
        boxShadow: [
          '0 48px 100px rgba(0,0,0,0.48)',
          '0 16px 32px rgba(0,0,0,0.22)',
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
            alt="יומן אכילה - מקרואים"
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
          background: BRAND,
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
    <motion.div className="absolute inset-0" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* Desktop: phone mockup floats left */}
      <motion.div
        className="absolute hidden lg:flex items-center justify-center pointer-events-none z-10"
        style={{ left: '6%', top: '30%', transform: 'translateY(-50%)' , height: '60vh', width: '25vw' }}
        initial={{ opacity: 0, y: 40, scale: 1.86 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.1, ease: [0.34, 1.2, 0.64, 1] }}
      >
        <AppPhoneMockup />
      </motion.div>

      <ContentPanel mobilePt="pt-8" mobilePb="pb-6">
        <motion.div variants={stagger} initial="initial" animate="animate">

          {/* Mobile: compact phone mockup — scaled 0.62, wrapper clips leftover
              layout height so the phone never overlaps the heading below */}
          <motion.div variants={item} className="lg:hidden mb-2 flex justify-center"
            style={{ height: '258px', overflow: 'hidden', paddingTop: '10px' }}>
            <div style={{ transform: 'scale(0.62)', transformOrigin: 'top center', flexShrink: 0 }}>
              <AppPhoneMockup compact />
            </div>
          </motion.div>

          <PhaseHeading>יומן אכילה<br/><Accent>שיתוף הדיאטנית המלווה באפליקציה שלנו</Accent></PhaseHeading>

          <motion.p variants={item} className="text-sm lg:text-xl text-gray-600 leading-snug lg:leading-relaxed mb-2 lg:mb-5" dir="rtl">
            כבר בפגישה הראשונה נבנה עבורך תפריט אישי, גמיש, מפורט עם הנחיות ושפת תזונה ברורה. <br className="hidden lg:block"></br>
            באפליקציה שלנו תוכלי לצלם את הארוחות ולשתף ישירות עם התזונאית.
          </motion.p>

          <motion.div variants={item} className="flex flex-col gap-1.5 lg:gap-2.5">
            {[
              'תפריט אישי מותאם כולל הנחיות מדויקות',
              'צילום יומני אכילה באפליקציה ושיתוף ישיר עם הדיאטנית',
              'פידבק כתוב מהדיאטנית בכל יום בווצאפ',
              'מענה לשאלות ופתרון קשיים שעולים לאורך התהליך',
              'הרצאות תזונה אונליין לקהילה של קים',
              'קיטים דיגיטליים עם מגוון מתכונים קלים, טעימים ופרקטיים — לגיוון התזונה ביומיום',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 lg:gap-3" dir="rtl">
                <CheckCircle2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" style={{ color: LIVEAT_GREEN }} />
                <span className="text-[13px] lg:text-lg leading-snug font-semibold text-[#333]">{f}</span>
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
        boxShadow: [
          '0 48px 100px rgba(0,0,0,0.48)',
          '0 16px 32px rgba(0,0,0,0.22)',
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
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, color: '#fff', fontSize: compact ? 10 : 12, fontWeight: 700, lineHeight: 1.2 }}>קים גפסון</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4CAF50', flexShrink: 0 }} />
                <p style={{ margin: 0, color: '#80CBC4', fontSize: compact ? 8 : 9.5, lineHeight: 1 }}>מחוברת עכשיו</p>
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
                      <span style={{ fontSize: compact ? 6 : 7.5, color: '#aaa' }}>{CHAT_TIMES[i]}</span>
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
              fontSize: compact ? 7.5 : 9, color: '#bbb',
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
    <motion.div className="absolute inset-0" variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ── Desktop: iPhone WA mockup in left column ── */}
      <motion.div
        className="absolute hidden lg:flex items-center justify-center pointer-events-none z-10"
        style={{ left: '8%', top: '30%', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0, y: 36, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.08, ease: [0.34, 1.2, 0.64, 1] }}
      >
        <WaPhoneMockup />
      </motion.div>

      <ContentPanel mobilePt="pt-8" mobilePb="pb-6">
        <motion.div variants={stagger} initial="initial" animate="animate">

          {/* Mobile: compact WA mockup — scaled 0.62, wrapper clips leftover
              layout height so the phone never overlaps the heading below */}
          <motion.div variants={item} className="lg:hidden flex justify-center mb-2"
            style={{ height: '258px', overflow: 'hidden', paddingTop: '10px' }}>
            <div style={{ transform: 'scale(0.62)', transformOrigin: 'top center', flexShrink: 0 }}>
              <WaPhoneMockup compact />
            </div>
          </motion.div>

          <PhaseHeading>ליווי יומיומי<br/><Accent>וכלים שנשארים איתך</Accent></PhaseHeading>

          <motion.p variants={item} className="text-sm lg:text-xl text-gray-600 leading-snug lg:leading-relaxed mb-2 lg:mb-5" dir="rtl">
           בתוכנית שלנו את לא רק מקבלת תפריט{' '}
            <strong style={{ color: BRAND }}>את לומדת על התזונה שלך</strong>{' '}<br className="hidden lg:block"></br>
            כך שתדעי{' '}
            <strong style={{ color: BRAND }}>לנהל אותה</strong>,
            {' '}גם{' '}
            <strong style={{ color: BRAND }}>שהתהליך מסתיים</strong>.
          </motion.p>
          <motion.div variants={item} className="flex flex-col gap-1.5 lg:gap-2.5 mb-2 lg:mb-7">
            {['ליווי יומיומי בווצאפ', 'קהילת תמיכה סגורה (בתוכנית נבחרת)', 'גיוון וגמישות מלאה בתפריט', 'פגישות מעקב אישיות חודשיות עם תזונאית קלינית'].map((f) => (
              <div key={f} className="flex items-center gap-2.5 lg:gap-3" dir="rtl">
                <CheckCircle2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" style={{ color: BRAND }} />
                <span className="text-[13px] lg:text-lg leading-snug font-semibold text-[#333]">{f}</span>
              </div>
            ))}
          </motion.div>
          <motion.div variants={item}>
            <motion.a
              href="https://wa.link/ntdrz1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="קביעת ייעוץ חינם עם קים בווצאפ"
              className="block sm:inline-block"
              whileHover={{ y: -4, scale: 1.05, filter: 'drop-shadow(0 8px 24px rgba(139,127,75,0.50))' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            >
              <Button
                className="rounded-full px-8 py-3 lg:py-6 text-base lg:text-lg font-bold text-white min-h-[44px]
                           shadow-[0_4px_20px_rgba(139,127,75,0.35)] w-full sm:w-auto"
                style={{ background: BRAND }}
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
export default function ScrollStorySection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const [phase, setPhase] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // Hysteresis: switching phase backward requires scrolling a bit PAST the
    // boundary. Without it, hovering right at a boundary while reversing
    // direction swaps phases instantly (full enter/exit animation) — which
    // reads as a "jump" on mobile.
    const BACK_LAG = 0.015;
    setPhase(p => {
      let next = p;
      while (next < PHASE_STARTS.length - 1 && v >= PHASE_STARTS[next + 1]) next++;
      while (next > 0 && v < PHASE_STARTS[next] - BACK_LAG) next--;
      return next;
    });
  });

  // ── Spring config for silky-smooth fade / scale on Kim and video layer ──
  const springCfg = { stiffness: 60, damping: 20, restDelta: 0.001 };

  // Kim's image — fades mid-scroll; hidden during video (phases 2→3), returns in phase 3+ (Ring)
  const _kimOpacity = useTransform(
    scrollYProgress,
    [0, 0.13, 0.16, 0.24, 0.29, 0.52, 0.57, 0.75, 0.80, 1],
    [1,    1,  0.2,  0.2,    0,    0,  0.2,  0.2,    1,  1]
  );
  const kimOpacity = useSpring(_kimOpacity, springCfg);
  const _kimScale  = useTransform(scrollYProgress, [0, 0.14, 0.85, 1], [1, 0.86, 0.86, 1]);
  const kimScale   = useSpring(_kimScale, springCfg);
  const kimY       = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Video overlay — covers phase 2 (Plate) only; fades out completely before PhaseRing (0.43)
  const plateScrollProgress = useTransform(scrollYProgress, [0.29, 0.40], [0, 1]);
  const _videoOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.30, 0.39, 0.43],
    [0, 1, 1, 0]
  );
  const videoOpacity = useSpring(_videoOpacity, springCfg);

  // Phase 3 is PhaseRing (PhaseExploded removed)
  const phases = [PhaseHero, PhaseBusyLife, PhasePlate, PhaseRing, PhaseApp, PhaseSupport];
  const PhaseComponent = phases[phase];

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      style={{ height: '560svh', scrollSnapAlign: 'none', scrollSnapStop: 'normal', position: 'relative' }}
    >
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: '100svh', background: BG }}
      >
        {/* ── Kim desktop — physically LEFT, always behind text column ── */}
        <motion.div
          className="absolute inset-y-0 left-0 hidden lg:flex items-end justify-center pointer-events-none z-10"
          style={{ width: '80%', opacity: kimOpacity, y: kimY, scale: kimScale }}
        >
          <img
            src={kimHero}
            alt="קים גפסון"
            className="w-full h-full object-contain object-bottom"
          />
        </motion.div>

        {/* ── Kim mobile — top strip (fades out when video appears) ── */}
        {/* pt-3 (12px) gives a little breathing room from the device top edge.
            h-36 (144px) keeps Kim visible but compact → bottom of strip = 156px,
            matching ContentPanel's pt-[156px] so text starts right below. */}
        <motion.div
          className={`lg:hidden absolute top-0 left-0 right-0 flex justify-center pt-3 z-10 pointer-events-none ${phase >= 4 ? 'hidden' : ''}`}
          style={{ opacity: kimOpacity }}
        >
          {/* Hidden in phases 4-5 (App/Support): on mobile the phone mockups own
              the top strip, and Kim behind them muddied the heading legibility */}
          <img src={kimHero} alt="קים גפסון" className="object-contain object-bottom w-auto" style={{ height: '36svh', maxHeight: '320px' }} />
        </motion.div>

        {/* ── Video layer — responsive ──────────────────────────────────────────
             Mobile  : top strip — 48vh so the plate fills a meaningful portion
             Desktop : left column, 52% wide, full height                       */}
        <motion.div
          className="absolute pointer-events-none
                     top-0 left-0 right-0 h-[44svh]
                     lg:inset-y-0 lg:right-auto lg:h-auto lg:pt-0 lg:w-[52%]"
          style={{ opacity: videoOpacity, zIndex: 11 }}
        >
          <ScrollVideoPlayer plateProgress={plateScrollProgress} />
        </motion.div>

        {/* ── WhatsApp testimonial bubbles – phase 0 only (z-9 = behind Kim z-10) ── */}
        <AnimatePresence>
          {phase === 0 && (
            <>
              {/* Desktop: far-left beige strip */}
              <motion.div key="wab-d0" className="hidden lg:block absolute pointer-events-none"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                style={{ zIndex: 9, top: '12%', left: '1%' }}>
                <div style={{ transform: 'rotate(-2deg)' }}><WaBubble {...waChatsLeft[0]} /></div>
              </motion.div>
              <motion.div key="wab-d1" className="hidden lg:block absolute pointer-events-none"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                style={{ zIndex: 9, bottom: '20%', left: '1%' }}>
                <div style={{ transform: 'rotate(1.5deg)' }}><WaBubble {...waChatsLeft[1]} /></div>
              </motion.div>
              <motion.div key="wab-d2" className="hidden lg:block absolute pointer-events-none"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                style={{ zIndex: 9, top: '24%', left: '16%' }}>
                <div style={{ transform: 'rotate(2deg)' }}><WaBubble {...waChatsRight[0]} /></div>
              </motion.div>
              <motion.div key="wab-d3" className="hidden lg:block absolute pointer-events-none"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                style={{ zIndex: 9, bottom: '30%', left: '14%' }}>
                <div style={{ transform: 'rotate(-1.5deg)' }}><WaBubble {...waChatsRight[1]} /></div>
              </motion.div>

              {/* Mobile: mini chips beside Kim */}
              <motion.div key="wab-m0" className="lg:hidden absolute pointer-events-none"
                initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                style={{ zIndex: 9, top: '7vh', left: '2px', transform: 'scale(0.72)', transformOrigin: 'top left' }}>
                <div style={{ transform: 'rotate(-2deg)' }}><WaBubble {...waChatsLeft[0]} /></div>
              </motion.div>
              <motion.div key="wab-m1" className="lg:hidden absolute pointer-events-none"
                initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                style={{ zIndex: 9, top: '17vh', right: '2px', transform: 'scale(0.72)', transformOrigin: 'top right' }}>
                <div style={{ transform: 'rotate(1.5deg)' }}><WaBubble {...waChatsRight[0]} /></div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Phase content ── */}
        <div className="relative z-20 h-full">
          <AnimatePresence mode="sync">
            <PhaseComponent key={`phase-${phase}`} />
          </AnimatePresence>
        </div>

        {/* ── Phase dots — layout-animated pill expansion ── */}
        <div className="absolute bottom-4 md:bottom-[52px] left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {phases.map((_, i) => (
            <motion.div
              key={i}
              layout
              className="rounded-full h-1.5"
              animate={{
                width:      i === phase ? 22 : 6,
                background: i === phase ? BRAND : `${BRAND}40`,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            />
          ))}
        </div>

        {/* ── Scroll hint (phase 0) ── */}
        <AnimatePresence>
          {phase === 0 && (
            <motion.div
              className="absolute bottom-12 md:bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-30"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <span className="text-sm font-medium" style={{ color: `${BRAND}80` }}>גללי לגלות</span>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}>
                <ChevronDown className="w-5 h-5" style={{ color: `${BRAND}70` }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom banner ── */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-40" style={{ background: `${BRAND}ee` }}>
          <p className="text-white text-center text-sm md:text-base font-medium py-3 px-6">
           תוכנית תזונה מדויקת וממוקדת, ליווי תזונתי אישי עם דיאטנית קלינית, אפליקציה תומכת וקהילה סגורה
          </p>
        </div>
      </div>
    </section>
  );
}
