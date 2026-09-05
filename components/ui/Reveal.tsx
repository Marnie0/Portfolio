'use client';

import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Stagger sibling reveals by passing an increasing delay, in seconds. */
  delay?: number;
  /** Travel distance in pixels. Use 0 for a pure fade. */
  y?: number;
  className?: string;
  /** Render as a different element when a `div` would be invalid markup. */
  as?: 'div' | 'li' | 'article' | 'section' | 'span';
};

/**
 * Scroll-triggered fade/slide. Uses `whileInView`, which is backed by an
 * IntersectionObserver rather than a scroll listener, so it stays off the main
 * thread. Animations run once and only animate `opacity`/`transform`, both of
 * which the compositor can handle without layout or paint.
 */
export function Reveal({ children, delay = 0, y = 16, className, as = 'div' }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = m[as];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}
