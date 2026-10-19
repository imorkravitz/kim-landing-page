import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { trackCTA } from '@/lib/analytics';
import ResponsiveImage from '@/components/ui/responsive-image';
// @ts-ignore
import kimLogo from '../../assets/icons/KIM - LOGO 2.png';

/*
 * Page navigation: a scroll-spy chip bar.
 *
 * Adapted from 21st.dev "Scroll Spy" (@ddoemonn): the active-section measure,
 * the click-to-scroll with a lock that ignores the spy until the smooth
 * scroll lands, and the sliding pill. Changed for this page: RTL, brand
 * colours, a fixed header that appears once the hero is behind you, the
 * logo and consult CTA on desktop, and a horizontally scrolling strip on
 * phones that keeps the active chip in view.
 */

const PILL = { type: 'spring', stiffness: 520, damping: 34, mass: 0.45 };
const RELEASE = 900;
const BRAND_SURFACE = '#807545';

function useScrollSpy({ sections, offset }) {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(() => sections[0]?.id ?? '');
  const list = useRef(sections);
  list.current = sections;
  const frame = useRef(0);
  const lock = useRef(null);
  const lockTimer = useRef(null);

  const measure = useCallback(() => {
    const viewport = window.innerHeight;
    const max = document.documentElement.scrollHeight - viewport;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
    // The trigger line slides down the viewport as the page nears its end,
    // so short final sections can still become active.
    const line = offset + ratio * Math.max(0, viewport - offset - 1);
    let current = '';
    for (const item of list.current) {
      const node = document.getElementById(item.id);
      if (!node) continue;
      if (!current) current = item.id;
      if (node.getBoundingClientRect().top <= line + 1) current = item.id;
    }
    return current;
  }, [offset]);

  const release = useCallback(() => {
    lock.current = null;
    if (lockTimer.current) { clearTimeout(lockTimer.current); lockTimer.current = null; }
  }, []);

  const sync = useCallback(() => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const next = measure();
      if (!next) return;
      if (lock.current) { if (lock.current === next) release(); return; }
      setActiveId((prev) => (prev === next ? prev : next));
    });
  }, [measure, release]);

  useEffect(() => {
    const abandon = () => { if (lock.current) release(); };
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    window.addEventListener('wheel', abandon, { passive: true });
    window.addEventListener('touchstart', abandon, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(document.documentElement);
    sync();
    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      window.removeEventListener('wheel', abandon);
      window.removeEventListener('touchstart', abandon);
      ro.disconnect();
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
  }, [sync, release]);

  const scrollTo = useCallback((id) => {
    const node = document.getElementById(id);
    if (!node) return;
    lock.current = id;
    setActiveId(id);
    // Story scenes reserve their own room for this bar, so they land flush.
    const flush = list.current.find((s) => s.id === id)?.flush;
    // Layout position, not the painted one: sections below the fold are still
    // shifted down by their entrance animation (AnimatedSection, y: 30) when
    // measured, and would land 30px off once it plays.
    let layoutTop = 0;
    for (let n = node; n; n = n.offsetParent) layoutTop += n.offsetTop;
    const top = Math.max(0, layoutTop - (flush ? 0 : offset) + 1);
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '-1');
    node.focus({ preventScroll: true });
    if (lockTimer.current) clearTimeout(lockTimer.current);
    // Long jumps on this page take more than a second; keep the lock until
    // the scroll actually stops moving.
    let last = -1;
    const settle = () => {
      if (window.scrollY === last) { release(); sync(); return; }
      last = window.scrollY;
      lockTimer.current = setTimeout(settle, 160);
    };
    lockTimer.current = setTimeout(settle, RELEASE);
  }, [offset, reduced, release, sync]);

  const getLinkProps = useCallback((id) => ({
    href: `#${id}`,
    'aria-current': id === activeId ? 'location' : undefined,
    onClick: (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      scrollTo(id);
    },
  }), [activeId, scrollTo]);

  return { activeId, getLinkProps };
}

/** Visible once the hero is mostly behind the visitor. */
function usePastHero(fraction = 0.6) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setPast(window.scrollY > window.innerHeight * fraction);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [fraction]);
  return past;
}

export default function SectionNav({ sections, offset = 64 }) {
  const reduced = useReducedMotion();
  const { activeId, getLinkProps } = useScrollSpy({ sections, offset });
  const visible = usePastHero();
  const pillId = useId();
  const chips = useRef(new Map());
  const strip = useRef(null);

  // Keep the active chip in view on the phone strip, without moving the page.
  useEffect(() => {
    const chip = chips.current.get(activeId);
    const box = strip.current;
    if (!chip || !box) return;
    const c = chip.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    if (c.left < b.left || c.right > b.right) {
      box.scrollBy({ left: c.left + c.width / 2 - (b.left + b.width / 2), behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [activeId, reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          dir="rtl"
          className="fixed inset-x-0 top-0 z-[60]"
          initial={reduced ? { opacity: 0 } : { y: -72, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: -72, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="border-b"
            style={{
              background: 'rgba(233, 228, 206, 0.86)',
              borderColor: 'rgba(139, 127, 75, 0.16)',
              WebkitBackdropFilter: 'saturate(1.4) blur(14px)',
              backdropFilter: 'saturate(1.4) blur(14px)',
            }}
          >
            <div className="mx-auto max-w-7xl h-14 lg:h-16 flex items-center gap-4 px-3 lg:px-6">
              {/* The logo file is mostly transparent padding (the mark fills
                  ~66% of its width, ~29% of its height), so the image is drawn
                  larger than its box and overflows it invisibly: the mark
                  itself reads at full size without making the bar taller. */}
              <a
                {...getLinkProps(sections[0].id)}
                className="shrink-0 flex items-center justify-center w-[72px] h-10 lg:w-[104px] lg:h-12"
                aria-label="קים גפסון, לראש העמוד"
              >
                <ResponsiveImage
                  src={kimLogo}
                  stem="/src/assets/icons/kim-logo"
                  sizes="160px"
                  width="640"
                  height="640"
                  alt=""
                  className="max-w-none w-[110px] h-[110px] lg:w-[158px] lg:h-[158px] pointer-events-none"
                />
              </a>

              <nav aria-label="ניווט בעמוד" className="flex-1 min-w-0 self-stretch flex">
                {/* Hit areas run the full height of the bar and touch each
                    other, so the pointer is a hand everywhere along the strip.
                    Hover feedback lives on an inner layer: it may grow, but the
                    link's own box never moves, so hovering cannot make the
                    element slide out from under the cursor. */}
                <ol
                  ref={strip}
                  className="flex-1 flex items-stretch overflow-x-auto lg:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{ WebkitMaskImage: 'linear-gradient(to left, transparent 0, #000 12px, #000 calc(100% - 12px), transparent 100%)' }}
                >
                  {sections.map((section) => {
                    const active = section.id === activeId;
                    return (
                      <li
                        key={section.id}
                        ref={(el) => { if (el) chips.current.set(section.id, el); else chips.current.delete(section.id); }}
                        className="relative shrink-0 flex"
                      >
                        {active && (
                          <motion.span
                            layoutId={reduced ? undefined : pillId}
                            aria-hidden
                            transition={PILL}
                            className="absolute inset-x-0.5 top-1/2 h-9 -mt-[18px] rounded-full pointer-events-none"
                            style={{ background: BRAND_SURFACE }}
                          />
                        )}
                        <a
                          {...getLinkProps(section.id)}
                          className="group relative flex items-center px-0.5 cursor-pointer outline-none focus-visible:[&>span]:ring-2 focus-visible:[&>span]:ring-[#6D6339]"
                        >
                          <span
                            className={`relative flex h-9 items-center px-3.5 rounded-full text-[15px] whitespace-nowrap
                                        transition-[transform,background-color,color] duration-200 ease-out
                                        motion-safe:group-hover:scale-[1.02] motion-safe:group-active:scale-[0.98]
                                        ${active ? 'text-white' : 'text-[#6D6339] group-hover:text-[#4A4326] group-hover:bg-[#807545]/[0.14]'}`}
                          >
                            {/* Both weights share one grid cell; the bold copy
                                holds the width, so a chip never resizes when it
                                becomes active and nothing shifts under the mouse. */}
                            <span className="grid">
                              <span aria-hidden className="invisible col-start-1 row-start-1 font-bold">{section.label}</span>
                              <span className={`col-start-1 row-start-1 text-center ${active ? 'font-bold' : 'font-medium'}`}>
                                {section.label}
                              </span>
                            </span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <a
                href="https://wa.link/ntdrz1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTA('whatsapp_consult', 'navbar')}
                // Grows in place rather than lifting: a button that moves up on
                // hover slides out from under the cursor at its lower edge.
                className="hidden lg:inline-flex shrink-0 items-center h-10 rounded-full px-5 text-[15px] font-bold text-white cursor-pointer transition-[background-color,transform] duration-200 ease-out bg-[#807545] hover:bg-[#6D6339] motion-safe:hover:scale-[1.02] active:scale-[0.98]"
              >
                לקביעת ייעוץ התאמה חינם
              </a>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
