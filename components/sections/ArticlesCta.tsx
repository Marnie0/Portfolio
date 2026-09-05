import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';

/**
 * Bridge between the achievements and the contact form: once a visitor has seen
 * the work, offer the longer read before asking them to get in touch.
 *
 * Rendered `bare` with tighter padding than a full section — it is a single
 * card, so full section rhythm would leave it stranded in whitespace.
 */
export function ArticlesCta() {
  return (
    <Section id="articles-cta" bare className="py-16 sm:py-20 lg:py-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-4xl border border-border bg-surface px-6 py-14 text-center sm:px-12 sm:py-16">
          {/* Same soft accent bloom used behind the hero, scaled down. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[100px]" />
            <div className="absolute inset-0 bg-grain opacity-[0.035] mix-blend-overlay dark:opacity-[0.06]" />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent-text">
            Articles
          </p>

          <h2
            id="articles-cta-heading"
            className="mx-auto mt-4 max-w-2xl font-display text-display-sm text-balance"
          >
            Want to read more of my thoughts?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted text-pretty sm:text-lg">
            I write about backend engineering, problem solving and what I learn building things
            — the reasoning behind the code, not just the code.
          </p>

          <div className="mt-9 flex justify-center">
            <Link
              href="/articles"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Read the articles
              <Icon
                name="arrowRight"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
