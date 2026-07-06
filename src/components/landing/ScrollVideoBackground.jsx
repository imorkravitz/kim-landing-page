import React, { useRef, useEffect } from 'react';
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

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    // progress = 0 when wrapper first appears at viewport bottom
    // progress = 1 when wrapper fully exits from viewport top
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    video.pause();
    video.currentTime = 0;

    // ── Paint ────────────────────────────────────────────────────────────────
    const paint = () => {
      if (video.readyState < 2) { pendingRef.current = false; return; }
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) { pendingRef.current = false; return; }

      // DPR-aware canvas sizing — sharp on retina / HiDPI
      const dpr  = window.devicePixelRatio || 1;
      const cssW = canvas.offsetWidth  || window.innerWidth;
      const cssH = canvas.offsetHeight || window.innerHeight;
      const physW = Math.round(cssW * dpr);
      const physH = Math.round(cssH * dpr);
      if (canvas.width !== physW || canvas.height !== physH) {
        canvas.width  = physW;
        canvas.height = physH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // object-cover: fills full 100vw × 100vh, edges crop
      const scale = Math.max(cssW / vw, cssH / vh);
      const dw = Math.round(vw * scale);
      const dh = Math.round(vh * scale);
      // Stethoscope sits on the right side of the video frame.
      // On mobile (<768px) shift the crop window right (posX→1) so it stays
      // visible throughout the scroll, matching the desktop experience.
      const posX = cssW < 768 ? 0.88 : 0.5;
      const dx = Math.round((cssW - dw) * posX);
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
    video.load(); // explicit — some browsers defer buffering of display:none videos

    // Repaint on resize / orientation change (mobile chrome bar)
    const ro = new ResizeObserver(() => paint());
    ro.observe(canvas);

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
  }, []);

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
          src={stethoscopeVideo}
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
        {/* Mobile-only white fade — sits above the canvas but inside z:-1 layer,
            softening the video so overlaid text stays fully legible */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: 'rgba(255,255,255,0.72)', pointerEvents: 'none' }}
        />
      </div>

      {/* Content — above canvas via natural DOM order over z-index:-1 */}
      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}
