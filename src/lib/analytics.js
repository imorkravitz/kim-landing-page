/**
 * Analytics bootstrap — Google Analytics 4 + Meta (Facebook) Pixel.
 *
 * Loads only when the matching ID exists in the environment, so local dev
 * stays clean and no tracking runs until real IDs are configured.
 *
 * Setup: create a `.env` file in the project root with:
 *   VITE_GA4_ID=G-XXXXXXXXXX
 *   VITE_META_PIXEL_ID=XXXXXXXXXXXXXXX
 */

const GA4_ID = import.meta.env.VITE_GA4_ID;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

export function initAnalytics() {
  if (GA4_ID) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID);
  }

  if (META_PIXEL_ID) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
}

/**
 * Track a conversion-intent click.
 *
 * `label` is WHAT the visitor asked for (whatsapp_consult, program_select_gold).
 * `placement` is WHERE they asked from (hero, pricing, faq, sticky, footer).
 *
 * The two are separate because the primary CTA deliberately repeats the same
 * wording and destination down the whole page — so without a placement, five
 * different buttons collapse into one indistinguishable number and there is no
 * way to learn which position actually earns the click. Reported as its own
 * parameter rather than baked into the label, so totals per intent still add up.
 */
export function trackCTA(label, placement) {
  const payload = placement ? { cta: label, placement } : { cta: label };
  if (window.gtag) window.gtag('event', 'cta_click', payload);
  if (window.fbq) window.fbq('track', 'Lead', { content_name: label, source: placement });
}

/**
 * Scroll-depth and section-reach instrumentation.
 *
 * Every judgement about "the page is too long" or "the hero earns its scroll"
 * is a guess until this exists. Depth milestones say how far people get;
 * section events say WHICH section they stop at, which is the part that
 * actually tells you where to cut. Both fire at most once per page view.
 *
 * Deliberately cheap: one rAF-coalesced scroll handler for depth, and an
 * IntersectionObserver for sections, so it costs nothing per frame.
 */
export function initScrollTracking() {
  if (typeof window === 'undefined' || !window.gtag) return () => {};

  const send = (name, params) => window.gtag('event', name, params);

  /* ── Depth milestones ── */
  const marks = [25, 50, 75, 90];
  const hit = new Set();
  let frame = null;

  const measure = () => {
    frame = null;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = (window.scrollY / scrollable) * 100;
    for (const m of marks) {
      if (pct >= m && !hit.has(m)) {
        hit.add(m);
        send('scroll_depth', { percent: m });
      }
    }
  };
  const onScroll = () => { if (frame === null) frame = requestAnimationFrame(measure); };
  window.addEventListener('scroll', onScroll, { passive: true });
  measure();

  /* ── Section reach ──
     data-track-section names a section; the event fires the first time enough
     of it has been on screen to count as seen.

     "Enough" cannot be a fixed ratio of the element. The hero story is 3,410px
     and pricing is 2,713px, so on an 812px phone neither can ever put 50% of
     itself in view — with a 0.5 threshold those two sections, the two most
     important on the page, silently never reported at all. The bar is instead
     the smaller of half the element and half the viewport, which behaves
     sensibly for a short trust bar and a five-screen story alike. */
  const seen = new Set();
  let io = null;
  const sections = document.querySelectorAll('[data-track-section]');
  if (sections.length && typeof IntersectionObserver !== 'undefined') {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const name = e.target.dataset.trackSection;
        if (seen.has(name) || !e.isIntersecting) continue;
        const needed = Math.min(e.boundingClientRect.height * 0.5, window.innerHeight * 0.5);
        if (e.intersectionRect.height >= needed) {
          seen.add(name);
          send('section_view', { section: name });
        }
      }
    }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
    sections.forEach((s) => io.observe(s));
  }

  /* Deepest point reached, reported once as the visitor leaves. Without this
     you only learn about people who cross a milestone, never where the ones
     who left early actually stopped. */
  const reportExit = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    send('scroll_exit', {
      max_percent: Math.round((window.scrollY / scrollable) * 100),
      sections_seen: seen.size,
    });
  };
  window.addEventListener('pagehide', reportExit, { once: true });

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pagehide', reportExit);
    if (frame !== null) cancelAnimationFrame(frame);
    if (io) io.disconnect();
  };
}
// deploy-connection test: 2026-07-07T17:38:10Z
