import { useEffect, useRef } from 'react';
import { useMotionValueEvent } from 'framer-motion';

/**
 * Scroll-scrubbed image sequence, painted onto a canvas.
 *
 * The phone counterpart of useScrubVideo. Seeking a <video> on iOS Safari is
 * slow and uneven: every currentTime write is an async decode, so a scrub
 * stutters and trails the finger. Here every frame is a decoded image held in
 * memory, so any scroll position maps to a frame instantly, in both
 * directions. Between two frames the next one is blended in by the fraction,
 * which is what makes ~50 frames read as continuous motion.
 *
 * Frames load once the canvas is within two screens, first frame first, the
 * rest in order; until a frame arrives the nearest loaded one is drawn.
 *
 * @param {object}   opts
 * @param {string[]} opts.frames   frame URLs in order
 * @param {import('framer-motion').MotionValue<number>} opts.progress 0..1
 * @param {string}   [opts.fill]   colour painted under the frame
 * @param {number}   [opts.tau]    smoothing time constant in seconds
 */
export default function useFrameSequence({ frames, progress, fill = '#ffffff', tau = 0.07 }) {
  const canvasRef = useRef(null);
  const targetRef = useRef(0);

  useMotionValueEvent(progress, 'change', (v) => {
    targetRef.current = Math.max(0, Math.min(1, v));
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frames.length) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    const images = new Array(frames.length).fill(null);
    let cancelled = false;
    let started = false;
    let raf = 0;
    let last = performance.now();
    let smooth = targetRef.current;
    let drawn = -1;
    let visible = false;

    const load = async () => {
      if (started) return;
      started = true;
      for (let i = 0; i < frames.length && !cancelled; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.src = frames[i];
        try { await img.decode(); } catch { continue; }
        if (cancelled) return;
        images[i] = img;
        drawn = -1; // a newly arrived frame may be nearer than the one shown
      }
    };

    const nearest = (i) => {
      if (images[i]) return images[i];
      for (let d = 1; d < images.length; d++) {
        if (images[i - d]) return images[i - d];
        if (images[i + d]) return images[i + d];
      }
      return null;
    };

    const size = () => {
      const box = (canvas.parentElement || canvas).getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(box.width * dpr), h = Math.round(box.height * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; drawn = -1; }
      return { w, h };
    };

    const paint = (pos) => {
      const { w, h } = size();
      const exact = pos * (frames.length - 1);
      const i = Math.floor(exact);
      const frac = exact - i;
      const key = Math.round(exact * 20); // redraw only when it visibly changes
      if (key === drawn) return;
      const a = nearest(i);
      if (!a) return;
      drawn = key;
      const scale = Math.min(w / a.naturalWidth, h / a.naturalHeight);
      const dw = a.naturalWidth * scale, dh = a.naturalHeight * scale;
      const x = (w - dw) / 2, y = (h - dh) / 2;
      ctx.globalAlpha = 1;
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(a, x, y, dw, dh);
      const b = images[i + 1];
      if (b && frac > 0.02) {
        ctx.globalAlpha = frac;
        ctx.drawImage(b, x, y, dw, dh);
        ctx.globalAlpha = 1;
      }
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!visible) return;
      const diff = targetRef.current - smooth;
      smooth = Math.abs(diff) < 0.0005 ? targetRef.current : smooth + diff * (1 - Math.exp(-dt / tau));
      paint(smooth);
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (e.isIntersecting) load();
    }, { rootMargin: '200% 0px' });
    io.observe(canvas);
    const ro = new ResizeObserver(() => { drawn = -1; });
    ro.observe(canvas.parentElement || canvas);

    return () => { cancelled = true; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [frames, fill, tau]);

  return canvasRef;
}
