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

  const getCardStyle = (index) => {
    const relativeIndex = (index - currentIndex + childArray.length) % childArray.length;
    return {
      x: relativeIndex * cardDistance,
      y: -relativeIndex * verticalDistance,
      scale: 1 - relativeIndex * 0.05,
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