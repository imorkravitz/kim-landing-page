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

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % childArray.length);
    }, delay);

    return () => clearInterval(interval);
  }, [delay, childArray.length, isPaused]);

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
      className="relative flex items-center justify-center"
      style={{ width, height, perspective: "1000px" }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
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
    </div>
  );
};

export default CardSwap;