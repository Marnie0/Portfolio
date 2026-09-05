import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  /** Removes the default vertical rhythm when a section manages its own. */
  bare?: boolean;
};

/**
 * A landmark region for one page section. Each section is labelled by its
 * heading via `aria-labelledby`, so screen-reader users can jump between them.
 */
export function Section({ id, children, className = '', bare = false }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`${bare ? '' : 'py-20 sm:py-28 lg:py-32'} ${className}`}
    >
      <div className="mx-auto w-full max-w-content px-5 sm:px-8">{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  id: string;
  /** Small uppercase kicker above the title. */
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Reveal className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-accent-text">
        {!centered && <span aria-hidden className="h-px w-8 bg-accent-text/50" />}
        {eyebrow}
      </p>
      <h2
        id={`${id}-heading`}
        className="mt-4 font-display text-display-sm text-balance"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted text-pretty sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
