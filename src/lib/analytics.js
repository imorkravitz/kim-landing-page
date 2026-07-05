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
 * Track a conversion-intent click (WhatsApp / questionnaire CTA).
 * Call with a short label, e.g. trackCTA('whatsapp_consult').
 */
export function trackCTA(label) {
  if (window.gtag) window.gtag('event', 'cta_click', { cta: label });
  if (window.fbq) window.fbq('track', 'Lead', { content_name: label });
}
