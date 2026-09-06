import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { getSiteSettings, initialsFrom } from '@/lib/content-db/settings';

/**
 * Shown for any unmatched URL, and for `notFound()` in
 * app/articles/[slug]/page.tsx — which fires for a deleted article, a draft, or
 * a mistyped slug. Kept deliberately plain: someone landing here wanted
 * something specific, so the job is to get them back out quickly.
 */
export default async function NotFound() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto flex w-full max-w-content flex-col items-center px-5 pb-24 pt-40 text-center sm:px-8 sm:pt-48">
      <span
        aria-hidden
        className="grid h-14 w-14 place-items-center rounded-2xl bg-accent font-display text-2xl tracking-tight text-accent-fg"
      >
        {initialsFrom(settings.name)}
      </span>

      <p className="mt-8 font-mono text-sm uppercase tracking-[0.18em] text-accent-text">
        404
      </p>

      <h1 className="mt-4 max-w-2xl font-display text-display-sm text-balance">
        This page does not exist
      </h1>

      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted text-pretty">
        The link may be out of date, or the page may have moved. Everything else is
        still where you left it.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          Back to the portfolio
          <Icon
            name="arrowRight"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>

        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-fg/30 hover:bg-surface-muted"
        >
          Read the articles
        </Link>
      </div>

      <Link
        href="/#contact"
        className="mt-8 text-sm text-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
      >
        Looking for something specific? Get in touch
      </Link>
    </div>
  );
}
