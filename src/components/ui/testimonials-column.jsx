import React, { useState, useRef } from "react";

/**
 * Vertical marquee column of testimonial screenshots.
 *
 * Mobile notes:
 *  • `duration` is the desktop loop time; mobile runs ~40% faster because the
 *    viewport shows fewer cards at once, so the same speed reads as "nothing
 *    is happening" before the visitor scrolls past.
 *  • Auto-moving content that runs >5s needs a way to stop it (WCAG 2.2.2).
 *    Desktop pauses on hover; touch devices pause while the user holds the
 *    column, and prefers-reduced-motion stops the loop entirely.
 */
export const TestimonialsColumn = ({
  className = "",
  testimonials,
  duration = 20,
  mobileDuration,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const columnRef = useRef(null);

  const mobile = mobileDuration ?? duration * 0.6;

  return (
    <div
      className={`relative h-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onTouchCancel={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes scrollVertical {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, -50%, 0); }
        }
        .animate-scroll-vertical {
          animation: scrollVertical linear infinite;
          animation-duration: var(--marquee-mobile);
          will-change: transform;
        }
        @media (min-width: 768px) {
          .animate-scroll-vertical { animation-duration: var(--marquee-desktop); }
        }
        /* WCAG 2.3.3 / 2.2.2 — no autoplaying motion when the OS asks for less */
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-vertical { animation: none; }
        }
      `}</style>

      <div
        ref={columnRef}
        className="animate-scroll-vertical flex flex-col gap-3 md:gap-6 pb-6"
        style={{
          '--marquee-mobile': `${mobile}s`,
          '--marquee-desktop': `${duration}s`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {/* Duplicated once so the loop is seamless */}
        {[...Array(2)].map((_, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={`${groupIndex}-${i}`}
                className="transform-gpu p-2 md:p-4 rounded-2xl md:rounded-3xl border border-[#8B7F4B]/20 bg-white shadow-lg shadow-[#8B7F4B]/5 w-full transition-transform duration-200"
              >
                <div className={`overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 ${role ? 'mb-2 md:mb-4' : ''}`}>
                  <img
                    src={image || "/placeholder.svg"}
                    alt={role ? `הצלחה של ${role}` : 'סיפור הצלחה של מטופלת'}
                    className="w-full h-auto object-cover block"
                    loading={groupIndex === 0 && i < 4 ? "eager" : "lazy"}
                    draggable="false"
                  />
                </div>

                {role && (
                  <div className="text-center">
                    <div className="text-xs md:text-sm text-[#8B7F4B] font-bold bg-[#8B7F4B]/10 rounded-full px-2 md:px-3 py-1 inline-block">
                      {role}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_10px_20px_rgb(255,255,255),inset_0_-10px_20px_rgb(255,255,255)] z-10" />
    </div>
  );
};
