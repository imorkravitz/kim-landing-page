/**
 * Cookie and tracking consent.
 *
 * ── Why this exists ───────────────────────────────────────────────────
 *
 * The site loads Google Analytics 4 and the Meta Pixel. GA4 is arguably
 * defensible as a statistics tool, but the Meta Pixel is not: it writes an
 * identifier, sends browsing behaviour to a third party, and feeds ad
 * targeting. Firing it before the visitor has agreed means processing
 * personal data with no lawful basis.
 *
 * Under חוק הגנת הפרטיות as amended by תיקון 13 (in force since August
 * 2025) consent must be informed and freely given, and the visitor must be
 * able to withdraw it as easily as she gave it. That is the whole design
 * brief here: nothing non-essential runs until "אישור", and "דחייה" is a
 * real button of equal weight, not a greyed-out afterthought.
 *
 * ── The state machine ─────────────────────────────────────────────────
 *
 *   null       never asked        -> show the banner, load nothing
 *   'granted'  she said yes       -> load GA4 + Pixel
 *   'denied'   she said no        -> load nothing, never ask again
 *
 * The decision lives in localStorage, which is first-party, functional, and
 * exactly the kind of storage that does not itself require consent.
 *
 * Storage can throw (private mode, blocked site data, embedded browsers),
 * and a great deal of this site's traffic is the Instagram in-app browser,
 * where that is common. Every access is guarded: if we cannot read the
 * decision we treat it as "never asked", which fails closed, with no
 * tracking.
 */

const KEY = 'kg-consent-v1';

export function getConsent() {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* Storage blocked. The choice still applies for this page view via the
       listeners below; it simply will not be remembered on the next one. */
  }
  listeners.forEach((fn) => fn(value));
}

/** Lets the visitor change her mind later, from the privacy page. */
export function resetConsent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
  listeners.forEach((fn) => fn(null));
}

const listeners = new Set();

export function onConsentChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
