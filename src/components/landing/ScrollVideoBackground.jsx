import React, {useRef, useEffect, useState} from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
/* Two encodes of the same 1920x1080 master, because one file cannot be right
   for both. The canvas paints the video fitted to the viewport WIDTH, so a
   375px phone at dpr 2 needs ~750 pixels across while a 1440px desktop needs
   ~2880 — the old single 960px file was fine on the phone and stretched 1.5x
   on the desktop, which is what made it look soft there.
   Both are encoded with every frame as a keyframe (241/241) so seeking stays
   instant, and measured at SSIM 0.998 against the master. */
// @ts-ignore
import stethoscope1920 from '../../assets/videos/stethoscope-1920.mp4';
// @ts-ignore
import stethoscope1280 from '../../assets/videos/stethoscope-1280.mp4';

/**
 * Shared scroll-driven video background — ProblemSolution + Features + Process.
 *
 * Design:
 *   • White background (#ffffff) — video renders on white; white video pixels = white BG (seamless)
 *   • object-cover (Math.max) always — fills 100vw × 100vh on ALL devices
 *   • No mix-blend-mode — not needed on white BG (multiply(white,white)=white anyway)
 *   • Sticky canvas z-index:-1 stays pinned while content scrolls above it
 *   • offset ['start end','end start'] — animation starts the moment section enters viewport
 *
 * Stacking (inside isolation:'isolate' wrapper):
 *   canvas z-index:-1  →  behind everything
 *   content z-index:auto → above canvas
 */

export default function ScrollVideoBackground({ children }) {
  const wrapperRef = useRef(null);
  const canvasRef  = useRef(null);
  const videoRef   = useRef(null);
  const targetRef  = useRef(0);
  const smoothRef  = useRef(0);
  const pendingRef = useRef(false);
  const rafRef     = useRef(null);

  /* This video sits roughly 5,000px down the page, but preload="auto" had it
     racing the hero for bandwidth at first paint — a megabyte spent before the
     visitor had seen anything. It is fetched once the section is within two
     viewports instead, which on any real connection is far enough ahead to be
     buffered by the time it is scrubbed. */
  const [shouldLoad, setShouldLoad] = useState(false);

  /* Chosen once, from the widest the canvas could need on this device. Read
     synchronously so the correct file is requested on the first attempt
     rather than swapped after a render. */
  const [videoSrc] = useState(() => {
    if (typeof window === 'undefined') return stethoscope1280;
    const needed = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
    return needed > 1280 ? stethoscope1920 : stethoscope1280;
  });

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') { setShouldLoad(true); return; }

    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShouldLoad(true); io.disconnect(); } },
      { rootMargin: '200% 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    // progress = 0 when wrapper first appears at viewport bottom
    // progress = 1 when wrapper fully exits from viewport top
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    // Keyed on shouldLoad so the paint listeners are attached only once a src
    // exists — otherwise nothing would ever repaint the canvas.
    if (!video || !canvas || !shouldLoad) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    video.pause();
    video.currentTime = 0;

    // ── Paint ────────────────────────────────────────────────────────────────
    const paint = () => {
      if (video.readyState < 2) { pendingRef.current = false; return; }
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) { pendingRef.current = false; return; }

      /* Size from the CONTAINER, never from the canvas itself.
         Reading canvas.offsetWidth/Height here and then writing canvas.width/
         height is a feedback loop: those attributes are the element's intrinsic
         size, so writing them can change its own layout box, which re-triggers
         the ResizeObserver below, which paints again. In practice it settled
         with a 375x357 backing store on a devicePixelRatio-2 screen — i.e. the
         video was being drawn at half resolution and then upscaled by the
         browser, which is what made this look soft on phones and retina
         displays. Measuring the parent breaks the loop. */
      const box  = (canvas.parentElement || canvas).getBoundingClientRect();
      const cssW = Math.round(box.width)  || window.innerWidth;
      const cssH = Math.round(box.height) || window.innerHeight;

      /* Capped at 2. Beyond that the extra pixels are invisible on a
         full-bleed background video but the per-frame fill+draw cost keeps
         rising, and this repaints on every scroll frame. */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const physW = Math.round(cssW * dpr);
      const physH = Math.round(cssH * dpr);
      if (canvas.width !== physW || canvas.height !== physH) {
        canvas.width  = physW;
        canvas.height = physH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      /* ── Framing: fit by WIDTH, on every device ───────────────────────────
         This is the original rule and it is restored deliberately. The
         stethoscope is not parked in the middle of the frame — measured on the
         master, it occupies x 75-95% at the start, sweeps the full width around
         the two-thirds mark, and ends at x 0-31%. Fitting the width is the only
         framing that keeps the WHOLE animation on screen; anything that fills
         the height has to crop horizontally, and then the subject leaves frame
         for part of its own journey.

         I briefly replaced this on mobile with a height-fill that panned to
         follow the subject. It made the stethoscope bigger and it tracked
         correctly, but bigger was never the requirement — seeing all of it was.
         Reverted.

         What stays from that work is the part that mattered: the source is now
         1920x1080 with a 1280 variant for phones, so this fit no longer has to
         upscale a 960px file (1.48x on desktop) to fill the canvas. */
      const scale = cssW / vw;
      const dw = Math.round(vw * scale);
      const dh = Math.round(vh * scale);
      const dx = 0;
      const dy = Math.round((cssH - dh) / 2);

      // White fill — video's white areas are seamlessly invisible on white BG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, cssW, cssH);
      ctx.drawImage(video, 0, 0, vw, vh, dx, dy, dw, dh);

      pendingRef.current = false;
    };

    video.addEventListener('seeked',         paint);

    /* iOS decoder priming.
       Safari on iOS will not produce a decodable frame for a video that has
       never played: drawImage of a paused, never-played element yields
       nothing, so the canvas stays blank on iPhone while every desktop
       browser is fine. Playing muted+playsInline is allowed without a user
       gesture, so a play() immediately followed by pause() gets the first
       frame decoded and everything after that scrubs normally.
       The touch fallback covers the case where the autoplay attempt is
       rejected — the first tap anywhere primes it instead. */
    let primed = false;
    const prime = () => {
      if (primed) return;
      const p = video.play();
      if (p && typeof p.then === 'function') {
        p.then(() => { primed = true; video.pause(); video.currentTime = 0; paint(); })
         .catch(() => { /* blocked — the touch handler below will retry */ });
      } else {
        primed = true; try { video.pause(); } catch {}
      }
    };
    video.addEventListener('loadedmetadata', prime);
    if (video.readyState >= 1) prime();
    const primeOnTouch = () => { prime(); };
    window.addEventListener('touchstart', primeOnTouch, { once: true, passive: true });

    /* Mobile needs an explicit kick, desktop does not.
       These <video> elements are 1px and effectively invisible, and iOS and
       Android Chrome routinely decline to buffer those from preload="auto"
       alone — which is why removing video.load() made the canvas render blank
       on phones while desktop kept working. Calling load() unconditionally is
       what caused the file to be fetched twice, so it is called only if the
       element has genuinely not started after a beat. */
    const kick = setTimeout(() => {
      if (video.readyState === 0) video.load();
    }, 800);
    video.addEventListener('loadeddata',     paint);
    video.addEventListener('canplaythrough', paint);

    // Observe the container, not the canvas — see the note in paint() about
    // why watching the canvas while resizing it feeds back on itself.
    const ro = new ResizeObserver(() => paint());
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // ── RAF scrub loop ───────────────────────────────────────────────────────
    // pendingSince: watchdog — if a seek never fires `seeked` (unbuffered
    // region, browser quirk), the pending flag would freeze the scrub forever.
    let pendingSince = 0;
    const tick = () => {
      if (pendingRef.current && performance.now() - pendingSince > 250) {
        pendingRef.current = false; // seek lost — recover instead of freezing
      }
      if (!pendingRef.current) {
        const diff = targetRef.current - smoothRef.current;
        if (Math.abs(diff) > 0.0004) {
          smoothRef.current += diff * 0.18;        // fast enough for mobile scrolling
          const v = Math.max(0, Math.min(1, smoothRef.current));
          if (isFinite(video.duration) && video.duration > 0) {
            const t = v * video.duration;
            if (Math.abs(video.currentTime - t) > 1 / 60) {
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
      clearTimeout(kick);
      video.removeEventListener('loadedmetadata', prime);
      window.removeEventListener('touchstart', primeOnTouch);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      video.removeEventListener('seeked',         paint);
      video.removeEventListener('loadeddata',     paint);
      video.removeEventListener('canplaythrough', paint);
    };
  }, [shouldLoad]);

  useMotionValueEvent(scrollYProgress, 'change', (rawV) => {
    targetRef.current = Math.max(0, Math.min(1, rawV));
  });

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        isolation: 'isolate', // stacking context — keeps z-index:-1 canvas behind content
        background: '#ffffff', // white — shown before video loads + fills margins if any
      }}
    >
      {/* Sticky canvas — pinned at top, z-index:-1 = behind all content */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          marginBottom: '-100vh', // collapses so content starts at same Y
          zIndex: -1,
          width: '100%',          // 100% safe for iOS Safari sticky (no overflow:hidden needed)
          pointerEvents: 'none',
        }}
      >
        <video
          ref={videoRef}
          src={shouldLoad ? videoSrc : undefined}
          muted
          playsInline
          autoPlay
          preload="auto"
          style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '1px', pointerEvents: 'none', overflow: 'hidden' }}
        />
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Content — above canvas via natural DOM order over z-index:-1 */}
      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}
