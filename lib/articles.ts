import { publicSupabase } from '@/lib/supabase/public';

/** Mirrors the `public.articles` table. */
export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  /** Pinned articles sort above everything else in the public list. */
  pinned: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** The subset the listing needs — `content` is large and unused there. */
export type ArticleSummary = Omit<Article, 'content'>;

export const SUMMARY_COLUMNS =
  'id,title,slug,excerpt,cover_image_url,published,pinned,published_at,created_at,updated_at';

/** The same list without `pinned`, used if 07_article_pin.sql has not run yet. */
const SUMMARY_COLUMNS_NO_PIN = SUMMARY_COLUMNS.replace(',pinned', '');

/**
 * True when a query failed only because a column this build knows about does
 * not exist in the database yet. Covers PostgREST's schema-cache wording and
 * Postgres' own 42703.
 */
function isMissingColumn(message: string, column: string): boolean {
  return (
    message.includes(`Could not find the '${column}' column`) ||
    new RegExp(`column [\\w."']*${column}["']? does not exist`).test(message)
  );
}

/**
 * Published articles, newest first.
 *
 * The `published` filter is belt-and-braces: Row Level Security already hides
 * drafts from this anonymous client, so a mistake here cannot leak one.
 */
export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  if (!publicSupabase) return [];

  const client = publicSupabase;

  /** Pinned first, then newest. Ordering is applied in the database. */
  const query = (columns: string, withPin: boolean) => {
    let q = client.from('articles').select(columns).eq('published', true);
    if (withPin) q = q.order('pinned', { ascending: false });
    return q
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
  };

  let { data, error } = await query(SUMMARY_COLUMNS, true);

  // Deploying this build before running 07_article_pin.sql would otherwise
  // empty the whole article list. Retry without the column instead.
  if (error && isMissingColumn(error.message, 'pinned')) {
    console.warn('[articles] `pinned` column missing — run supabase/07_article_pin.sql');
    ({ data, error } = await query(SUMMARY_COLUMNS_NO_PIN, false));
  }

  if (error) {
    console.error('[articles] Failed to load published articles:', error.message);
    return [];
  }

  // `pinned` is absent on the fallback path; default it so callers can rely on it.
  // Cast through `unknown`: the column list is a runtime string, so supabase-js
  // cannot infer the row shape.
  return ((data ?? []) as unknown as Record<string, unknown>[]).map((row) => ({
    pinned: false,
    ...row,
  })) as unknown as ArticleSummary[];
}

/** A single published article, or null when it does not exist or is a draft. */
export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  if (!publicSupabase) return null;

  const { data, error } = await publicSupabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('[articles] Failed to load article:', error.message);
    return null;
  }

  return (data as Article) ?? null;
}

/** Slugs for static generation of the article pages. */
export async function getPublishedSlugs(): Promise<string[]> {
  if (!publicSupabase) return [];

  const { data, error } = await publicSupabase
    .from('articles')
    .select('slug')
    .eq('published', true);

  if (error) return [];
  return (data ?? []).map((row) => row.slug as string);
}

/** "My First Post!" -> "my-first-post". Used to prefill the slug field. */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Dates render identically on server and client to avoid hydration drift. */
export function formatArticleDate(value: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Rough reading time, shown beside the date. */
export function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
