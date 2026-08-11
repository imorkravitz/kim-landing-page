import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Card = React.forwardRef(({ children, className = "", ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));
Card.displayName = "Card";

const CardSwap = ({
  width = 280,
  height = 450,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  skewAmount = 6,
  children,
}) => {
  const childArray = React.Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* Hover-pause only where hovering is a real thing.
     iOS synthesises a mouseenter on tap but frequently never sends the
     matching mouseleave, so on a phone one touch latched isPaused true and the
     carousel stopped for good after a single swap — which is exactly the
     "swaps once then freezes" behaviour. Pointer capability is the honest
     test; touch devices get tap-to-advance instead. */
  const canHover =
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  const next = React.useCallback(
    () => setCurrentIndex((prev) => (prev + 1) % childArray.length),
    [childArray.length]
  );

  /* Tapping advances, and `tick` is in the timer's deps so the interval
     restarts from that moment — the card the visitor just asked for gets a
     full dwell rather than whatever was left of the previous one. */
  const [tick, setTick] = useState(0);
  const advance = () => { next(); setTick((t) => t + 1); };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, delay);
    return () => clearInterval(interval);
  }, [delay, next, isPaused, tick]);

  /* Offsets are clamped to VISIBLE_DEPTH slots.
     Unclamped, the nth card sat at n*cardDistance right and n*verticalDistance
     up, so with six cards the deepest one rendered 250px right and 300px above
     the container it nominally lives in — outside the box the layout reserves
     for it, overlapping whatever sits above and pushing the page sideways on
     narrow screens. Cards past the visible depth now stack in place and fade,
     which is what the effect was trying to suggest anyway. */
  const VISIBLE_DEPTH = 3;

  const getCardStyle = (index) => {
    const relativeIndex = (index - currentIndex + childArray.length) % childArray.length;
    const depth = Math.min(relativeIndex, VISIBLE_DEPTH);
    return {
      x: depth * cardDistance,
      y: -depth * verticalDistance,
      scale: 1 - depth * 0.05,
      opacity: relativeIndex > VISIBLE_DEPTH ? 0 : 1,
      zIndex: childArray.length - relativeIndex,
      rotateY: skewAmount,
    };
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="מסך הבא באפליקציה"
      className="relative flex items-center justify-center cursor-pointer group select-none
                 rounded-[3rem] transition-transform duration-200 active:scale-[0.98]
                 focus-visible:outline-none"
      style={{ width, height, perspective: "1000px" }}
      onClick={advance}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); } }}
      onMouseEnter={() => canHover && pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => canHover && pauseOnHover && setIsPaused(false)}
    >
      {childArray.map((child, index) => {
        const style = getCardStyle(index);
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{ width, height }}
            animate={{
              x: style.x,
              y: style.y,
              scale: style.scale,
              opacity: style.opacity,
              zIndex: style.zIndex,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.8,
            }}
          >
            {child}
          </motion.div>
        );
      })}

      {/* Affordance: without it the stack looks decorative and nobody learns it
          responds. Shown on hover where hover exists, and always on touch,
          where there is no hover state to reveal it. */}
      <div
        aria-hidden="true"
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none
                    flex items-center gap-1.5 rounded-full px-3 py-1.5
                    bg-black/55 text-white text-xs font-medium backdrop-blur-sm
                    transition-opacity duration-200
                    ${canHover ? 'opacity-0 group-hover:opacity-100' : 'opacity-90'}`}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        למסך הבא
      </div>
    </div>
  );
};

export default CardSwap;