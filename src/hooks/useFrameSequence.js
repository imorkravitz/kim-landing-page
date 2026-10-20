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
 * Frames load once the canvas is within four screens, coarse to fine and
 * several at a time; until the gaps fill, the nearest loaded frames either
 * side are blended, so the motion is continuous from the first second.
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

    /* Coarse to fine, several at a time. Loading one frame after another
       ran at the network's round-trip rate: on a 4G phone about 15 of the
       stethoscope's 121 frames had arrived when the visitor reached it, so
       the canvas sat on the same picture while the page scrolled. Every
       16th frame first, then every 8th, 4th, 2nd and the rest: the whole
       motion is drawable within the first few requests and sharpens as the
       gaps fill. */
    const order = [];
    const queued = new Set();
    for (const stride of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < frames.length; i += stride) {
        if (!queued.has(i)) { queued.add(i); order.push(i); }
      }
      const lastIdx = frames.length - 1;
      if (!queued.has(lastIdx)) { queued.add(lastIdx); order.push(lastIdx); }
    }
    const load = () => {
      if (started) return;
      started = true;
      let next = 0;
      const worker = async () => {
        while (!cancelled && next < order.length) {
          const i = order[next++];
          const img = new Image();
          img.decoding = 'async';
          img.src = frames[i];
          try { await img.decode(); } catch { continue; }
          if (cancelled) return;
          images[i] = img;
          drawn = -1; // a newly arrived frame may sit closer than the ones shown
        }
      };
      for (let k = 0; k < 6; k++) worker();
    };

    // The loaded frames either side of a position, for blending across gaps.
    const bracket = (exact) => {
      let lo = Math.floor(exact), hi = Math.ceil(exact);
      while (lo >= 0 && !images[lo]) lo--;
      while (hi < images.length && !images[hi]) hi++;
      if (lo < 0 && hi >= images.length) return null;
      if (lo < 0) return [hi, hi, 0];
      if (hi >= images.length) return [lo, lo, 0];
      if (hi === lo) return [lo, lo, 0];
      /* Blend only across a short gap, where it reads as motion. Across a
         wide one (early on a slow network) the two poses are far apart and a
         crossfade shows both at once, a ghost; snap to the nearer instead. */
      if (hi - lo > 4) { const n = exact - lo < hi - exact ? lo : hi; return [n, n, 0]; }
      return [lo, hi, (exact - lo) / (hi - lo)];
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
      const key = Math.round(exact * 20); // redraw only when it visibly changes
      if (key === drawn) return;
      const br = bracket(exact);
      if (!br) return;
      const [lo, hi, frac] = br;
      const a = images[lo];
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
      const b = images[hi];
      if (hi !== lo && frac > 0.02) {
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
    }, { rootMargin: '400% 0px' }); // start well ahead: ~4 screens of lead
    io.observe(canvas);
    const ro = new ResizeObserver(() => { drawn = -1; });
    ro.observe(canvas.parentElement || canvas);

    return () => { cancelled = true; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [frames, fill, tau]);

  return canvasRef;
}
