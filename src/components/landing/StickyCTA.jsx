import React, { useEffect, useRef, useState } from 'react';
import { trackCTA } from '@/lib/analytics';

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/**
 * Mobile-only sticky primary CTA.
 *
 * The page already had a persistent WhatsApp control, but as an unlabelled
 * green bubble: it asks the visitor to guess what happens when they tap it,
 * on a page whose whole offer is a free fit consultation. This states the
 * offer instead, and reuses the same wording and destination as the four
 * in-page primary CTAs so the action reads as one action all the way down.
 *
 * It deliberately does NOT appear over the hero (which has its own CTA in
 * view) or over the closing CTA section (where it would duplicate a button
 * already on screen), so it only ever adds a path that was missing.
 *
 * The other floating controls are pushed up by --sticky-cta-h while it is
 * shown, which is why that height is published as a custom property rather
 * than hard-coded in three places.
 */
export default function StickyCTA() {
  const [show, setShow] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const closingCta = document.querySelector('[data-closing-cta]');
    const contentStart = document.getElementById('content-start');
    let frame = null;

    const evaluate = () => {
      frame = null;
      // Past the hero...
      const started = contentStart
        ? contentStart.getBoundingClientRect().top < 0
        : window.scrollY > window.innerHeight;
      // ...but not once the closing CTA is on screen.
      const closingVisible = closingCta
        ? closingCta.getBoundingClientRect().top < window.innerHeight * 0.9
        : false;
      const next = started && !closingVisible;
      setShow((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(evaluate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    evaluate();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  /* Publish the occupied height so the floating controls and the page's
     bottom padding can react to it, instead of each guessing a magic number. */
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sticky-cta-h',
      show ? `${barRef.current?.offsetHeight ?? 64}px` : '0px'
    );
  }, [show]);

  return (
    <div
      ref={barRef}
      data-sticky-cta
      className={`lg:hidden fixed inset-x-0 bottom-0 sticky-cta ${show ? 'is-shown' : ''}`}
      aria-hidden={!show}
    >
      <div className="px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-sm border-t border-[var(--border-default)]">
        <a
          href="https://wa.link/ntdrz1"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCTA('whatsapp_consult', 'sticky')}
          tabIndex={show ? 0 : -1}
          className="flex items-center justify-center gap-2.5 w-full min-h-[52px] rounded-full
                     text-white font-bold text-[17px] bg-[var(--wa-green)]
                     active:bg-[var(--wa-green-dark)] transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5" />
          לקביעת ייעוץ התאמה חינם
        </a>
      </div>
    </div>
  );
}
