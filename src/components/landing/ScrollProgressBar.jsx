import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Fixed scroll-progress bar pinned to the very top of the viewport.
 * Grows left-to-right regardless of page direction (progress indicator convention).
 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999]"
      style={{
        scaleX,
        transformOrigin: '0% 0%',
        background: 'linear-gradient(90deg, #8B7F4B 0%, #C49A7A 60%, #D4A843 100%)',
      }}
    />
  );
}
