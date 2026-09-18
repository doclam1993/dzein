'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export type ScrollAnimationType = 'fadeUp' | 'staggerList' | 'zoomIn' | 'parallax' | 'slideRight' | 'flip3D';

interface ScrollAnimationWrapperProps {
  type?: ScrollAnimationType;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  parallaxSpeed?: number; // e.g. -50 to 50
  once?: boolean;
}

export const ScrollAnimationWrapper: React.FC<ScrollAnimationWrapperProps> = ({
  type = 'fadeUp',
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  parallaxSpeed = 40,
  once = true
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Parallax Scroll calculation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-parallaxSpeed, parallaxSpeed]);

  if (type === 'parallax') {
    return (
      <div ref={containerRef} className={`overflow-hidden ${className}`}>
        <motion.div style={{ y: parallaxY }} transition={{ ease: 'easeOut' }}>
          {children}
        </motion.div>
      </div>
    );
  }

  if (type === 'staggerList') {
    return (
      <motion.div
        ref={containerRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-60px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: delay,
            },
          },
        }}
        className={className}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 35, scale: 0.96 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (type === 'zoomIn') {
    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.88 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once, margin: '-60px' }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  if (type === 'slideRight') {
    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once, margin: '-60px' }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  if (type === 'flip3D') {
    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, rotateX: 25, y: 30 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once, margin: '-60px' }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1000 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Default: Fade Up
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
