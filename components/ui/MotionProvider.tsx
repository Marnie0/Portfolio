'use client';

import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Loads only Framer Motion's DOM animation feature set (~6 KB) instead of the
 * full runtime (~34 KB). `strict` makes the compiler-free mistake of importing
 * `motion.*` throw — every animated element in this app uses `m.*`.
 *
 * `reducedMotion="user"` makes every transform/opacity animation respect the
 * operating system's reduce-motion preference without per-component checks.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
