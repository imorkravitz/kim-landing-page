import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  /* rAF-throttled and passive. The unthrottled version called setState on every
     scroll event, re-rendering during the scroll itself — on a 17,000px page
     that is a steady source of jank on mobile. Coalescing to one read per frame
     and bailing when the boolean is unchanged keeps re-renders to two per page. */
  useEffect(() => {
    let frame = null;

    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        setIsVisible((prev) => {
          const next = window.scrollY > 300;
          return next === prev ? prev : next;
        });
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    // Honour reduced-motion: animating a 17,000px flight is exactly the kind of
    // vestibular trigger the preference exists for.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-5 md:bottom-6 left-4 z-50 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[var(--brand-surface)] text-white shadow-lg hover:bg-[var(--brand-dark)] transition-all duration-300 flex items-center justify-center ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="חזרה למעלה"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  );
}