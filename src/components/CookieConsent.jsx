import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConsent, setConsent, onConsentChange } from '@/lib/consent';
import { initAnalytics } from '@/lib/analytics';

/**
 * Cookie consent banner.
 *
 * ── Design decisions that are not cosmetic ────────────────────────────
 *
 * Both buttons look the same. A banner where "accept" is a filled brand
 * button and "reject" is a grey link is a dark pattern, and under תיקון 13
 * consent has to be freely given. Equal visual weight is the cheapest way
 * to stay on the right side of that, and it costs almost nothing in real
 * acceptance rate.
 *
 * There is no close X and no "keep browsing means yes". Dismissing without
 * choosing would have to be read as consent to be useful, and it cannot be.
 *
 * It sits at the bottom on mobile, above the sticky CTA rather than on top
 * of it: 90% of this site's traffic is a phone arriving from Instagram, and
 * burying the primary CTA under a legal notice would be its own kind of
 * failure. --sticky-cta-h is published by StickyCTA for exactly this.
 *
 * It renders nothing at all once a choice has been stored, so the returning
 * visitor never sees it twice. She can still change her mind from the
 * privacy page, which is what "withdraw as easily as you gave it" means.
 */
export default function CookieConsent() {
  const [decision, setDecision] = useState(() => getConsent());
  /* Mount-gated so the banner cannot flash during hydration on a device
     where storage is slow or blocked. */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /* A grant stored on a previous visit still has to actually start the
       trackers on this page load. */
    if (getConsent() === 'granted') initAnalytics();
    setReady(true);
    return onConsentChange(setDecision);
  }, []);

  if (!ready || decision !== null) return null;

  const choose = (value) => {
    setConsent(value);
    if (value === 'granted') initAnalytics();
  };

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 z-[var(--z-modal,90)] px-3"
      style={{
        bottom: 'calc(var(--sticky-cta-h, 0px) + env(safe-area-inset-bottom) + 0.75rem)',
      }}
    >
      <div
        className="mx-auto max-w-2xl rounded-2xl bg-white shadow-lg border
                   border-[var(--border-default)] p-5 md:p-6"
      >
        <h2
          id="cookie-consent-title"
          className="font-bold text-[var(--text-primary)] text-base md:text-lg mb-2"
        >
          אנחנו משתמשות בעוגיות
        </h2>

        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
          האתר משתמש בעוגיות סטטיסטיקה ופרסום (Google Analytics ו־Meta Pixel)
          כדי להבין איך גולשות באתר ולשפר אותו. אלה אינן נחוצות לתפעול האתר,
          והוא עובד במלואו גם בלעדיהן.{' '}
          <Link
            to="/Privacy"
            className="underline underline-offset-4 text-[var(--brand-ink)] font-medium"
          >
            מדיניות הפרטיות
          </Link>
        </p>

        {/* Equal weight, deliberately. See the note at the top of this file. */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => choose('granted')}
            className="flex-1 min-h-[48px] rounded-full font-bold text-[16px] text-white
                       bg-[var(--brand-surface)] hover:opacity-95 active:opacity-90
                       transition-opacity"
          >
            אישור
          </button>
          <button
            type="button"
            onClick={() => choose('denied')}
            className="flex-1 min-h-[48px] rounded-full font-bold text-[16px]
                       text-[var(--brand-ink)] bg-[var(--surface-sunken)]
                       border border-[var(--border-brand)] hover:bg-[var(--bg-tertiary)]
                       transition-colors"
          >
            דחייה
          </button>
        </div>
      </div>
    </div>
  );
}
