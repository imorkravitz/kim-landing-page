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
// deploy-connection test: 2026-07-07T17:38:10Z
