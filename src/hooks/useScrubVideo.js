import { useEffect, useRef } from 'react';
import { useMotionValueEvent } from 'framer-motion';

/**
 * Scroll-scrubbed video, painted onto a canvas.
 *
 * Shared by the hero plate and the stethoscope background, which used to carry
 * two diverging copies of this loop.
 *
 * Why a canvas: seeking a visible <video> blanks it while the target frame
 * decodes. The canvas keeps the last good frame on screen until the next one
 * is ready, so a scrub never flashes.
 *
 * Smoothing is time-based (an exponential approach with time constant `tau`),
 * not a fixed fraction per frame. The old 8%-per-frame lerp ran at half speed
 * on a 30fps phone and twice as fast on a 120Hz display, so the same scroll
 * felt different on every device. Only one seek is in flight at a time; a
 * watchdog releases it if `seeked` never arrives (unbuffered range, iOS).
 *
 * @param {object}  opts
 * @param {string?} opts.src       video URL; null defers loading
 * @param {import('framer-motion').MotionValue<number>} opts.progress  0..1
 * @param {'contain'|'width'} [opts.fit]  contain = whole frame centred;
 *                                        width = fill the width, centre vertically
 * @param {string}  [opts.fill]    colour painted under the frame
 * @param {number}  [opts.tau]     smoothing time constant in seconds
 */
export default function useScrubVideo({ src, progress, fit = 'contain', fill = '#ffffff', tau = 0.09 }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const targetRef = useRef(0);

  useMotionValueEvent(progress, 'change', (v) => {
    targetRef.current = Math.max(0, Math.min(1, v));
  });

  useEffect(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !src) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let smooth  = targetRef.current;
    let pending = false;
    let pendingSince = 0;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const paint = () => {
      pending = false;
      if (video.readyState < 2) return;
      const vw = video.videoWidth, vh = video.videoHeight;
      if (!vw || !vh) return;

      /* Measure the container, never the canvas: writing canvas.width changes
         the canvas's own box, which would feed back into the measurement. */
      const box = (canvas.parentElement || canvas).getBoundingClientRect();
      const cw = Math.round(box.width)  || window.innerWidth;
      const ch = Math.round(box.height) || window.innerHeight;
      /* Backing store at device pixels (capped at 2): CSS-pixel canvases are
         rasterised at half resolution on retina and phones and look soft. */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pw = Math.round(cw * dpr), ph = Math.round(ch * dpr);
      if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const scale = fit === 'width' ? cw / vw : Math.min(cw / vw, ch / vh);
      const dw = vw * scale, dh = vh * scale;
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(video, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    /* iOS will not hand a never-played video to drawImage. A muted inline
       play()+pause() is allowed without a gesture and primes the decoder; the
       first touch retries if autoplay was refused. */
    let primed = false;
    const prime = () => {
      if (primed) return;
      const p = video.play();
      if (p && typeof p.then === 'function') {
        p.then(() => { primed = true; video.pause(); video.currentTime = smooth * (video.duration || 0); paint(); })
         .catch(() => {});
      } else {
        primed = true;
        try { video.pause(); } catch { /* noop */ }
      }
    };

    video.pause();
    video.addEventListener('loadedmetadata', prime);
    video.addEventListener('loadeddata', paint);
    video.addEventListener('seeked', paint);
    if (video.readyState >= 1) prime();
    window.addEventListener('touchstart', prime, { once: true, passive: true });

    /* Phones often decline to buffer a 1px video from preload alone; kick it
       only if it has genuinely not started, so desktop does not fetch twice. */
    const kick = setTimeout(() => { if (video.readyState === 0) video.load(); }, 800);

    const ro = new ResizeObserver(() => paint());
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // Nothing to scrub while the canvas is off screen.
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '50% 0px' })
      : null;
    if (io && canvas.parentElement) io.observe(canvas.parentElement);

    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      if (pending && now - pendingSince > 250) pending = false; // lost seek
      const diff = targetRef.current - smooth;
      if (Math.abs(diff) > 0.0002) smooth += diff * (1 - Math.exp(-dt / tau));
      else smooth = targetRef.current;

      if (pending || !(video.duration > 0) || video.readyState < 1) return;
      const t = smooth * video.duration;
      // Below half a frame there is nothing new to show.
      if (Math.abs(video.currentTime - t) < 1 / 48) return;
      pending = true;
      pendingSince = now;
      video.currentTime = t;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      clearTimeout(kick);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener('touchstart', prime);
      video.removeEventListener('loadedmetadata', prime);
      video.removeEventListener('loadeddata', paint);
      video.removeEventListener('seeked', paint);
    };
  }, [src, fit, fill, tau]);

  return { videoRef, canvasRef };
}
