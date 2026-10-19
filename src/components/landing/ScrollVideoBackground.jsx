import { useRef, useEffect, useState } from 'react';
import { useScroll } from 'framer-motion';
import useScrubVideo from '@/hooks/useScrubVideo';
/* Two encodes of the same master, because one file cannot be right for both.
   The canvas paints the video fitted to the viewport WIDTH, so a 375px phone
   at dpr 2 needs ~750 pixels across while a 1440px desktop needs ~2880.
   Both are every-frame-a-keyframe H.264 (the delivered master is 10-bit HEVC,
   which Chrome and Firefox do not reliably decode), with the studio backdrop
   lifted to pure white so the frame edges disappear into the white section. */
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

  /* This video sits roughly 5,000px down the page, so it is fetched once the
     section is within two viewports rather than racing the hero at first
     paint. */
  const [shouldLoad, setShouldLoad] = useState(false);

  /* Chosen once, from the widest the canvas could need on this device. */
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
    // 0 when the wrapper enters at the viewport bottom, 1 when it leaves the top
    offset: ['start end', 'end start'],
  });

  /* Fit by WIDTH on every device: the stethoscope travels across the whole
     frame (right edge at the start, left edge at the end), so any framing that
     fills the height would crop it out of its own journey. */
  const { videoRef, canvasRef } = useScrubVideo({
    src: shouldLoad ? videoSrc : null,
    progress: scrollYProgress,
    fit: 'width',
    fill: '#ffffff',
    tau: 0.12,
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
