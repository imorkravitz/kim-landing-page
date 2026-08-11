import React, {useRef, useEffect, useState} from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
// @ts-ignore
import stethoscopeVideo from '../../assets/videos/stethoscope_animated_2.mp4';

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

      /* The source is 960x540. Full-bleed on a desktop that is 1425 device
         pixels wide means a 1.5x upscale (worse on a retina laptop), and no
         re-encode can invent those pixels — a higher-resolution export of the
         original is the only real fix. High-quality smoothing is what is
         available meanwhile; it costs nothing and visibly softens the
         stair-stepping the default bilinear filter leaves behind. */
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fit by WIDTH always — guarantees the full horizontal extent of the
      // video (where the stethoscope sits) is visible on every device,
      // mobile included. Object-cover (fit by height) on a narrow/tall
      // mobile viewport forced a severe horizontal crop, hiding most of
      // the stethoscope; a fixed posX guess couldn't reliably compensate.
      // Cropping only vertically (top/bottom) is safe since the subject
      // is vertically centered in the source video.
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
          src={shouldLoad ? stethoscopeVideo : undefined}
          muted
          playsInline
          preload="auto"
          style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}
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
