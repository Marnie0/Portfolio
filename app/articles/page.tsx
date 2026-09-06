import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { formatArticleDate, getPublishedArticles } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Writing on backend engineering, problem solving and building for the web.',
};

/** Rebuild at most once a minute so new posts appear without a deploy. */
export const revalidate = 60;

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="mx-auto w-full max-w-content px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40">
      <Reveal>
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-accent-text">
          <span aria-hidden className="h-px w-8 bg-accent-text/50" />
          Articles
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-display-sm text-balance">
          Notes on what I am building and learning
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted text-pretty sm:text-lg">
          Writing on backend engineering, problem solving and the things worth knowing beneath
          the interface.
        </p>
      </Reveal>

      {articles.length === 0 ? (
        <Reveal delay={0.1}>
          <p className="mt-16 rounded-3xl border border-dashed border-border bg-surface-muted/40 px-6 py-14 text-center text-muted">
            No articles published yet. Check back soon.
          </p>
        </Reveal>
      ) : (
        <ul className="mt-16 grid gap-6 sm:mt-20 sm:grid-cols-2">
          {articles.map((article, index) => (
            <Reveal as="li" key={article.id} delay={(index % 2) * 0.08}>
              <article className="group h-full overflow-hidden rounded-3xl border border-border bg-surface transition-colors duration-300 hover:border-accent/45">
                <Link href={`/articles/${article.slug}`} className="flex h-full flex-col">
                  {article.cover_image_url ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface-muted">
                      <Image
                        src={article.cover_image_url}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 46vw, 92vw"
                        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div aria-hidden className="aspect-[16/9] bg-surface-muted" />
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                      {article.pinned && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-accent-fg">
                          Pinned
                        </span>
                      )}
                      {formatArticleDate(article.published_at ?? article.created_at)}
                    </p>

                    <h2 className="mt-3 font-display text-2xl leading-snug text-balance">
                      {article.title}
                    </h2>

                    {article.excerpt && (
                      <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
                        {article.excerpt}
                      </p>
                    )}

                    <span className="mt-auto pt-6 text-sm font-medium text-accent-text">
                      Read article →
                    </span>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
