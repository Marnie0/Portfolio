'use client';

import { m } from 'framer-motion';
import type { SkillGroup } from '@/lib/content';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * One skill group, animated as a single unit.
 *
 * The card is the only element observed for scroll entry; the chips animate as
 * variant children. Giving each chip its own `whileInView` would put an
 * IntersectionObserver on every tag for no benefit.
 */
export function SkillCard({ group, delay = 0 }: { group: SkillGroup; delay?: number }) {
  const card = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE, delay, staggerChildren: 0.04 },
    },
  };

  const chip = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
  };

  return (
    <m.article
      variants={card}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      className="h-full rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/45"
    >
      <h3 className="font-display text-xl">{group.title}</h3>

      <ul className="mt-5 flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <m.li
            key={skill}
            variants={chip}
            className="rounded-lg border border-border bg-surface-muted px-3 py-1.5 font-mono text-xs text-muted"
          >
            {skill}
          </m.li>
        ))}
      </ul>
    </m.article>
  );
}
