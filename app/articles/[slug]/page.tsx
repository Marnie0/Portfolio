import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Markdown } from '@/components/articles/Markdown';
import { Icon } from '@/components/ui/Icon';
import {
  formatArticleDate,
  getPublishedArticleBySlug,
  getPublishedSlugs,
  readingTime,
} from '@/lib/articles';

export const revalidate = 60;

/** Prerender the articles that exist at build time; the rest render on demand. */
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) return { title: 'Article not found' };

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt ?? undefined,
      publishedTime: article.published_at ?? article.created_at,
      images: article.cover_image_url ? [{ url: article.cover_image_url }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  // A draft or a bad slug both land here: RLS never returns unpublished rows.
  if (!article) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-24 pt-32 sm:px-8 sm:pb-32 sm:pt-40">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-fg"
      >
        <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
        All articles
      </Link>

      <header className="mt-8">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.14em] text-muted">
          <time dateTime={article.published_at ?? article.created_at}>
            {formatArticleDate(article.published_at ?? article.created_at)}
          </time>
          <span aria-hidden>·</span>
          <span>{readingTime(article.content)}</span>
        </p>

        <h1 className="mt-4 font-display text-display-sm leading-tight text-balance">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">{article.excerpt}</p>
        )}
      </header>

      {article.cover_image_url && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-border bg-surface-muted">
          <Image
            src={article.cover_image_url}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 48rem, 92vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-12 border-t border-border pt-10">
        <Markdown content={article.content} />
      </div>

      <footer className="mt-16 border-t border-border pt-8">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent-text hover:text-fg"
        >
          <Icon name="arrowRight" className="h-4 w-4 rotate-180" />
          Back to all articles
        </Link>
      </footer>
    </article>
  );
}
