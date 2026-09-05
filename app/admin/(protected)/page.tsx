import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/server';
import { formatArticleDate, type ArticleSummary } from '@/lib/articles';
import { deleteArticle, togglePublished } from '../actions';
import { DeleteButton } from '@/components/admin/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabase();

  // The "admin reads all articles" policy lets a signed-in user see drafts too.
  const { data, error } = await supabase
    .from('articles')
    .select('id,title,slug,excerpt,cover_image_url,published,published_at,created_at,updated_at')
    .order('created_at', { ascending: false });

  const articles = (data ?? []) as ArticleSummary[];

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {articles.length} article{articles.length === 1 ? '' : 's'}
        </p>
        <Link
          href="/admin/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          New article
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-text">
          Could not load articles: {error.message}
        </p>
      )}

      {articles.length === 0 && !error ? (
        <p className="mt-8 rounded-3xl border border-dashed border-border px-6 py-14 text-center text-muted">
          No articles yet. Create your first one.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {articles.map((article) => (
            <li
              key={article.id}
              className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        'rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide',
                        article.published
                          ? 'bg-accent-soft text-accent-text'
                          : 'bg-surface-muted text-muted',
                      ].join(' ')}
                    >
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {formatArticleDate(article.published_at ?? article.created_at)}
                    </span>
                  </div>

                  <h2 className="mt-2 font-display text-xl leading-snug">{article.title}</h2>
                  <p className="mt-1 truncate font-mono text-xs text-muted">/{article.slug}</p>
                </div>

                {/* Wraps under the title on narrow screens rather than squashing. */}
                <div className="flex flex-wrap items-center gap-2">
                  <form action={togglePublished}>
                    <input type="hidden" name="id" value={article.id} />
                    <input type="hidden" name="next" value={String(!article.published)} />
                    <button
                      type="submit"
                      className="rounded-full border border-border px-3.5 py-2 text-sm text-fg transition-colors hover:bg-surface-muted"
                    >
                      {article.published ? 'Unpublish' : 'Publish'}
                    </button>
                  </form>

                  <Link
                    href={`/admin/edit/${article.id}`}
                    className="rounded-full border border-border px-3.5 py-2 text-sm text-fg transition-colors hover:bg-surface-muted"
                  >
                    Edit
                  </Link>

                  <form action={deleteArticle}>
                    <input type="hidden" name="id" value={article.id} />
                    <DeleteButton title={article.title} />
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
